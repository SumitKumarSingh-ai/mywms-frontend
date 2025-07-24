import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import AdminPage from './pages/AdminPage';
import ProductManagementPage from './pages/ProductManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import LocationManagementPage from './pages/LocationManagementPage';
import CorrectionPage from './pages/CorrectionPage';
import GoodsReceiptPage from './pages/GoodsReceiptPage';
import PickListPage from './pages/PickListPage';
import PickingExecutionPage from './pages/PickingExecutionPage';
import PutawayExecutionPage from './pages/PutawayExecutionPage';
import ReportsPage from './pages/ReportsPage';


const ProtectedRoute = () => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

const AdminRoute = () => {
    const { user } = useAuth();
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverviewPage />} />
                <Route path="goods-receipt" element={<GoodsReceiptPage />} />
                <Route path="goods-receipt/:grnId/putaway" element={<PutawayExecutionPage />} />
                <Route path="picking" element={<PickListPage />} />
                <Route path="picking/:picklistId" element={<PickingExecutionPage />} />
                <Route path="reports" element={<ReportsPage />} />
                
                <Route element={<AdminRoute />}>
                    <Route path="admin" element={<AdminPage />} />
                    <Route path="products" element={<ProductManagementPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="locations" element={<LocationManagementPage />} />
                    <Route path="correction" element={<CorrectionPage />} />
                </Route>
            </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}