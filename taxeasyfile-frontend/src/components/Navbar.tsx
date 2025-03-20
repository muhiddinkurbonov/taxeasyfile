import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };


  const handleDashboard = () => {
    if (role === "CPA") {
      navigate("/cpa/dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };


  const handleClients = () => {
    navigate("/clients");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TaxEasyFile
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleDashboard}>
                Dashboard
              </Button>
              {role === "ADMIN" && (
                <>
                  <Button color="inherit" onClick={handleClients}>
                    Clients
                  </Button>
                </>
              )}
              {role === "CPA" && (
                <Button color="inherit" onClick={handleClients}>
                  Clients
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : ""}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
