import React, { useState, useEffect } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../api/client";
import { ClientDTO } from "../api/types";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const ClientManagement = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const initialCpaId = Number(localStorage.getItem("userId") && localStorage.getItem("role") === "cpa");
  const [newClient, setNewClient] = useState({
    cpaId: initialCpaId,
    name: "",
    tin: "",
    email: "",
  });
  const [editingClient, setEditingClient] = useState<ClientDTO | null>(null);
  const [error, setError] = useState<string>("");

useEffect(() => {
  const fetchClients = async () => {
    try {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients");
    }
  };
  fetchClients();
}, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient((prev) => ({ ...prev!, [name]: value }));
    } else {
      setNewClient((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleCreateOrUpdate = async () => {
    const cpaId = Number(localStorage.getItem("cpaId"));
    try {
      setError("");
      if (editingClient) {
        if (editingClient.id) {
          const updated = await updateClient(editingClient.id, {
            ...editingClient,
          });
          setClients((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
          setEditingClient(null);
        } else {
          console.error("editingClient does not have an ID.");
        }
      } else {
        if (isNaN(cpaId)) {
          console.error("cpaId is not valid");
          setError("Invalid CPA ID");
          return;
        }
        const created = await createClient({ ...newClient, cpaId });
        setClients((prev) => [...prev, created]);
        setNewClient({ name: "", tin: "", email: "", cpaId });
      }
    } catch (err: any) {
      setError(err.message || "Failed to save client");
    }
  };

  const handleEdit = (client: ClientDTO) => {
    setEditingClient(client);
    setError("");
  };

  const handleDelete = async (clientId: number | undefined) => {
    if (clientId) {
      try {
        setError(""); // Clear previous error
        await deleteClient(clientId);
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== clientId)
        );
      } catch (err: any) {
        setError(err.message || "Failed to delete client"); // Display specific error
      }
    } else {
      console.error("clientId is undefined");
      setError("Client ID is undefined");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Client Management
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Name"
          name="name"
          value={editingClient ? editingClient.name : newClient.name}
          onChange={handleInputChange}
          sx={{ mr: 2, mb: 2 }}
          required
        />
        <TextField
          label="TIN"
          name="tin"
          value={editingClient ? editingClient.tin : newClient.tin}
          onChange={handleInputChange}
          sx={{ mr: 2, mb: 2 }}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={editingClient ? editingClient.email : newClient.email}
          onChange={handleInputChange}
          sx={{ mr: 2, mb: 2 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleCreateOrUpdate}
          sx={{ mt: 1 }}
        >
          {editingClient ? "Update Client" : "Add Client"}
        </Button>
        {editingClient && (
          <Button onClick={() => setEditingClient(null)} sx={{ ml: 2, mt: 1 }}>
            Cancel
          </Button>
        )}
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>TIN</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.tin}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(client)}>Edit</Button>
                <Button onClick={() => handleDelete(client.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ClientManagement;
