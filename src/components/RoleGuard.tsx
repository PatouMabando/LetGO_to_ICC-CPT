import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";

export function RoleGuard({
  allow,
  children,
}: {
  allow: ("admin" | "driver" | "member")[];
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}
