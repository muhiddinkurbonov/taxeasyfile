import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { TaxReturnDTO, CategoryDTO } from "../api/types";

interface TaxReturnListProps {
  taxReturns: TaxReturnDTO[];
  categories: CategoryDTO[];
  onEdit: (taxReturn: TaxReturnDTO) => void;
  onDelete: (id: number) => void;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onSortChange: (field: string, direction: "asc" | "desc") => void;
  sortBy: string;
  sortDir: "asc" | "desc";
}

const TaxReturnList: React.FC<TaxReturnListProps> = ({
  taxReturns = [],
  categories,
  onEdit,
  onDelete,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  sortBy,
  sortDir,
}) => {

  const getCategoryName = (categoryId?: number): string => {
    if (!categoryId) return "N/A";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortDir === "asc";
    onSortChange(field, isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <h2>Your Tax Returns</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortBy === "id"}
                direction={sortBy === "id" ? sortDir : "asc"}
                onClick={() => handleSort("id")}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "clientId"}
                direction={sortBy === "clientId" ? sortDir : "asc"}
                onClick={() => handleSort("clientId")}
              >
                Client ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "taxYear"}
                direction={sortBy === "taxYear" ? sortDir : "asc"}
                onClick={() => handleSort("taxYear")}
              >
                Tax Year
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "taxReturnStatus"}
                direction={sortBy === "taxReturnStatus" ? sortDir : "asc"}
                onClick={() => handleSort("taxReturnStatus")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "filingDate"}
                direction={sortBy === "filingDate" ? sortDir : "asc"}
                onClick={() => handleSort("filingDate")}
              >
                Filing Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "totalIncome"}
                direction={sortBy === "totalIncome" ? sortDir : "asc"}
                onClick={() => handleSort("totalIncome")}
              >
                Total Income
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "categoryId"}
                direction={sortBy === "categoryId" ? sortDir : "asc"}
                onClick={() => handleSort("categoryId")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "fileAttachment"}
                direction={sortBy === "fileAttachment" ? sortDir : "asc"}
                onClick={() => handleSort("fileAttachment")}
              >
                Attachment
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taxReturns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No tax returns available
              </TableCell>
            </TableRow>
          ) : (
            taxReturns.map((tr) => (
              <TableRow key={tr.id}>
                <TableCell>{tr.id}</TableCell>
                <TableCell>{tr.clientId}</TableCell>
                <TableCell>{tr.taxYear}</TableCell>
                <TableCell>{tr.taxReturnStatus}</TableCell>
                <TableCell>{tr.filingDate}</TableCell>
                <TableCell>{tr.totalIncome?.toLocaleString()}</TableCell>
                <TableCell>{getCategoryName(tr.categoryId)}</TableCell>
                <TableCell>{tr.fileAttachment}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(tr)} color="primary">
                    Edit
                  </Button>
                  <Button onClick={() => onDelete(tr.id!)} color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TaxReturnList;
