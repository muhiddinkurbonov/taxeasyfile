import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth"; // Import logout function from your auth API

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set to true if token exists
  }, [location]); // Re-run when route changes

  const handleLogout = () => {
    logout(); // Call your logout function to clear localStorage
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  const handleLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  const handleDashboard = () => {
    navigate("/dashboard"); // Redirect to dashboard
  };

  const handleClients = () => {
    navigate("/clients"); // Redirect to client management
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CPA Management System
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleDashboard}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleClients}>
                Clients
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
