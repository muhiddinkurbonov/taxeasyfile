import { api } from "./utils";

import {User, CpaStats} from './types';

export const getUsers = async (
  filters: { role?: "CPA" | "ADMIN"; active?: boolean } = {}
) => {
  const response = await api.get("/admin/users", { params: filters });
  return response.data as User[];
};

export const getCpaStats = async () => {
  const response = await api.get("/admin/cpa-stats");
  return response.data as CpaStats;
};

export const updateUserRole = async (id: number, role: "CPA" | "ADMIN") => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const toggleUserStatus = async (id: number) => {
  const response = await api.put(`/admin/users/${id}/status`);
  return response.data;
};

export const resetUserPassword = async (id: number) => {
  const response = await api.put(`/admin/users/${id}/reset-password`);
  return response.data;
};
