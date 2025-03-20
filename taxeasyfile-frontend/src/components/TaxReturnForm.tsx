import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { TaxReturnDTO, ClientDTO, CategoryDTO } from "../api/types";
import { createTaxReturn, updateTaxReturn } from "../api/taxReturns";
import { getClients } from "../api/client";
import { getCategories } from "../api/categories";

interface TaxReturnFormProps {
  taxReturn?: TaxReturnDTO;
  onSave: (taxReturn: TaxReturnDTO) => void;
  onCancel?: () => void;
}

const TaxReturnForm = ({ taxReturn, onSave, onCancel }: TaxReturnFormProps) => {
  const [formData, setFormData] = useState<TaxReturnDTO>({
    clientId: 0,
    taxYear: new Date().getFullYear(),
    taxReturnStatus: "PENDING",
    filingDate: "",
    totalIncome: 0,
    categoryId: undefined,
    cpaId: 0,
    fileAttachment: "",
  });
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeForm = async () => {
      await fetchData();
      if (taxReturn) {
        setFormData(taxReturn); 
      }
    };
    initializeForm();
  }, [taxReturn]);

  const fetchData = async () => {
    try {
      const [clientList, categoryList] = await Promise.all([
        getClients(),
        getCategories(),
      ]);
      setClients(clientList);
      setCategories(categoryList);

      if (
        taxReturn?.clientId &&
        !clientList.some((c) => c.id === taxReturn.clientId)
      ) {
        setClients((prev) => [
          ...prev,
          {
            id: taxReturn.clientId,
            name: "Client Not Found",
            tin: "N/A",
            email: "N/A",
            cpaId: 0,
          },
        ]);
      }

      if (
        taxReturn?.categoryId &&
        !categoryList.some((cat) => cat.id === taxReturn.categoryId)
      ) {
        setCategories((prev) => [
          ...prev,
          { id: taxReturn.categoryId, name: "Category Not Found" },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load clients or categories");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    const updateFieldValue = (fieldName: string, fieldValue: unknown) => {
      if (fieldValue === "") return undefined;
      if (
        ["clientId", "taxYear", "cpaId", "totalIncome", "categoryId"].includes(
          fieldName
        )
      ) {
        return Number(fieldValue);
      }
      if (fieldName === "taxReturnStatus") {
        return fieldValue as "PENDING" | "IN_PROGRESS" | "COMPLETED";
      }
      return fieldValue;
    };

    setFormData((prev) => ({
      ...prev,
      [name]: updateFieldValue(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const cpaId = Number(localStorage.getItem("userId")) || 1;
      const updatedFormData = { ...formData, cpaId };
      let savedTaxReturn: TaxReturnDTO;
      if (taxReturn?.id) {
        savedTaxReturn = await updateTaxReturn(taxReturn.id, updatedFormData);
      } else {
        savedTaxReturn = await createTaxReturn(updatedFormData);
      }
      onSave(savedTaxReturn);
    } catch (err: any) {
      setError(err.response?.data || "Failed to save tax return");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {taxReturn ? "Edit Tax Return" : "Create Tax Return"}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Client"
          name="clientId"
          value={formData.clientId || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {clients.length === 0 ? (
            <MenuItem value="">No clients available</MenuItem>
          ) : (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name} (TIN: {client.tin})
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Tax Year"
          name="taxYear"
          type="number"
          value={formData.taxYear}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Status"
          name="taxReturnStatus"
          value={formData.taxReturnStatus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {["PENDING", "IN_PROGRESS", "COMPLETED"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Filing Date"
          name="filingDate"
          type="date"
          value={formData.filingDate || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Total Income"
          name="totalIncome"
          type="number"
          value={formData.totalIncome || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          name="categoryId"
          value={formData.categoryId || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {categories.length === 0 ? (
            <MenuItem value="">No categories available</MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="File Attachment"
          name="fileAttachment"
          value={formData.fileAttachment || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1 }}
          >
            {taxReturn ? "Update" : "Create"}
          </Button>
          {onCancel && (
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ py: 1 }}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default TaxReturnForm;
