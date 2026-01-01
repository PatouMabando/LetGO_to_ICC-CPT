import { Box, Stack, Typography, Link, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

// SVG imports (les tiens depuis Figma)
import iccLogo from "@/assets/icc-footer-logo.svg";
import arrowUp from "@/assets/arrow-up.svg";
import clockIcon from "@/assets/clock-footer.svg";
import phoneIcon from "@/assets/phone.svg";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        bgcolor: "#142C54",
        color: "#fff",
        pt: { xs: 6, md: 8 },
        pb: 4,
        px: { xs: 2, md: 6 },
        position: "relative",
      }}
    >
      {/* TOP CONTENT */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 5, md: 8 }}
        maxWidth={1200}
        mx="auto"
        alignItems={{ xs: "center", md: "flex-start" }}
        textAlign={{ xs: "center", md: "left" }}
      >
        {/* BRAND */}
        <Box flex={1}>
          <Stack spacing={2} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              Let’s Go To ICC
            </Typography>

            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "0.95rem",
                opacity: 0.85,
                maxWidth: 260,
              }}
            >
              The solution of not being late
            </Typography>

            <Box
              component="img"
              src={iccLogo}
              alt="ICC Logo"
              sx={{ width: 70, mt: 1 }}
            />
          </Stack>
        </Box>

        {/* PAGES */}
        <Box flex={1}>
          <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
            >
              Pages
            </Typography>

            <Link
              component="button"
              onClick={() => navigate("/")}
              underline="none"
              sx={{ color: "#fff", opacity: 0.85 }}
            >
              Book now
            </Link>

            <Link
              component="button"
              onClick={() => navigate("/contact")}
              underline="none"
              sx={{ color: "#fff", opacity: 0.85 }}
            >
              Contact
            </Link>
          </Stack>
        </Box>

        {/* QUICK LINKS */}
        <Box flex={1}>
          <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
            >
              Quick Links
            </Typography>

            <Link
              component="button"
              onClick={() => navigate("/login")}
              underline="none"
              sx={{ color: "#fff", opacity: 0.85 }}
            >
              Login
            </Link>
          </Stack>
        </Box>

        {/* WORK DAYS */}
        <Box flex={1}>
          <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
              }}
            >
              Work Days
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box component="img" src={clockIcon} width={18} />
              <Typography sx={{ opacity: 0.85 }}>Sundays</Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box component="img" src={phoneIcon} width={18} />
              <Link
                href="tel:+27780492663"
                underline="none"
                sx={{ color: "#fff", opacity: 0.85 }}
              >
                +27 780 49 2663
              </Link>
            </Stack>

            <Typography
              sx={{
                fontSize: "0.85rem",
                opacity: 0.7,
                maxWidth: 260,
                mt: 1,
              }}
            >
              Our Support is available 24/7 to answer your queries
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* BACK TO TOP */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: 16, md: 32 },
          top: { xs: 16, md: 40 },
          cursor: "pointer",
        }}
        onClick={scrollToTop}
      >
        <Box
          component="img"
          src={arrowUp}
          alt="Back to top"
          sx={{
            width: 48,
            filter: "brightness(0) invert(1)", // 👈 flèche blanche
          }}
        />
      </Box>

      {/* DIVIDER */}
      <Divider
        sx={{
          my: 4,
          maxWidth: 500,
          mx: "auto",
          bgcolor: "rgba(255,255,255,0.3)",
        }}
      />

      {/* TERMS */}
      <Stack spacing={2} alignItems="center">
        <Link
          component="button"
          onClick={() => navigate("/terms")}
          underline="none"
          sx={{ color: "#fff", opacity: 0.8 }}
        >
          Terms of Use
        </Link>

        <Link
          component="button"
          onClick={() => navigate("/privacy")}
          underline="none"
          sx={{ color: "#fff", opacity: 0.8 }}
        >
          Privacy Policy
        </Link>
      </Stack>

      <Divider
        sx={{
          my: 3,
          maxWidth: 300,
          mx: "auto",
          bgcolor: "rgba(255,255,255,0.3)",
        }}
      />

      {/* COPYRIGHT */}
      <Typography
        align="center"
        sx={{
          fontSize: "0.8rem",
          opacity: 0.6,
        }}
      >
        Copyright © {new Date().getFullYear()} Let’s go to ICC
      </Typography>
    </Box>
  );
};

export default Footer;
