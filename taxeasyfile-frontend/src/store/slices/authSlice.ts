import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, signup, logout as apiLogout } from "../../api/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: "CPA" | "ADMIN" | null;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  userId: localStorage.getItem("userId"),
  role: localStorage.getItem("role") as "CPA" | "ADMIN" | null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        jwt: string;
        refreshToken: string;
        userId: string;
        role: string;
      }>
    ) => {
      state.token = action.payload.jwt;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.role = action.payload.role as "CPA" | "ADMIN";
      state.error = null;
      localStorage.setItem("token", action.payload.jwt);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("role", action.payload.role);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.role = null;
      state.error = null;
      apiLogout();
    },
  },
});

export const { setCredentials, setError, logout } = authSlice.actions;
export default authSlice.reducer;
