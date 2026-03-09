
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthGate: React.FC = () => {
  const { token, role } = useAuth();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but role not loaded yet (refresh case)
  if (!role) {
    return null; // or a loading spinner
  }

  // Redirect to role dashboard
  return <Navigate to={`/${role}`} replace />;
};

export default AuthGate;

