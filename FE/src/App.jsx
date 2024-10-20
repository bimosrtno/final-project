import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.jsx"; // Perbaiki path
import Login from "./pages/LoginPage/Login.jsx"; // Perbaiki path
import SalesDashboard from "./pages/AdminSales/SalesDashboard.jsx"; // Perbaiki path
import GudangDashboard from "./pages/AdminGudang/GudangDashboard.jsx"; // Perbaiki path
import Dashboard from "./pages/SuperAdmin/Dashboard.jsx"; // Perbaiki path

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-sales" element={<SalesDashboard />} />
        <Route path="/admin-gudang" element={<GudangDashboard />} />
        <Route path="/super-admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;