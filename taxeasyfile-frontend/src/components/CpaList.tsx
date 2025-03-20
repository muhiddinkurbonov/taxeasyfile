import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getCpas } from "../api/users";

interface UserDTO {
  id: number;
  username: string;
  role: "CPA" | "ADMIN";
}

const CpaList: React.FC = () => {
  const [cpas, setCpas] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCpas = async () => {
      setLoading(true);
      try {
        const cpaData = await getCpas();
        if (isMounted) {
          setCpas(cpaData ?? []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch CPAs:", err);
        if (isMounted) {
          setError("Unable to load CPA list. Please try again later.");
          setCpas([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCpas();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        CPA List
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cpas.length > 0 ? (
              cpas.map((cpa) => (
                <TableRow key={cpa.id}>
                  <TableCell>{cpa.id}</TableCell>
                  <TableCell>{cpa.username}</TableCell>
                  <TableCell>{cpa.role}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No CPAs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default CpaList;