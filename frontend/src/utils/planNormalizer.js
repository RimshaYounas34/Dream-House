const collections = ["rooms", "walls", "doors", "windows", "furniture", "dimensions"];

const defaultPlan = {
  project: { name: "Dream House", plotWidth: 30, plotLength: 60, floors: 1, units: "feet" },
  site: { boundaryWall: { enabled: true, height: 2.2, material: "white-plaster", color: "#e8e3d9" }, gate: { style: "modern", width: 4, color: "#26352f" }, driveway: true, garden: true, parkingSpaces: 1 },
  exterior: { style: "pakistani-modern", facadeMaterial: "white-plaster", facadeColor: "#f4f1e8" },
  interior: { style: "warm-modern", ceilingColor: "#fffdf8" },
  materials: { wall: "white-paint", floor: "light-wood", door: "dark-wood", windowFrame: "black" },
  lighting: { mode: "day", intensity: 1.8, warmth: 0.45 },
  roof: { type: "parapet", material: "concrete", color: "#d9d5ca", height: 0.45 },
  floors: [{ id: "floor-1", name: "Ground Floor", level: 0 }],
  layers: {},
  settings: {},
  source: "manual",
};

export function normalizeFloorPlan(input = {}) {
  const source = input.floorPlanData || input;
  const sourceFloors = Array.isArray(source.floors) ? source.floors : [];
  const result = {
    ...defaultPlan,
    ...source,
    project: { ...defaultPlan.project, ...(source.project || {}) },
    site: { ...defaultPlan.site, ...(source.site || {}), boundaryWall: { ...defaultPlan.site.boundaryWall, ...(source.site?.boundaryWall || {}) }, gate: { ...defaultPlan.site.gate, ...(source.site?.gate || {}) } },
    exterior: { ...defaultPlan.exterior, ...(source.exterior || {}) },
    interior: { ...defaultPlan.interior, ...(source.interior || {}) },
    materials: { ...defaultPlan.materials, ...(source.materials || {}) },
    lighting: { ...defaultPlan.lighting, ...(source.lighting || {}) },
    roof: { ...defaultPlan.roof, ...(source.roof || {}) },
    layers: source.layers && typeof source.layers === "object" ? source.layers : {},
    settings: source.settings && typeof source.settings === "object" ? source.settings : {},
  };

  for (const collection of collections) result[collection] = Array.isArray(source[collection]) ? source[collection] : [];
  result.floors = sourceFloors.length
    ? sourceFloors.map((floor, index) => ({ ...floor, id: floor.id || `floor-${index + 1}`, level: Number(floor.level ?? index), elevation: Number(floor.elevation || 0), rooms: Array.isArray(floor.rooms) ? floor.rooms : [], walls: Array.isArray(floor.walls) ? floor.walls : [], doors: Array.isArray(floor.doors) ? floor.doors : [], windows: Array.isArray(floor.windows) ? floor.windows : [], furniture: Array.isArray(floor.furniture) ? floor.furniture : [] }))
    : defaultPlan.floors.map((floor) => ({ ...floor, rooms: [], walls: [], doors: [], windows: [], furniture: [] }));

  for (const collection of collections) {
    if (result[collection].length) continue;
    result[collection] = result.floors.flatMap((floor) => (floor[collection] || []).map((item) => ({ ...item, floor: item.floor ?? floor.level })));
  }
  if (!result.floors[0].rooms.length && result.rooms.length) result.floors[0].rooms = result.rooms;
  if (!result.floors[0].walls.length && result.walls.length) result.floors[0].walls = result.walls;
  return result;
}

export function planFromLocationState(state) {
  if (!state) return normalizeFloorPlan();
  return normalizeFloorPlan({ ...state, project: state.project || { name: state.projectName, plotWidth: state.plotWidth, plotLength: state.plotLength, floors: state.floors } });
}
