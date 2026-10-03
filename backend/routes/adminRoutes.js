import { Router } from "express";

import {
  requireAdmin,
  requireAuth,
} from "../middleware/authMiddleware.js";

import { asyncHandler as wrap } from "../utils/asyncHandler.js";

import {
  getDashboard,
} from "../controllers/adminDashboardController.js";

import {
  changeUserRole,
  createUser,
  deleteUser,
  getUser,
  listUsers,
  resetUserPassword,
  toggleUserStatus,
  updateUser,
} from "../controllers/adminUserController.js";

import {
  deleteAnyProject,
  getAnyProject,
  listAllProjects,
} from "../controllers/adminProjectController.js";

import {
  clearAiLogs,
  getAiUsage,
  listAiLogs,
} from "../controllers/adminAiUsageController.js";

import {
  exportReport,
  getReports,
} from "../controllers/adminReportController.js";

import {
  changeAdminPassword,
  getAdminSettings,
  updateAdminProfile,
  updateAdminSettings,
} from "../controllers/settingsController.js";

import {
  adminListTemplates,
  createTemplate,
  deleteTemplate,
  updateTemplate,
} from "../controllers/templateController.js";

/* =========================================================
   CONTACT QUERIES
========================================================= */

import {
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  updateContactMessageStatus,
} from "../controllers/adminContactController.js";


const router = Router();

// Is file ke SAARE routes sirf logged-in admin ke liye hain
router.use(requireAuth, requireAdmin);


/* =========================================================
   DASHBOARD
========================================================= */

router.get(
  "/dashboard",
  wrap(getDashboard)
);


/* =========================================================
   USERS
========================================================= */

router
  .route("/users")
  .get(wrap(listUsers))
  .post(wrap(createUser));

router
  .route("/users/:id")
  .get(wrap(getUser))
  .put(wrap(updateUser))
  .delete(wrap(deleteUser));

router.patch(
  "/users/:id/status",
  wrap(toggleUserStatus)
);

router.patch(
  "/users/:id/role",
  wrap(changeUserRole)
);

router.post(
  "/users/:id/reset-password",
  wrap(resetUserPassword)
);


/* =========================================================
   PROJECTS
========================================================= */

router.get(
  "/projects",
  wrap(listAllProjects)
);

router
  .route("/projects/:id")
  .get(wrap(getAnyProject))
  .delete(wrap(deleteAnyProject));


/* =========================================================
   TEMPLATES
========================================================= */

router
  .route("/templates")
  .get(wrap(adminListTemplates))
  .post(wrap(createTemplate));

router
  .route("/templates/:id")
  .put(wrap(updateTemplate))
  .delete(wrap(deleteTemplate));


/* =========================================================
   AI USAGE
========================================================= */

router
  .route("/ai-usage")
  .get(wrap(getAiUsage))
  .delete(wrap(clearAiLogs));

router.get(
  "/ai-usage/logs",
  wrap(listAiLogs)
);


/* =========================================================
   CONTACT QUERIES
========================================================= */

// Get all contact queries
router.get(
  "/contact-messages",
  wrap(listContactMessages)
);

// Get single contact query
router.get(
  "/contact-messages/:id",
  wrap(getContactMessage)
);

// Update query status
router.patch(
  "/contact-messages/:id/status",
  wrap(updateContactMessageStatus)
);

// Delete contact query
router.delete(
  "/contact-messages/:id",
  wrap(deleteContactMessage)
);


/* =========================================================
   REPORTS
========================================================= */

router.get(
  "/reports",
  wrap(getReports)
);

router.get(
  "/reports/export",
  wrap(exportReport)
);


/* =========================================================
   SETTINGS + ADMIN PROFILE
========================================================= */

router
  .route("/settings")
  .get(wrap(getAdminSettings))
  .put(wrap(updateAdminSettings));

router.put(
  "/profile",
  wrap(updateAdminProfile)
);

router.put(
  "/password",
  wrap(changeAdminPassword)
);


export default router;