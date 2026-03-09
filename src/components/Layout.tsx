import { CssBaseline, GlobalStyles } from "@mui/joy";
import { Box } from "@mui/joy";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: "var(--joy-palette-background-body)",
          },
        }}
      />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {user && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <LogoutButton />
          </Box>
        )}
        {children}
      </Box>
    </>
  );
};
