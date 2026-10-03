import { apiRequest, API_URL } from "./api";

const json = (method, body) => ({
  method,
  body: JSON.stringify(body),
});

const qs = (params = {}) => {
  const clean = Object.entries(params).filter(
    ([, v]) =>
      v !== undefined &&
      v !== "" &&
      v !== "All"
  );

  return clean.length
    ? `?${new URLSearchParams(clean)}`
    : "";
};


// ===============================
// ADMIN DASHBOARD
// ===============================

export const getAdminDashboard = () =>
  apiRequest("/admin/dashboard");


// ===============================
// USERS
// ===============================

export const getAdminUsers = (params) =>
  apiRequest(`/admin/users${qs(params)}`);

export const getAdminUser = (id) =>
  apiRequest(`/admin/users/${id}`);

export const createAdminUser = (user) =>
  apiRequest(
    "/admin/users",
    json("POST", user)
  );

export const updateAdminUser = (id, changes) =>
  apiRequest(
    `/admin/users/${id}`,
    json("PUT", changes)
  );

export const toggleAdminUserStatus = (id) =>
  apiRequest(
    `/admin/users/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({}),
    }
  );

export const changeAdminUserRole = (id, role) =>
  apiRequest(
    `/admin/users/${id}/role`,
    json("PATCH", { role })
  );

export const resetAdminUserPassword = (
  id,
  password
) =>
  apiRequest(
    `/admin/users/${id}/reset-password`,
    json(
      "POST",
      password
        ? { password }
        : {}
    )
  );

export const deleteAdminUser = (id) =>
  apiRequest(
    `/admin/users/${id}`,
    {
      method: "DELETE",
    }
  );


// ===============================
// PROJECTS
// ===============================

export const getAdminProjects = (params) =>
  apiRequest(
    `/admin/projects${qs(params)}`
  );

export const getAdminProject = (id) =>
  apiRequest(
    `/admin/projects/${id}`
  );

export const deleteAdminProject = (id) =>
  apiRequest(
    `/admin/projects/${id}`,
    {
      method: "DELETE",
    }
  );


// ===============================
// TEMPLATES
// ===============================

export const getAdminTemplates = () =>
  apiRequest(
    "/admin/templates"
  );

export const createAdminTemplate = (
  template
) =>
  apiRequest(
    "/admin/templates",
    json("POST", template)
  );

export const updateAdminTemplate = (
  id,
  changes
) =>
  apiRequest(
    `/admin/templates/${id}`,
    json("PUT", changes)
  );

export const deleteAdminTemplate = (
  id
) =>
  apiRequest(
    `/admin/templates/${id}`,
    {
      method: "DELETE",
    }
  );

export const getPublicTemplates = () =>
  apiRequest(
    "/templates"
  );


// ===============================
// AI USAGE
// ===============================

export const getAdminAiUsage = (
  days = 7
) =>
  apiRequest(
    `/admin/ai-usage?days=${days}`
  );

export const getAdminAiLogs = (
  params
) =>
  apiRequest(
    `/admin/ai-usage/logs${qs(params)}`
  );

export const clearAdminAiLogs = () =>
  apiRequest(
    "/admin/ai-usage",
    {
      method: "DELETE",
    }
  );

export const track3dGeneration = () =>
  apiRequest(
    "/ai/usage",
    json("POST", {
      feature: "3D Generation",
    })
  ).catch(() => {});


// ===============================
// CONTACT QUERIES
// ===============================

export const getAdminContactMessages = () =>
  apiRequest(
    "/admin/contact-messages"
  );

export const getAdminContactMessage = (
  id
) =>
  apiRequest(
    `/admin/contact-messages/${id}`
  );

export const updateAdminContactMessageStatus = (
  id,
  status
) =>
  apiRequest(
    `/admin/contact-messages/${id}/status`,
    json("PATCH", { status })
  );

export const deleteAdminContactMessage = (
  id
) =>
  apiRequest(
    `/admin/contact-messages/${id}`,
    {
      method: "DELETE",
    }
  );


// ===============================
// REPORTS
// ===============================

export const getAdminReports = (
  period = 30
) =>
  apiRequest(
    `/admin/reports?period=${period}`
  );

export async function downloadAdminReport(
  type
) {
  const blob = await apiRequest(
    `/admin/reports/export?type=${type}`
  );

  const url =
    URL.createObjectURL(blob);

  const a = Object.assign(
    document.createElement("a"),
    {
      href: url,
      download: `${type}.csv`,
    }
  );

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}


// ===============================
// SETTINGS
// ===============================

export const getAdminSettings = () =>
  apiRequest(
    "/admin/settings"
  );

export const updateAdminSettings = (
  settings
) =>
  apiRequest(
    "/admin/settings",
    json("PUT", settings)
  );

export const updateAdminProfile = (
  profile
) =>
  apiRequest(
    "/admin/profile",
    json("PUT", profile)
  );

export const changeAdminPassword = (
  currentPassword,
  newPassword
) =>
  apiRequest(
    "/admin/password",
    json("PUT", {
      currentPassword,
      newPassword,
    })
  );

export const getPublicSettings = () =>
  apiRequest(
    "/settings/public"
  );


// ===============================
// API URL
// ===============================

export { API_URL };