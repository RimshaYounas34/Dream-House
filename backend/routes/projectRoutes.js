import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createProject, createVersionEndpoint, deleteProject, getProject, getVersion, listProjects, listVersions, restoreVersion, updateProject } from "../controllers/projectController.js";
import { exportDxf, exportPdf } from "../controllers/exportController.js";

const router = Router();
router.use(requireAuth);
router.route("/").get(asyncHandler(listProjects)).post(asyncHandler(createProject));
router.route("/:id").get(asyncHandler(getProject)).put(asyncHandler(updateProject)).delete(asyncHandler(deleteProject));
router.post("/:id/versions", asyncHandler(createVersionEndpoint));
router.get("/:id/versions", asyncHandler(listVersions));
router.get("/:id/versions/:versionId", asyncHandler(getVersion));
router.post("/:id/versions/:versionId/restore", asyncHandler(restoreVersion));
router.get("/:id/export/pdf", asyncHandler(exportPdf));
router.get("/:id/export/dxf", asyncHandler(exportDxf));
export default router;
