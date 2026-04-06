export const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    console.warn("Invalid user data in localStorage");
    localStorage.removeItem("user");
    return null;
  }
};

export const getAuthToken = () => localStorage.getItem("token") || "";

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
