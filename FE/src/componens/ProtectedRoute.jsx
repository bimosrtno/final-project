import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../utils/AuthService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    try {
        const role = getRole();
        if (allowedRoles.includes(role)) {
            return children;
        }
        return <Navigate to="/login" replace />;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
