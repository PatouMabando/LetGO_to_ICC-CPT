import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

type Role = "admin" | "driver" | "member";

export function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { token, role } = useAuth();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but role not ready yet (page refresh)
  if (!role) {
    return null; // or loading spinner
  }

  // Logged in but role not allowed
  if (!allow.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  // Allowed
  return <>{children}</>;
}
