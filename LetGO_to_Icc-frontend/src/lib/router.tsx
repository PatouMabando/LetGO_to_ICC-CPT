import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";

import Login from "@/pages/LoginPage";
import Register from "@/pages/Register";
import Driver from "@/pages/driver/DriversPage";
import Members from "@/pages/member/MembersPage";
import Bookings from "@/pages/BookingsPage";
import VerifyOtp from "@/pages/VerifyOtpPage";
import HomePage from "@/pages/HomePage";

import { Layout } from "@/components/Layout";
import { ErrorPage } from "@/components/ErrorPages";
import { AuthCheck } from "@/auth/AuthCheck";
import { RequireRole } from "@/auth/RequireRole";

// ✅ NEW ADMIN UI
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import AdminMembersPage from "@/pages/admin/MembersPage";
import AdminDriversPage from "@/pages/admin/DriversPage";
import AdminAdminsPage from "@/pages/admin/AdminPage";

export const router = createBrowserRouter([
  // ROOT
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },

  // PUBLIC
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

  // ✅ ADMIN PROTECTED (NO <Layout /> HERE)
  {
    element: (
      <AuthCheck>
        <Outlet />
      </AuthCheck>
    ),
    children: [
      {
        path: ROUTES.ADMIN_ROOT, // "/admin"
        element: (
          <RequireRole allow={["admin"]}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", element: <AdminHome /> },
          { path: "members", element: <AdminMembersPage /> },
          { path: "drivers", element: <AdminDriversPage /> },
{ path: "admins", element: <AdminAdminsPage /> },
          // later:
          // { path: "drivers", element: <AdminDriversPage /> },
          // { path: "admins", element: <AdminAdminsPage /> },
        ],
      },
    ],
  },

  // ✅ OTHER PROTECTED ROUTES (WITH OLD <Layout />)
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