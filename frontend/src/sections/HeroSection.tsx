import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/heroImage.svg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 7, md: 12 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        spacing={{ xs: 3, md: 2 }} // ✅ reduced gap
      >
        {/* LEFT — 40% */}
        <Box sx={{ flexBasis: { md: "40%" } }}>
          <Stack spacing={3}>
            <Typography
              sx={{
                fontFamily: "Russo One",
                fontSize: { xs: "2.6rem", md: "3.6rem" },
                lineHeight: 1.15,
                color: "#142C54",
              }}
            >
              Book{" "}
              <Box component="span" sx={{ color: "#FF9900" }}>
                Rides
              </Box>
              <br />
              For{" "}
              <Box component="span" sx={{ color: "#FF9900" }}>
                Sundays
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#475569",
                fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: 460,
              }}
            >
              The solution of not being late to church
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "#FF9900",
                  borderRadius: "999px",
                  px: 4.5,
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e68a00" },
                }}
              >
                Book Now
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: "999px",
                  px: 4.5,
                  py: 1.2,
                  borderColor: "#CBD5E1",
                  color: "#142C54",
                }}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* RIGHT — 60% */}
        <Box sx={{ flexBasis: { md: "60%" }, textAlign: "center" }}>
          <Box
            component="img"
            src={heroImage}
            alt="Hero Illustration"
            sx={{
              width: "100%",
              maxWidth: 640,
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default HeroSection;
