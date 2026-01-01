
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";

import Login from "@/pages/LoginPage";
import Register from "@/pages/Register";
import Admin from "@/pages/AdminPage";
import Driver from "@/pages/driver/DriversPage";
import Members from "@/pages/member/MembersPage";
import Bookings from "@/pages/BookingsPage";
import VerifyOtp from "@/pages/VerifyOtpPage";
import HomePage from "@/pages/HomePage";



import { Layout } from "@/components/Layout";
import { ErrorPage } from "@/components/ErrorPages";
import { AuthCheck } from "@/auth/AuthCheck";
import { RequireRole } from "@/auth/RequireRole";

export const router = createBrowserRouter([
  // Redirect root
  {
  path: "/",
  element: <HomePage />,
  errorElement: <ErrorPage />,
},

  // PUBLIC ROUTES
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.VERIFY_OTP,
    element: <VerifyOtp />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  

  // PROTECTED ROUTES
  {
    element: (
      <AuthCheck>
        <Layout>
          <Outlet />
        </Layout>
      </AuthCheck>
    ),
    children: [
      {
        path: ROUTES.MEMBER_ROOT,
        element: (
          <RequireRole allow={["member"]}>
            <Members />
          </RequireRole>
        ),
      },
      {
        path: ROUTES.DRIVER_ROOT,
        element: (
          <RequireRole allow={["driver"]}>
            <Driver />
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_ROOT,
        element: (
          <RequireRole allow={["admin"]}>
            <Admin />
          </RequireRole>
        ),
      },
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