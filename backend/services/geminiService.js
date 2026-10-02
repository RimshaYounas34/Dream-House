// =====================================================================
// Gemini AI service
// Ye file Gemini ko request bhejti hai aur JSON wapas leti hai.
// =====================================================================

const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

// IMPORTANT: gemini-2.0-flash Google ne June 2026 mein band kar diya hai.
// Isliye naya model default rakha hai. .env mein GEMINI_MODEL se badal sakti hain.
const DEFAULT_MODEL = "gemini-3.5-flash";

// Agar pehla model "not found" (404) de, to ye models ek ek karke try honge.
const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash"];

// ---------------------------------------------------------------------
// Gemini ke text me se JSON nikalna
// ---------------------------------------------------------------------
function extractJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start < 0 || end < start) {
    const error = new Error("AI did not return JSON. Please try again.");
    error.statusCode = 502;
    error.expose = true;
    throw error;
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (parseError) {
    const error = new Error("AI returned invalid JSON. Please try again.");
    error.statusCode = 502;
    error.expose = true;
    throw error;
  }
}

// ---------------------------------------------------------------------
// Ek model ko request bhejna
// ---------------------------------------------------------------------
async function callModel(model, parts, systemInstruction) {
  const response = await fetch(
    `${baseUrl}/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts }],
        // Note: temperature yahan nahi di, Gemini 3 ka default best chalta hai.
        generationConfig: { responseMimeType: "application/json" },
      }),
      // 60 second se zyada intezar nahi karna
      signal: AbortSignal.timeout(60000),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[Gemini] ${model} failed (${response.status}):`, detail.slice(0, 500));

    let message = `Gemini request failed (${response.status})`;
    if (response.status === 404) message = `Gemini model "${model}" not found. Check GEMINI_MODEL in backend/.env`;
    if (response.status === 400 && /API key/i.test(detail)) message = "Gemini API key is invalid. Check GEMINI_API_KEY in backend/.env";
    if (response.status === 403) message = "Gemini API key is not allowed to use this model (403).";
    if (response.status === 429) message = "Gemini limit reached (429). Please wait a minute and try again.";
    if (response.status === 503 || response.status === 500) message = "Gemini is busy right now (Google server overloaded). Please try again in a few seconds.";

    const error = new Error(message);
    error.httpStatus = response.status;
    error.statusCode = response.status >= 500 ? 502 : 400;
    error.expose = true;
    throw error;
  }

  const body = await response.json();
  const text =
    body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";

  return extractJson(text);
}

// ---------------------------------------------------------------------
// Models ko order mein try karna
//   - 503 / 500 (Google busy): 2 baar ruk ruk kar dobara try
//   - phir bhi na chale ya model nahi mile (404): agla model
// ---------------------------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BUSY_CODES = [500, 503, 504];
const SKIP_MODEL_CODES = [404, 429, 500, 503, 504];

async function generateContent(parts, systemInstruction) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is not configured in backend/.env");
    error.statusCode = 503;
    error.expose = true;
    throw error;
  }

  const first = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const models = [...new Set([first, ...FALLBACK_MODELS])];

  let lastError;

  for (const model of models) {
    // Har model ko 3 koshishein (pehli + 2 retry)
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        return await callModel(model, parts, systemInstruction);
      } catch (error) {
        lastError = error;

        // Timeout ya network error: agla model try karo
        if (!error.httpStatus) {
          console.error(`[Gemini] ${model} network/timeout error:`, error.message);
          break;
        }

        // Google busy hai: thora ruk kar isi model ko dobara try karo
        if (BUSY_CODES.includes(error.httpStatus) && attempt < 3) {
          console.log(`[Gemini] ${model} busy (${error.httpStatus}), retry ${attempt}/2 ...`);
          await sleep(attempt * 1500);
          continue;
        }

        // Is model par aage koshish bekar hai
        break;
      }
    }

    // Agar masla model ka nahi (jaise galat API key 400/403), to foran error dikha do
    if (lastError?.httpStatus && !SKIP_MODEL_CODES.includes(lastError.httpStatus)) {
      throw lastError;
    }
  }

  // Timeout / network error ko bhi saaf message do
  if (lastError && !lastError.httpStatus) {
    const error = new Error("Could not reach Gemini (network or timeout). Check your internet and try again.");
    error.statusCode = 502;
    error.expose = true;
    throw error;
  }

  throw lastError;
}

// ---------------------------------------------------------------------
// Floor plan ka format (Gemini ko samjhane ke liye)
// ---------------------------------------------------------------------
const schemaInstruction = `
You are an architectural floor-plan AI for a 2D floor plan editor.
Return ONLY valid JSON. No markdown, no code, no text outside the JSON.

UNITS AND COORDINATES (very important)
- All numbers are in FEET.
- (0,0) is the TOP-LEFT corner of the plot. x goes to the right, y goes down.
- Every room has x, y, width, height. x+width must be <= plotWidth and y+height must be <= plotLength.
- Rooms must NOT overlap. Place them side by side like a real floor plan, with no big empty gaps.
- Typical sizes in feet: bedroom 12x11, master bedroom 14x12, bathroom 6x8, kitchen 10x10, living room 14x12, dining room 10x10, garage 12x18, balcony 10x5.

JSON SHAPE
{
  "reply": "one short friendly sentence about what you created",
  "project": { "name": "Dream House", "plotWidth": 30, "plotLength": 60, "floors": 1, "units": "feet", "style": "Modern" },
  "rooms": [ { "id": "room-1", "type": "bedroom", "name": "Bedroom 1", "x": 0, "y": 0, "width": 12, "height": 11, "rotation": 0 } ],
  "doors": [ { "id": "door-1", "roomId": "room-1", "x": 6, "y": 11, "width": 3, "rotation": 0 } ],
  "windows": [ { "id": "window-1", "roomId": "room-1", "x": 6, "y": 0, "width": 4, "rotation": 0 } ],
  "walls": [],
  "furniture": []
}

RULES
1. Every item needs a unique string "id".
2. width and height are always positive. x and y are never negative.
3. Room "type" must be one of: masterbedroom, bedroom, bathroom, kitchen, livingroom, diningroom, garage, balcony, study, store, laundry, hallway, other.
4. Use the exact room names the user asked for (e.g. "Master Bedroom", "Bedroom 1").
5. Count rooms exactly as requested (3 bedrooms means exactly 3 bedrooms). Do not add rooms the user did not ask for, except a small hallway if really needed.
6. Give every room one door and every outside room at least one window.
7. Leave "walls" as an empty array and "furniture" as an empty array unless the user asked for furniture.
`;

// ---------------------------------------------------------------------
// 1) Naya plan banana
// ---------------------------------------------------------------------
export function generatePlan(prompt, options = {}) {
  const regenerateNote = options.regenerate
    ? "\nThe user pressed Regenerate. Create a NEW layout that is clearly different from a typical first attempt (different room arrangement), but with the same requirements.\n"
    : "";

  return generateContent(
    [{ text: prompt }],
    `${schemaInstruction}
Create a complete house plan from the user's requirements.
If the user gave plot dimensions (for example 30x60), use them for project.plotWidth and project.plotLength. Otherwise use 30 x 60.
${regenerateNote}`
  );
}

// ---------------------------------------------------------------------
// 2) Maujooda plan me tabdeeli (add / remove / move ...)
// ---------------------------------------------------------------------
export function modifyPlan(command, floorPlanData) {
  return generateContent(
    // User message: command + current plan
    [{ text: JSON.stringify({ command, currentPlan: floorPlanData }) }],

    // Rules
    `
You are an AI house-design agent. The user is changing an EXISTING house plan.
You get { command, currentPlan }. Return ONLY the operations needed. Do NOT return the full plan.

Return ONLY this JSON:
{ "reply": "short friendly confirmation", "operations": [ ... ] }

COORDINATE SYSTEM
- If currentPlan.settings.canvas exists, the plan is drawn on a PIXEL canvas.
  Every x must be between canvas.left and canvas.right, every y between canvas.top and canvas.bottom,
  and x+width <= canvas.right, y+height <= canvas.bottom. Ignore project.plotWidth / plotLength for positions.
  Typical pixel sizes: bedroom 140x100, bathroom 70x70, kitchen 140x100, living 180x110, dining 145x90,
  balcony 125x42, garage 165x105, study 115x80, door 34x8, window 52x7.
  For room "type" use ONLY values from canvas.roomTypes.
- Otherwise the units are FEET, (0,0) is top-left, and rooms stay inside project.plotWidth x project.plotLength.
- Look at the existing rooms: new rooms must be placed in FREE space so they do not overlap other rooms.

GENERAL RULES
- Keep the SAME units and scale as currentPlan (look at the sizes of the existing rooms).
- Do not change anything the user did not ask for.
- Use the EXISTING ids from currentPlan when you change or remove something. Never create a second copy of something that already exists.
- To add something, give it a new unique string "id".
- New rooms must not overlap existing rooms. Put them in free space next to the existing rooms and inside the plot (project.plotWidth x project.plotLength).
- If the user asks for N items ("add 2 balconies"), add exactly N operations.
- If the request is impossible or already done, return { "reply": "explain briefly", "operations": [] }.

OPERATION FORMATS (use exactly these field names)

{ "type": "add_room", "room": { "id": "new-id", "type": "balcony", "name": "Balcony 1", "x": 0, "y": 0, "width": 10, "height": 5 } }
{ "type": "remove_room", "roomId": "existing-id" }
{ "type": "move_room", "roomId": "existing-id", "x": 12, "y": 8 }
{ "type": "resize_room", "roomId": "existing-id", "width": 16, "height": 14 }
{ "type": "rename_room", "roomId": "existing-id", "name": "New Name" }

{ "type": "add_door", "door": { "id": "new-id", "roomId": "existing-room-id", "x": 5, "y": 5, "width": 3, "rotation": 0 } }
{ "type": "remove_door", "doorId": "existing-id" }
{ "type": "add_window", "window": { "id": "new-id", "roomId": "existing-room-id", "x": 5, "y": 5, "width": 4, "rotation": 0 } }
{ "type": "remove_window", "windowId": "existing-id" }

{ "type": "add_furniture", "furniture": { "id": "new-id", "type": "bed", "name": "Bed", "roomId": "existing-room-id", "x": 2, "y": 2, "width": 5, "height": 6 } }
{ "type": "remove_furniture", "furnitureId": "existing-id" }
{ "type": "move_furniture", "furnitureId": "existing-id", "x": 3, "y": 3 }
{ "type": "resize_furniture", "furnitureId": "existing-id", "width": 6, "height": 7 }

{ "type": "set_room_color", "roomId": "existing-id", "color": "#f4f1e8" }
{ "type": "set_room_material", "roomId": "existing-id", "material": "light-wood" }
{ "type": "set_style", "style": "Modern" }
{ "type": "set_roof", "roofType": "flat" }
{ "type": "set_lighting", "mode": "day" }
{ "type": "add_floor", "name": "First Floor" }
{ "type": "add_stairs", "name": "Stairs", "x": 10, "y": 10, "width": 4, "height": 10 }
{ "type": "add_site_element", "elementType": "parking" }   (elementType: parking, garden, boundary-wall, gate)

EXAMPLES
"Make the master bedroom bigger" -> one resize_room using the existing master bedroom id.
"Add a study room" -> one add_room with type "study".
"Remove the garage" -> one remove_room using the existing garage id.
`
  );
}

// ---------------------------------------------------------------------
// 3) Floor plan ki image samajhna
// ---------------------------------------------------------------------
export function analyzeImage(file) {
  return generateContent(
    [
      { inlineData: { mimeType: file.mimetype, data: file.buffer.toString("base64") } },
      { text: "Analyze this floor plan image and return an editable structured floor plan with rooms, doors, windows and labels." },
    ],
    `${schemaInstruction}
This is image recognition. Look at the floor plan image and recreate it in the JSON shape above.
Estimate sizes in feet. Do not invent rooms that are not visible.
`
  );
}
