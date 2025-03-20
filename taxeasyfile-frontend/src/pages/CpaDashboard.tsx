import React, { useEffect, useState } from "react";
import { deleteTaxReturn, getTaxReturns } from "../api/taxReturns";
import { getCategories } from "../api/categories";
import TaxReturnList from "../components/TaxReturnList";
import TaxReturnForm from "../components/TaxReturnForm";
import { TaxReturnDTO, CategoryDTO } from "../api/types";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const CpaDashboard = () => {
  const [taxReturns, setTaxReturns] = useState<TaxReturnDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTaxReturn, setEditingTaxReturn] = useState<
    TaxReturnDTO | undefined
  >(undefined);
  const [showForm, setShowForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taxReturnIdToDelete, setTaxReturnIdToDelete] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const taxReturnResponse = await getTaxReturns(
          page,
          rowsPerPage,
          sortBy,
          sortDir
        );
        if (isMounted) {
          setTaxReturns(taxReturnResponse.content ?? []);
          setTotalElements(taxReturnResponse.totalElements ?? 0);
          setCategories(await getCategories());
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        if (isMounted) setTaxReturns([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page, rowsPerPage, sortBy, sortDir]);

  const handleSave = (savedTaxReturn: TaxReturnDTO) => {
    setTaxReturns((prev) =>
      editingTaxReturn
        ? prev.map((tr) => (tr.id === savedTaxReturn.id ? savedTaxReturn : tr))
        : [...prev, savedTaxReturn]
    );
    setEditingTaxReturn(undefined);
    setShowForm(false);
    fetchData();
  };

  const handleEdit = (taxReturn: TaxReturnDTO) => {
    setEditingTaxReturn(taxReturn);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setTaxReturnIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (taxReturnIdToDelete !== null) {
      try {
        await deleteTaxReturn(taxReturnIdToDelete);
        setTaxReturns((prev) =>
          prev.filter((tr) => tr.id !== taxReturnIdToDelete)
        );
        setTotalElements((prev) => prev - 1);
      } catch (err) {
        console.error("Failed to delete tax return:", err);
      } finally {
        setOpenDeleteDialog(false);
        setTaxReturnIdToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setTaxReturnIdToDelete(null);
  };

  const handleCancelForm = () => {
    setEditingTaxReturn(undefined);
    setShowForm(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortBy(field);
    setSortDir(direction);
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const taxReturnResponse = await getTaxReturns(
        page,
        rowsPerPage,
        sortBy,
        sortDir
      );
      setTaxReturns(taxReturnResponse.content ?? []);
      setTotalElements(taxReturnResponse.totalElements ?? 0);
    } catch (err) {
      console.error("Failed to refetch tax returns:", err);
      setTaxReturns([]);
      setTotalElements(0);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1>CPA Dashboard</h1>
      <Button
        variant="contained"
        onClick={() => setShowForm(true)}
        sx={{ mb: 2 }}
      >
        Create New Tax Return
      </Button>
      {showForm && (
        <TaxReturnForm
          taxReturn={editingTaxReturn}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TaxReturnList
            key={taxReturns.length} // Force re-render when length changes
            taxReturns={taxReturns}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        </>
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this tax return? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CpaDashboard;
