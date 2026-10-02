function pair(code, value) {
  return `${code}\n${value}\n`;
}

function entityLine(layer, x1, y1, x2, y2) {
  return `${pair(0, "LINE")}${pair(8, layer)}${pair(10, x1)}${pair(20, y1)}${pair(11, x2)}${pair(21, y2)}`;
}

function rectangle(layer, item) {
  const x = Number(item.x || 0);
  const y = Number(item.y || 0);
  const width = Number(item.width || 0);
  const height = Number(item.height || 0);
  return [
    entityLine(layer, x, y, x + width, y),
    entityLine(layer, x + width, y, x + width, y + height),
    entityLine(layer, x + width, y + height, x, y + height),
    entityLine(layer, x, y + height, x, y),
  ].join("");
}

export function createDxf(plan) {
  let entities = "";
  for (const wall of plan.walls || []) entities += rectangle("WALLS", wall);
  for (const room of plan.rooms || []) entities += rectangle("ROOMS", room);
  for (const door of plan.doors || []) entities += rectangle("DOORS", door);
  for (const window of plan.windows || []) entities += rectangle("WINDOWS", window);
  for (const piece of plan.furniture || []) entities += rectangle("FURNITURE", piece);

  return `${pair(0, "SECTION")}${pair(2, "HEADER")}${pair(0, "ENDSEC")}${pair(0, "SECTION")}${pair(2, "ENTITIES")}${entities}${pair(0, "ENDSEC")}${pair(0, "EOF")}`;
}
