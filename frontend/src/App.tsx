import "@fontsource/inter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { AuthProvider } from "@/context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { router } from "@/lib/router";

function App() {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
