import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/utils";
import { jwtDecode } from "jwt-decode";
import { login } from "../api/auth";

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login({ username, password });
      onLogin(token);
    } catch (err) {
      setError("Username or password is incorrect.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: "#fff",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            CPA Login
          </Typography>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (token: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    const decoded = jwtDecode<{ sub: string; cpaId: number }>(token);
    localStorage.setItem("cpaId", decoded.cpaId.toString());
    navigate("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
