import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { createProject, getProject, updateProject } from "../services/projectApi";
import { modifyFloorPlan } from "../services/aiApi";

const PLOT = { left: 35, top: 35, right: 660, bottom: 585, width: 625, height: 550 };

const ROOM_TYPES = [
  { value: "living", label: "Living Room", icon: "🛋️" },
  { value: "bedroom", label: "Bedroom", icon: "🛏️" },
  { value: "kitchen", label: "Kitchen", icon: "🍳" },
  { value: "bathroom", label: "Bathroom", icon: "🛁" },
  { value: "dining", label: "Dining", icon: "🍽️" },
  { value: "garage", label: "Garage", icon: "🚗" },
  { value: "balcony", label: "Balcony", icon: "🌿" },
  { value: "study", label: "Study", icon: "📚" },
  { value: "stairs", label: "Stairs", icon: "↕" },
  { value: "laundry", label: "Laundry", icon: "🧺" },
  { value: "store", label: "Store", icon: "📦" },
  { value: "porch", label: "Porch", icon: "🏠" },
];

const INITIAL_ROOMS = [
  { id: "living-1", type: "living", name: "Living Room", x: 60, y: 65, width: 220, height: 150, rotation: 0 },
  { id: "master-1", type: "bedroom", name: "Master Bedroom", x: 300, y: 65, width: 180, height: 150, rotation: 0 },
  { id: "bedroom-2", type: "bedroom", name: "Bedroom 2", x: 500, y: 65, width: 140, height: 150, rotation: 0 },
  { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 60, y: 235, width: 180, height: 130, rotation: 0 },
  { id: "dining-1", type: "dining", name: "Dining", x: 260, y: 235, width: 150, height: 130, rotation: 0 },
  { id: "bath-1", type: "bathroom", name: "Common Bath", x: 430, y: 235, width: 95, height: 105, rotation: 0 },
  { id: "garage-1", type: "garage", name: "Garage", x: 535, y: 235, width: 105, height: 150, rotation: 0 },
  { id: "balcony-1", type: "balcony", name: "Balcony", x: 60, y: 385, width: 190, height: 75, rotation: 0 },
  { id: "stairs-1", type: "stairs", name: "Stairs", x: 270, y: 385, width: 120, height: 90, rotation: 0 },
];

const INITIAL_DOORS = [
  { id: "door-1", name: "Main Door", x: 145, y: 55, width: 42, height: 12, rotation: 0 },
  { id: "door-2", name: "Bedroom Door", x: 380, y: 205, width: 42, height: 12, rotation: 0 },
  { id: "door-3", name: "Garage Door", x: 585, y: 215, width: 42, height: 12, rotation: 90 },
];

const INITIAL_WINDOWS = [
  { id: "window-1", name: "Window 1", x: 85, y: 65, width: 55, height: 8, rotation: 0 },
  { id: "window-2", name: "Window 2", x: 330, y: 65, width: 55, height: 8, rotation: 0 },
  { id: "window-3", name: "Window 3", x: 520, y: 65, width: 55, height: 8, rotation: 0 },
  { id: "window-4", name: "Window 4", x: 65, y: 285, width: 8, height: 50, rotation: 0 },
  { id: "window-5", name: "Window 5", x: 600, y: 270, width: 8, height: 55, rotation: 0 },
];

const INITIAL_WALLS = [];

// AI kabhi "livingroom" / "masterbedroom" jaise naam deti hai, lekin editor
// "living" / "bedroom" samajhta hai. Ye function dono ko ek jaisa bana deta hai.
const TYPE_ALIASES = {
  livingroom: "living", "living-room": "living", drawingroom: "living", lounge: "living",
  masterbedroom: "bedroom", "master-bedroom": "bedroom", bedrooms: "bedroom",
  diningroom: "dining", "dining-room": "dining",
  carporch: "garage", parking: "garage",
  terrace: "balcony",
  washroom: "bathroom", bath: "bathroom",
  storeroom: "store", studyroom: "study", office: "study",
};

function normalizeRoomType(type) {
  const key = String(type || "").toLowerCase().replace(/[\s_]/g, "");
  if (TYPE_ALIASES[key]) return TYPE_ALIASES[key];
  if (ROOM_TYPES.some((r) => r.value === key)) return key;
  return type || "bedroom";
}

const FURNITURE_LIBRARY = [
  { type: "bed", name: "Queen Bed", width: 70, height: 45, icon: "Bed" },
  { type: "sofa", name: "Sofa", width: 85, height: 30, icon: "Sofa" },
  { type: "table", name: "Dining Table", width: 70, height: 42, icon: "Table" },
  { type: "island", name: "Kitchen Island", width: 72, height: 24, icon: "Island" },
  { type: "wardrobe", name: "Wardrobe", width: 20, height: 55, icon: "Wardrobe" },
  { type: "toilet", name: "Toilet", width: 22, height: 28, icon: "Toilet" },
  { type: "car", name: "Car", width: 70, height: 34, icon: "Car" },
];

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

function Icon({ name, size = 20 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    select: <path d="M5 3.5 18.5 14l-6.2 1.1-2.7 5.7L5 3.5Z" />,
    room: <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 9h6M14 4v7M14 15h6" /></>,
    door: <><path d="M6 20V4h12v16M6 20h14" /><path d="M12 12h.01" /></>,
    window: <><rect x="4" y="5" width="16" height="14" rx="1" /><path d="M12 5v14M4 12h16" /></>,
    wall: <path d="M4 7h16M4 17h16M7 7v10M17 7v10" />,
    grid: <><path d="M4 4h16v16H4zM10 4v16M16 4v16M4 10h16M4 16h16" /></>,
    zoomIn: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4M10.5 8v5M8 10.5h5" /></>,
    zoomOut: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4M8 10.5h5" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    save: <><path d="M5 4h12l3 3v13H5V4Z" /><path d="M8 4v6h8V4M9 20v-6h6v6" /></>,
    undo: <><path d="M9 7 4 12l5 5" /><path d="M4 12h9a6 6 0 0 1 6 6" /></>,
    redo: <><path d="m15 7 5 5-5 5" /><path d="M20 12h-9a6 6 0 0 0-6 6" /></>,
    back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

function ToolButton({ active, label, icon, onClick }) {
  return <button type="button" onClick={onClick} title={label} className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${active ? "border-[#0b5d46] bg-[#0b5d46] text-white shadow-md" : "border-[#dfe5de] bg-white text-[#53615a] hover:bg-[#f4f7f2]"}`}><Icon name={icon} size={18} /></button>;
}

const roomInfo = (type) => ROOM_TYPES.find((r) => r.value === type) || ROOM_TYPES[0];
const fillFor = (type) => ({
  living: "#f2f0e8", bedroom: "#f4f1e8", kitchen: "#f1eee2", bathroom: "#edf3f2",
  dining: "#f2eee7", garage: "#e9e9e5", balcony: "#edf3eb", study: "#eeeaf0",
  stairs: "#eceee9", laundry: "#eef1ee", store: "#eeece7", porch: "#e9eee9",
}[type] || "#edf0ea");

function TextLabel({ x, y, children, size = 10, weight = 700 }) {
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={weight} fill="#2d4a40" pointerEvents="none">{children}</text>;
}

function Furniture({ room }) {
  const { x, y, width: w, height: h, type } = room;
  const stroke = "#78847d";
  const light = "#dfe6df";
  const cx = x + w / 2;
  const cy = y + h / 2;

  if (type === "bedroom") {
    const bw = Math.min(w * 0.58, 90);
    const bh = Math.min(h * 0.42, 55);
    const bx = cx - bw / 2;
    const by = cy - bh / 2 + 8;
    return <g opacity=".85" pointerEvents="none">
      <rect x={bx} y={by} width={bw} height={bh} rx="3" fill={light} stroke={stroke} strokeWidth="1.1" />
      <rect x={bx + 5} y={by + 5} width={bw - 10} height={14} rx="2" fill="#fff" stroke={stroke} strokeWidth=".8" />
      <path d={`M${bx} ${by + bh - 7}h${bw}`} stroke={stroke} strokeWidth="1" />
      <rect x={x + w - 24} y={y + 14} width="10" height="22" rx="2" fill="#d8dfd8" stroke={stroke} strokeWidth=".8" />
    </g>;
  }

  if (type === "living") {
    const sw = Math.min(w * .62, 120);
    return <g opacity=".82" pointerEvents="none">
      <rect x={cx - sw / 2} y={cy - 18} width={sw} height="30" rx="6" fill={light} stroke={stroke} strokeWidth="1" />
      <rect x={cx - sw / 2 + 5} y={cy - 12} width={sw - 10} height="18" rx="4" fill="#f8f8f4" stroke={stroke} strokeWidth=".7" />
      <rect x={cx - 24} y={cy + 27} width="48" height="20" rx="3" fill="#e6e2d7" stroke={stroke} strokeWidth="1" />
      <rect x={cx - 7} y={cy + 30} width="14" height="14" fill="#faf9f4" stroke={stroke} strokeWidth=".6" />
    </g>;
  }

  if (type === "dining") {
    const tw = Math.min(w * .55, 80);
    const th = Math.min(h * .35, 46);
    return <g opacity=".82" pointerEvents="none">
      <rect x={cx - tw/2} y={cy - th/2} width={tw} height={th} rx="5" fill="#e4e0d5" stroke={stroke} strokeWidth="1" />
      {[
        [cx-tw/2-13,cy-8],[cx+tw/2+3,cy-8],[cx-tw/2-13,cy+3],[cx+tw/2+3,cy+3]
      ].map(([px,py],i)=><rect key={i} x={px} y={py} width="10" height="7" rx="2" fill={light} stroke={stroke} strokeWidth=".7" />)}
    </g>;
  }

  if (type === "kitchen") {
    return <g opacity=".85" pointerEvents="none">
      <path d={`M${x+12} ${y+18}H${x+w-12}V${y+42}H${x+12}Z`} fill="#e2e5de" stroke={stroke} strokeWidth="1" />
      <path d={`M${x+18} ${y+25}h18M${x+44} ${y+25}h18M${x+70} ${y+25}h18`} stroke={stroke} strokeWidth="1" />
      <rect x={cx-34} y={y+h-48} width="68" height="25" rx="3" fill="#e8e4d8" stroke={stroke} strokeWidth="1" />
      <circle cx={cx-14} cy={y+h-35} r="6" fill="none" stroke={stroke} />
      <circle cx={cx+14} cy={y+h-35} r="6" fill="none" stroke={stroke} />
    </g>;
  }

  if (type === "bathroom") {
    return <g opacity=".85" pointerEvents="none">
      <rect x={x+12} y={y+13} width="26" height="28" rx="8" fill="#f7faf8" stroke={stroke} strokeWidth="1" />
      <circle cx={x+25} cy={y+20} r="3" fill="none" stroke={stroke} strokeWidth=".8" />
      <rect x={x+w-38} y={y+13} width="25" height="25" rx="3" fill="#e4ecea" stroke={stroke} strokeWidth="1" />
      <circle cx={x+w-25} cy={y+h-20} r="8" fill="#f8faf8" stroke={stroke} strokeWidth="1" />
      <path d={`M${x+w-31} ${y+h-26}h12`} stroke={stroke} strokeWidth=".8" />
    </g>;
  }

  if (type === "garage") {
    return <g opacity=".78" pointerEvents="none">
      <rect x={cx-36} y={cy-52} width="72" height="104" rx="5" fill="#ecece8" stroke={stroke} strokeWidth="1" />
      <path d={`M${cx-30} ${cy-42}v84M${cx-18} ${cy-42}v84M${cx-6} ${cy-42}v84M${cx+6} ${cy-42}v84M${cx+18} ${cy-42}v84M${cx+30} ${cy-42}v84`} stroke="#a0aaa3" strokeWidth=".7" />
      <path d={`M${cx-42} ${cy-57}h84`} stroke="#5f7168" strokeWidth="2" />
    </g>;
  }

  if (type === "stairs") {
    const steps = 7;
    return <g opacity=".85" pointerEvents="none">
      {Array.from({length: steps}).map((_,i)=><path key={i} d={`M${x+16+i*9} ${y+h-16-i*7}h${w-32-i*18}v-7`} fill="none" stroke={stroke} strokeWidth="1.2" />)}
      <path d={`M${x+w/2} ${y+h-20}V${y+18}`} stroke="#53685f" strokeWidth="1.2" />
      <path d={`M${x+w/2} ${y+18}l-4 7M${x+w/2} ${y+18}l4 7`} stroke="#53685f" strokeWidth="1.2" />
    </g>;
  }

  return null;
}

function ArchitecturalRoom({ room, selectedRoom, onPointerDown, dragging }) {
  const cx = room.x + room.width / 2;
  const cy = room.y + room.height / 2;
  const title = String(room.name || roomInfo(room.type).label).toUpperCase();

  return (
    <g
      key={room.id}
      transform={`rotate(${room.rotation || 0} ${cx} ${cy})`}
      onPointerDown={onPointerDown}
      className={dragging ? "cursor-grabbing" : "cursor-grab"}
    >
      <rect x={room.x} y={room.y} width={room.width} height={room.height} fill={room.floorColor || fillFor(room.type)} stroke={selectedRoom ? "#0b5d46" : "#43584f"} strokeWidth={selectedRoom ? "3" : "2.2"} />
      {!selectedRoom && <rect x={room.x+4} y={room.y+4} width={Math.max(0,room.width-8)} height={Math.max(0,room.height-8)} fill="none" stroke="#c5cdc5" strokeWidth=".7" />}
      <Furniture room={room} />
      <TextLabel x={cx} y={room.type === "balcony" ? cy : cy - 8} size={room.width < 110 ? 8 : 10}>{title}</TextLabel>
      {room.type !== "balcony" && room.type !== "garage" && room.width > 110 && (
        <TextLabel x={cx} y={cy + 8} size={7} weight={500}>
          {Math.round(room.width)} × {Math.round(room.height)} ft
        </TextLabel>
      )}
      {selectedRoom && <rect x={room.x-5} y={room.y-5} width={room.width+10} height={room.height+10} fill="none" stroke="#0b5d46" strokeWidth="1" strokeDasharray="5 4" pointerEvents="none" />}
    </g>
  );
}

function buildArchitecturalAIPlan(inputRooms) {
  const source = Array.isArray(inputRooms) ? inputRooms : [];
  const requested = source.map((r, i) => ({
    ...r,
    id: r.id || `ai-room-${i}`,
    type: normalizeRoomType(r.type),
    // "masterbedroom" type ko bedroom bana rahe hain, isliye naam me master bacha lo
    name: r.name || (String(r.type).toLowerCase() === "masterbedroom" ? "Master Bedroom" : undefined),
  }));

  if (!requested.length) {
    return { rooms: INITIAL_ROOMS, doors: INITIAL_DOORS, windows: INITIAL_WINDOWS };
  }

  const list = (type) => requested.filter((r) => r.type === type);
  const bedrooms = list("bedroom");
  const bathrooms = list("bathroom");
  const first = (type) => list(type)[0];

  const living = first("living");
  const kitchen = first("kitchen");
  const dining = first("dining");
  const garage = first("garage");
  const balcony = first("balcony");
  const stairs = first("stairs");
  const store = first("store");
  const laundry = first("laundry");
  const study = first("study");
  const porch = first("porch");
  const rooms = [];
  const used = new Set();

  const add = (room, x, y, width, height, name) => {
    if (!room || used.has(room.id)) return;
    rooms.push({
      ...room,
      x, y, width, height,
      rotation: 0,
      name: name || room.name || roomInfo(room.type).label,
    });
    used.add(room.id);
  };

  /*
    CLEAN ARCHITECTURAL ZONING

    FRONT / ROAD
    ┌──────────────┬───────────────────┬──────────────┐
    │ PARKING      │ MAIN ENTRY        │ KITCHEN      │
    │ / PORCH      │ LIVING / DRAWING  │              │
    ├──────────────┼─────────┬─────────┼──────────────┤
    │ DINING       │ STAIRS  │ STORE   │ COMMON BATH  │
    ├──────────────┴─────────┴─────────┴──────────────┤
    │ MASTER + ATTACHED │ BEDROOM 2 + BATH            │
    ├───────────────────┼─────────────────────────────┤
    │ BEDROOM 3         │ BEDROOM 4 / STUDY          │
    ├─────────────────────────────────────────────────┤
    │              REAR BALCONY / SERVICE             │
    └─────────────────────────────────────────────────┘
    BACK

    Every room gets a dedicated non-overlapping rectangle.
    Public spaces stay at the front, private rooms at the back.
  */

  // FRONT / PUBLIC ZONE
  if (garage) add(garage, 55, 55, 170, 115, "PARKING / GARAGE");
  if (porch) add(porch, 55, 55, garage ? 170 : 135, 35, "FRONT PORCH");

  if (living) add(living, 235, 55, 235, 115, "LIVING / DRAWING");
  if (kitchen) add(kitchen, 480, 55, 155, 115, "KITCHEN");

  // MIDDLE / CIRCULATION + SERVICE ZONE
  if (dining) add(dining, 55, 185, 205, 105, "DINING");
  if (stairs) add(stairs, 275, 185, 85, 105, "STAIRS");
  if (store) add(store, 375, 185, 80, 55, "STORE");
  if (laundry) add(laundry, 470, 185, 75, 55, "LAUNDRY");

  // If there is no kitchen/living in the request, don't invent them.
  // Unused front spaces simply remain circulation/open space.

  // PRIVATE ZONE. Master bedroom is always paired with its attached bath.
  if (bedrooms.length > 0) {
    add(bedrooms[0], 55, 305, 200, 105, "MASTER BEDROOM");

    if (bathrooms[0]) {
      add(bathrooms[0], 265, 305, 75, 75, "MASTER ATTACHED BATH");
    }

    if (bedrooms[1]) {
      add(bedrooms[1], 350, 305, 190, 105, "BEDROOM 2");
    }

    if (bathrooms[1]) {
      add(bathrooms[1], 550, 305, 80, 75, "COMMON BATHROOM");
    }

    if (bedrooms[2]) {
      add(bedrooms[2], 55, 425, 245, 100, "BEDROOM 3");
    }

    if (bedrooms[3]) {
      add(bedrooms[3], 315, 425, 245, 100, "BEDROOM 4");
    }

    if (bathrooms[2]) {
      add(bathrooms[2], 570, 425, 60, 75, "BATHROOM 3");
    }
  } else if (bathrooms[0]) {
    add(bathrooms[0], 55, 305, 100, 75, "COMMON BATHROOM");
  }

  // Optional rear/service spaces are kept together rather than scattered.
  if (study && !used.has(study.id)) add(study, 55, 535, 150, 40, "STUDY / OFFICE");
  if (laundry && !used.has(laundry.id)) add(laundry, 215, 535, 120, 40, "LAUNDRY");
  if (balcony && !used.has(balcony.id)) add(balcony, 345, 535, 285, 40, "REAR BALCONY");

  // Place any unusual requested spaces in an orderly service strip.
  const leftovers = requested.filter((r) => !used.has(r.id));
  const fallbackSlots = [
    [55, 185, 95, 55],
    [155, 185, 95, 55],
    [470, 250, 75, 45],
    [550, 250, 80, 45],
    [55, 535, 130, 40],
  ];
  leftovers.forEach((room, i) => {
    const slot = fallbackSlots[i % fallbackSlots.length];
    add(room, ...slot, String(room.name || roomInfo(room.type).label).toUpperCase());
  });

  // Make sure all rooms remain inside the plot.
  rooms.forEach((r) => {
    r.width = Math.max(35, Math.min(r.width, PLOT.width - 10));
    r.height = Math.max(30, Math.min(r.height, PLOT.height - 10));
    r.x = Math.max(PLOT.left + 5, Math.min(r.x, PLOT.right - r.width - 5));
    r.y = Math.max(PLOT.top + 5, Math.min(r.y, PLOT.bottom - r.height - 5));
  });

  // Doors are attached to room boundaries. No floating doors in the middle.
  const doors = [];
  const addDoor = (id, name, x, y, width = 34, height = 8, rotation = 0) => {
    doors.push({ id, name, x, y, width, height, rotation });
  };

  const livingRoom = rooms.find((r) => r.type === "living");
  if (livingRoom) {
    addDoor(
      "ai-main-door",
      "MAIN ENTRY",
      livingRoom.x + livingRoom.width * 0.42,
      PLOT.top - 2,
      46,
      9
    );
  }

  const parkingRoom = rooms.find((r) => r.type === "garage");
  if (parkingRoom) {
    addDoor(
      "ai-parking-gate",
      "PARKING GATE",
      parkingRoom.x + parkingRoom.width * 0.18,
      PLOT.top - 2,
      parkingRoom.width * 0.64,
      9
    );
  }

  rooms.forEach((r, i) => {
    if (["garage", "porch", "balcony"].includes(r.type)) return;

    // Prefer a door on the top wall. For rear rooms this naturally opens to
    // the circulation side above them.
    addDoor(
      `ai-door-${i}`,
      `${r.name} DOOR`,
      r.x + r.width / 2 - 17,
      r.y - 4,
      34,
      8
    );
  });

  // Windows are only placed on exterior-facing walls.
  const windows = [];
  rooms.forEach((r, i) => {
    if (r.type === "stairs" || r.type === "store") return;

    const onLeft = Math.abs(r.x - (PLOT.left + 5)) < 8;
    const onRight = Math.abs(r.x + r.width - (PLOT.right - 5)) < 8;
    const onTop = Math.abs(r.y - (PLOT.top + 5)) < 8;
    const onBottom = Math.abs(r.y + r.height - (PLOT.bottom - 5)) < 8;

    if (onTop || (!onLeft && !onRight && !onBottom && r.y < 180)) {
      windows.push({
        id: `ai-window-${i}-top`,
        name: `${r.name} WINDOW`,
        x: r.x + r.width / 2 - 26,
        y: r.y - 3,
        width: 52,
        height: 7,
        rotation: 0,
      });
    } else if (onLeft) {
      windows.push({
        id: `ai-window-${i}-left`,
        name: `${r.name} WINDOW`,
        x: r.x - 3,
        y: r.y + r.height / 2 - 25,
        width: 7,
        height: 50,
        rotation: 0,
      });
    } else if (onRight) {
      windows.push({
        id: `ai-window-${i}-right`,
        name: `${r.name} WINDOW`,
        x: r.x + r.width - 4,
        y: r.y + r.height / 2 - 25,
        width: 7,
        height: 50,
        rotation: 0,
      });
    } else if (onBottom) {
      windows.push({
        id: `ai-window-${i}-bottom`,
        name: `${r.name} WINDOW`,
        x: r.x + r.width / 2 - 26,
        y: r.y + r.height - 4,
        width: 52,
        height: 7,
        rotation: 0,
      });
    }
  });

  return { rooms, doors, windows };
}


function buildDoubleStoreyFirstFloorPlan(baseRooms = []) {
  const source = Array.isArray(baseRooms) ? baseRooms : [];
  const roomByType = (type, index = 0) => source.filter((r) => normalizeRoomType(r.type) === type)[index];
  const pickName = (type, fallback) => roomByType(type)?.name || fallback;
  const rooms = [];

  const add = (type, name, x, y, width, height, extra = {}) => {
    rooms.push({
      id: `first-${type}-${rooms.length + 1}`,
      type,
      name,
      x,
      y,
      width,
      height,
      rotation: 0,
      ...extra,
    });
  };

  // FIRST FLOOR — private family zone with stairs, bedrooms and balconies.
  add("stairs", "Staircase", 55, 55, 100, 105);
  add("living", "Family Lounge", 165, 55, 215, 105);
  add("bedroom", "Master Bedroom", 390, 55, 235, 125, { floorMaterial: "light-wood" });
  add("bathroom", "Master Attached Bath", 480, 190, 145, 72);
  add("bedroom", pickName("bedroom", "Bedroom 3"), 55, 180, 185, 115);
  add("bedroom", source.filter((r) => normalizeRoomType(r.type) === "bedroom")[2]?.name || "Bedroom 4", 250, 180, 190, 115);
  add("bathroom", "Common Bath", 455, 280, 85, 75);
  add("bathroom", "Attached Bath 2", 550, 280, 75, 75);
  add("balcony", "Front Balcony", 55, 315, 210, 72);
  add("balcony", "Open Terrace", 275, 315, 265, 72);
  add("laundry", "Laundry", 555, 375, 70, 70);
  add("store", "Store", 465, 375, 80, 70);

  const clampRoom = (r) => ({
    ...r,
    x: Math.max(PLOT.left + 5, Math.min(r.x, PLOT.right - r.width - 5)),
    y: Math.max(PLOT.top + 5, Math.min(r.y, PLOT.bottom - r.height - 5)),
  });

  const finalRooms = rooms.map(clampRoom);
  const doors = [];
  const windows = [];

  finalRooms.forEach((r, index) => {
    if (r.type !== "balcony" && r.type !== "terrace") {
      doors.push({
        id: `first-door-${index + 1}`,
        name: `${r.name} Door`,
        x: Math.round(r.x + Math.min(r.width / 2 - 21, Math.max(20, r.width / 2 - 21))),
        y: Math.max(PLOT.top, r.y - 3),
        width: 42,
        height: 10,
        rotation: 0,
      });
    }

    const exteriorTop = r.y <= PLOT.top + 8;
    const exteriorLeft = r.x <= PLOT.left + 8;
    const exteriorRight = r.x + r.width >= PLOT.right - 8;
    const exteriorBottom = r.y + r.height >= PLOT.bottom - 8;

    if (exteriorTop || (!exteriorLeft && !exteriorRight && !exteriorBottom && r.y < 190)) {
      windows.push({ id: `first-window-${index}-top`, name: `${r.name} Window`, x: r.x + r.width / 2 - 25, y: r.y - 3, width: 50, height: 7, rotation: 0 });
    } else if (exteriorLeft) {
      windows.push({ id: `first-window-${index}-left`, name: `${r.name} Window`, x: r.x - 3, y: r.y + r.height / 2 - 23, width: 7, height: 46, rotation: 0 });
    } else if (exteriorRight) {
      windows.push({ id: `first-window-${index}-right`, name: `${r.name} Window`, x: r.x + r.width - 4, y: r.y + r.height / 2 - 23, width: 7, height: 46, rotation: 0 });
    } else if (exteriorBottom) {
      windows.push({ id: `first-window-${index}-bottom`, name: `${r.name} Window`, x: r.x + r.width / 2 - 25, y: r.y + r.height - 4, width: 50, height: 7, rotation: 0 });
    }
  });

  return { rooms: finalRooms, doors, windows, walls: [], furniture: [] };
}

export default function FloorPlanEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const isAIPlan = location.state?.source === "ai-planner" || location.state?.generatedByAI === true;
  const isManualPlan = !isAIPlan;

  const [project, setProject] = useState(() => ({
    name: location.state?.project?.name || location.state?.projectName || "Dream House",
    plotWidth: location.state?.plotWidth || location.state?.project?.plotWidth || 30,
    plotLength: location.state?.plotLength || location.state?.project?.plotLength || 60,
    // This editor is configured for a real double-storey house.
    floors: Math.max(1, Number(location.state?.floors || location.state?.project?.floors || 2)),
  }));
  const [backendProjectId, setBackendProjectId] = useState(location.state?.projectId || null);
  const [designSettings, setDesignSettings] = useState(() => ({
    site: location.state?.site || {},
    exterior: location.state?.exterior || {},
    interior: location.state?.interior || {},
    materials: location.state?.materials || {},
    lighting: location.state?.lighting || {},
    roof: location.state?.roof || {},
    floors: location.state?.floorsData || [],
  }));

  const [rooms, setRooms] = useState(() => {
    if (isAIPlan && location.state?.rooms?.length) return buildArchitecturalAIPlan(location.state.rooms).rooms;
    return Array.isArray(location.state?.rooms) && location.state.rooms.length
      ? location.state.rooms.map((room, index) => ({ ...room, id: room.id || `room-${index}-${Date.now()}`, rotation: room.rotation || 0 }))
      : INITIAL_ROOMS;
  });

  const [doors, setDoors] = useState(() => {
    if (isAIPlan && location.state?.rooms?.length) return buildArchitecturalAIPlan(location.state.rooms).doors;
    return Array.isArray(location.state?.doors) ? location.state.doors : INITIAL_DOORS;
  });

  const [windows, setWindows] = useState(() => {
    if (isAIPlan && location.state?.rooms?.length) return buildArchitecturalAIPlan(location.state.rooms).windows;
    return Array.isArray(location.state?.windows) ? location.state.windows : INITIAL_WINDOWS;
  });
  const [walls, setWalls] = useState(INITIAL_WALLS);
  const [furniture, setFurniture] = useState([]);

  // Multi-floor support: every selected building floor gets its own editable snapshot.
  const [floorLevel, setFloorLevel] = useState("ground");
  const [floorPlans, setFloorPlans] = useState({});

  const floorKey = (level) => (level === 0 ? "ground" : level === 1 ? "first" : `floor-${level}`);
  const floorLabel = (level) => (
    level === 0 ? "Ground Floor" : level === 1 ? "First Floor" : `Floor ${level + 1}`
  );

  const makeFloorSnapshot = (level, ground) => {
    if (level === 0) {
      return {
        rooms: rooms.map((item) => ({ ...item, floor: 0 })),
        doors: doors.map((item) => ({ ...item, floor: 0 })),
        windows: windows.map((item) => ({ ...item, floor: 0 })),
        walls: walls.map((item) => ({ ...item, floor: 0 })),
        furniture: furniture.map((item) => ({ ...item, floor: 0 })),
      };
    }

    if (level === 1) {
      return buildDoubleStoreyFirstFloorPlan(ground.rooms || []);
    }

    // Higher floors start from the ground footprint so they are immediately visible
    // in both 2D and 3D, but remain independent once the user edits them.
    return {
      rooms: (ground.rooms || []).map((item, index) => ({ ...item, id: `${item.id || "room"}-f${level}-${index}`, floor: level })),
      doors: (ground.doors || []).map((item, index) => ({ ...item, id: `${item.id || "door"}-f${level}-${index}`, floor: level })),
      windows: (ground.windows || []).map((item, index) => ({ ...item, id: `${item.id || "window"}-f${level}-${index}`, floor: level })),
      walls: (ground.walls || []).map((item, index) => ({ ...item, id: `${item.id || "wall"}-f${level}-${index}`, floor: level })),
      furniture: (ground.furniture || []).map((item, index) => ({ ...item, id: `${item.id || "furniture"}-f${level}-${index}`, floor: level })),
    };
  };

  useEffect(() => {
    setFloorPlans((previous) => {
      const count = Math.max(1, Number(project?.floors || 1));
      const ground = previous.ground?.rooms?.length
        ? previous.ground
        : makeFloorSnapshot(0, {});

      const next = { ...previous, ground };
      for (let level = 1; level < count; level += 1) {
        const key = floorKey(level);
        if (!next[key]?.rooms?.length) next[key] = makeFloorSnapshot(level, ground);
      }

      // Remove snapshots above the newly selected floor count.
      Object.keys(next).forEach((key) => {
        const level = key === "ground" ? 0 : key === "first" ? 1 : Number(key.replace("floor-", ""));
        if (Number.isFinite(level) && level >= count) delete next[key];
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.floors]);

  const [selected, setSelected] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(!isAIPlan);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [dragging, setDragging] = useState(null);
const [aiCommand, setAiCommand] = useState("");
const [aiCommandLoading, setAiCommandLoading] = useState(false);
const [aiCommandMessage, setAiCommandMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const skipHistoryRef = useRef(false);
  const [aiChat, setAiChat] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Assalam o Alaikum! Aap apni normal language mein command dein. English, Roman Urdu, Urdu/Hinglish — main plan mein sirf aapki requested changes apply karunga.",
    },
  ]);
  useEffect(() => {
    if (location.state?.rooms?.length || isAIPlan) return;
    const raw = localStorage.getItem("dreamhouse_current_plan");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      queueMicrotask(() => {
        if (data.project) {
          setProject({
            ...data.project,
            floors: Math.max(1, Number(data.project.floors || 1)),
          });
        }
        if (Array.isArray(data.rooms)) setRooms(data.rooms);
        if (Array.isArray(data.doors)) setDoors(data.doors);
        if (Array.isArray(data.windows)) setWindows(data.windows);
        if (Array.isArray(data.walls)) setWalls(data.walls);
        if (Array.isArray(data.furniture)) setFurniture(data.furniture);
        if (data.floorPlans && typeof data.floorPlans === "object") {
          setFloorPlans((previous) => {
            const incoming = data.floorPlans;
            const ground = incoming.ground || previous.ground || {
              rooms: Array.isArray(data.rooms) ? data.rooms : INITIAL_ROOMS,
              doors: Array.isArray(data.doors) ? data.doors : INITIAL_DOORS,
              windows: Array.isArray(data.windows) ? data.windows : INITIAL_WINDOWS,
              walls: Array.isArray(data.walls) ? data.walls : [],
              furniture: Array.isArray(data.furniture) ? data.furniture : [],
            };
            return {
              ...previous,
              ...incoming,
              ground,
            };
          });
        }
        if (data.floorLevel) setFloorLevel(data.floorLevel);
        setDesignSettings((current) => ({ ...current, ...data }));
      });
    } catch (e) { console.error("Could not load saved floor plan", e); }
  }, [isAIPlan, location.state]);

  useEffect(() => {
    if (!backendProjectId || !localStorage.getItem("dreamhouse_token")) return;
    getProject(backendProjectId).then((remote) => {
      const plan = remote.floorPlanData || {};
      if (plan.project) {
        setProject({
          ...plan.project,
          floors: Math.max(1, Number(plan.project.floors || 1)),
        });
      }
      if (Array.isArray(plan.rooms)) setRooms(plan.rooms);
      if (Array.isArray(plan.doors)) setDoors(plan.doors);
      if (Array.isArray(plan.windows)) setWindows(plan.windows);
      if (Array.isArray(plan.walls)) setWalls(plan.walls);
      if (Array.isArray(plan.furniture)) setFurniture(plan.furniture);
      if (plan.floorPlans && typeof plan.floorPlans === "object") {
        setFloorPlans((previous) => {
          const incoming = plan.floorPlans;
          const ground = incoming.ground || previous.ground || {
            rooms: Array.isArray(plan.rooms) ? plan.rooms : INITIAL_ROOMS,
            doors: Array.isArray(plan.doors) ? plan.doors : INITIAL_DOORS,
            windows: Array.isArray(plan.windows) ? plan.windows : INITIAL_WINDOWS,
            walls: Array.isArray(plan.walls) ? plan.walls : [],
            furniture: Array.isArray(plan.furniture) ? plan.furniture : [],
          };
          return {
            ...previous,
            ...incoming,
            ground,
          };
        });
      }
      if (plan.floorLevel) setFloorLevel(plan.floorLevel);
      setDesignSettings({ site: plan.site || {}, exterior: plan.exterior || {}, interior: plan.interior || {}, materials: plan.materials || {}, lighting: plan.lighting || {}, roof: plan.roof || {}, floors: plan.floors || [] });
    }).catch((error) => setAiCommandMessage(`Could not load cloud project: ${error.message}`));
  }, [backendProjectId]);

  useEffect(() => {
    const snapshot = { rooms, doors, windows, walls, furniture };
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    setHistory((previous) => {
      const last = previous[previous.length - 1];
      if (last && JSON.stringify(last) === JSON.stringify(snapshot)) return previous;
      return [...previous.slice(-39), snapshot];
    });
    setFuture([]);
  }, [rooms, doors, windows, walls, furniture]);

  const applySnapshot = (snapshot) => {
    skipHistoryRef.current = true;
    setRooms(snapshot.rooms);
    setDoors(snapshot.doors);
    setWindows(snapshot.windows);
    setWalls(snapshot.walls || []);
    setFurniture(snapshot.furniture || []);
    setSelected(null);
  };

  const undo = () => {
    if (history.length < 2) return;
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [...items, current]);
    applySnapshot(previous);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[future.length - 1];
    setHistory((items) => [...items, next]);
    setFuture((items) => items.slice(0, -1));
    applySnapshot(next);
  };

  const selectedData = useMemo(() => {
    if (!selected) return null;
    if (selected.type === "room") return rooms.find((x) => x.id === selected.id) || null;
    if (selected.type === "door") return doors.find((x) => x.id === selected.id) || null;
    if (selected.type === "window") return windows.find((x) => x.id === selected.id) || null;
    if (selected.type === "wall") return walls.find((x) => x.id === selected.id) || null;
    if (selected.type === "furniture") return furniture.find((x) => x.id === selected.id) || null;
    return null;
  }, [selected, rooms, doors, windows, walls, furniture]);

  const svgPoint = (e) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const getItem = (type, id) =>
    type === "room" ? rooms.find((x) => x.id === id) :
    type === "door" ? doors.find((x) => x.id === id) :
    type === "window" ? windows.find((x) => x.id === id) :
    type === "wall" ? walls.find((x) => x.id === id) :
    furniture.find((x) => x.id === id);

  const startDrag = (e, type, id) => {
    e.preventDefault();
    e.stopPropagation();
    const item = getItem(type, id);
    if (!item) return;
    const p = svgPoint(e);
    dragRef.current = { type, id, offsetX: p.x - item.x, offsetY: p.y - item.y };
    setSelected({ type, id });
    setActiveTool("select");
    setDragging({ type, id });
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      if (!dragRef.current || !svgRef.current) return;
      const p = svgPoint(e);
      const snap = snapEnabled ? (e.shiftKey ? 1 : 5) : 1;
      let x = Math.round((p.x - dragRef.current.offsetX) / snap) * snap;
      let y = Math.round((p.y - dragRef.current.offsetY) / snap) * snap;
      const { type, id } = dragRef.current;
      const update = (item) => {
        if (!item) return item;
        x = Math.max(PLOT.left, Math.min(x, PLOT.right - item.width));
        y = Math.max(PLOT.top, Math.min(y, PLOT.bottom - item.height));
        return { ...item, x, y };
      };
      if (type === "room") setRooms((a) => a.map((x) => x.id === id ? update(x) : x));
      if (type === "door") setDoors((a) => a.map((x) => x.id === id ? update(x) : x));
      if (type === "window") setWindows((a) => a.map((x) => x.id === id ? update(x) : x));
      if (type === "wall") setWalls((a) => a.map((x) => x.id === id ? update(x) : x));
      if (type === "furniture") setFurniture((a) => a.map((x) => x.id === id ? update(x) : x));
    };
    const up = () => { dragRef.current = null; setDragging(null); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, snapEnabled]);

  useEffect(() => {
    const key = (e) => {
      const editingText = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !editingText) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !editingText) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key !== "Delete" || !selected) return;
      if (selected.type === "room") setRooms((a) => a.filter((x) => x.id !== selected.id));
      if (selected.type === "door") setDoors((a) => a.filter((x) => x.id !== selected.id));
      if (selected.type === "window") setWindows((a) => a.filter((x) => x.id !== selected.id));
      if (selected.type === "wall") setWalls((a) => a.filter((x) => x.id !== selected.id));
      if (selected.type === "furniture") setFurniture((a) => a.filter((x) => x.id !== selected.id));
      setSelected(null);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  // The handlers intentionally stay local to the editor state machine.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, isAIPlan, history, future]);
const handleAICommand = async () => {
  if (!isAIPlan || !aiCommand.trim()) return;

  const originalCommand = aiCommand.trim();

  // Convert common English, Roman-Urdu, Urdu-script and Hindi/Hinglish words
  // into a common command vocabulary. This keeps the editor usable without
  // forcing the user to choose predefined suggestion buttons.
  const normalizeAICommand = (input) => {
    let value = String(input || "").toLowerCase().trim();

    const replacements = [
      // Urdu script
      ["پارکنگ", "parking"], ["گاڑی", "parking"], ["کار", "parking"],
      ["مین گیٹ", "main gate"], ["دروازے", "gate"], ["دروازہ", "gate"],
      ["کمرے", "rooms"], ["کمرہ", "room"], ["پیچھے", "behind"], ["پیچھے والی", "rear"],
      ["بالکنی", "balcony"], ["باورچی خانہ", "kitchen"], ["کچن", "kitchen"],
      ["بیڈروم", "bedroom"], ["بیڈ روم", "bedroom"], ["باتھ روم", "bathroom"],
      ["واش روم", "washroom"], ["لاؤنج", "living room"], ["ڈرائنگ روم", "drawing room"],
      ["ڈائننگ", "dining"], ["گیراج", "garage"], ["چھت", "terrace"],
      ["بائیں", "left"], ["دائیں", "right"], ["سامنے", "front"], ["اوپر", "upper"],
      ["نیچے", "bottom"], ["درمیان", "center"], ["ساتھ", "near"], ["پاس", "near"],
      ["شامل", "add"], ["بناؤ", "add"], ["بناو", "add"], ["ہٹا دو", "remove"],
      ["ہٹاؤ", "remove"], ["منتقل", "move"], ["کر دو", "do"], ["کرو", "do"],
      ["گھماؤ", "rotate"], ["گھماو", "rotate"], ["ڈگری", "degrees"],
      // Roman Urdu / Hinglish
      ["ky", "ke"], ["kay", "ke"], ["k", "ke"],
      ["picha", "behind"], ["peecha", "behind"], ["peechay", "behind"], ["piche", "behind"],
      ["peeche", "behind"], ["pichay", "behind"], ["back side", "rear"],
      ["samne", "front"], ["aagay", "front"], ["agay", "front"],
      ["baen", "left"], ["baayi", "left"], ["bain", "left"],
      ["dayen", "right"], ["daayi", "right"], ["dain", "right"],
      ["pass", "near"], ["paas", "near"], ["pss", "near"], ["qareeb", "near"], ["nazdeek", "near"],
      ["chor do", "add"], ["chhor do", "add"], ["choro", "add"],
      ["bari", "bigger"], ["bara", "bigger"], ["chota", "smaller"],
      ["move karo", "move"], ["move kr", "move"], ["shift karo", "move"],
      ["add karo", "add"], ["add kr", "add"], ["bana do", "add"],
      ["remove karo", "remove"], ["remove kar do", "remove"], ["remove kr do", "remove"],
      ["delete karo", "remove"], ["delete kar do", "remove"], ["delete kr do", "remove"],
      ["del karo", "remove"], ["del kar do", "remove"], ["del kr do", "remove"], ["del", "remove"],
      ["hata do", "remove"], ["hatao", "remove"], ["hatado", "remove"],
      ["nikaal do", "remove"], ["nikal do", "remove"],
      ["ghumao", "rotate"], ["rotate karo", "rotate"], ["rotate kar do", "rotate"],
      // Hindi/Hinglish
      ["कमरा", "room"], ["कमरे", "rooms"], ["रसोई", "kitchen"], ["रसोईघर", "kitchen"],
      ["बेडरूम", "bedroom"], ["बाथरूम", "bathroom"], ["पार्किंग", "parking"],
      ["बालकनी", "balcony"], ["पीछे", "behind"], ["सामने", "front"],
      ["बाएं", "left"], ["दाएं", "right"], ["पास", "near"],
      ["जोड़ो", "add"], ["हटाओ", "remove"], ["चलाओ", "move"], ["घुमाओ", "rotate"],
    ];

    // Long phrases first. Use word boundaries so Roman-Urdu aliases such as
    // "k", "ki" or "ky" never corrupt real words like kitchen or parking.
    replacements.sort((a, b) => b[0].length - a[0].length);
    for (const [from, to] of replacements) {
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      value = value.replace(new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "gi"), `$1${to}`);
    }

    // Normalize room numbering so all of these become "bedroom 3":
    // bedroom no 3, bedroom number 3, bedroom #3, bedroom num 3.
    value = value
      .replace(/\b(?:no|number|num|#)\s*(\d+)\b/gi, "$1")
      .replace(/\b(?:no\.|number\.|num\.)\s*(\d+)\b/gi, "$1")
      .replace(/[،،؛؟]/g, " ")
      .replace(/[.,!?;:]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // If the user puts the action after the target, normalize it too:
    // "bedroom 3 del kar do" -> "remove bedroom 3".
    value = value
      .replace(/^(.*?)(?:\s+)(?:remove|delete|del)(?:\s+(?:do|karo|kar|kr|please))?$/i, "remove $1")
      .replace(/^(.*?)(?:\s+)(?:hatao|hatado|hata do|nikaal do|nikal do)$/i, "remove $1")
      .replace(/\s+/g, " ")
      .trim();

    return value;
  };

  const command = normalizeAICommand(originalCommand);
  setAiCommandLoading(true);
  setAiCommandMessage("");
  const userMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    text: originalCommand,
  };
  setAiChat((prev) => [...prev, userMessage]);

  // =====================================================================
  // STEP 1: Pehle asli AI (Gemini) se try karo. Login zaroori nahi.
  // Agar AI fail ho jaye to neeche wala purana local parser chalega.
  // =====================================================================
  try {
    // Editor pixels me kaam karta hai (plot 625 x 550), feet me nahi.
    // Isliye AI ko canvas ki hadd aur allowed room types saath bhej rahe hain.
    const planForAI = {
      project: { ...project, plotWidth: PLOT.width, plotLength: PLOT.height, units: "pixels" },
      rooms, doors, windows, walls, furniture,
      floorLevel,
      floorCount: project?.floors || 1,
      ...designSettings,
      settings: {
        canvas: {
          left: PLOT.left,
          top: PLOT.top,
          right: PLOT.right,
          bottom: PLOT.bottom,
          units: "pixels",
          roomTypes: ROOM_TYPES.map((r) => r.value),
        },
      },
    };

    const response = await modifyFloorPlan(originalCommand, planForAI);
    const next = response.floorPlanData || response;

    // Agar AI ne sahi plan nahi diya to purana plan mat mitao
    if (!Array.isArray(next.rooms)) {
      throw new Error("AI did not return a valid plan");
    }

    setRooms(next.rooms.map((room) => ({ ...room, type: normalizeRoomType(room.type) })));
    setDoors(next.doors || []);
    setWindows(next.windows || []);
    setWalls(next.walls || []);
    setFurniture(next.furniture || []);
    setDesignSettings({ site: next.site || {}, exterior: next.exterior || {}, interior: next.interior || {}, materials: next.materials || {}, lighting: next.lighting || {}, roof: next.roof || {}, floors: next.floors || [] });
    setSelected(null);
    setSaved(false);

    // AI ka apna reply dikhao (agar nahi mila to simple message)
    const changeCount = (response.operations || []).length;
    const confirmation =
      response.reply ||
      (changeCount
        ? `AI applied ${changeCount} change${changeCount === 1 ? "" : "s"} to your plan.`
        : "No changes were needed.");

    setAiCommandMessage(confirmation);
    setAiChat((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", text: confirmation }]);
    setAiCommand("");
    setAiCommandLoading(false);
    return;
  } catch (error) {
    console.error("[Editor AI] Backend AI failed, using local parser:", error);
    setAiChat((prev) => [
      ...prev,
      {
        id: `assistant-note-${Date.now()}`,
        role: "assistant",
        text: `AI server se jawab nahi mila (${error.message}). Main local mode se try kar rahi hoon.`,
      },
    ]);
  }

  setTimeout(() => {
    let nextRooms = [...rooms];
    let nextDoors = [...doors];
    let nextWindows = [...windows];
    const messages = [];

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const roomLabel = (r) => (r?.name || r?.type || "room").replace(/\s+/g, " ").trim();

    const findRoom = (text) => {
      const normalized = String(text || "")
        .toLowerCase()
        .replace(/\b(?:no|number|num|#)\s*(\d+)\b/gi, "$1")
        .replace(/\b(?:no\.|number\.|num\.)\s*(\d+)\b/gi, "$1")
        .replace(/\s+/g, " ")
        .trim();

      const numberWords = {
        one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      };

      const getNumber = (value) => {
        const digit = String(value).match(/\b(\d+)\b/);
        if (digit) return Number(digit[1]);
        const word = String(value).match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
        return word ? numberWords[word[1].toLowerCase()] : null;
      };

      const candidatesByType = (types) =>
        nextRooms.filter((r) => types.includes(r.type));

      const numberedRoom = (typeWords, types) => {
        const numberMatch = normalized.match(
          new RegExp(`\\b(?:${typeWords.join("|")})\\s*(?:no\\.?|number|num|#)?\\s*(\\d+)\\b`, "i")
        );
        if (numberMatch) {
          const number = Number(numberMatch[1]);
          const candidates = candidatesByType(types);
          return candidates[number - 1] || null;
        }

        const wordNumberMatch = normalized.match(
          new RegExp(`\\b(?:${typeWords.join("|")})\\s+(one|two|three|four|five|six|seven|eight|nine|ten)\\b`, "i")
        );
        if (wordNumberMatch) {
          const number = numberWords[wordNumberMatch[1].toLowerCase()];
          const candidates = candidatesByType(types);
          return candidates[number - 1] || null;
        }

        return null;
      };

      // Explicit numbered bedrooms have priority over generic "bedroom".
      const explicitBedroom = numberedRoom(
        ["master\\s+bedroom", "bed\\s*room", "bedrooms?", "bedroom"],
        ["bedroom"]
      );
      if (explicitBedroom) return explicitBedroom;

      if (/\bmaster(?:\s+bedroom)?\b/i.test(normalized)) {
        const bedrooms = candidatesByType(["bedroom"]);
        return bedrooms.find((r) => /master/i.test(r.name || "")) || bedrooms[0] || null;
      }

      const patterns = [
        { re: /\bbath(?:room)?s?\b|\bwashrooms?\b/i, types: ["bathroom"] },
        { re: /\bkitchens?\b/i, types: ["kitchen"] },
        { re: /\b(?:living\s*room|living)\b/i, types: ["living"] },
        { re: /\b(?:dining\s*room|dining)\b/i, types: ["dining"] },
        { re: /\b(?:garage|parking|car\s+parking)\b/i, types: ["garage", "parking"] },
        { re: /\bbalcon(?:y|ies)\b/i, types: ["balcony"] },
        { re: /\bterraces?\b/i, types: ["terrace"] },
        { re: /\b(?:study\s*room|study)\b/i, types: ["study"] },
        { re: /\boffice\b/i, types: ["office"] },
        { re: /\blaundry\b/i, types: ["laundry"] },
        { re: /\b(?:store\s*room|store)\b/i, types: ["store"] },
        { re: /\b(?:prayer\s*room|prayer)\b/i, types: ["prayer-room", "prayer"] },
      ];

      for (const p of patterns) {
        if (!p.re.test(normalized)) continue;
        const candidates = candidatesByType(p.types);
        const number = getNumber(normalized);
        if (number && candidates[number - 1]) return candidates[number - 1];
        return candidates[0] || null;
      }

      // Last fallback: exact/partial match against the actual room name.
      const roomName = nextRooms.find((r) => {
        const name = String(r.name || "").toLowerCase().replace(/\s+/g, " ").trim();
        return name && normalized.includes(name);
      });
      return roomName || null;
    };

    const overlaps = (a, b, gap = 8) =>
      a.x < b.x + b.width + gap &&
      a.x + a.width + gap > b.x &&
      a.y < b.y + b.height + gap &&
      a.y + a.height + gap > b.y;

    const findFreeSpot = (width, height, preferredX, preferredY) => {
      const xs = [preferredX, 55, 145, 235, 325, 415, 505];
      const ys = [preferredY, 55, 145, 235, 325, 425, 515];
      for (const y0 of ys) {
        for (const x0 of xs) {
          const candidate = {
            x: clamp(x0, PLOT.left + 8, PLOT.right - width - 8),
            y: clamp(y0, PLOT.top + 8, PLOT.bottom - height - 8),
            width,
            height,
          };
          if (!nextRooms.some((r) => overlaps(candidate, r))) return candidate;
        }
      }
      return {
        x: clamp(preferredX, PLOT.left + 8, PLOT.right - width - 8),
        y: clamp(preferredY, PLOT.top + 8, PLOT.bottom - height - 8),
        width,
        height,
      };
    };

    const addRoomByType = (type, name, width, height, preferredX, preferredY) => {
      const spot = findFreeSpot(width, height, preferredX, preferredY);
      const newRoom = {
        id: `ai-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        name,
        x: spot.x,
        y: spot.y,
        width,
        height,
        rotation: 0,
      };
      nextRooms.push(newRoom);
      return newRoom;
    };

    const moveRoom = (room, x, y) => {
      if (!room) return null;
      const nx = clamp(x, PLOT.left + 5, PLOT.right - room.width - 5);
      const ny = clamp(y, PLOT.top + 5, PLOT.bottom - room.height - 5);
      const updated = { ...room, x: nx, y: ny };
      nextRooms = nextRooms.map((r) => (r.id === room.id ? updated : r));
      return updated;
    };

    const syncOpenings = (room) => {
      if (!room) return;
      nextDoors = nextDoors.map((d) => {
        if (!new RegExp(roomLabel(room), "i").test(d.name || "")) return d;
        return { ...d, x: room.x + room.width / 2 - d.width / 2, y: room.y - d.height / 2 };
      });
      nextWindows = nextWindows.map((w) => {
        if (!new RegExp(roomLabel(room), "i").test(w.name || "")) return w;
        return { ...w, x: room.x + room.width / 2 - w.width / 2, y: room.y - 3 };
      });
    };

    const countFrom = (text) => {
      const digit = text.match(/(?:add|create|make|insert)\s+(\d+)/i);
      if (digit) return Number(digit[1]);
      const words = { one: 1, two: 2, three: 3, four: 4, five: 5 };
      const hit = Object.entries(words).find(([word]) => new RegExp(`(?:add|create|make|insert)\\s+${word}\\b`, "i").test(text));
      return hit ? hit[1] : 1;
    };

    // ADD: bedrooms / bathrooms / balconies and common spaces.
    const addMatch = command.match(/\b(add|create|make|insert)\s+(?:(\d+)\s+)?(bedrooms?|bed\s*rooms?|bathrooms?|baths?|washrooms?|balcon(?:y|ies)|kitchens?|living\s*rooms?|dining\s*rooms?|garages?|parkings?|terraces?|study\s*rooms?|offices?|laundries?|stores?|prayer\s*rooms?)/i);
    if (addMatch) {
      const rawType = addMatch[3].replace(/\s+/g, " ").toLowerCase();
      const count = Number(addMatch[2] || countFrom(originalCommand));
      const type = rawType.startsWith("bed") ? "bedroom" :
        rawType.startsWith("bath") || rawType.startsWith("wash") ? "bathroom" :
        rawType.startsWith("balcon") ? "balcony" : rawType.startsWith("kitchen") ? "kitchen" :
        rawType.startsWith("living") ? "living" : rawType.startsWith("dining") ? "dining" :
        rawType.startsWith("garage") || rawType.startsWith("parking") ? "garage" :
        rawType.startsWith("terrace") ? "terrace" : rawType.startsWith("study") ? "study" :
        rawType.startsWith("office") ? "office" : rawType.startsWith("laundry") ? "laundry" :
        rawType.startsWith("store") ? "store" : "prayer-room";

      const dimensions = {
        bedroom: [135, 95], bathroom: [70, 70], balcony: [125, 42], kitchen: [140, 95],
        living: [180, 110], dining: [145, 90], garage: [165, 105], terrace: [170, 55],
        study: [115, 80], office: [115, 80], laundry: [80, 60], store: [75, 60], "prayer-room": [85, 70],
      };

      const addNearBack = /(back|rear|bottom|behind|pich|peeche|picha)/i.test(command);
      const addNearFront = /(front|entrance|gate|samne|aage|aagay)/i.test(command);
      const addNearLeft = /(left|baen|baayi)/i.test(command);
      const addNearRight = /(right|dayen|daayi)/i.test(command);

      for (let i = 0; i < count; i++) {
        const [w, h] = dimensions[type] || [110, 80];
        const existing = nextRooms.filter((r) => r.type === type).length + 1;
        let preferredX = 55 + i * 25;
        let preferredY = 185 + i * 15;
        if (addNearBack) preferredY = PLOT.bottom - h - 15;
        if (addNearFront) preferredY = PLOT.top + 20;
        if (addNearLeft) preferredX = PLOT.left + 20;
        if (addNearRight) preferredX = PLOT.right - w - 20;
        addRoomByType(type, `${type === "bedroom" ? "Bedroom" : type === "bathroom" ? "Bathroom" : type.replace(/(^|-)(\w)/g, (_, a, c) => c.toUpperCase())} ${existing}`, w, h, preferredX, preferredY);
      }
      messages.push(`${count} ${type.replace("-room", " room")}${count > 1 ? "s" : ""} added.`);
    }

    // REMOVE / DELETE a specifically named room or room type.
    // Supports both:
    //   "remove bedroom no 3"
    //   "bedroom no 3 del kar do"
    //   "delete bedroom 3"
    //   "bedroom 3 hata do"
    const removeMatch =
      command.match(/\b(?:remove|delete|take out)\s+(?:the\s+)?(.+?)(?:\s+(?:please|now|do|karo|kar|kr))?$/i) ||
      command.match(/^(?:the\s+)?(.+?)\s+\b(?:remove|delete|del|hatao|hatado|hata|nikaal|nikal)\b(?:\s+(?:do|karo|kar|kr|please))?$/i);

    if (removeMatch) {
      const targetText = removeMatch[1].trim();
      const target = findRoom(targetText);

      if (target) {
        const targetLabel = roomLabel(target);
        nextRooms = nextRooms.filter((r) => r.id !== target.id);

        const safeLabel = targetLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        nextDoors = nextDoors.filter((d) => !new RegExp(safeLabel, "i").test(d.name || ""));
        nextWindows = nextWindows.filter((w) => !new RegExp(safeLabel, "i").test(w.name || ""));

        messages.push(`${targetLabel} removed.`);
      } else {
        messages.push(`I could not find "${targetText}" in the current plan.`);
      }
    }

    // ATTACHED BATHROOM — attach it to the master/first bedroom.
    if (/(attached|en-suite|ensuite).*(bath|bathroom|washroom)|add.*attached.*bath/i.test(command)) {
      const master = nextRooms.find((r) => r.type === "bedroom" && /master/i.test(r.name || "")) || nextRooms.find((r) => r.type === "bedroom");
      if (master) {
        const [w, h] = [70, 70];
        const x = clamp(master.x + master.width + 8, PLOT.left + 5, PLOT.right - w - 5);
        const y = clamp(master.y, PLOT.top + 5, PLOT.bottom - h - 5);
        const attached = {
          id: `ai-attached-bath-${Date.now()}`,
          type: "bathroom",
          name: "ATTACHED BATHROOM",
          x, y, width: w, height: h, rotation: 0,
        };
        nextRooms.push(attached);
        messages.push("Attached bathroom added beside the master bedroom.");
      }
    }

    // PARKING/GARAGE near main gate/front. If parking does not already exist,
    // create it instead of silently doing nothing.
    if (/\b(parking|garage|car parking)\b/.test(command) && /(main gate|gate|entrance|front|front side|samne)/i.test(command)) {
      let parking = nextRooms.find((r) => r.type === "garage" || r.type === "parking");
      if (!parking) {
        addRoomByType("garage", "MAIN GATE PARKING", 165, 105, PLOT.left + 20, PLOT.top + 20);
        messages.push("Parking added near the main gate.");
      } else {
        const updated = moveRoom(parking, PLOT.left + 20, PLOT.top + 20);
        syncOpenings(updated);
        messages.push("Parking moved near the main gate/front side.");
      }
    }

    // Very natural mixed-language form: "parking main gate ke paas ho".
    // This intentionally does not require the words move/place.
    if (/\b(parking|garage)\b.*(?:main gate|gate).*(?:near|ke paas|pass|qareeb|nazdeek)/i.test(command) ||
        /(?:main gate|gate).*(?:near|ke paas|pass|qareeb|nazdeek).*\b(parking|garage)\b/i.test(command)) {
      let parking = nextRooms.find((r) => r.type === "garage" || r.type === "parking");
      if (!parking) {
        addRoomByType("garage", "MAIN GATE PARKING", 165, 105, PLOT.left + 20, PLOT.top + 20);
        messages.push("Parking added near the main gate.");
      } else {
        moveRoom(parking, PLOT.left + 20, PLOT.top + 20);
        messages.push("Parking placed near the main gate.");
      }
    }

    // Generic move: "move kitchen to left", "move bedroom upper left", etc.
    const moveMatch = command.match(/\b(move|shift|place|put|set)\s+(?:the\s+)?(.+?)\s+(?:to|towards|near|on|at)\s+(?:the\s+)?(.+?)(?:\s+side)?$/i);
    if (moveMatch) {
      const target = findRoom(moveMatch[2]);
      const where = moveMatch[3].toLowerCase();
      if (target) {
        let x = target.x, y = target.y;
        const left = /left|baen|baayi/.test(where), right = /right|dayen|daayi/.test(where);
        const top = /top|upper|front|aagay|aage/.test(where), bottom = /back|rear|bottom|behind|pich|peeche|picha/.test(where);
        if (left) x = PLOT.left + 20;
        if (right) x = PLOT.right - target.width - 20;
        if (top) y = PLOT.top + 20;
        if (bottom) y = PLOT.bottom - target.height - 20;
        if (/center|middle|centre/.test(where)) { x = (PLOT.left + PLOT.right - target.width) / 2; y = (PLOT.top + PLOT.bottom - target.height) / 2; }
        const updated = moveRoom(target, x, y);
        syncOpenings(updated);
        messages.push(`${roomLabel(target)} moved ${where}.`);
      }
    }

    // Roman Urdu / mixed-language move: "kitchen ko left side move karo".
    const urduMoveMatch = command.match(/(?:move|shift|place|put)?\s*(?:the\s+)?(.+?)\s+ko\s+(.+?)\s+(?:move|shift|place|put)\s*(?:karo|kar do|do)?/i);
    if (urduMoveMatch) {
      const target = findRoom(urduMoveMatch[1]);
      const where = urduMoveMatch[2].toLowerCase();
      if (target) {
        let x = target.x, y = target.y;
        if (/left|baen|baayi/.test(where)) x = PLOT.left + 20;
        if (/right|dayen|daayi/.test(where)) x = PLOT.right - target.width - 20;
        if (/back|rear|bottom|behind|pich|peeche|picha/.test(where)) y = PLOT.bottom - target.height - 20;
        if (/front|top|upper|samne|aage|aagay/.test(where)) y = PLOT.top + 20;
        const updated = moveRoom(target, x, y);
        syncOpenings(updated);
        messages.push(`${roomLabel(target)} moved ${where}.`);
      }
    }

    // Natural language: "move X near/next to Y".
    const relationMatch = command.match(/\b(move|place|put|shift)\s+(?:the\s+)?(.+?)\s+(?:near|next to|beside|behind|in front of)\s+(?:the\s+)?(.+?)(?:\.|,|$)/i);
    if (relationMatch) {
      const target = findRoom(relationMatch[2]);
      const anchor = findRoom(relationMatch[3]);
      const relation = relationMatch[0].toLowerCase();
      if (target && anchor && target.id !== anchor.id) {
        let x = anchor.x + anchor.width + 10;
        let y = anchor.y;
        if (/behind/.test(relation)) { x = anchor.x; y = anchor.y + anchor.height + 10; }
        if (/in front of/.test(relation)) { x = anchor.x; y = anchor.y - target.height - 10; }
        const updated = moveRoom(target, x, y);
        syncOpenings(updated);
        messages.push(`${roomLabel(target)} placed ${/behind/.test(relation) ? "behind" : /in front/.test(relation) ? "in front of" : "near"} ${roomLabel(anchor)}.`);
      }
    }

    // Balcony behind/rear of rooms. This specifically handles:
    // "parking main gate pss ho aur rooms ky picha balconi chor do"
    if (/balcon/.test(command) && /(behind|back|rear|pich|peeche|picha|rooms? ke)/i.test(command)) {
      const existingBalcony = nextRooms.find((r) => r.type === "balcony");
      if (existingBalcony) {
        const rearRooms = nextRooms.filter((r) => r.type !== "balcony").sort((a, b) => (b.y + b.height) - (a.y + a.height));
        const anchor = rearRooms[0];
        if (anchor) moveRoom(existingBalcony, anchor.x, anchor.y + anchor.height + 10);
        else moveRoom(existingBalcony, PLOT.left + 20, PLOT.bottom - existingBalcony.height - 10);
        messages.push("Balcony moved to the rear/behind the rooms.");
      } else {
        const rearRooms = nextRooms.filter((r) => r.type !== "balcony").sort((a, b) => (b.y + b.height) - (a.y + a.height));
        const anchor = rearRooms[0];
        const w = 125, h = 42;
        const x = anchor ? anchor.x : PLOT.left + 20;
        const y = anchor ? anchor.y + anchor.height + 10 : PLOT.bottom - h - 10;
        const balcony = {
          id: `ai-balcony-${Date.now()}`,
          type: "balcony",
          name: "REAR BALCONY",
          x: clamp(x, PLOT.left + 5, PLOT.right - w - 5),
          y: clamp(y, PLOT.top + 5, PLOT.bottom - h - 5),
          width: w,
          height: h,
          rotation: 0,
        };
        nextRooms.push(balcony);
        messages.push("Rear balcony added behind the rooms.");
      }
    }

    // NATURAL ADD / CREATE / CHHOR DO forms. The user should not have to use
    // the exact phrase "add bedroom". Examples handled here include:
    // "bedroom add karo", "2 bedroom bana do", "rooms ke picha balcony chor do".
    const naturalAddTypes = [
      { re: /\b(\d+)?\s*bed\s*rooms?\b.*\b(add|bana|ban|create|insert|chor|chhor)\b|\b(add|bana|ban|create|insert|chor|chhor)\b.*\b(\d+)?\s*bed\s*rooms?\b/i, type: "bedroom", size: [135,95], label: "Bedroom" },
      { re: /\b(\d+)?\s*(bath\s*rooms?|wash\s*rooms?)\b.*\b(add|bana|ban|create|insert|chor|chhor)\b|\b(add|bana|ban|create|insert|chor|chhor)\b.*\b(\d+)?\s*(bath\s*rooms?|wash\s*rooms?)\b/i, type: "bathroom", size: [70,70], label: "Bathroom" },
      { re: /\b(\d+)?\s*balcon(?:y|ies|i)\b.*\b(add|bana|ban|create|insert|chor|chhor)\b|\b(add|bana|ban|create|insert|chor|chhor)\b.*\b(\d+)?\s*balcon(?:y|ies|i)\b/i, type: "balcony", size: [125,42], label: "Balcony" },
      { re: /\b(\d+)?\s*kitchen\b.*\b(add|bana|ban|create|insert)\b|\b(add|bana|ban|create|insert)\b.*\b(\d+)?\s*kitchen\b/i, type: "kitchen", size: [140,95], label: "Kitchen" },
      { re: /\b(\d+)?\s*living\s*rooms?\b.*\b(add|bana|ban|create|insert)\b|\b(add|bana|ban|create|insert)\b.*\b(\d+)?\s*living\s*rooms?\b/i, type: "living", size: [180,110], label: "Living Room" },
      { re: /\b(\d+)?\s*dining\s*rooms?\b.*\b(add|bana|ban|create|insert)\b|\b(add|bana|ban|create|insert)\b.*\b(\d+)?\s*dining\s*rooms?\b/i, type: "dining", size: [145,90], label: "Dining Room" },
    ];

    for (const spec of naturalAddTypes) {
      if (!spec.re.test(command)) continue;
      const numberMatch = command.match(/\b(\d+)\s*(?:bed\s*rooms?|bath\s*rooms?|wash\s*rooms?|balcon(?:y|ies|i)|kitchens?|living\s*rooms?|dining\s*rooms?)\b/i);
      const count = numberMatch ? Number(numberMatch[1]) : 1;
      const alreadyAdded = nextRooms.filter((r) => r.type === spec.type).length;
      for (let i = 0; i < count; i++) {
        const [w,h] = spec.size;
        const nearBack = /back|rear|behind|pich|peeche|picha|rooms?\s+ke/i.test(command);
        const x = nearBack ? PLOT.left + 20 + (i * 15) : PLOT.left + 25 + (i * 20);
        const y = nearBack ? PLOT.bottom - h - 10 : PLOT.top + 150 + (i * 15);
        addRoomByType(spec.type, `${spec.label} ${alreadyAdded + i + 1}`, w, h, x, y);
      }
      messages.push(`${count} ${spec.label}${count > 1 ? "s" : ""} added.`);
      break;
    }

    // ROTATE: supports "rotate kitchen 90 degrees", "kitchen ko 90 degree rotate karo".
    const rotateMatch = command.match(/(?:rotate|turn)\s+(?:the\s+)?(.+?)(?:\s+ko)?\s+(?:by\s+)?(-?\d+)\s*degrees?/i) || command.match(/(.+?)(?:\s+ko)?\s+(-?\d+)\s*degrees?\s*(?:rotate|rotation)/i);
    if (rotateMatch) {
      const target = findRoom(rotateMatch[1]);
      if (target) {
        const degrees = Number(rotateMatch[2]);
        nextRooms = nextRooms.map((r) => r.id === target.id ? { ...r, rotation: ((degrees % 360) + 360) % 360 } : r);
        messages.push(`${roomLabel(target)} rotated ${degrees} degrees.`);
      }
    }

    // Resize: "make living room bigger", "increase kitchen width".
    const resizeMatch = command.match(/\b(make|resize|increase|decrease|enlarge|shrink)\s+(?:the\s+)?(.+?)\s+(bigger|smaller|larger|width|height)/i);
    if (resizeMatch) {
      const target = findRoom(resizeMatch[2]);
      if (target) {
        const bigger = /bigger|larger|increase|enlarge/.test(resizeMatch[3]);
        const factor = bigger ? 1.15 : 0.85;
        nextRooms = nextRooms.map((r) => r.id === target.id ? {
          ...r,
          width: clamp(Math.round(r.width * factor), 45, PLOT.width - 20),
          height: clamp(Math.round(r.height * factor), 35, PLOT.height - 20),
        } : r);
        messages.push(`${roomLabel(target)} size updated.`);
      }
    }

    // Apply all changes together so one natural-language command can make multiple changes.
    if (messages.length) {
      const responseText = messages.join(" ");
      setRooms(nextRooms);
      setDoors(nextDoors);
      setWindows(nextWindows);
      setSelected(null);
      setSaved(false);
      setAiCommandMessage(responseText);
      setAiChat((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: responseText,
        },
      ]);
    } else {
      const responseText = `Main ne command read ki, lekin is waqt us action ko map par identify nahi kar saka. Aap simple natural language mein bata sakti hain, jaise “parking main gate ke paas ho aur rooms ke peeche balcony add karo”.`;
      setAiCommandMessage(responseText);
      setAiChat((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: responseText,
        },
      ]);
    }

    setAiCommand("");
    setAiCommandLoading(false);
  }, 250);
};


  const currentFloorSnapshot = () => ({
    rooms: rooms.map((item) => ({ ...item })),
    doors: doors.map((item) => ({ ...item })),
    windows: windows.map((item) => ({ ...item })),
    walls: walls.map((item) => ({ ...item })),
    furniture: furniture.map((item) => ({ ...item })),
  });

  const switchFloor = (nextFloor) => {
    if (nextFloor === floorLevel) return;

    const currentSnapshot = currentFloorSnapshot();
    const storedTarget = floorPlans[nextFloor];
    const nextLevel = nextFloor === "ground" ? 0 : nextFloor === "first" ? 1 : Number(nextFloor.replace("floor-", ""));
    const ground = floorPlans.ground || currentSnapshot;
    const targetSnapshot = storedTarget?.rooms?.length
      ? storedTarget
      : makeFloorSnapshot(nextLevel, ground);

    setFloorPlans((previous) => ({
      ...previous,
      [floorLevel]: currentSnapshot,
      [nextFloor]: targetSnapshot,
    }));

    applySnapshot(targetSnapshot);
    setFloorLevel(nextFloor);
    setSelected(null);
    setSaved(false);
    setAiCommandMessage(`${floorLabel(nextLevel)} selected — this floor has its own editable 2D layout and will appear at the same level in 3D.`);
  };

  const savePlan = async () => {
    const nextFloorPlans = {
      ...floorPlans,
      [floorLevel]: currentFloorSnapshot(),
    };

    const selectedFloorCount = Math.max(1, Number(project?.floors || 1));
    const ground = nextFloorPlans.ground || currentFloorSnapshot();
    for (let level = 1; level < selectedFloorCount; level += 1) {
      const key = floorKey(level);
      if (!nextFloorPlans[key]?.rooms?.length) {
        nextFloorPlans[key] = makeFloorSnapshot(level, ground);
      }
    }

    setFloorPlans(nextFloorPlans);

    const floorPlanData = {
      project,
      rooms,
      doors,
      windows,
      walls,
      furniture,
      floorLevel,
      floorPlans: nextFloorPlans,
      ...designSettings,
      source: isAIPlan ? "ai-planner" : "manual",
      savedAt: new Date().toISOString()
    };
    localStorage.setItem("dreamhouse_current_plan", JSON.stringify(floorPlanData));
    try {
      if (localStorage.getItem("dreamhouse_token")) {
        const remote = backendProjectId
          ? await updateProject(backendProjectId, { name: project.name, floorPlanData })
          : await createProject({ name: project.name, floorPlanData });
        if (!backendProjectId) setBackendProjectId(remote._id);
      }
      setSaved(true);
    } catch (error) {
      setAiCommandMessage(`Saved locally. Cloud save failed: ${error.message}`);
    }
    setTimeout(() => setSaved(false), 2200);
  };

  const exportSvg = () => {
    if (!svgRef.current) return;
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(project?.name || "dream-house").replace(/\s+/g, "-").toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------------
  // SAVE AS IMAGE / PDF
  // ---------------------------------------------------------------------

  // SVG ko canvas (picture) mein convert karta hai
  const svgToCanvas = () =>
    new Promise((resolve, reject) => {
      const svg = svgRef.current;
      if (!svg) return reject(new Error("Plan nahi mila"));

      const source = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const scale = 2; // zyada quality ke liye
        const canvas = document.createElement("canvas");
        canvas.width = 700 * scale;
        canvas.height = 620 * scale;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // white background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image ban nahi saki"));
      };
      img.src = url;
    });

  const fileName = () =>
    (project?.name || "dream-house").replace(/\s+/g, "-").toLowerCase();

  // PNG ya JPG download
  const saveAsImage = async (format) => {
    try {
      const canvas = await svgToCanvas();
      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      canvas.toBlob((blob) => {
        if (!blob) {
          setAiCommandMessage("Image ban nahi saki.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName()}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      }, mime, 0.95);
      setShowSaveModal(false);
      setAiCommandMessage(`Plan ${format.toUpperCase()} mein save ho gaya.`);
    } catch (error) {
      setAiCommandMessage(`Save nahi hua: ${error.message}`);
    }
  };

  // PDF download
  const saveAsPdf = async () => {
    try {
      const canvas = await svgToCanvas();
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (imgWidth * 620) / 700;
      pdf.setFontSize(16);
      pdf.text(project?.name || "Dream House", 20, 30);
      pdf.addImage(imgData, "JPEG", 20, 45, imgWidth, imgHeight);
      pdf.save(`${fileName()}.pdf`);
      setShowSaveModal(false);
      setAiCommandMessage("Plan PDF mein save ho gaya.");
    } catch (error) {
      setAiCommandMessage(`PDF nahi bani: ${error.message}`);
    }
  };

  const addRoom = () => {
    const r = { id: createId("room"), type: "bedroom", name: "Bedroom", x: 100, y: 100, width: 130, height: 95, rotation: 0 };
    setRooms((a) => [...a, r]);
    setSelected({ type: "room", id: r.id });
    setActiveTool("select");
  };

  const addDoor = () => {
    const d = { id: createId("door"), name: "New Door", x: 120, y: 180, width: 42, height: 12, rotation: 0 };
    setDoors((a) => [...a, d]);
    setSelected({ type: "door", id: d.id });
    setActiveTool("select");
  };

  const addWindow = () => {
    const w = { id: createId("window"), name: "New Window", x: 150, y: 300, width: 55, height: 8, rotation: 0 };
    setWindows((a) => [...a, w]);
    setSelected({ type: "window", id: w.id });
    setActiveTool("select");
  };

  const addWall = () => {
    const wall = { id: createId("wall"), name: "Interior Wall", x: 120, y: 220, width: 220, height: 7, rotation: 0 };
    setWalls((items) => [...items, wall]);
    setSelected({ type: "wall", id: wall.id });
    setActiveTool("select");
  };

  const addFurniture = (item) => {
    const piece = {
      id: createId("furniture"),
      type: item.type,
      name: item.name,
      x: 100,
      y: 120,
      width: item.width,
      height: item.height,
      rotation: 0,
    };
    setFurniture((items) => [...items, piece]);
    setSelected({ type: "furniture", id: piece.id });
    setActiveTool("select");
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (selected.type === "room") setRooms((a) => a.filter((x) => x.id !== selected.id));
    if (selected.type === "door") setDoors((a) => a.filter((x) => x.id !== selected.id));
    if (selected.type === "window") setWindows((a) => a.filter((x) => x.id !== selected.id));
    if (selected.type === "wall") setWalls((a) => a.filter((x) => x.id !== selected.id));
    if (selected.type === "furniture") setFurniture((a) => a.filter((x) => x.id !== selected.id));
    setSelected(null);
  };

  const updateSelected = (field, value) => {
    if (!selected) return;
    const numeric = ["x", "y", "width", "height", "rotation"].includes(field);
    const v = numeric ? Number(value) : value;
    const updater = (a) => a.map((x) => x.id === selected.id ? { ...x, [field]: v } : x);
    if (selected.type === "room") setRooms(updater);
    if (selected.type === "door") setDoors(updater);
    if (selected.type === "window") setWindows(updater);
    if (selected.type === "wall") setWalls(updater);
    if (selected.type === "furniture") setFurniture(updater);

  };

  const duplicateSelected = () => {
    if (!selected || !selectedData) return;
    const copy = { ...selectedData, id: createId(selected.type), name: `${selectedData.name || "Object"} Copy`, x: selectedData.x + 20, y: selectedData.y + 20 };
    if (selected.type === "room") setRooms((items) => [...items, copy]);
    if (selected.type === "door") setDoors((items) => [...items, copy]);
    if (selected.type === "window") setWindows((items) => [...items, copy]);
    if (selected.type === "wall") setWalls((items) => [...items, copy]);
    if (selected.type === "furniture") setFurniture((items) => [...items, copy]);
    setSelected({ type: selected.type, id: copy.id });
  };

  const toolClick = (id) => {
    setActiveTool(id);
    if (id === "room") addRoom();
    if (id === "door") addDoor();
    if (id === "window") addWindow();
    if (id === "wall") addWall();
  };

  const go3D = () => {
    const nextFloorPlans = {
      ...floorPlans,
      [floorLevel]: currentFloorSnapshot(),
    };
    const selectedFloorCount = Math.max(1, Number(project?.floors || 1));
    const ground = nextFloorPlans.ground || currentFloorSnapshot();
    for (let level = 1; level < selectedFloorCount; level += 1) {
      const key = floorKey(level);
      if (!nextFloorPlans[key]?.rooms?.length) {
        nextFloorPlans[key] = makeFloorSnapshot(level, ground);
      }
    }
    setFloorPlans(nextFloorPlans);

    const floorPlanData = {
      project,
      rooms,
      doors,
      windows,
      walls,
      furniture,
      floorLevel,
      floorPlans: nextFloorPlans,
      ...designSettings,
    };

    // Keep the exact current 2D editor state available to the 3D viewer.
    // This prevents an older cloud snapshot from replacing the latest edits.
    localStorage.setItem("dreamhouse_current_plan", JSON.stringify(floorPlanData));

    navigate("/3d-view", {
      state: {
        ...floorPlanData,
        selected,
        projectId: backendProjectId,
        source: isAIPlan ? "ai-planner" : "manual",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f3eb] text-[#173d32]">
      <header className="border-b border-[#dfe4dc] bg-[#fbfaf5]">
        <div className="flex h-[72px] items-center justify-between px-5 lg:px-7">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(isAIPlan ? "/ai-planner" : "/create-project")} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9dfd7] bg-white text-[#315348] hover:bg-[#eef3ed]"><Icon name="back" size={18} /></button>
            <div>
              <p className="font-serif text-lg font-bold leading-none">{project?.name || "Dream House"}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#89948d]">2D Architectural Floor Plan • {floorLabel(floorLevel === "ground" ? 0 : floorLevel === "first" ? 1 : Number(floorLevel.replace("floor-", "")))} • {isAIPlan ? "AI Generated" : "Manual"}</p>
            </div>
          </div>
          <div className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold md:flex ${isAIPlan ? "border-[#d9e1d8] bg-[#eef3ed] text-[#315348]" : "border-[#d9e1d8] bg-white text-[#315348]"}`}>
            <span className={`h-2 w-2 rounded-full ${isAIPlan ? "bg-[#8a928c]" : "bg-[#0b5d46]"}`} />
            {isAIPlan ? "AI Generated • Editable" : "Manual • Drag & Drop Enabled"}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={history.length < 2} title="Undo (Ctrl+Z)" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#ccd8ce] bg-white text-[#315348] disabled:opacity-35 sm:flex"><Icon name="undo" size={15} /></button>
            <button type="button" onClick={redo} disabled={!future.length} title="Redo (Ctrl+Y)" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#ccd8ce] bg-white text-[#315348] disabled:opacity-35 sm:flex"><Icon name="redo" size={15} /></button>
            {selectedData && <button type="button" onClick={duplicateSelected} title="Duplicate selected object" className="hidden rounded-full border border-[#ccd8ce] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#315348] sm:block">Duplicate</button>}
            <button type="button" onClick={exportSvg} title="Export SVG" className="hidden rounded-full border border-[#ccd8ce] bg-white px-3 py-2.5 text-[11px] font-semibold text-[#315348] sm:block">Export</button>
            <button type="button" onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 rounded-full border border-[#ccd8ce] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#315348]"><Icon name="save" size={15} />{saved ? "Saved" : "Save Plan"}</button>
            <button type="button" onClick={go3D} className="flex items-center gap-2 rounded-full bg-[#0b5d46] px-4 py-2.5 text-[11px] font-bold text-white"><Icon name="cube" size={15} />3D View</button>
          </div>
        </div>
      </header>

      {Number(project?.floors || 1) > 1 && (
        <div className="border-b border-[#dfe4dc] bg-[#fbfaf5] px-5 py-3 lg:px-7">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7d8982]">Multi-Storey House</p>
              <p className="mt-1 text-[11px] text-[#65736b]">{project.floors} floors selected — har floor ka apna 2D layout hai aur 3D mein sab floors stack honge.</p>
            </div>
            <div className="flex max-w-full flex-wrap rounded-2xl border border-[#d5ddd4] bg-white p-1 shadow-sm">
              {Array.from({ length: Math.max(1, Number(project?.floors || 1)) }, (_, level) => {
                const key = floorKey(level);
                const icon = level === 0 ? "🏠" : level === 1 ? "🛏️" : "🏢";
                return (
                  <button key={key} type="button" onClick={() => switchFloor(key)} className={`rounded-xl px-4 py-2.5 text-[11px] font-bold transition ${floorLevel === key ? "bg-[#0b5d46] text-white" : "text-[#53645b] hover:bg-[#eef3ed]"}`}>
                    {icon} {floorLabel(level)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[238px_minmax(0,1fr)_300px]">
        <aside className="border-r border-[#dfe4dc] bg-[#fbfaf5] p-3">
          <div className="mb-4 hidden lg:block">
            <p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d8982]">Component library</p>
            <p className="px-2 pt-1 text-[10px] text-[#9aa39d]">Drag-ready architectural pieces</p>
            <div className="mt-3 space-y-1">
              {FURNITURE_LIBRARY.map((item) => (
                <button key={item.type} type="button" onClick={() => addFurniture(item)} className="flex w-full items-center justify-between rounded-xl border border-transparent bg-white px-3 py-2.5 text-left text-[11px] font-semibold text-[#53645b] shadow-sm hover:border-[#bcd0c2] hover:bg-[#f1f7f1]">
                  <span>{item.icon}</span><span className="flex-1 px-2">{item.name}</span><span className="text-[#9aa39d]">+</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:items-center">
            <ToolButton active={activeTool === "select"} label="Select" icon="select" onClick={() => setActiveTool("select")} />
            {["room", "door", "window", "wall"].map((id) => (
              <ToolButton key={id} active={activeTool === id} label={id} icon={id} onClick={() => toolClick(id)} />
            ))}
          </div>
          <div className="my-4 hidden h-px bg-[#e2e6df] lg:block" />
          <div className="flex flex-row gap-2 lg:flex-col lg:items-center">
            <ToolButton active={showGrid} label="Grid" icon="grid" onClick={() => setShowGrid((v) => !v)} />
            <button type="button" onClick={() => setSnapEnabled((v) => !v)} title="Snap to grid" className={`flex h-10 w-10 items-center justify-center rounded-xl border ${snapEnabled ? "border-[#0b5d46] bg-[#eef5ef] text-[#0b5d46]" : "border-[#dfe5de] bg-white text-[#53615a]"}`}>Snap</button>
            <button type="button" onClick={() => setZoom((v) => Math.min(1.35, v + 0.1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5de] bg-white text-[#53615a]"><Icon name="zoomIn" size={18} /></button>
            <button type="button" onClick={() => setZoom((v) => Math.max(0.75, v - 0.1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5de] bg-white text-[#53615a]"><Icon name="zoomOut" size={18} /></button>
          </div>
        </aside>

        <main className="min-w-0 overflow-auto bg-[#e9e8e0] p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#728078]">Architectural Layout</p>
              <h1 className="mt-1 font-serif text-2xl font-bold">{floorLevel === "ground" ? (isAIPlan ? "Ground Floor — AI Architectural Plan" : "Ground Floor — House Plan") : `${floorLabel(floorLevel === "first" ? 1 : Number(floorLevel.replace("floor-", "")))} — House Plan`}</h1>
            </div>
            <div className={`rounded-full border px-3 py-2 text-[10px] font-semibold ${isAIPlan ? "border-[#d9e1d8] bg-[#eef3ed] text-[#53645b]" : "border-[#d5ddd4] bg-white text-[#607269]"}`}>
              {isAIPlan ? "AI plan editable • Drag = move • Inspector = resize / rotate" : "Drag = move • Shift = fine movement"}
            </div>
          </div>

          {isAIPlan && (
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d8e0d7] bg-[#f7faf5] px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#7b887f]">Architectural Layout</p>
                <p className="mt-1 text-[11px] font-semibold text-[#315348]">Rooms + circulation arranged</p>
              </div>
              <div className="rounded-2xl border border-[#d8e0d7] bg-[#f7faf5] px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#7b887f]">Openings</p>
                <p className="mt-1 text-[11px] font-semibold text-[#315348]">Doors + windows shown</p>
              </div>
              <div className="rounded-2xl border border-[#d8e0d7] bg-[#f7faf5] px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#7b887f]">Furniture</p>
                <p className="mt-1 text-[11px] font-semibold text-[#315348]">Basic room furniture preview</p>
              </div>
            </div>
          )}

          <div className="flex min-h-[650px] items-center justify-center rounded-[28px] border border-[#d7ddd5] bg-[#f7f6f0] p-4 sm:p-8">
            <div className="origin-center transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
              <svg ref={svgRef} width="700" height="620" viewBox="0 0 700 620" className="overflow-visible rounded-xl bg-white shadow-[0_12px_40px_rgba(38,55,45,0.10)]" style={{ userSelect: "none", touchAction: "none" }} onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
                <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#edf0eb" strokeWidth="0.7" /></pattern>
                  <pattern id="largeGrid" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#smallGrid)" /><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e7e0" strokeWidth="1" /></pattern>
                  <filter id="roomShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity=".08" /></filter>
                </defs>

                <rect width="700" height="620" fill="#fff" />
                {showGrid && <rect x={PLOT.left} y={PLOT.top} width={PLOT.width} height={PLOT.height} fill="url(#largeGrid)" />}

                <rect x={PLOT.left} y={PLOT.top} width={PLOT.width} height={PLOT.height} fill="#fafaf6" stroke="#243d34" strokeWidth="7" filter="url(#roomShadow)" />
                <rect x={PLOT.left+7} y={PLOT.top+7} width={PLOT.width-14} height={PLOT.height-14} fill="none" stroke="#8d9991" strokeWidth="1" />

                <text x="347" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#68766e">{project?.plotWidth || 30} ft FRONT</text>
                <text x="17" y="315" textAnchor="middle" transform="rotate(-90 17 315)" fontSize="9" fontWeight="700" fill="#68766e">{project?.plotLength || 60} ft</text>

                <g transform="translate(620 48)">
                  <text x="0" y="-10" textAnchor="middle" fontSize="10" fontWeight="800" fill="#315348">N</text>
                  <path d="M0 25V0M0 0l-5 8M0 0l5 8" stroke="#315348" strokeWidth="1.7" />
                </g>

                {isAIPlan && (
                  <>
                    <text x="48" y="575" fontSize="7" fontWeight="700" fill="#748078">ARCHITECTURAL 2D PLAN • {floorLabel(floorLevel === "ground" ? 0 : floorLevel === "first" ? 1 : Number(floorLevel.replace("floor-", ""))).toUpperCase()}</text>
                    <text x="650" y="575" textAnchor="end" fontSize="7" fontWeight="700" fill="#748078">AI GENERATED • CONCEPT PLAN</text>
                  </>
                )}

                {rooms.map((room) => {
                  const selectedRoom = selected?.type === "room" && selected.id === room.id;
                  return (
                    <ArchitecturalRoom
                      key={room.id}
                      room={room}
                      selectedRoom={selectedRoom}
                      dragging={dragging?.type === "room" && dragging.id === room.id}
                      onPointerDown={(e) => startDrag(e, "room", room.id)}
                    />
                  );
                })}

                {walls.map((wall) => {
                  const selectedWall = selected?.type === "wall" && selected.id === wall.id;
                  const cx = wall.x + wall.width / 2;
                  const cy = wall.y + wall.height / 2;
                  return (
                    <g key={wall.id} transform={`rotate(${wall.rotation || 0} ${cx} ${cy})`} onPointerDown={(e) => startDrag(e, "wall", wall.id)} className="cursor-grab">
                      <rect x={wall.x - 5} y={wall.y - 5} width={wall.width + 10} height={wall.height + 10} fill="transparent" />
                      <rect x={wall.x} y={wall.y} width={wall.width} height={wall.height} fill={selectedWall ? "#0b5d46" : "#344a41"} />
                    </g>
                  );
                })}

                {furniture.map((piece) => {
                  const selectedPiece = selected?.type === "furniture" && selected.id === piece.id;
                  const cx = piece.x + piece.width / 2;
                  const cy = piece.y + piece.height / 2;
                  return (
                    <g key={piece.id} transform={`rotate(${piece.rotation || 0} ${cx} ${cy})`} onPointerDown={(e) => startDrag(e, "furniture", piece.id)} className="cursor-grab">
                      <rect x={piece.x - 4} y={piece.y - 4} width={piece.width + 8} height={piece.height + 8} fill="transparent" />
                      <rect x={piece.x} y={piece.y} width={piece.width} height={piece.height} rx="4" fill={selectedPiece ? "#dbeafe" : "#eef2f0"} stroke={selectedPiece ? "#2563eb" : "#82928a"} strokeWidth={selectedPiece ? "2" : "1"} />
                      <text x={cx} y={cy + 3} textAnchor="middle" fontSize="7" fontWeight="700" fill="#53645b" pointerEvents="none">{piece.name}</text>
                    </g>
                  );
                })}

                {doors.map((door) => {
                  const selectedDoor = selected?.type === "door" && selected.id === door.id;
                  const cx = door.x + door.width / 2, cy = door.y + door.height / 2;
                  return (
                    <g key={door.id} transform={`rotate(${door.rotation || 0} ${cx} ${cy})`} onPointerDown={(e) => startDrag(e, "door", door.id)} className={dragging?.type === "door" && dragging.id === door.id ? "cursor-grabbing" : "cursor-grab"}>
                      <rect x={door.x-5} y={door.y-5} width={door.width+10} height={door.height+10} fill="transparent" />
                      <rect x={door.x} y={door.y} width={door.width} height={door.height} fill="#fff" stroke={selectedDoor ? "#0b5d46" : "#344a41"} strokeWidth={selectedDoor ? "2.5" : "1.6"} />
                      <path d={`M ${door.x} ${door.y + door.height} A ${door.width} ${door.width} 0 0 1 ${door.x + door.width} ${door.y}`} fill="none" stroke={selectedDoor ? "#0b5d46" : "#78847d"} strokeWidth="1" />
                      {isAIPlan && <text x={cx} y={door.y-5} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#66756d" pointerEvents="none">{door.name}</text>}
                    </g>
                  );
                })}

                {windows.map((win) => {
                  const selectedWindow = selected?.type === "window" && selected.id === win.id;
                  const cx = win.x + win.width / 2, cy = win.y + win.height / 2;
                  return (
                    <g key={win.id} transform={`rotate(${win.rotation || 0} ${cx} ${cy})`} onPointerDown={(e) => startDrag(e, "window", win.id)} className={dragging?.type === "window" && dragging.id === win.id ? "cursor-grabbing" : "cursor-grab"}>
                      <rect x={win.x-5} y={win.y-5} width={win.width+10} height={win.height+10} fill="transparent" />
                      <rect x={win.x} y={win.y} width={win.width} height={win.height} fill="#d7e9e6" stroke={selectedWindow ? "#0b5d46" : "#55756d"} strokeWidth={selectedWindow ? "2.5" : "1.6"} />
                      <path d={win.width >= win.height ? `M ${win.x + win.width / 2} ${win.y} V ${win.y + win.height}` : `M ${win.x} ${win.y + win.height / 2} H ${win.x + win.width}`} stroke="#76918a" strokeWidth="1" />
                    </g>
                  );
                })}

                {isAIPlan && (
                  <g pointerEvents="none">
                    <text x="347" y="600" textAnchor="middle" fontSize="8" fontWeight="700" fill="#758078">
                      MAIN ENTRY ↓
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

{isAIPlan && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#d8e0d7] bg-[#fbfaf5] shadow-sm">
              <div className="border-b border-[#e0e5de] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0e8] text-[#0b5d46]">✦</div>
                  <div>
                    <p className="text-[11px] font-bold text-[#173d32]">AI Plan Assistant</p>
                    <p className="text-[9px] text-[#7b8780]">
                      Apni normal language mein baat karein — English, Roman Urdu, Urdu/Hinglish.
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[210px] space-y-2 overflow-y-auto bg-white/60 px-4 py-3">
                {aiChat.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-[10px] leading-5 ${
                        message.role === "user"
                          ? "rounded-br-md bg-[#0b5d46] text-white"
                          : "rounded-bl-md border border-[#dfe6de] bg-[#f2f5ef] text-[#315348]"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {aiCommandLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-[#f2f5ef] px-3 py-2 text-[10px] text-[#68756e]">
                      Plan samajh raha hoon...
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#e0e5de] bg-[#fbfaf5] p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAICommand();
                      }
                    }}
                    placeholder="Apni command likhein... e.g. parking gate ke paas aur rooms ke peeche balcony"
                    className="min-w-0 flex-1 rounded-xl border border-[#d5ddd4] bg-white px-4 py-3 text-[11px] text-[#173d32] outline-none focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10"
                  />
                  <button
                    type="button"
                    onClick={handleAICommand}
                    disabled={aiCommandLoading || !aiCommand.trim()}
                    className="rounded-xl bg-[#0b5d46] px-5 py-3 text-[10px] font-bold text-white transition hover:bg-[#084936] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {aiCommandLoading ? "Working..." : "Send"}
                  </button>
                </div>

                <p className="mt-2 text-[9px] text-[#87928b]">
                  Example: “Kitchen left side move karo”, “2 bedrooms back side add karo”, “master bedroom ke sath attached bathroom add karo”.
                </p>

                {aiCommandMessage && (
                  <div className="mt-2 rounded-xl bg-[#eef3ed] px-3 py-2 text-[10px] font-medium text-[#315348]">
                    {aiCommandMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d9e0d8] bg-[#f8f7f1] px-4 py-3 text-[10px] text-[#68756e]">
            <div className="flex gap-4">
              <span>Rooms: <b className="text-[#315348]">{rooms.length}</b></span>
              <span>Doors: <b className="text-[#315348]">{doors.length}</b></span>
              <span>Windows: <b className="text-[#315348]">{windows.length}</b></span>
              <span>Walls: <b className="text-[#315348]">{walls.length}</b></span>
              <span>Furniture: <b className="text-[#315348]">{furniture.length}</b></span>
            </div>
            <span>{floorLevel === "ground" ? (isAIPlan ? "Ground Floor AI plan editable. Ye baqi floors se separate layout hai." : "Ground Floor ka separate layout edit karo.") : `${floorLabel(floorLevel === "first" ? 1 : Number(floorLevel.replace("floor-", "")))} ka separate layout edit ho raha hai.`}</span>
          </div>
        </main>

        <aside className="border-l border-[#dfe4dc] bg-[#fbfaf5] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d8982]">Inspector</p>
              <h2 className="mt-1 font-serif text-xl font-bold">{selectedData ? (isAIPlan ? "Room Details" : "Edit Element") : "Plan Information"}</h2>
            </div>
            {selectedData && <button type="button" onClick={deleteSelected} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ead4d0] bg-[#fff8f6] text-[#a15d53]"><Icon name="trash" size={16} /></button>}
          </div>

          {!selectedData ? (
            <div className="mt-8">
              <div className="rounded-2xl border border-[#d8e0d7] bg-[#f2f6f1] p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#708078]">Plan Summary</p>
                <div className="mt-4 space-y-3 text-[11px]">
                  <div className="flex justify-between"><span className="text-[#7b8780]">Plot</span><b>{project.plotWidth} × {project.plotLength} ft</b></div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Floors</span><b>{project.floors} • {floorLabel(floorLevel === "ground" ? 0 : floorLevel === "first" ? 1 : Number(floorLevel.replace("floor-", "")))}</b></div>
                  <div className="mt-3 border-t border-[#dce4dc] pt-3">
                    <label className="text-[10px] font-semibold text-[#7b8780]">Building Floors</label>
                    <select value={Math.max(1, Number(project.floors || 1))} onChange={(e) => {
                      const floors = Math.max(1, Number(e.target.value));
                      setProject((current) => ({ ...current, floors }));
                      setSaved(false);
                    }} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2 text-[11px] text-[#173d32] outline-none">
                      {Array.from({ length: 10 }, (_, index) => {
                        const count = index + 1;
                        return <option key={count} value={count}>{count} Floor{count > 1 ? "s" : ""}</option>;
                      })}
                    </select>
                  </div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Rooms</span><b>{rooms.length}</b></div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Doors</span><b>{doors.length}</b></div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Windows</span><b>{windows.length}</b></div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Walls</span><b>{walls.length}</b></div>
                  <div className="flex justify-between"><span className="text-[#7b8780]">Furniture</span><b>{furniture.length}</b></div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-[#ccd7cd] bg-white p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ed] text-[#315348]"><Icon name="select" size={22} /></div>
                <p className="mt-4 text-sm font-semibold">{isAIPlan ? "Click a room to edit it" : "Select something"}</p>
                <p className="mt-2 text-[11px] leading-5 text-[#7b8780]">{isAIPlan ? "AI layout ko drag, resize, rotate ya neeche diye command box se modify karo." : "Canvas par room, door ya window ko click/drag karo."}</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {selected.type === "room" && (
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8782]">Room Type</label>
                  <select value={selectedData.type} onChange={(e) => { const t = e.target.value; updateSelected("type", t); updateSelected("name", roomInfo(t).label); }} className="w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm outline-none">
                    {ROOM_TYPES.map((r) => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
                  </select>
                </div>
              )}

              {selected.type === "room" && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] text-[#87928c]">Floor material
                    <select value={selectedData.floorMaterial || "light-wood"} onChange={(e) => updateSelected("floorMaterial", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-2 py-2.5 text-[11px] text-[#173d32] outline-none">
                      <option value="light-wood">Light wood</option><option value="dark-wood">Dark wood</option><option value="marble">Marble</option><option value="concrete">Concrete</option>
                    </select>
                  </label>
                  <label className="text-[10px] text-[#87928c]">Wall material
                    <select value={selectedData.wallMaterial || "white-paint"} onChange={(e) => updateSelected("wallMaterial", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-2 py-2.5 text-[11px] text-[#173d32] outline-none">
                      <option value="white-paint">White paint</option><option value="cream-paint">Cream paint</option><option value="grey-paint">Grey paint</option><option value="stone">Stone</option>
                    </select>
                  </label>
                  <label className="text-[10px] text-[#87928c]">Floor color<input type="color" value={selectedData.floorColor || "#d8c7aa"} onChange={(e) => updateSelected("floorColor", e.target.value)} className="mt-1 h-9 w-full rounded-xl border border-[#d5ddd4] bg-white p-1" /></label>
                  <label className="text-[10px] text-[#87928c]">Wall color<input type="color" value={selectedData.wallColor || "#f4f1e8"} onChange={(e) => updateSelected("wallColor", e.target.value)} className="mt-1 h-9 w-full rounded-xl border border-[#d5ddd4] bg-white p-1" /></label>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8782]">Name</label>
                <input value={selectedData.name || ""} onChange={(e) => updateSelected("name", e.target.value)} className="w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm outline-none disabled:text-[#65736b]" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8782]">Position</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] text-[#87928c]">X<input type="number" value={selectedData.x} onChange={(e) => updateSelected("x", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm text-[#173d32] outline-none" /></label>
                  <label className="text-[10px] text-[#87928c]">Y<input type="number" value={selectedData.y} onChange={(e) => updateSelected("y", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm text-[#173d32] outline-none" /></label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8782]">Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] text-[#87928c]">Width<input type="number" value={selectedData.width} onChange={(e) => updateSelected("width", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm text-[#173d32] outline-none" /></label>
                  <label className="text-[10px] text-[#87928c]">Height<input type="number" value={selectedData.height} onChange={(e) => updateSelected("height", e.target.value)} className="mt-1 w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm text-[#173d32] outline-none" /></label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8782]">Rotation</label>
                <input type="number" value={selectedData.rotation || 0} onChange={(e) => updateSelected("rotation", e.target.value)} className="w-full rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-sm outline-none" />
              </div>

              {selected.type === "room" && (
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => updateSelected("rotation", ((selectedData.rotation || 0) - 90 + 360) % 360)} className="rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#53645b]">↺ Rotate 90°</button>
                  <button type="button" onClick={() => updateSelected("rotation", ((selectedData.rotation || 0) + 90) % 360)} className="rounded-xl border border-[#d5ddd4] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#53645b]">↻ Rotate 90°</button>
                </div>
              )}

              <button type="button" onClick={savePlan} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b5d46] px-4 py-3 text-[11px] font-bold text-white"><Icon name="save" size={16} />Save Changes</button>

              {isAIPlan && (
                <div className="rounded-2xl border border-[#d9e1d8] bg-[#eef3ed] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#537064]">AI Plan • Editable</p>
                  <p className="mt-2 text-[11px] leading-5 text-[#65736b]">
                    Drag this room on the plan, or change X, Y, width, height and rotation here.
                    You can also use the AI command box below.
                  </p>
                </div>
              )}
            </div>
          )}

          {isManualPlan && (
            <div className="mt-8 border-t border-[#e2e6df] pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8982]">Quick Add</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" onClick={addRoom} className="rounded-xl border border-[#d7dfd6] bg-white px-2 py-3 text-[10px] font-semibold text-[#53645b]">+ Room</button>
                <button type="button" onClick={addDoor} className="rounded-xl border border-[#d7dfd6] bg-white px-2 py-3 text-[10px] font-semibold text-[#53645b]">+ Door</button>
                <button type="button" onClick={addWindow} className="rounded-xl border border-[#d7dfd6] bg-white px-2 py-3 text-[10px] font-semibold text-[#53645b]">+ Window</button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {showSaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowSaveModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg font-bold text-[#173d32]">Plan kahan save karein?</h3>
            <p className="mt-1 text-[11px] text-[#7b8780]">Apna format chunein</p>

            <div className="mt-4 space-y-2">
              <button type="button" onClick={() => saveAsImage("png")} className="w-full rounded-xl border border-[#d5ddd4] px-4 py-3 text-left text-[12px] font-semibold text-[#315348] hover:bg-[#f1f7f1]">
                🖼️ Image (PNG) — Gallery
              </button>
              <button type="button" onClick={() => saveAsImage("jpg")} className="w-full rounded-xl border border-[#d5ddd4] px-4 py-3 text-left text-[12px] font-semibold text-[#315348] hover:bg-[#f1f7f1]">
                📷 Image (JPG) — Gallery
              </button>
              <button type="button" onClick={saveAsPdf} className="w-full rounded-xl border border-[#d5ddd4] px-4 py-3 text-left text-[12px] font-semibold text-[#315348] hover:bg-[#f1f7f1]">
                📄 PDF Document
              </button>
              <button type="button" onClick={() => { savePlan(); setShowSaveModal(false); }} className="w-full rounded-xl bg-[#0b5d46] px-4 py-3 text-left text-[12px] font-bold text-white">
                💾 App mein save karein (editable)
              </button>
            </div>

            <button type="button" onClick={() => setShowSaveModal(false)} className="mt-4 w-full text-center text-[11px] text-[#7b8780]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
