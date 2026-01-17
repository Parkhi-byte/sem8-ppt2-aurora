import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

const MasterRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!user || user.role !== 'master') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default MasterRoute;
