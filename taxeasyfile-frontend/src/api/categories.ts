import { api } from "./utils"; 
import { CategoryDTO } from "./types";

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const response = await api.get("/categories");
  return response.data;
};
