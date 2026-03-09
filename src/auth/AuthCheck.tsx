import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
// checking if user is authenticated (has token) before allowing access to protected routes (admin, driver dashboard, member home)