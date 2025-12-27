import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
