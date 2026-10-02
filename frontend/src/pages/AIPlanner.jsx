import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  analyzeFloorPlanImage,
  generatePlan,
  modifyFloorPlan,
} from "../services/aiApi";

/* =========================================================
   SUGGESTIONS
========================================================= */

const suggestions = [
  "3 bedrooms, 2 bathrooms, kitchen, living room and garage",
  "4 bedrooms with a large master bedroom and modern kitchen",
  "2 bedrooms, open kitchen, living room and a front balcony",
  "3 bedrooms, 3 bathrooms, dining room and car porch",
];

/* =========================================================
   QUICK ADD BUTTONS (floor plan ready hone ke baad)
========================================================= */

const quickAdds = [
  "Add a bedroom",
  "Add a bathroom",
  "Add a balcony",
  "Add a study room",
  "Add a garage",
];

/* =========================================================
   ROOM COLORS
========================================================= */

const roomColors = {
  bedroom: "#dbeafe",
  masterbedroom: "#bfdbfe",
  bathroom: "#dcfce7",
  kitchen: "#fef3c7",
  livingroom: "#fce7f3",
  diningroom: "#f3e8ff",
  garage: "#e5e7eb",
  carporch: "#e5e7eb",
  balcony: "#cffafe",
  terrace: "#cffafe",
  store: "#f3f4f6",
  study: "#ede9fe",
  office: "#ede9fe",
  laundry: "#e0f2fe",
  drawingroom: "#fce7f3",
  familyroom: "#fef9c3",
  hallway: "#f3f4f6",
  entrance: "#ecfccb",
  stairs: "#e2e8f0",
  garden: "#dcfce7",
  dining: "#f3e8ff",
  lounge: "#fce7f3",
  other: "#f1f5f9",
};

/* =========================================================
   NUMBER WORDS
========================================================= */

const NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findCount(text, words) {
  const normalized = normalizeText(text);

  for (const word of words) {
    const numberPattern = new RegExp(
      `\\b(\\d+)\\s+${word}\\b`,
      "i"
    );

    const numberMatch = normalized.match(numberPattern);

    if (numberMatch) {
      return Number(numberMatch[1]);
    }

    for (const [numberWord, number] of Object.entries(
      NUMBER_WORDS
    )) {
      const wordPattern = new RegExp(
        `\\b${numberWord}\\s+${word}\\b`,
        "i"
      );

      if (wordPattern.test(normalized)) {
        return number;
      }
    }
  }

  return 0;
}

function hasPattern(text, patterns) {
  const normalized = normalizeText(text);

  return patterns.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(normalized);
    }

    return normalized.includes(pattern);
  });
}

function extractPlotSize(text) {
  const normalized = normalizeText(text);

  const match = normalized.match(
    /(\d+(?:\.\d+)?)\s*(?:x|by)\s*(\d+(?:\.\d+)?)/
  );

  if (!match) {
    return null;
  }

  return {
    width: Number(match[1]),
    length: Number(match[2]),
  };
}

function getBedroomCount(text) {
  const count = findCount(text, [
    "bedroom",
    "bedrooms",
    "bed room",
    "bed rooms",
  ]);

  if (count > 0) {
    return count;
  }

  if (
    hasPattern(text, [
      "master bedroom",
      "master bed",
      "master suite",
    ])
  ) {
    return 1;
  }

  return 0;
}

function createRoom(
  name,
  type,
  x,
  y,
  width,
  height,
  extra = {}
) {
  return {
    id:
      extra.id ||
      `${type}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    name,
    type,
    x,
    y,
    width,
    height,
    ...extra,
  };
}

/* =========================================================
   LOCAL DEMO PLAN
   Used only if backend does not return a valid plan.
========================================================= */

function generateDemoPlan(
  text,
  width = 30,
  length = 60
) {
  const bedrooms = Math.max(
    getBedroomCount(text),
    1
  );

  const bathrooms = Math.max(
    findCount(text, [
      "bathroom",
      "bathrooms",
      "washroom",
      "washrooms",
    ]),
    1
  );

  const rooms = [];

  rooms.push(
    createRoom(
      "Living Room",
      "livingroom",
      0,
      0,
      14,
      12
    ),
    createRoom(
      "Kitchen",
      "kitchen",
      14,
      0,
      10,
      10
    )
  );

  let currentY = 12;

  for (let i = 0; i < bedrooms; i += 1) {
    const isMaster =
      i === 0 &&
      hasPattern(text, [
        "master bedroom",
        "master bed",
        "master suite",
      ]);

    rooms.push(
      createRoom(
        isMaster
          ? "Master Bedroom"
          : `Bedroom ${i + 1}`,
        isMaster
          ? "masterbedroom"
          : "bedroom",
        i % 2 === 0 ? 0 : 12,
        currentY,
        isMaster ? 14 : 12,
        11
      )
    );

    if (i % 2 === 1) {
      currentY += 11;
    }
  }

  if (bedrooms % 2 !== 0) {
    currentY += 11;
  }

  for (let i = 0; i < bathrooms; i += 1) {
    rooms.push(
      createRoom(
        `Bathroom ${i + 1}`,
        "bathroom",
        24,
        i * 7,
        6,
        7
      )
    );
  }

  if (
    hasPattern(text, [
      "garage",
      "car garage",
      "car porch",
      "parking",
    ])
  ) {
    rooms.push(
      createRoom(
        "Garage",
        "garage",
        0,
        currentY,
        12,
        10
      )
    );
  }

  if (
    hasPattern(text, [
      "balcony",
      "balconies",
      "terrace",
    ])
  ) {
    rooms.push(
      createRoom(
        "Balcony",
        "balcony",
        14,
        currentY,
        10,
        5
      )
    );
  }

  if (
    hasPattern(text, [
      "dining room",
      "dining",
    ])
  ) {
    rooms.push(
      createRoom(
        "Dining Room",
        "diningroom",
        14,
        10,
        10,
        10
      )
    );
  }

  if (
    hasPattern(text, [
      "study",
      "study room",
      "office",
      "home office",
    ])
  ) {
    rooms.push(
      createRoom(
        "Study",
        "study",
        24,
        14,
        6,
        8
      )
    );
  }

  const walls = [];
  const doors = [];
  const windows = [];
  const furniture = [];

  rooms.forEach((room) => {
    walls.push(
      {
        id: `wall-${room.id}-top`,
        x1: room.x,
        y1: room.y,
        x2: room.x + room.width,
        y2: room.y,
      },
      {
        id: `wall-${room.id}-right`,
        x1: room.x + room.width,
        y1: room.y,
        x2: room.x + room.width,
        y2: room.y + room.height,
      },
      {
        id: `wall-${room.id}-bottom`,
        x1: room.x + room.width,
        y1: room.y + room.height,
        x2: room.x,
        y2: room.y + room.height,
      },
      {
        id: `wall-${room.id}-left`,
        x1: room.x,
        y1: room.y + room.height,
        x2: room.x,
        y2: room.y,
      }
    );

    doors.push({
      id: `door-${room.id}`,
      roomId: room.id,
      x: room.x + room.width / 2,
      y: room.y + room.height,
      width: 1,
      rotation: 0,
    });

    windows.push({
      id: `window-${room.id}`,
      roomId: room.id,
      x: room.x + room.width / 2,
      y: room.y,
      width: 2.5,
      rotation: 0,
    });
  });

  return {
    rooms,
    walls,
    doors,
    windows,
    furniture,
    project: {
      plotWidth: Number(width) || 30,
      plotLength: Number(length) || 60,
      floors: 1,
      style: "Modern",
    },
    reply:
      "I created an initial concept based on your requirements.",
  };
}

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function extractPlanFromResponse(response) {
  if (!response) {
    return null;
  }

  if (
    Array.isArray(response.rooms) ||
    Array.isArray(response.walls) ||
    Array.isArray(response.doors) ||
    Array.isArray(response.windows) ||
    Array.isArray(response.furniture)
  ) {
    return response;
  }

  if (response.floorPlanData) {
    return response.floorPlanData;
  }

  if (response.data?.floorPlanData) {
    return response.data.floorPlanData;
  }

  if (response.plan) {
    return response.plan;
  }

  if (response.data?.plan) {
    return response.data.plan;
  }

  if (response.data?.rooms) {
    return response.data;
  }

  if (response.result) {
    return response.result;
  }

  if (response.data?.result) {
    return response.data.result;
  }

  return null;
}

function extractReplyFromResponse(
  response,
  fallback = "Done. Your floor plan has been updated."
) {
  return (
    response?.reply ||
    response?.message ||
    response?.data?.reply ||
    response?.data?.message ||
    fallback
  );
}

function normalizePlan(plan, fallback = {}) {
  const source = plan || {};

  return {
    ...fallback,
    ...source,

    rooms: Array.isArray(source.rooms)
      ? source.rooms
      : Array.isArray(fallback.rooms)
      ? fallback.rooms
      : [],

    walls: Array.isArray(source.walls)
      ? source.walls
      : Array.isArray(fallback.walls)
      ? fallback.walls
      : [],

    doors: Array.isArray(source.doors)
      ? source.doors
      : Array.isArray(fallback.doors)
      ? fallback.doors
      : [],

    windows: Array.isArray(source.windows)
      ? source.windows
      : Array.isArray(fallback.windows)
      ? fallback.windows
      : [],

    furniture: Array.isArray(source.furniture)
      ? source.furniture
      : Array.isArray(fallback.furniture)
      ? fallback.furniture
      : [],

    project: {
      ...(fallback.project || {}),
      ...(source.project || {}),
    },
  };
}

function getRoomLabel(room) {
  return (
    room?.name ||
    room?.label ||
    room?.type ||
    "Room"
  );
}

function getRoomColor(room) {
  const type = normalizeText(
    room?.type || room?.name || ""
  ).replace(/\s+/g, "");

  if (type.includes("master")) {
    return roomColors.masterbedroom;
  }

  return roomColors[type] || roomColors.other;
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-[#063f34] text-white rounded-br-md"
            : "bg-[#f5f3ea] text-[#24352f] rounded-bl-md border border-[#e6e2d6]"
        }`}
      >
        <div className="text-[10px] uppercase tracking-[0.16em] opacity-60 mb-1">
          {isUser ? "You" : "AI House Agent"}
        </div>

        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FLOOR PLAN PREVIEW
========================================================= */

function FloorPlanPreview({ plan }) {
  const rooms = Array.isArray(plan?.rooms)
    ? plan.rooms
    : [];

  if (!rooms.length) {
    return (
      <div className="h-full min-h-[480px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#edf1e8] flex items-center justify-center text-2xl">
            🏠
          </div>

          <h3 className="text-xl font-semibold text-[#18372f]">
            Your floor plan will appear here
          </h3>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            Describe your dream house on the left and
            the AI agent will create the plan.
          </p>
        </div>
      </div>
    );
  }

  const maxX = Math.max(
    ...rooms.map(
      (room) =>
        Number(room.x || 0) +
        Number(room.width || 0)
    ),
    30
  );

  const maxY = Math.max(
    ...rooms.map(
      (room) =>
        Number(room.y || 0) +
        Number(room.height || 0)
    ),
    30
  );

  const scale = Math.min(
    520 / maxX,
    500 / maxY
  );

  const svgWidth = maxX * scale + 50;
  const svgHeight = maxY * scale + 50;

  return (
    <div className="w-full min-h-[480px] flex items-center justify-center overflow-auto rounded-2xl bg-[#faf9f5] border border-[#e8e4d8] p-4">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="max-w-full max-h-[560px] w-full h-auto"
      >
        <rect
          x="20"
          y="20"
          width={maxX * scale}
          height={maxY * scale}
          fill="#ffffff"
          stroke="#18372f"
          strokeWidth="2"
          rx="4"
        />

        {rooms.map((room, index) => {
          const x =
            20 + Number(room.x || 0) * scale;

          const y =
            20 + Number(room.y || 0) * scale;

          const width = Math.max(
            Number(room.width || 5) * scale,
            25
          );

          const height = Math.max(
            Number(room.height || 5) * scale,
            25
          );

          return (
            <g
              key={
                room.id ||
                `${room.name}-${index}`
              }
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getRoomColor(room)}
                stroke="#6b756f"
                strokeWidth="1.5"
                rx="2"
              />

              <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#263831"
                fontSize={Math.max(
                  Math.min(width / 8, 12),
                  7
                )}
                fontWeight="600"
              >
                {getRoomLabel(room)}
              </text>
            </g>
          );
        })}

        {Array.isArray(plan?.doors) &&
          plan.doors.map((door, index) => {
            const x = Number(door.x);
            const y = Number(door.y);

            if (!Number.isFinite(x) || !Number.isFinite(y)) {
              return null;
            }

            return (
              <circle
                key={
                  door.id ||
                  `door-${index}`
                }
                cx={20 + x * scale}
                cy={20 + y * scale}
                r="3"
                fill="#063f34"
              />
            );
          })}

        {Array.isArray(plan?.windows) &&
          plan.windows.map((window, index) => {
            const x = Number(window.x);
            const y = Number(window.y);

            if (!Number.isFinite(x) || !Number.isFinite(y)) {
              return null;
            }

            return (
              <circle
                key={
                  window.id ||
                  `window-${index}`
                }
                cx={20 + x * scale}
                cy={20 + y * scale}
                r="2.5"
                fill="#38bdf8"
              />
            );
          })}
      </svg>
    </div>
  );
}

/* =========================================================
   MAIN AI PLANNER
========================================================= */

function AIPlanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [addInput, setAddInput] = useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isAgentThinking, setIsAgentThinking] =
    useState(false);

  const [imageLoading, setImageLoading] =
    useState(false);

  const [generated, setGenerated] =
    useState(false);

  const [generatedPlan, setGeneratedPlan] =
    useState(null);

  const [currentPlan, setCurrentPlan] =
    useState(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI House Agent. Tell me what kind of house you want and I'll create a floor plan for you.",
    },
  ]);

  const [plotWidth, setPlotWidth] =
    useState("30");

  const [plotLength, setPlotLength] =
    useState("60");

  const [floors, setFloors] =
    useState("1");

  const [style, setStyle] =
    useState("Modern");

  /* =======================================================
     PLAN STATE
  ======================================================= */

  const hasPlan =
    Array.isArray(currentPlan?.rooms) &&
    currentPlan.rooms.length > 0;

  const displayedPlan =
    currentPlan || generatedPlan;

  const roomCount =
    displayedPlan?.rooms?.length || 0;

  const bedroomCount = useMemo(() => {
    return (
      displayedPlan?.rooms?.filter((room) => {
        const value = normalizeText(
          `${room?.type || ""} ${room?.name || ""}`
        );

        return (
          value.includes("bedroom") ||
          value.includes("masterbed")
        );
      }).length || 0
    );
  }, [displayedPlan]);

  const bathroomCount = useMemo(() => {
    return (
      displayedPlan?.rooms?.filter((room) => {
        const value = normalizeText(
          `${room?.type || ""} ${room?.name || ""}`
        );

        return value.includes("bathroom");
      }).length || 0
    );
  }, [displayedPlan]);

  /* =======================================================
     UPDATE PLAN
  ======================================================= */

  function updatePlanState(plan) {
    if (!plan) {
      return false;
    }

    const normalized = normalizePlan(plan);

    if (!normalized.rooms.length) {
      return false;
    }

    setCurrentPlan(normalized);
    setGeneratedPlan(normalized);
    setGenerated(true);

    if (normalized.project) {
      if (normalized.project.plotWidth) {
        setPlotWidth(
          String(normalized.project.plotWidth)
        );
      }

      if (normalized.project.plotLength) {
        setPlotLength(
          String(normalized.project.plotLength)
        );
      }

      if (normalized.project.floors) {
        setFloors(
          String(normalized.project.floors)
        );
      }

      if (normalized.project.style) {
        setStyle(
          normalized.project.style
        );
      }
    }

    return true;
  }

  /* =======================================================
     GENERATE PLAN
  ======================================================= */

  async function handleGenerate(
    customPrompt = prompt,
    isRegenerate = false
  ) {
    const cleanPrompt =
      String(customPrompt || "").trim();

    if (!cleanPrompt) {
      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Please describe your dream house first.",
        },
      ]);

      return;
    }

    setPrompt(cleanPrompt);

    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: isRegenerate
          ? "Regenerate this design with a new layout."
          : cleanPrompt,
      },
    ]);

    setIsGenerating(true);

    try {
      const plotSize =
        extractPlotSize(cleanPrompt);

      if (plotSize) {
        setPlotWidth(String(plotSize.width));
        setPlotLength(String(plotSize.length));
      }

      console.log(
        "[AIPlanner] Sending generate request:",
        cleanPrompt
      );

      const response =
        await generatePlan(cleanPrompt, {
          regenerate: isRegenerate,
        });

      console.log(
        "[AIPlanner] Generate response:",
        response
      );

      const backendPlan =
        extractPlanFromResponse(response);

      if (!backendPlan) {
        throw new Error(
          "Backend did not return a valid floor plan."
        );
      }

      const normalized =
        normalizePlan(backendPlan);

      if (!normalized.rooms.length) {
        throw new Error(
          "AI response was received, but it contains no rooms."
        );
      }

      updatePlanState(normalized);

      const reply =
        extractReplyFromResponse(
          response,
          "Your AI floor plan has been created successfully."
        );

      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error(
        "[AIPlanner] Generate error:",
        error
      );

      /*
       * Regenerate fail ho jaye to purana design rehne do
       * aur asli error user ko dikhao.
       */
      if (isRegenerate && hasPlan) {
        setMessages((previous) => [
          ...previous,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              error?.message ||
              "Could not regenerate the design. Your current plan is unchanged.",
          },
        ]);

        return;
      }

      /*
       * Backend failed:
       * Create a local plan so the user still gets
       * a visible floor plan.
       */

      try {
        const fallbackPlan =
          generateDemoPlan(
            cleanPrompt,
            Number(plotWidth) || 30,
            Number(plotLength) || 60
          );

        updatePlanState(fallbackPlan);

        setMessages((previous) => [
          ...previous,
          {
            id: `fallback-${Date.now()}`,
            role: "assistant",
            content: `AI error: ${
              error?.message || "unknown error"
            }. I created a basic local concept instead so you can keep working.`,
          },
        ]);
      } catch (fallbackError) {
        console.error(
          "[AIPlanner] Fallback error:",
          fallbackError
        );

        setMessages((previous) => [
          ...previous,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              error?.message ||
              "Something went wrong while generating the floor plan.",
          },
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  /* =======================================================
     AI AGENT MODIFY
  ======================================================= */

  async function handleAgentMessage(
    customCommand = chatInput
  ) {
    const command =
      String(customCommand || "").trim();

    if (!command) {
      return;
    }

    if (!hasPlan) {
      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "Please generate a floor plan first. Then you can ask me to modify it.",
        },
      ]);

      return;
    }

    setChatInput("");

    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: command,
      },
    ]);

    setIsAgentThinking(true);

    try {
      console.log(
        "[AIPlanner] Sending modification:",
        command
      );

      console.log(
        "[AIPlanner] Current plan:",
        currentPlan
      );

      const response =
        await modifyFloorPlan(
          command,
          currentPlan
        );

      console.log(
        "[AIPlanner] Modify response:",
        response
      );

      const backendPlan =
        extractPlanFromResponse(response);

      if (backendPlan) {
        const normalized =
          normalizePlan(
            backendPlan,
            currentPlan
          );

        if (normalized.rooms.length) {
          updatePlanState(normalized);
        }
      }

      const reply =
        extractReplyFromResponse(
          response,
          "Done. I updated your floor plan."
        );

      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error(
        "[AIPlanner] Modify error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            error?.message ||
            "I could not modify the floor plan. Please check your backend connection.",
        },
      ]);
    } finally {
      setIsAgentThinking(false);
    }
  }

  /* =======================================================
     IMAGE ANALYSIS
  ======================================================= */

  async function handleImageUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageLoading(true);

    setMessages((previous) => [
      ...previous,
      {
        id: `image-user-${Date.now()}`,
        role: "user",
        content:
          `Analyze this floor plan image: ${file.name}`,
      },
    ]);

    try {
      console.log(
        "[AIPlanner] Sending image:",
        file.name
      );

      const response =
        await analyzeFloorPlanImage(file);

      console.log(
        "[AIPlanner] Image analysis response:",
        response
      );

      const backendPlan =
        extractPlanFromResponse(response);

      if (!backendPlan) {
        throw new Error(
          "Image analysis did not return a valid floor plan."
        );
      }

      const normalized =
        normalizePlan(backendPlan);

      if (!normalized.rooms.length) {
        throw new Error(
          "Image analysis returned no rooms."
        );
      }

      updatePlanState(normalized);

      setMessages((previous) => [
        ...previous,
        {
          id: `image-ai-${Date.now()}`,
          role: "assistant",
          content:
            extractReplyFromResponse(
              response,
              "I analyzed the image and created the floor plan."
            ),
        },
      ]);
    } catch (error) {
      console.error(
        "[AIPlanner] Image error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: `image-error-${Date.now()}`,
          role: "assistant",
          content:
            error?.message ||
            "I could not analyze this floor plan image.",
        },
      ]);
    } finally {
      setImageLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  /* =======================================================
     REGENERATE
  ======================================================= */

  function regeneratePlan() {
    if (!prompt.trim()) {
      return;
    }

    handleGenerate(prompt, true);
  }

  /* =======================================================
     CLEAR DESIGN
     Plan hata deta hai, prompt box me text rehta hai
     taake user dubara generate kar sake.
  ======================================================= */

  function clearDesign() {
    const ok = window.confirm(
      "Clear the whole design? This cannot be undone."
    );

    if (!ok) {
      return;
    }

    setCurrentPlan(null);
    setGeneratedPlan(null);
    setGenerated(false);
    setChatInput("");
    setAddInput("");

    setMessages((previous) => [
      ...previous,
      {
        id: `clear-${Date.now()}`,
        role: "assistant",
        content:
          "The design is cleared. Describe a new house (or edit the requirements) and press Generate Floor Plan.",
      },
    ]);
  }

  /* =======================================================
     ADD MORE (floor plan ready hone ke baad)
  ======================================================= */

  function handleAddSubmit(event) {
    event.preventDefault();

    const text = addInput.trim();

    if (!text || isAgentThinking) {
      return;
    }

    setAddInput("");
    handleAgentMessage(text);
  }

  /* =======================================================
     OPEN 2D EDITOR
  ======================================================= */

  function openEditor() {
    if (!hasPlan) {
      return;
    }

    navigate("/floor-plan-editor", {
      state: {
        rooms: currentPlan.rooms || [],
        walls: currentPlan.walls || [],
        doors: currentPlan.doors || [],
        windows: currentPlan.windows || [],
        furniture: currentPlan.furniture || [],

        plotWidth:
          currentPlan.project?.plotWidth ||
          Number(plotWidth) ||
          30,

        plotLength:
          currentPlan.project?.plotLength ||
          Number(plotLength) ||
          60,

        floors:
          currentPlan.project?.floors ||
          Number(floors) ||
          1,

        style:
          currentPlan.project?.style ||
          style,

        prompt,

        source: "ai-planner",
        generatedByAI: true,

        aiMessages: messages,
        aiPlan: currentPlan,
      },
    });
  }

  /* =======================================================
     QUICK SUGGESTION
  ======================================================= */

  function useSuggestion(value) {
    setPrompt(value);
    handleGenerate(value);
  }

  /* =======================================================
     CHAT SUBMIT
  ======================================================= */

  function handleChatSubmit(event) {
    event.preventDefault();

    handleAgentMessage(chatInput);
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#18372f]">
      {/* HEADER */}

      <header className="h-16 bg-white border-b border-[#e7e2d5] flex items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="font-semibold text-xl tracking-tight"
          >
            DreamHouse
          </Link>

          <span className="hidden sm:block text-gray-300">
            /
          </span>

          <span className="hidden sm:block text-sm text-gray-500">
            AI House Planner
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edf5ef] text-[#35654f] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            AI House Agent
          </span>

          <Link
            to="/dashboard"
            className="text-sm text-gray-600 hover:text-[#063f34]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-[1500px] mx-auto p-4 md:p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6d8077] mb-2">
            AI DESIGN STUDIO
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Design your dream house
          </h1>

          <p className="mt-2 text-gray-500 max-w-2xl">
            Describe your requirements and let the AI
            House Agent create and modify your floor plan.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-6">
          {/* LEFT PANEL */}

          <section className="bg-white rounded-3xl border border-[#e5e1d6] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#ece8de]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    AI House Agent
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Tell me what you want to build
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#063f34] text-white flex items-center justify-center">
                  ✨
                </div>
              </div>

              {/* CHAT */}

              <div className="h-[360px] overflow-y-auto space-y-3 pr-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}

                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-[#f5f3ea] border border-[#e6e2d6] rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#063f34] rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-[#063f34] rounded-full animate-bounce"
                          style={{
                            animationDelay: "120ms",
                          }}
                        />
                        <span
                          className="w-2 h-2 bg-[#063f34] rounded-full animate-bounce"
                          style={{
                            animationDelay: "240ms",
                          }}
                        />
                        <span className="ml-1 text-gray-500">
                          Creating your floor plan...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isAgentThinking && (
                  <div className="flex justify-start">
                    <div className="bg-[#f5f3ea] border border-[#e6e2d6] rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-500">
                      AI is modifying your plan...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* INITIAL PROMPT */}

            <div className="p-5 border-b border-[#ece8de]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                House requirements
              </label>

              <textarea
                value={prompt}
                onChange={(event) =>
                  setPrompt(event.target.value)
                }
                placeholder="Example: 3 bedrooms, 2 bathrooms, modern kitchen, living room and garage..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-[#ddd8ca] bg-[#fcfbf7] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#063f34]/20 focus:border-[#063f34]"
              />

              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full mt-3 rounded-2xl bg-[#063f34] text-white py-3.5 font-medium hover:bg-[#052f28] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isGenerating
                  ? "Creating Floor Plan..."
                  : "Generate Floor Plan"}
              </button>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={imageLoading}
                  className="rounded-xl border border-[#ddd8ca] bg-white py-2.5 text-sm font-medium hover:bg-[#faf9f5] disabled:opacity-50"
                >
                  {imageLoading
                    ? "Analyzing..."
                    : "📷 Analyze Image"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPrompt("")
                  }
                  className="rounded-xl border border-[#ddd8ca] bg-white py-2.5 text-sm font-medium hover:bg-[#faf9f5]"
                >
                  Clear
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* SUGGESTIONS */}

            <div className="p-5 border-b border-[#ece8de]">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Try an example
              </p>

              <div className="space-y-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      useSuggestion(item)
                    }
                    disabled={isGenerating}
                    className="w-full text-left rounded-xl border border-[#e5e1d6] bg-[#fcfbf7] px-3 py-2.5 text-xs text-gray-600 hover:border-[#063f34] hover:text-[#063f34] transition disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* AI MODIFY CHAT */}

            <div className="p-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Modify current plan
              </label>

              <form
                onSubmit={handleChatSubmit}
                className="flex gap-2"
              >
                <input
                  value={chatInput}
                  onChange={(event) =>
                    setChatInput(event.target.value)
                  }
                  disabled={!hasPlan || isAgentThinking}
                  placeholder={
                    hasPlan
                      ? "e.g. Add a bedroom..."
                      : "Generate a plan first..."
                  }
                  className="flex-1 min-w-0 rounded-xl border border-[#ddd8ca] bg-[#fcfbf7] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#063f34]/20 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={
                    !hasPlan ||
                    !chatInput.trim() ||
                    isAgentThinking
                  }
                  className="px-4 rounded-xl bg-[#063f34] text-white text-sm font-medium disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT PANEL */}

          <section className="bg-white rounded-3xl border border-[#e5e1d6] shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#ece8de]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    LIVE PREVIEW
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    Your Floor Plan
                  </h2>
                </div>

                <div className="flex gap-2">
                  {hasPlan && (
                    <>
                      <button
                        type="button"
                        onClick={regeneratePlan}
                        disabled={isGenerating}
                        className="px-4 py-2.5 rounded-xl border border-[#ddd8ca] text-sm font-medium hover:bg-[#faf9f5] disabled:opacity-50"
                      >
                        Regenerate
                      </button>

                      <button
                        type="button"
                        onClick={openEditor}
                        className="px-4 py-2.5 rounded-xl bg-[#063f34] text-white text-sm font-medium hover:bg-[#052f28]"
                      >
                        Open in 2D Editor
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <FloorPlanPreview
                plan={displayedPlan}
              />

              {/* STATS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <div className="rounded-2xl bg-[#faf9f5] border border-[#e8e4d8] p-4">
                  <p className="text-xs text-gray-500">
                    Rooms
                  </p>

                  <p className="text-2xl font-semibold mt-1">
                    {roomCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] border border-[#e8e4d8] p-4">
                  <p className="text-xs text-gray-500">
                    Bedrooms
                  </p>

                  <p className="text-2xl font-semibold mt-1">
                    {bedroomCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] border border-[#e8e4d8] p-4">
                  <p className="text-xs text-gray-500">
                    Bathrooms
                  </p>

                  <p className="text-2xl font-semibold mt-1">
                    {bathroomCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf9f5] border border-[#e8e4d8] p-4">
                  <p className="text-xs text-gray-500">
                    Floors
                  </p>

                  <p className="text-2xl font-semibold mt-1">
                    {floors}
                  </p>
                </div>
              </div>

              {/* PROJECT SETTINGS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div>
                  <label className="text-xs text-gray-500">
                    Plot Width
                  </label>

                  <input
                    value={plotWidth}
                    onChange={(event) =>
                      setPlotWidth(
                        event.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-[#ddd8ca] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    Plot Length
                  </label>

                  <input
                    value={plotLength}
                    onChange={(event) =>
                      setPlotLength(
                        event.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-[#ddd8ca] px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    Floors
                  </label>

                  <select
                    value={floors}
                    onChange={(event) =>
                      setFloors(
                        event.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-[#ddd8ca] px-3 py-2 text-sm bg-white"
                  >
                    <option value="1">
                      1 Floor
                    </option>
                    <option value="2">
                      2 Floors
                    </option>
                    <option value="3">
                      3 Floors
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    Style
                  </label>

                  <select
                    value={style}
                    onChange={(event) =>
                      setStyle(
                        event.target.value
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-[#ddd8ca] px-3 py-2 text-sm bg-white"
                  >
                    <option>Modern</option>
                    <option>Minimal</option>
                    <option>Traditional</option>
                    <option>Luxury</option>
                    <option>Contemporary</option>
                  </select>
                </div>
              </div>

              {/* STATUS / NEXT STEPS */}

              {!hasPlan ? (
                <div className="mt-5 rounded-2xl bg-[#edf5ef] border border-[#dce9df] px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">✨</div>

                    <div>
                      <p className="text-sm font-medium text-[#28553f]">
                        Ready to design
                      </p>

                      <p className="text-xs text-[#527162] mt-0.5">
                        Describe your requirements and generate your first floor plan.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#edf5ef] border border-[#dce9df] p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">✓</div>

                    <div>
                      <p className="text-sm font-medium text-[#28553f]">
                        Floor plan ready. What would you like to do next?
                      </p>

                      <p className="text-xs text-[#527162] mt-0.5">
                        Add more things, regenerate a new layout, or clear the design and start again.
                      </p>
                    </div>
                  </div>

                  {/* ADD MORE */}

                  <form
                    onSubmit={handleAddSubmit}
                    className="mt-4 flex gap-2"
                  >
                    <input
                      value={addInput}
                      onChange={(event) =>
                        setAddInput(event.target.value)
                      }
                      disabled={isAgentThinking || isGenerating}
                      placeholder="Add something... e.g. add a study room"
                      className="flex-1 min-w-0 rounded-xl border border-[#cfe0d4] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#063f34]/20 disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={
                        !addInput.trim() ||
                        isAgentThinking ||
                        isGenerating
                      }
                      className="px-4 rounded-xl bg-[#063f34] text-white text-sm font-medium disabled:opacity-40"
                    >
                      {isAgentThinking ? "Adding..." : "+ Add"}
                    </button>
                  </form>

                  {/* QUICK ADD BUTTONS */}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickAdds.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleAgentMessage(item)}
                        disabled={isAgentThinking || isGenerating}
                        className="px-3 py-1.5 rounded-full border border-[#cfe0d4] bg-white text-xs text-[#35654f] hover:border-[#063f34] disabled:opacity-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* REGENERATE + CLEAR */}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={regeneratePlan}
                      disabled={
                        isGenerating ||
                        isAgentThinking ||
                        !prompt.trim()
                      }
                      className="rounded-xl border border-[#cfe0d4] bg-white py-2.5 text-sm font-medium text-[#063f34] hover:bg-[#faf9f5] disabled:opacity-50"
                    >
                      {isGenerating ? "Regenerating..." : "↻ Regenerate"}
                    </button>

                    <button
                      type="button"
                      onClick={clearDesign}
                      disabled={isGenerating || isAgentThinking}
                      className="rounded-xl border border-red-200 bg-white py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      🗑 Clear Design
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default AIPlanner;