import Setting from "../models/Setting.js";

// Maintenance mode on ho to normal users ko 503 milta hai, admin phir bhi kaam kar sakta hai.
// optionalAuth / requireAuth ke BAAD lagana hai (taake req.user mil sakay).
export async function blockDuringMaintenance(req, res, next) {
  try {
    const settings = await Setting.getGlobal();
    if (settings.maintenanceMode && req.user?.role !== "admin") {
      return res.status(503).json({ success: false, message: "DreamHouse is under maintenance. Please try again later." });
    }
    next();
  } catch (error) {
    next(error);
  }
}

// AI band ho to AI routes 403 dengi
export async function requireAiEnabled(req, res, next) {
  try {
    const settings = await Setting.getGlobal();
    if (!settings.aiEnabled) {
      return res.status(403).json({ success: false, message: "AI features are currently disabled by the administrator." });
    }
    next();
  } catch (error) {
    next(error);
  }
}
