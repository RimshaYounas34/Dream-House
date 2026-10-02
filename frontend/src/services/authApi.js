import { apiRequest } from "./api";

function extractToken(response) {
  return (
    response?.data?.token ||
    response?.data?.accessToken ||
    response?.data?.access_token ||
    response?.token ||
    response?.accessToken ||
    response?.access_token ||
    response?.data?.data?.token ||
    response?.data?.data?.accessToken ||
    response?.data?.data?.access_token ||
    null
  );
}

function extractUser(response) {
  return (
    response?.data?.user ||
    response?.user ||
    response?.data?.data?.user ||
    null
  );
}

export async function loginUser(credentials) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  console.log("========== LOGIN RESPONSE ==========");
  console.log(response);
  console.log("====================================");

  const token = extractToken(response);
  const user = extractUser(response);

  console.log("[authApi] Token found:", token ? "YES" : "NO");
  console.log("[authApi] User found:", user ? "YES" : "NO");

  if (!token) {
    throw new Error(
      "Login successful nahi hua: backend response mein token nahi mila."
    );
  }

  if (!user) {
    throw new Error(
      "Login successful nahi hua: backend response mein user nahi mila."
    );
  }

  // Save authentication data
  localStorage.setItem("dreamhouse_token", token);
  localStorage.setItem("dreamhouse_user", JSON.stringify(user));
  localStorage.setItem("dreamhouse_logged_in", "true");

  if (user.name) {
    localStorage.setItem("dreamhouse_name", user.name);
  }

  if (user.role) {
    localStorage.setItem("dreamhouse_role", user.role);
  }

  console.log(
    "[authApi] Saved token:",
    localStorage.getItem("dreamhouse_token") ? "YES" : "NO"
  );

  console.log(
    "[authApi] Saved user:",
    localStorage.getItem("dreamhouse_user")
  );

  return user;
}

export async function registerUser(payload) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log("========== REGISTER RESPONSE ==========");
  console.log(response);
  console.log("=======================================");

  const token = extractToken(response);
  const user = extractUser(response);

  if (!token) {
    throw new Error(
      "Registration response mein authentication token nahi mila."
    );
  }

  if (!user) {
    throw new Error(
      "Registration response mein user information nahi mili."
    );
  }

  localStorage.setItem("dreamhouse_token", token);
  localStorage.setItem("dreamhouse_user", JSON.stringify(user));
  localStorage.setItem("dreamhouse_logged_in", "true");

  if (user.name) {
    localStorage.setItem("dreamhouse_name", user.name);
  }

  if (user.role) {
    localStorage.setItem("dreamhouse_role", user.role);
  }

  return user;
}

export function logoutUser() {
  [
    "dreamhouse_token",
    "dreamhouse_user",
    "dreamhouse_logged_in",
    "dreamhouse_role",
    "dreamhouse_name",
  ].forEach((key) => {
    localStorage.removeItem(key);
  });
}