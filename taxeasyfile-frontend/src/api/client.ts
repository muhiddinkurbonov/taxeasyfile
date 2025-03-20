import { api } from "./utils"; 
import { ClientDTO } from "./types";

export const getClients = async (): Promise<ClientDTO[]> => {
  const response = await api.get("/clients");
  return response.data;
};

export const createClient = async (client: ClientDTO): Promise<ClientDTO> => {
  try {
    if (!client.name || !client.tin) {
      throw new Error("Client name and TIN cannot be empty.");
    }
    const response = await api.post("/clients", client);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data;
      if (status === 409 || (status === 400 && message.includes("TIN"))) {
        throw new Error("A client with this TIN already exists.");
      }
      throw new Error(message || "Failed to create client");
    }
    console.error("Failed to create client:", error);
    throw error; 
  }
};

export const updateClient = async (
  id: number,
  client: ClientDTO
): Promise<ClientDTO> => {
  const response = await api.put(`/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await api.delete(`/clients/${id}`);
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data;
      if (status === 409) {
        throw new Error(
          "Cannot delete client because they have existing tax returns."
        );
      }
      if (status === 404) {
        throw new Error("Client not found");
      }
      throw new Error(
        message ||
          "Cannot delete client because they may have existing tax returns."
      );
    }
    console.error("Failed to delete client:", error);
    throw error;
  }
};
