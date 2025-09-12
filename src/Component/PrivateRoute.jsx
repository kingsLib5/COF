// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if token exists
  const auth = localStorage.getItem('cof_auth');
  if (!auth) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
};

export default PrivateRoute;
