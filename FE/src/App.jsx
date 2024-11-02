import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.jsx"; // Perbaiki path
import Login from "./pages/LoginPage/Login.jsx"; // Perbaiki path
import SalesDashboard from "./pages/AdminSales/SalesDashboard.jsx"; // Perbaiki path
import GudangDashboard from "./pages/AdminGudang/GudangDashboard.jsx"; // Perbaiki path
import CustomerPage from "./pages/AdminSales/CustomerPage.jsx";
import ShippingPage from "./pages/AdminGudang/ShippingPage.jsx";
import DataBaseInven from "./pages/SuperAdmin/Dashboard.jsx";
import DataBaseSales from "./pages/SuperAdmin/DataBaseSales.jsx";
import PerformancePage from "./pages/SuperAdmin/PerformancePage.jsx";
import CustDataPage from "./pages/SuperAdmin/DataBaseCust.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-sales" element={<SalesDashboard />} />
        <Route path="/admin-sales/customerlist" element={<CustomerPage/>}/>
        <Route path="/admin-gudang" element={<GudangDashboard />} />
        <Route path="/admin-gudang/shipping" element={<ShippingPage />} />
        <Route path="/super-admin" element={<PerformancePage />} />
        <Route path="/super-admin/database-inventoris" element={<DataBaseInven />} />
        <Route path="/super-admin/database-sales" element={<DataBaseSales />} />
        <Route path="/super-admin/database-customer" element={<CustDataPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;