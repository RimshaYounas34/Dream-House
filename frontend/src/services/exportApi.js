import { apiRequest } from "./api";

export async function downloadProjectExport(projectId, format) {
  const blob = await apiRequest(`/projects/${projectId}/export/${format}`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dream-house.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}
