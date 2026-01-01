import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// SVG assets
import benefitsIllustration from "@/assets/benefits.svg";
import timeIcon from "@/assets/benefits-card.svg";
import clockIcon from "@/assets/clock.svg";
import calendarIcon from "@/assets/calendar.svg";
import arrowUp from "@/assets/arrow-up.svg";

const BenefitsSection = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
        bgcolor: "#fff",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 6, md: 10 }}
        maxWidth={1200}
        mx="auto"
        alignItems="flex-start"
      >
        {/* LEFT */}
        <Box flex={1}>
          <Stack spacing={3}>
            {/* LEFT TITLE */}
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "#142C54",
              }}
            >
              With few simple clicks
            </Typography>

            {/* CARD */}
            <Box
              component="img"
              src={benefitsIllustration}
              alt="Benefits illustration"
              sx={{
                width: "100%",
                maxWidth: 420,
              }}
            />
          </Stack>
        </Box>

        {/* RIGHT */}
        <Box flex={1} position="relative">
          <Stack spacing={3}>
            {/* RIGHT TITLE — SAME SIZE & ALIGNMENT */}
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "1.6rem", // ✅ same as left
                color: "#142C54",
              }}
            >
              Benefits
            </Typography>

            {/* BENEFITS LIST */}
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box component="img" src={timeIcon} width={22} />
                <Typography sx={{ fontFamily: "Manrope", fontWeight: 600 }}>
                  Don’t spend anymore to hear the voice of God
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box component="img" src={clockIcon} width={22} />
                <Typography sx={{ fontFamily: "Manrope", fontWeight: 600 }}>
                  Be on time in Sunday services
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box component="img" src={calendarIcon} width={22} />
                <Typography sx={{ fontFamily: "Manrope", fontWeight: 600 }}>
                  Get Sunday services reminder
                </Typography>
              </Stack>
            </Stack>

            {/* BUTTON — CENTERED IN COLUMN */}
            <Box display="flex" justifyContent="center">
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  mt: 3,
                  bgcolor: "#FF9900",
                  color: "#fff",
                  px: 5,
                  py: 1.3,
                  borderRadius: "999px",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e68a00" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Stack>

          {/* BACK TO TOP — BIGGER SVG */}
          <Box
            sx={{
              position: "absolute",
              right: -56,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "none", md: "block" },
              cursor: "pointer",
            }}
            onClick={scrollToTop}
          >
            <Box
              component="img"
              src={arrowUp}
              alt="Back to top"
              sx={{ width: 48 }} // ✅ bigger arrow
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default BenefitsSection;
