import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '../lib/routes';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  // const { isAuthenticated } = useAuth();
  const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  // }

  return <>{children}</>;
}