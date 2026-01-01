import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NearMeIcon from "@mui/icons-material/NearMe";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useState } from "react";

import RouteMap from "@/components/maps/RouteMap";

const DEFAULT_PICKUP = "Cape Town Station";
const DEFAULT_DROPOFF = "57 Halt Road, Riverton, Cape Town";

const BookingSection = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(DEFAULT_PICKUP);

  return (
    <Box
      sx={{
        bgcolor: "#142C54",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 4,
          border: "2px solid #fff",
          overflow: "hidden",
          bgcolor: "transparent",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          minHeight={{ md: 460 }}
        >
          {/* LEFT — FORM */}
          <Box
            sx={{
              flexBasis: { md: "35%" },
              p: { xs: 3, md: 4 },
              color: "#fff",
            }}
          >
            <Stack spacing={3}>
              {/* TITLE */}
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                }}
              >
                Find Your Ride
              </Typography>

              {/* PICKUP */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Pick Up Address
                </Typography>

                <TextField
                  fullWidth
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Your place"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <NearMeIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 1.5,
                  }}
                />
              </Box>

              {/* DROPOFF */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Drop Off Address
                </Typography>

                <TextField
                  fullWidth
                  disabled
                  value={DEFAULT_DROPOFF}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 1.5,
                  }}
                />
              </Box>

              {/* PASSENGERS */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Passengers
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Bring someone with you"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PeopleAltIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 1.5,
                  }}
                />
              </Box>

              {/* BUTTON */}
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  mt: 2,
                  bgcolor: "#FF9900",
                  color: "#fff",
                  borderRadius: "999px",
                  py: 1.2,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#e68a00",
                  },
                }}
              >
                Book now
              </Button>
            </Stack>
          </Box>

          {/* RIGHT — MAP */}
          <Box
            sx={{
              flexBasis: { md: "65%" },

              
              height: { xs: 320, md: "auto" },
              minHeight: { md: 460 },

              overflow: "hidden",

              // Radius logic
              borderTopRightRadius: { md: 16 },
              borderBottomRightRadius: { md: 16 },

              borderBottomLeftRadius: { xs: 16 },
              
            }}
          >
            <RouteMap
              origin={pickup}
              destination={DEFAULT_DROPOFF}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BookingSection;
