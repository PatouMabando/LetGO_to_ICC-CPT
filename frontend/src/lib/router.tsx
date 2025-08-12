import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes";
import Login from "@/pages/LoginPage";
import { ErrorPage } from "@/components/ErrorPages";
import Register from "@/pages/Register";
import { AuthCheck } from "@/components/AuthCheck";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/DashboardPage";
import Admin from "@/pages/AdminPage";
import Driver from "@/pages/DriversPage";
import Members from "@/pages/MembersPage";
import Bookings from "@/pages/BookingsPage";
// import Settings from "@/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },

  // Public routes
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

  // Protected routes
  {
    path: ROUTES.ROOT,
    element: (
      <AuthCheck>
        <Layout>
          <Outlet />
        </Layout>
      </AuthCheck>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.ADMIN,
        element: <Admin />,
      },
      {
        path: ROUTES.DRIVERS,
        element: <Driver />,
      },
      {
        path: ROUTES.MEMBERS,
        element: <Members />,
      },
      {
        path: ROUTES.BOOKINGS,
        element: <Bookings />,
      },
      //   {
      //     path: ROUTES.SETTINGS,
      //     element: <Settings />,
      //   },
    ],
  },
]);
