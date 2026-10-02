const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7210/api";

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = localStorage.getItem("dreamhouse_token");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.blob();
  if (!response.ok) throw new Error(body?.message || "Request failed");
  return body;
}

export { API_URL };
