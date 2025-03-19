import { api } from "./utils"; // Import centralized api
import { CategoryDTO } from "./types";

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const response = await api.get("/categories");
  return response.data;
};
