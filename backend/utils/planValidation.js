const collections = ["rooms", "doors", "windows", "walls", "furniture", "dimensions"];

export function normalizePlan(input = {}) {
  const source = input.floorPlanData || input;
  const project = source.project || {};
  const plan = {
    project: {
      name: String(project.name || input.name || "Dream House").slice(0, 160),
      plotWidth: Number(project.plotWidth || project.width || source.plot?.width || 30),
      plotLength: Number(project.plotLength || project.height || source.plot?.height || 60),
      floors: Number(project.floors || 1),
      units: project.units || source.plot?.unit || "feet",
      // style pehle yahan se gum ho jata tha, ab bacha rahega
      ...(project.style ? { style: project.style } : {}),
    },
    source: source.source || "manual",
  };

  for (const collection of collections) {
    plan[collection] = Array.isArray(source[collection]) ? source[collection] : [];
  }
  plan.layers = source.layers && typeof source.layers === "object" ? source.layers : {};
  plan.settings = source.settings && typeof source.settings === "object" ? source.settings : {};
  plan.site = source.site && typeof source.site === "object" ? source.site : {};
  plan.exterior = source.exterior && typeof source.exterior === "object" ? source.exterior : {};
  plan.interior = source.interior && typeof source.interior === "object" ? source.interior : {};
  plan.materials = source.materials && typeof source.materials === "object" ? source.materials : {};
  plan.lighting = source.lighting && typeof source.lighting === "object" ? source.lighting : {};
  plan.roof = source.roof && typeof source.roof === "object" ? source.roof : {};
  plan.floors = Array.isArray(source.floors) ? source.floors : [{ id: "floor-1", name: "Ground Floor", level: 0 }];
  plan.aiHistory = Array.isArray(source.aiHistory) ? source.aiHistory : [];
  return plan;
}

// AI kabhi kabhi chhoti ghalti kar deti hai (id nahi di, x negative wagaira).
// Pehle hum poora plan reject kar dete the. Ab hum chhoti ghaltiyan khud theek kar dete hain.
function repairItems(plan) {
  for (const collection of collections) {
    // Faltu (null / object nahi) items nikaal do
    plan[collection] = plan[collection].filter((item) => item && typeof item === "object");

    const usedIds = new Set();
    plan[collection].forEach((item, index) => {
      // id nahi hai, ya duplicate hai -> nayi id
      if (!item.id || usedIds.has(String(item.id))) {
        item.id = `${collection}-${index + 1}-${Math.random().toString(36).slice(2, 7)}`;
      }
      usedIds.add(String(item.id));

      // x, y negative ya galat ho to 0
      for (const field of ["x", "y"]) {
        if (item[field] !== undefined) {
          const value = Number(item[field]);
          item[field] = Number.isFinite(value) && value >= 0 ? value : 0;
        }
      }

      // width, height 0 / negative / galat ho to 1
      for (const field of ["width", "height"]) {
        if (item[field] !== undefined) {
          const value = Number(item[field]);
          item[field] = Number.isFinite(value) && value > 0 ? value : 1;
        }
      }
    });
  }
}

export function validatePlan(input) {
  const plan = normalizePlan(input);
  if (!(plan.project.plotWidth > 0) || !(plan.project.plotLength > 0)) {
    return { valid: false, message: "Plot dimensions must be greater than zero" };
  }

  repairItems(plan);
  return { valid: true, plan };
}
