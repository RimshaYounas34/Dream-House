import crypto from "node:crypto";
import { normalizePlan, validatePlan } from "./planValidation.js";

const supported = new Set([
  "add_room", "remove_room", "move_room", "resize_room", "rename_room",
  "add_door", "remove_door", "add_window", "remove_window",
  "add_furniture", "remove_furniture", "move_furniture", "resize_furniture",
  "set_room_material", "set_room_color", "set_wall_material", "set_floor_material",
  "set_exterior_style", "set_roof", "set_lighting", "set_site", "set_boundary_wall",
  "set_gate", "set_parking", "set_garden", "add_floor", "add_site_element", "set_style", "add_stairs",
]);

const makeId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

// Number banata hai. Agar value galat ho to fallback deta hai (0 bhi valid hai).
function num(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// AI ka operation kai tarah se aa sakta hai:
//   { type:"add_room", room:{ name, x, y ... } }   (nested)
//   { type:"resize_room", roomId:"abc", width:16 }  (roomId)
// Ye function dono ko ek jaisa bana deta hai.
function readOperation(op) {
  const nested = op.room || op.door || op.window || op.furniture || {};
  return {
    ...nested,
    ...op,
    targetId: op.targetId || op.roomId || op.doorId || op.windowId || op.furnitureId || op.id || null,
    wantedId: nested.id || op.newId || null,
    subType: nested.type || op.roomType || op.doorType || op.windowType || op.furnitureType || null,
    // add_door / add_furniture me roomId ka matlab "kis room me" hota hai
    inRoomId: nested.roomId || op.roomId || null,
  };
}

function findIndex(items, operation) {
  if (operation.targetId) {
    const byId = items.findIndex((item) => item.id === operation.targetId);
    if (byId >= 0) return byId;
  }
  const query = String(operation.targetName || operation.name || "").toLowerCase();
  if (!query) return -1;
  const exact = items.findIndex((item) => String(item.name || "").toLowerCase() === query);
  if (exact >= 0) return exact;
  return items.findIndex((item) => String(item.name || "").toLowerCase().includes(query));
}

// Nayi id: agar AI ki di hui id pehle se maujood ho to nayi bana do
function freshId(items, wanted, prefix) {
  if (wanted && !items.some((item) => item.id === wanted)) return wanted;
  return makeId(prefix);
}

function ensureOperation(operation) {
  if (!operation || !supported.has(operation.type)) {
    throw new Error(`Unsupported AI operation: ${operation?.type || "unknown"}`);
  }
}

// Plan kis scale par hai? Feet (chhote numbers) ya pixels (bade numbers)?
function guessScale(rooms) {
  if (!rooms.length) return { door: [3, 0.5], window: [4, 0.5], furniture: [4, 3], room: [12, 10] };
  const avgW = rooms.reduce((sum, r) => sum + num(r.width, 0), 0) / rooms.length;
  const avgH = rooms.reduce((sum, r) => sum + num(r.height, 0), 0) / rooms.length;
  if (avgW > 60) return { door: [34, 8], window: [55, 8], furniture: [60, 30], room: [Math.round(avgW), Math.round(avgH)] };
  return { door: [3, 0.5], window: [4, 0.5], furniture: [4, 3], room: [Math.round(avgW) || 12, Math.round(avgH) || 10] };
}

// Plot / canvas ki hadd (left, top, right, bottom).
// Editor pixels me kaam karta hai aur settings.canvas bhejta hai, warna feet wala plot.
function getBounds(plan) {
  const c = plan.settings?.canvas;
  if (c && [c.left, c.top, c.right, c.bottom].every((v) => Number.isFinite(Number(v)))) {
    return { left: Number(c.left), top: Number(c.top), right: Number(c.right), bottom: Number(c.bottom) };
  }
  return { left: 0, top: 0, right: Number(plan.project.plotWidth) || 30, bottom: Number(plan.project.plotLength) || 60 };
}

const clamp = (value, min, max) => Math.max(min, Math.min(value, Math.max(min, max)));

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function hitsAnyRoom(rooms, box) {
  return rooms.some((r) => overlaps(box, { x: num(r.x, 0), y: num(r.y, 0), width: num(r.width, 0), height: num(r.height, 0) }));
}

// Khali jagah dhoondna (grid search). Nahi mile to null.
function findFreeSpot(rooms, width, height, bounds) {
  const step = Math.max(1, Math.round(Math.min(width, height) / 4));
  for (let y = bounds.top; y + height <= bounds.bottom; y += step) {
    for (let x = bounds.left; x + width <= bounds.right; x += step) {
      if (!hitsAnyRoom(rooms, { x, y, width, height })) return { x, y };
    }
  }
  return null;
}

// Nayi room ko sahi jagah dena:
//   1) AI ki di hui jagah agar andar ho aur kisi room par na charhe to wahi
//   2) warna khali jagah dhoondo
//   3) warna room thori chhoti karke dobara dhoondo
//   4) warna bounds ke andar clamp kar do
function placeRoom(rooms, bounds, wantedX, wantedY, width, height) {
  const inside = (x, y, w, h) => x >= bounds.left && y >= bounds.top && x + w <= bounds.right && y + h <= bounds.bottom;

  if (wantedX !== null && wantedY !== null && inside(wantedX, wantedY, width, height) && !hitsAnyRoom(rooms, { x: wantedX, y: wantedY, width, height })) {
    return { x: wantedX, y: wantedY, width, height };
  }

  for (const factor of [1, 0.75, 0.55]) {
    const w = Math.min(Math.round(width * factor), bounds.right - bounds.left);
    const h = Math.min(Math.round(height * factor), bounds.bottom - bounds.top);
    const spot = findFreeSpot(rooms, w, h, bounds);
    if (spot) return { x: spot.x, y: spot.y, width: w, height: h };
  }

  const w = Math.min(width, bounds.right - bounds.left);
  const h = Math.min(height, bounds.bottom - bounds.top);
  return {
    x: clamp(wantedX ?? bounds.left, bounds.left, bounds.right - w),
    y: clamp(wantedY ?? bounds.top, bounds.top, bounds.bottom - h),
    width: w,
    height: h,
  };
}

export function applyOperations(input, rawOperations = []) {
  const plan = structuredClone(normalizePlan(input));
  if (!Array.isArray(rawOperations)) throw new Error("AI operations must be an array");

  for (const raw of rawOperations) {
    ensureOperation(raw);
    const operation = readOperation(raw);
    const rooms = plan.rooms;
    const furniture = plan.furniture;
    const scale = guessScale(rooms);
    const bounds = getBounds(plan);

    if (operation.type === "add_floor") {
      const level = Math.max(0, num(operation.level, plan.floors.length));
      if (!plan.floors.some((floor) => Number(floor.level) === level)) {
        plan.floors.push({ id: makeId("floor"), name: operation.name || `Floor ${level + 1}`, level, elevation: num(operation.elevation, level * 3.2), rooms: [], walls: [], doors: [], windows: [], furniture: [] });
      }
      plan.project.floors = Math.max(Number(plan.project.floors || 1), level + 1);

    } else if (operation.type === "add_room") {
      const width = num(operation.width, scale.room[0]);
      const height = num(operation.height, scale.room[1]);
      if (width <= 0 || height <= 0) throw new Error("Room dimensions must be positive");
      // AI ki x, y ko sirf "pasand" samjho; overlap ho to khali jagah dhoondo
      const spot = placeRoom(rooms, bounds, num(operation.x, null), num(operation.y, null), width, height);
      plan.rooms.push({
        id: freshId(rooms, operation.wantedId, "room"),
        type: operation.subType || "bedroom",
        name: operation.name || "New Room",
        x: spot.x,
        y: spot.y,
        width: spot.width,
        height: spot.height,
        rotation: num(operation.rotation, 0),
        floor: num(operation.floor, 0),
      });

    } else if (operation.type === "remove_room") {
      const index = findIndex(rooms, operation);
      if (index >= 0) plan.rooms.splice(index, 1);

    } else if (["move_room", "resize_room", "rename_room", "set_room_material", "set_room_color", "set_floor_material"].includes(operation.type)) {
      const index = findIndex(rooms, operation);
      if (index < 0) { console.warn("[AI] Room not found, skipped:", operation.targetId || operation.name); continue; }
      const room = rooms[index];
      if (operation.type === "resize_room") {
        room.width = Math.min(num(operation.width, room.width), bounds.right - bounds.left);
        room.height = Math.min(num(operation.height, room.height), bounds.bottom - bounds.top);
      }
      if (operation.type === "move_room" || operation.type === "resize_room") {
        // bounds ke andar rakho
        room.x = clamp(num(operation.x, room.x), bounds.left, bounds.right - num(room.width, 0));
        room.y = clamp(num(operation.y, room.y), bounds.top, bounds.bottom - num(room.height, 0));
      }
      if (operation.type === "rename_room") room.name = String(operation.newName || operation.name || room.name);
      if (operation.type === "set_room_material" || operation.type === "set_floor_material") room.floorMaterial = String(operation.material || room.floorMaterial || "light-wood");
      if (operation.type === "set_room_color") room.wallColor = String(operation.color || room.wallColor || "#f4f1e8");

    } else if (operation.type === "add_furniture") {
      const room = rooms.find((r) => r.id === operation.inRoomId);
      plan.furniture.push({
        id: freshId(furniture, operation.wantedId, "furniture"),
        type: operation.subType || "sofa",
        name: operation.name || "Furniture",
        x: num(operation.x, room ? num(room.x, 0) + 1 : 1),
        y: num(operation.y, room ? num(room.y, 0) + 1 : 1),
        width: num(operation.width, scale.furniture[0]),
        height: num(operation.height, scale.furniture[1]),
        rotation: num(operation.rotation, 0),
        roomId: operation.inRoomId || null,
      });

    } else if (["remove_furniture", "move_furniture", "resize_furniture"].includes(operation.type)) {
      const index = findIndex(furniture, operation);
      if (index < 0) { console.warn("[AI] Furniture not found, skipped:", operation.targetId || operation.name); continue; }
      const item = furniture[index];
      if (operation.type === "remove_furniture") furniture.splice(index, 1);
      if (operation.type === "move_furniture") { item.x = num(operation.x, item.x); item.y = num(operation.y, item.y); }
      if (operation.type === "resize_furniture") { item.width = num(operation.width, item.width); item.height = num(operation.height, item.height); }

    } else if (operation.type === "add_door") {
      const room = rooms.find((r) => r.id === operation.inRoomId);
      plan.doors.push({
        id: freshId(plan.doors, operation.wantedId, "door"),
        type: operation.subType || "single",
        name: operation.name || "Door",
        roomId: operation.inRoomId || undefined,
        x: num(operation.x, room ? num(room.x, 0) + num(room.width, 0) / 2 : 1),
        y: num(operation.y, room ? num(room.y, 0) + num(room.height, 0) : 1),
        width: num(operation.width, scale.door[0]),
        height: num(operation.height, scale.door[1]),
        rotation: num(operation.rotation, 0),
      });

    } else if (operation.type === "remove_door") {
      const index = findIndex(plan.doors, operation);
      if (index >= 0) plan.doors.splice(index, 1);

    } else if (operation.type === "add_window") {
      const room = rooms.find((r) => r.id === operation.inRoomId);
      plan.windows.push({
        id: freshId(plan.windows, operation.wantedId, "window"),
        type: operation.subType || "single",
        name: operation.name || "Window",
        roomId: operation.inRoomId || undefined,
        x: num(operation.x, room ? num(room.x, 0) + num(room.width, 0) / 2 : 1),
        y: num(operation.y, room ? num(room.y, 0) : 1),
        width: num(operation.width, scale.window[0]),
        height: num(operation.height, scale.window[1]),
        rotation: num(operation.rotation, 0),
      });

    } else if (operation.type === "remove_window") {
      const index = findIndex(plan.windows, operation);
      if (index >= 0) plan.windows.splice(index, 1);

    } else if (operation.type === "set_wall_material") {
      plan.materials.wall = operation.material || plan.materials.wall;
      plan.rooms.forEach((room) => { room.wallMaterial = plan.materials.wall; });

    } else if (operation.type === "add_stairs") {
      const stairsW = num(operation.width, scale.room[0] > 60 ? 100 : 4);
      const stairsH = num(operation.height, scale.room[0] > 60 ? 120 : 10);
      const spot = placeRoom(rooms, bounds, num(operation.x, null), num(operation.y, null), stairsW, stairsH);
      plan.rooms.push({
        id: freshId(rooms, operation.wantedId, "stairs"),
        type: "stairs",
        name: operation.name || "Stairs",
        x: spot.x,
        y: spot.y,
        width: spot.width,
        height: spot.height,
        floor: num(operation.floor, 0),
        stepCount: num(operation.stepCount, 10),
        rotation: num(operation.rotation, 0),
      });

    } else if (operation.type === "add_site_element") {
      if (operation.elementType === "parking") plan.site = { ...plan.site, parkingSpaces: num(operation.count, 1), driveway: true };
      if (operation.elementType === "garden") plan.site = { ...plan.site, garden: true };
      if (operation.elementType === "boundary-wall") plan.site = { ...plan.site, boundaryWall: { ...(plan.site.boundaryWall || {}), enabled: true } };
      if (operation.elementType === "gate") plan.site = { ...plan.site, gate: { ...(plan.site.gate || {}), style: operation.style || "sliding" } };

    } else if (operation.type === "set_style") {
      plan.exterior = { ...plan.exterior, style: operation.style || plan.exterior.style };
      if (/white|modern/i.test(operation.style || "")) plan.exterior.facadeColor = "#f4f1e8";
      if (operation.style) plan.project.style = operation.style;

    } else if (operation.type === "set_exterior_style") {
      plan.exterior = { ...plan.exterior, style: operation.style || plan.exterior.style, facadeMaterial: operation.material || plan.exterior.facadeMaterial, facadeColor: operation.color || plan.exterior.facadeColor };

    } else if (operation.type === "set_roof") {
      plan.roof = { ...plan.roof, ...(raw.roof || {}), type: operation.roofType || raw.roof?.type || plan.roof.type };

    } else if (operation.type === "set_lighting") {
      plan.lighting = { ...plan.lighting, ...(raw.lighting || {}), mode: operation.mode || plan.lighting.mode };

    } else if (operation.type === "set_site") {
      plan.site = { ...plan.site, ...(raw.site || {}) };

    } else if (operation.type === "set_boundary_wall") {
      plan.site = { ...plan.site, boundaryWall: { ...(plan.site.boundaryWall || {}), ...(raw.boundaryWall || {}), enabled: operation.enabled ?? true } };

    } else if (operation.type === "set_gate") {
      plan.site = { ...plan.site, gate: { ...(plan.site.gate || {}), ...(raw.gate || {}) } };

    } else if (operation.type === "set_parking") {
      plan.site = { ...plan.site, parkingSpaces: num(operation.spaces, 1) };

    } else if (operation.type === "set_garden") {
      plan.site = { ...plan.site, garden: operation.enabled ?? true };
    }
  }

  const checked = validatePlan(plan);
  if (!checked.valid) throw new Error(checked.message);
  return checked.plan;
}
