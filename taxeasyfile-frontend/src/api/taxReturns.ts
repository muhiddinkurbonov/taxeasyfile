import { api } from "./utils"; 
import { TaxReturnDTO } from "./types";

export const getTaxReturns = async (
  page: number = 0,
  size: number = 5,
  sortBy: string = "id",
  sortDir: string = "asc"
): Promise<{ content: TaxReturnDTO[]; totalElements: number }> => {
  const response = await api.get("/tax-returns", {
    params: { page, size, sortBy, sortDir },
  });
  return response.data; 
};

export const createTaxReturn = async (
  taxReturn: TaxReturnDTO
): Promise<TaxReturnDTO> => {
  const response = await api.post("/tax-returns", taxReturn);
  return response.data;
};

export const updateTaxReturn = async (
  id: number,
  taxReturn: TaxReturnDTO
): Promise<TaxReturnDTO> => {
  const response = await api.put(`/tax-returns/${id}`, taxReturn);
  return response.data;
};

export const deleteTaxReturn = async (id: number): Promise<void> => {
  await api.delete(`/tax-returns/${id}`);
};
