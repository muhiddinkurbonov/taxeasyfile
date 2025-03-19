export interface AuthRequest {
  username: string;
  password: string;
}

export interface TaxReturnDTO {
  id?: number;
  clientId?: number;
  taxYear: number;
  taxReturnStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  filingDate?: string; // ISO date string
  totalIncome?: number;
  categoryId?: number;
  cpaId: number;
  fileAttachment?: string;
}

export interface CategoryDTO {
  id?: number;
  name: string;
}

export interface ClientDTO {
  id?: number;
  name: string;
  tin: string;
  email: string;
  cpaId: number; 
}
