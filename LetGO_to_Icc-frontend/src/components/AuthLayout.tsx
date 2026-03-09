import { Box } from "@mui/material";

type AuthLayoutProps = {
  image: React.ReactNode;
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ image, children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* LEFT – Illustration (80%) */}
      <Box
        sx={{
          flex: 8,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ffffff",
        }}
      >
        {image}
      </Box>

      {/* RIGHT – Form (20%) */}
      <Box
        sx={{
          flex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;