import crypto from "node:crypto";

export const THREE_D_FILTER = {
  $or: [
    { "floorPlanData.exterior.style": { $exists: true } },
    { "floorPlanData.roof.type": { $exists: true } },
  ],
};

// floorPlanData.source -> admin panel ka "type" badge
export function projectType(source) {
  if (source === "ai-planner" || source === "ai") return "AI";
  if (source === "template") return "Template";
  return "2D";
}

export function has3D(plan = {}) {
  return Boolean(plan?.exterior?.style || plan?.roof?.type);
}

export function pctChange(current, previous) {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatChange(current, previous) {
  const value = pctChange(current, previous);
  return `${value >= 0 ? "+" : ""}${value}%`;
}

export function monthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return { start, end };
}

export function daysAgo(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

export function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "U";
}

export function tempPassword() {
  return crypto.randomBytes(9).toString("base64url"); // 12 chars
}

export function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parsePaging(query, defaultLimit = 50, maxLimit = 200) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

export function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const cell = (value) => {
    let text = value instanceof Date ? value.toISOString() : String(value ?? "");
    // CSV/Excel formula injection se bachao
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => cell(row[h])).join(","))].join("\n");
}

export function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.expose = true;
  return error;
}
