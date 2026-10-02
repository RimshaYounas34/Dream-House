import { apiRequest } from "./api";

/* =========================================================
   EXTRACT PLAN FROM ANY COMMON BACKEND RESPONSE
========================================================= */

function extractPlan(response) {
  if (!response) {
    return null;
  }

  // Direct plan
  if (
    Array.isArray(response.rooms) ||
    Array.isArray(response.walls) ||
    Array.isArray(response.doors) ||
    Array.isArray(response.windows) ||
    Array.isArray(response.furniture)
  ) {
    return response;
  }

  // Common wrappers
  if (response.plan) {
    return response.plan;
  }

  if (response.floorPlanData) {
    return response.floorPlanData;
  }

  if (response.data?.plan) {
    return response.data.plan;
  }

  if (response.data?.floorPlanData) {
    return response.data.floorPlanData;
  }

  // data itself may be the plan
  if (
    response.data &&
    Array.isArray(response.data.rooms)
  ) {
    return response.data;
  }

  // result wrapper
  if (response.result) {
    return response.result;
  }

  if (response.data?.result) {
    return response.data.result;
  }

  return null;
}

/* =========================================================
   EXTRACT REPLY
========================================================= */

function extractReply(
  response,
  fallback = "Done."
) {
  return (
    response?.reply ||
    response?.message ||
    response?.data?.reply ||
    response?.data?.message ||
    fallback
  );
}

/* =========================================================
   GENERATE FLOOR PLAN
========================================================= */

export async function generatePlan(prompt, options = {}) {
  if (!prompt || !String(prompt).trim()) {
    throw new Error(
      "Please provide house requirements."
    );
  }

  console.log(
    "[aiApi] Generating floor plan:",
    prompt
  );

  const response = await apiRequest(
    "/ai/generate",
    {
      method: "POST",
      body: JSON.stringify({
        prompt: String(prompt).trim(),
        // true = user ne Regenerate dabaya, AI naya layout banaye
        regenerate: Boolean(options.regenerate),
      }),
    }
  );

  console.log(
    "[aiApi] Generate API response:",
    response
  );

  const payload = response?.data ?? response;

  const plan = extractPlan(payload);

  if (!plan) {
    console.error(
      "[aiApi] No floor plan found in generate response:",
      response
    );

    throw new Error(
      "AI server returned no floor plan."
    );
  }

  return {
    ...plan,

    reply: extractReply(
      response,
      "Your floor plan has been created successfully."
    ),
  };
}

/* =========================================================
   MODIFY FLOOR PLAN
========================================================= */

export async function modifyFloorPlan(
  command,
  floorPlanData
) {
  if (!command || !String(command).trim()) {
    throw new Error(
      "Please enter a modification command."
    );
  }

  if (!floorPlanData) {
    throw new Error(
      "No floor plan is available to modify."
    );
  }

  console.log(
    "[aiApi] Modifying floor plan:",
    command
  );

  const response = await apiRequest(
    "/ai/modify-floorplan",
    {
      method: "POST",
      body: JSON.stringify({
        command: String(command).trim(),
        floorPlanData,
      }),
    }
  );

  console.log(
    "[aiApi] Modify API response:",
    response
  );

  const payload = response?.data ?? response;

  const plan = extractPlan(payload);

  return {
    ...(plan || {}),

    reply: extractReply(
      response,
      "Done. I updated your floor plan."
    ),

    operations:
      payload?.operations ||
      payload?.data?.operations ||
      [],
  };
}

/* =========================================================
   ANALYZE FLOOR PLAN IMAGE
========================================================= */

export async function analyzeFloorPlanImage(
  file
) {
  if (!file) {
    throw new Error(
      "Please select a floor plan image."
    );
  }

  console.log(
    "[aiApi] Analyzing floor plan image:",
    file.name
  );

  const form = new FormData();

  form.append("image", file);

  const response = await apiRequest(
    "/ai/analyze-image",
    {
      method: "POST",
      body: form,
    }
  );

  console.log(
    "[aiApi] Image analysis response:",
    response
  );

  const payload = response?.data ?? response;

  const plan = extractPlan(payload);

  if (!plan) {
    console.error(
      "[aiApi] No floor plan found in image response:",
      response
    );

    throw new Error(
      "AI server returned no floor plan from the image."
    );
  }

  return {
    ...plan,

    reply: extractReply(
      response,
      "I analyzed the image and created the floor plan."
    ),
  };
}