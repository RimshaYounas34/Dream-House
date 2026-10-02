import PDFDocument from "pdfkit";

function drawRect(doc, item, scale, offsetX, offsetY, color = "#455a50") {
  const x = offsetX + Number(item.x || 0) * scale;
  const y = offsetY + Number(item.y || 0) * scale;
  const width = Number(item.width || 0) * scale;
  const height = Number(item.height || 0) * scale;
  doc.rect(x, y, width, height).lineWidth(1).stroke(color);
  if (item.name) doc.fontSize(6).fillColor("#30483d").text(item.name, x + 2, y + 2, { width: Math.max(width - 4, 20), height: 12, ellipsis: true });
}

export function createPdf(plan) {
  const doc = new PDFDocument({ size: "A4", margin: 36 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const done = new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  doc.fontSize(20).fillColor("#173d32").text(plan.project?.name || "Dream House");
  doc.fontSize(9).fillColor("#63736a").text(`Floor plan | ${plan.project?.plotWidth || 0} x ${plan.project?.plotLength || 0} ${plan.project?.units || "ft"}`);
  doc.moveDown(1);

  const plotWidth = Number(plan.project?.plotWidth || 30);
  const plotLength = Number(plan.project?.plotLength || 60);
  const drawable = [...(plan.rooms || []), ...(plan.walls || []), ...(plan.doors || []), ...(plan.windows || []), ...(plan.furniture || [])];
  const drawingWidth = Math.max(plotWidth, ...drawable.map((item) => Number(item.x || 0) + Number(item.width || 0)));
  const drawingHeight = Math.max(plotLength, ...drawable.map((item) => Number(item.y || 0) + Number(item.height || 0)));
  const scale = Math.min(520 / drawingWidth, 650 / drawingHeight);
  const offsetX = 42;
  const offsetY = 100;
  doc.rect(offsetX, offsetY, drawingWidth * scale, drawingHeight * scale).lineWidth(2).stroke("#173d32");
  for (const room of plan.rooms || []) drawRect(doc, room, scale, offsetX, offsetY, "#536b5e");
  for (const wall of plan.walls || []) drawRect(doc, wall, scale, offsetX, offsetY, "#1f332b");
  for (const door of plan.doors || []) drawRect(doc, door, scale, offsetX, offsetY, "#9b6f52");
  for (const window of plan.windows || []) drawRect(doc, window, scale, offsetX, offsetY, "#4f8790");
  for (const piece of plan.furniture || []) drawRect(doc, piece, scale, offsetX, offsetY, "#9c8664");

  doc.fontSize(8).fillColor("#63736a").text(`Rooms: ${(plan.rooms || []).length} | Doors: ${(plan.doors || []).length} | Windows: ${(plan.windows || []).length} | Generated: ${new Date().toLocaleDateString()}`, 42, 760);
  doc.end();
  return done;
}
