import { apiRequest } from "./api";

export async function listProjects() {
  const response = await apiRequest("/projects");
  return response.data;
}

export async function createProject(payload) {
  const response = await apiRequest("/projects", { method: "POST", body: JSON.stringify(payload) });
  return response.data;
}

export async function getProject(id) {
  const response = await apiRequest(`/projects/${id}`);
  return response.data;
}

export async function updateProject(id, payload) {
  const response = await apiRequest(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  return response.data;
}

export async function deleteProject(id) {
  return apiRequest(`/projects/${id}`, { method: "DELETE" });
}

export async function listVersions(id) {
  const response = await apiRequest(`/projects/${id}/versions`);
  return response.data;
}
