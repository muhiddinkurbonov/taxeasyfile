import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CpaDashboard from "./pages/CpaDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import ClientsPage from "./pages/ClientsPage";

const ProtectedRoute: React.FC<{
  roleRequired: string;
  children: any;
}> = ({ roleRequired, children }) => {
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (role !== roleRequired) {
    return <Navigate to="/cpa/dashboard" replace />; 
  }
  return children;
};

const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cpa/dashboard" element={<CpaDashboard />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
