import { api } from "./utils"; // Import centralized api
import { AuthRequest } from "./types";

export const login = async (credentials: AuthRequest): Promise<string> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("cpaId");
  api.defaults.headers.common["Authorization"] = ""; // Clear header
};
