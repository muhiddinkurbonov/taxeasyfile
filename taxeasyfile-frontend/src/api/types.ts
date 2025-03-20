export interface AuthRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  role: "CPA" | "ADMIN";
}

export interface TaxReturnDTO {
  id?: number;
  clientId?: number;
  taxYear: number;
  taxReturnStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  filingDate?: string; 
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

export interface User {
  id: number;
  username: string;
  email: string;
  role: "CPA" | "ADMIN";
  registrationDate: string;
  active: boolean;
}

export interface CpaStats {
  totalCpas: number;
  totalClients: number;
  avgClientsPerCpa: number;
  taxReturnsThisMonth: number;
  taxReturnsThisYear: number;
  totalTaxReturns: number;
}

export interface AuthResponse {
  jwt: string;
  refreshToken: string;
  userId: string;
  role: "CPA" | "ADMIN";
}