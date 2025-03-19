import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}