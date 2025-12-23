
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Role = "admin" | "driver" | "member";

const ProtectedRoute: React.FC<React.PropsWithChildren<{ roles?: Role[] }>> = ({
  children,
  roles,
}) => {
  const { token, role } = useAuth();

  // 1. Not logged in → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but role not yet loaded (page refresh)
  if (!role) {
    return null; // or loading spinner if you want
  }

  // 3. Logged in but role not allowed
  if (roles && !roles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  // 4. Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
