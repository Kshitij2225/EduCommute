import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Redirect to "not authorized" page if role is not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // If authenticated and role is allowed, render the child component
  return children;
};

export default ProtectedRoute;
