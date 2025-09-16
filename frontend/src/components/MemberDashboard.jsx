// src/components/MemberDashboard.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Rating,
  CircularProgress,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Timer,
  Phone,
  CheckCircle,
  DirectionsCar,
  CalendarToday,
  History,
  ManageAccounts,
} from "@mui/icons-material";
import EventIcon from "@mui/icons-material/Event";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import RoomIcon from "@mui/icons-material/Room";
import ChurchIcon from "@mui/icons-material/Church";
import MiniRouteCard from "@/components/MiniRouteCard";
import MapComponent from "@/components/MapComponent";
import { getNextSundayBooking, createNextSundayBooking } from "@/lib/api";

// English date formatter
function formatENG(isoOrDate) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// map booking status -> MUI Chip color
function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "success";
    case "on-the-way":
    case "accepted":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
}

export default function MemberDashboard({
  memberId,
  defaultPickupAddress = "needs to get from db",
  data: dataProp = {
    stats: {
      totalMembers: 245,
      activeMembers: 189,
      totalDrivers: 18,
      availableDrivers: 12,
      totalBookings: 567,
      activeBookings: 23,
    },
    recentBookings: [
      {
        id: "TRP001",
        memberName: "Mehdi kiona",
        memberContact: "+27 21 234 5678",
        driverName: "Alexandre",
        driverContact: "+27 21 567 8901",
        pickupAddress: "789 Pine Rd, Claremont",
        destination: "ICC Church, 56 Halt Road, Riverton, Cape Town, 7490",
        status: "completed",
        date: new Date().toISOString(),
        rating: 5,
      },
      {
        id: "TRP002",
        memberName: "Mehdi kiona",
        memberContact: "+27 21 234 5678",
        driverName: "Alexandre",
        driverContact: "+27 21 567 8901",
        pickupAddress: "789 Pine Rd, Claremont",
        destination: "ICC Church, 56 Halt Road, Riverton, Cape Town, 7490",
        status: "cancelled",
        date: new Date().toISOString(),
        rating: 4,
      },
      {
        id: "TRP003",
        memberName: "Mehdi kiona",
        memberContact: "+27 21 234 5678",
        driverName: "Alexandre",
        driverContact: "+27 21 567 8901",
        pickupAddress: "789 Pine Rd, Claremont",
        destination: "ICC Church, 56 Halt Road, Riverton, Cape Town, 7490",
        status: "completed",
        date: new Date().toISOString(),
        rating: 5,
      },
    ],
    drivers: [],
    memberName: "Member",
  },
  theme,
}) {
  // Next Sunday booking (from backend)
  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const b = await getNextSundayBooking(memberId);
        setBooking(b);
      } finally {
        setLoadingBooking(false);
      }
    })();
  }, [memberId]);

  const nextSundayLabel = useMemo(() => {
    if (booking?.serviceDate) return formatENG(booking.serviceDate);
    const d = new Date();
    const day = d.getDay(); // 0 = Sunday
    const diff = (7 - day) % 7 || 7; // strictly next Sunday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return formatENG(d);
  }, [booking?.serviceDate]);

  async function handleBookNow() {
    try {
      const b = await createNextSundayBooking({
        memberId,
        selectedTime: "08:30", // will add a TimePicker later
        pickupAddress: booking?.pickupAddress || defaultPickupAddress,
      });
      setBooking(b);
      setToast("Booking created ✅");
    } catch (e) {
      setToast(e?.message || "Error while creating the booking");
    }
  }

  const { currentBooking, recentBookings, memberName } = dataProp;

  return (
    <Box>
      {/* --- Next Sunday block --- */}
      {loadingBooking ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 160,
            mb: 3,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ md: "center" }}
            gap={2}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Hi, {memberName || "Member"},
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready for your next trip?
              </Typography>
            </Box>
            <Chip
              icon={<EventIcon />}
              color="primary"
              label={`Next Sunday — ${nextSundayLabel}`}
            />
          </Stack>

          {/* One horizontal card: From | road | To */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="stretch" sx={{ mt: 0 }}>
              {/* LEFT: From */}
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                    <RoomIcon />
                    <Typography variant="subtitle2" fontWeight="bold">
                      From
                    </Typography>
                  </Stack>
                  <Typography variant="body1">
                    {booking?.pickupAddress || defaultPickupAddress || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    (We’ll link this to the User’s address later)
                  </Typography>
                </Paper>
              </Grid>

              {/* MIDDLE: Road with trees + arrow */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: { xs: 140, md: "100%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 1,
                  }}
                >
                  <Box sx={{ width: "100%", maxWidth: 380 }}>
                    <svg viewBox="0 0 380 120" width="100%" height="100%" aria-label="Road to ICC">
                      <rect x="0" y="0" width="380" height="120" fill="transparent" rx="12" />
                      <g opacity="0.9">
                        <circle cx="40" cy="28" r="7" fill="#4caf50" />
                        <circle cx="70" cy="18" r="5" fill="#66bb6a" />
                        <circle cx="105" cy="30" r="6" fill="#43a047" />
                        <circle cx="300" cy="24" r="7" fill="#4caf50" />
                        <circle cx="330" cy="16" r="5" fill="#66bb6a" />
                        <circle cx="275" cy="34" r="6" fill="#43a047" />
                      </g>
                      <rect x="20" y="50" width="340" height="20" rx="10" fill="#616161" />
                      <line
                        x1="30"
                        y1="60"
                        x2="350"
                        y2="60"
                        stroke="#fafafa"
                        strokeWidth="3"
                        strokeDasharray="12 10"
                        strokeLinecap="round"
                      >
                        <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="2s" repeatCount="indefinite" />
                      </line>
                      <g transform="translate(340, 60)">
                        <line x1="-22" y1="0" x2="0" y2="0" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                        <polyline
                          points="0,0 -10,-8 -10,8"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </Box>
                </Box>
              </Grid>

              {/* RIGHT: To (ICC) */}
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                    <Box
                      component="img"
                      src="/ICC.png" 
                      alt="ICC"
                      sx={{ width: 28, height: 28, borderRadius: "50%" }}
                    />
                    <Typography variant="subtitle2" fontWeight="bold">
                      To
                    </Typography>
                  </Stack>
                  <Typography variant="body1">ICC Cape Town</Typography>
                  <Typography variant="body2" color="text.secondary">
                    56 Halt Road, Riverton, Cape Town, 7490
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

           <Box sx={{ mb: 3 }}>
            <MiniRouteCard youLabel="" destinationLabel="ICC" accentColor="#e53935" lineColor="#1976d2" />
          </Box> 

          {/* Your booking */}   {/* to be added fethching from db if statement to be added */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Next sunday booking
            </Typography>

            {booking ? (
              <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ sm: "center" }}>
                <Chip icon={<EventIcon />} label={formatENG(booking.serviceDate)} />
                <Chip icon={<WatchLaterIcon />} label={`Time ${booking.selectedTime || "-"}`} />
                <Chip icon={<DirectionsCar />} label={`Vehicle -`} />
              </Stack>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Typography variant="body1" color="text.secondary">
                  No booking for Sunday
                </Typography>
                <Button variant="contained" startIcon={<DirectionsCar />} onClick={handleBookNow}>
                  Book now for next Sunday
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      )}

      {/* --- Current booking --- if driver trigger the button on his driver dashboard */ }
      {currentBooking ? (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme?.palette?.primary?.main || "primary.main",
            color: "white",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Current Trip
            </Typography>
            <Box display="flex" alignItems="center">
              <Timer sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                {currentBooking.estimatedArrival}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Paper sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 2 }}>
                  <Typography variant="subtitle1" mb={1} fontWeight="bold">
                    Driver Details
                  </Typography>
                  <Typography fontWeight="medium">{currentBooking.driverName}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {currentBooking.vehicleNumber}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Phone fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{currentBooking.driverContact}</Typography>
                  </Box>
                </Paper>

                <Paper sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 2 }}>
                  <Typography variant="subtitle1" mb={1} fontWeight="bold">
                    booking Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>From:</strong> {currentBooking.pickupAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>To:</strong> {currentBooking.destination}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={currentBooking.status.replace("-", " ").toUpperCase()}
                      color={currentBooking.status === "on-the-way" ? "warning" : "success"}
                      sx={{ color: "white", fontWeight: "bold" }}
                    />
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            {/* to be added fethching from db */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" mb={1} fontWeight="bold">
                Live Tracking
              </Typography>
              <Box sx={{ height: 300, mb: 2 }}>
                <MapComponent role="member" data={dataProp} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <DirectionsCar sx={{ fontSize: 60, color: "text.secondary" }} />
          <Typography variant="h6" mt={2} mb={2} color="text.secondary">
            No Active Trip
          </Typography>
        </Paper>
      )}

      {/* Recent Bookings */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Booking history
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Member</strong></TableCell>
                <TableCell><strong>Driver</strong></TableCell>
                <TableCell><strong>Route</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>              
              </TableRow>
            </TableHead>
            <TableBody>
              {dataProp.recentBookings.map((bk) => (
                <TableRow key={bk.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">#{bk.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">{bk.memberName}</Typography>
                      <Typography variant="body2" color="text.secondary">{bk.memberContact}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {bk.driverName ? (
                      <Box>
                        <Typography variant="body1" fontWeight="medium">{bk.driverName}</Typography>
                        <Typography variant="body2" color="text.secondary">{bk.driverContact}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bk.pickupAddress} → {bk.destination}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bk.status.replace("-", " ").toUpperCase()}
                      color={getStatusColor(bk.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast} />
    </Box>
  );
}

