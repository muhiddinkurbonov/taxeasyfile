import { api } from "./utils";
import { AuthRequest } from "./types";
import { SignupRequest } from "./types";

export const login = async (
  credentials: AuthRequest
): Promise<{ jwt: string; refreshToken: string, userId: string, role: string }> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const signup = async (userData: SignupRequest): Promise<string> => {
  const response = await api.post("/auth/signup", userData);
  return response.data; 
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  api.defaults.headers.common["Authorization"] = "";
};





