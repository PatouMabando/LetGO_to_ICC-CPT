
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";

import Login from "@/pages/LoginPage";
import Register from "@/pages/Register";
import Admin from "@/pages/AdminPage";
import Driver from "@/pages/driver/DriversPage";
import Members from "@/pages/member/MembersPage";
import Bookings from "@/pages/BookingsPage";

import { Layout } from "@/components/Layout";
import { ErrorPage } from "@/components/ErrorPages";
import { AuthCheck } from "@/auth/AuthCheck";
import { RequireRole } from "@/auth/RequireRole";

export const router = createBrowserRouter([
  // Redirect root
  {
    path: "/",
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },

  // Public
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
    errorElement: <ErrorPage />,
  },

  {
    element: (
      <AuthCheck>
        <Layout>
          <Outlet />
        </Layout>
      </AuthCheck>
    ),
    children: [
      // MEMBER
      {
        path: ROUTES.MEMBER_ROOT,
        element: (
          <RequireRole allow={["member"]}>
            <Members />
          </RequireRole>
        ),
      },

      // DRIVER
      {
        path: ROUTES.DRIVER_ROOT,
        element: (
          <RequireRole allow={["driver"]}>
            <Driver />
          </RequireRole>
        ),
      },

      // ADMIN
      {
        path: ROUTES.ADMIN_ROOT,
        element: (
          <RequireRole allow={["admin"]}>
            <Admin />
          </RequireRole>
        ),
      },

      // BOOKINGS (admin + member)
      {
        path: ROUTES.BOOKINGS,
        element: (
          <RequireRole allow={["admin", "member"]}>
            <Bookings />
          </RequireRole>
        ),
      },
    ],
  },
]);
