import { Box, Stack } from "@mui/material";

type Props = {
  image: React.ReactNode;
  children: React.ReactNode;
};

const RegisterLayout = ({ image, children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 88px)", // header height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 6 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 6, md: 10 }}
        alignItems="center"
        width="100%"
        maxWidth={1200}
      >
        {/* LEFT IMAGE */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ maxWidth: 420, width: "100%" }}>
            {image}
          </Box>
        </Box>

        {/* RIGHT FORM */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start", // 🔥 clé pour éviter le push
          }}
        >
          {children}
        </Box>
      </Stack>
    </Box>
  );
};

export default RegisterLayout;
