
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Role = "admin" | "driver" | "member";

const ProtectedRoute: React.FC<React.PropsWithChildren<{ roles?: Role[] }>> = ({
  children,
  roles,
}) => {
  const { token, role } = useAuth(); 

  // Not logged in? -> go to login
  if (!token) return <Navigate to="/login" replace />;

  // Logged in but role not allowed? -> go to dashboard
  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
