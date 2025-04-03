import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  getUsers,
  getCpaStats,
  updateUserRole,
  toggleUserStatus,
  resetUserPassword,
} from "../api/admin";

import {  User,
  CpaStats} from '../api/types';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<CpaStats | null>(null);
  const [roleFilter, setRoleFilter] = useState<"CPA" | "ADMIN" | "">("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">(
    ""
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userFilters = {
        role: roleFilter || undefined,
        active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : undefined,
      };
      const [usersData, statsData] = await Promise.all([
        getUsers(userFilters),
        getCpaStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleRoleChange = async (id: number, newRole: "CPA" | "ADMIN") => {
    await updateUserRole(id, newRole);
    fetchData(); 
  };

  const handleStatusToggle = async (id: number) => {
    await toggleUserStatus(id);
    fetchData();
  };

  const handleResetPassword = async (id: number) => {
    await resetUserPassword(id);
    alert("Password reset to default123"); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total CPAs</Typography>
            <Typography variant="h4">{stats?.totalCpas || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Clients</Typography>
            <Typography variant="h4">{stats?.totalClients || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Avg Clients/CPA</Typography>
            <Typography variant="h4">
              {stats?.avgClientsPerCpa.toFixed(1) || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Tax Returns (This Month)</Typography>
            <Typography variant="h4">
              {stats?.taxReturnsThisMonth || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Tax Returns (This Year)</Typography>
            <Typography variant="h4">
              {stats?.taxReturnsThisYear || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Tax Returns</Typography>
            <Typography variant="h4">
              {stats?.totalTaxReturns || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          User List
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "" | "CPA" | "ADMIN")
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="CPA">CPA</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "" | "active" | "inactive")
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as "CPA" | "ADMIN"
                      )
                    }
                    size="small"
                  >
                    <MenuItem value="CPA">CPA</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(user.registrationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleStatusToggle(user.id)}
                    sx={{ mr: 1 }}
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleResetPassword(user.id)}
                  >
                    Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
