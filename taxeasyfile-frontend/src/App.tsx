import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ClientManagement from "./pages/ClientManagement";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
      </Routes>
    </Router>
  );
};

export default App;
