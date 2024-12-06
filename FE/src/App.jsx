import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import SalesDashboard from "./pages/AdminSales/SalesDashboard.jsx";
import GudangDashboard from "./pages/AdminGudang/GudangDashboard.jsx";
import CustomerPage from "./pages/AdminSales/CustomerPage.jsx";
import ShippingPage from "./pages/AdminGudang/ShippingPage.jsx";
import DataBaseInven from "./pages/SuperAdmin/Dashboard.jsx";
import DataBaseSales from "./pages/SuperAdmin/DataBaseSales.jsx";
import PerformancePage from "./pages/SuperAdmin/PerformancePage.jsx";
import CustDataPage from "./pages/SuperAdmin/DataBaseCust.jsx";
import AdminPage from "./pages/SuperAdmin/AdminPage.jsx";
import TamplatePage from "./pages/SuperAdmin/TamplatePage.jsx";

import ProtectedRoute from "./componens/ProtectedRoute.jsx"; // Import ProtectedRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Routes untuk Superadmin */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <PerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/database-inventoris"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <DataBaseInven />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/database-sales"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <DataBaseSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/database-customer"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <CustDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/admin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/template"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <TamplatePage />
            </ProtectedRoute>
          }
        />

        {/* Routes untuk Admin Gudang */}
        <Route
          path="/admin-gudang"
          element={
            <ProtectedRoute allowedRoles={['gudang']}>
              <GudangDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-gudang/shipping"
          element={
            <ProtectedRoute allowedRoles={['gudang']}>
              <ShippingPage />
            </ProtectedRoute>
          }
        />

        {/* Routes untuk Admin Sales */}
        <Route
          path="/admin-sales"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <SalesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-sales/customerlist"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <CustomerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
