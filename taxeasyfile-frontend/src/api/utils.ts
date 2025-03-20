import axios from "axios";
import { logout } from "./auth";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          const newToken = response.data;
          localStorage.setItem("token", newToken);
          setAuthToken(newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError : any) {
          console.error(
            "Refresh token failed:",
            refreshError.response?.data || refreshError.message
          );
          logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        logout();
        window.location.href = "/login";
      }
    }
    console.error(
      "Request failed:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}
