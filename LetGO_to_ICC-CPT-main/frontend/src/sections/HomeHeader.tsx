import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/ICC LOGO (1).svg";

const HomeHeader = () => {
  const navigate = useNavigate();

  return (
   <Box
  sx={{
    px: { xs: 2, md: 6 },
    py: 2,
    borderBottom: "1px solid #E5E7EB",
  }}
>
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"   
    spacing={1.5}
    sx={{ cursor: "pointer" }}
    onClick={() => navigate("/")}
  >
    <Box
      component="img"
      src={logo}
      alt="ICC Logo"
      sx={{ height: 36 }}
    />

    <Typography
      fontFamily="Russo One"
      fontWeight={600}
      sx={{ color: "#142C54" }}
    >
      Let’s Go To ICC CPT
    </Typography>
  </Stack>
</Box>
  );
};

export default HomeHeader;
