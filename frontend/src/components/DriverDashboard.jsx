// src/components/DriverDashboard.jsx
import { useMemo } from "react";
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
} from "@mui/material";
import {
  Phone,
  Navigation,
  CheckCircle,
  AccessTime,
  CalendarToday,
  History,
  DirectionsCar,
} from "@mui/icons-material";
import MapComponent from "@/components/MapComponent";

/**
 * Props:
 * - data: {
 *     status?: "available"|"busy"|"offline",
 *     stats?: { completedToday?: number, earnings?: string|number, rating?: number },
 *     currentTrip?: {
 *       id?: string,
 *       memberName?: string,
 *       memberContact?: string,
 *       pickupAddress?: string,
 *       destination?: string,
 *       pickupTime?: string
 *     },
 *     todaysTrips?: Array<{
 *       id: string,
 *       memberName?: string,
 *       status?: "pending"|"assigned"|"arrived"|"completed",
 *       pickupTime?: string
 *     }>
 *   }
 * - theme?: MUI theme (optional)
 * - onMarkArrived?: (tripId: string) => void
 * - onCompleteTrip?: (tripId: string) => void
 * - onStartNavigation?: (trip: any) => void
 */
export default function DriverDashboard({
  data = {},
  theme,
  onMarkArrived,
  onCompleteTrip,
  onStartNavigation,
}) {
  const {
    status = "available",
    stats = {},
    currentTrip,
    todaysTrips = [],
  } = data;

  const statusColor = useMemo(() => {
    switch (status) {
      case "busy":
        return "warning";
      case "offline":
        return "default";
      default:
        return "success";
    }
  }, [status]);

  return (
    <Box>
      {/* Driver Status Header */}
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
            Driver Status
          </Typography>
          <Chip
            label={(status || "available").toUpperCase()}
            color={statusColor}
            sx={{ color: "white", fontWeight: "bold" }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="white"  fontWeight="bold ">
                {stats.completedToday ?? 0}
              </Typography>
              <Typography variant="body2"  sx={{ opacity: 0.85 ,color: 'white' }}>
                Completed Trips
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="white" fontWeight="bold ">
                 {stats.totalbookings ?? 0} {/*// to be added fetching from db */}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 ,color: 'white'}}>
                Number of bookings
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Current Trip */}
      {currentTrip ? (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
            Current Trip
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {/* Member Details */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Member Details
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {currentTrip.memberName || "—"}
                  </Typography>
                  {currentTrip.memberContact ? (
                    <Box display="flex" alignItems="center" mt={1}>
                      <Phone fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {currentTrip.memberContact}
                      </Typography>
                    </Box>
                  ) : null}
                </Paper>

                {/* Trip Details */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Trip Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>From:</strong> {currentTrip.pickupAddress || "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>To:</strong> {currentTrip.destination || "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pickup Time:</strong> {currentTrip.pickupTime || "—"}
                  </Typography>
                </Paper>

                {/* Action Buttons */}
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<CheckCircle />}
                    onClick={() => currentTrip.id && onMarkArrived?.(currentTrip.id)}
                  >
                    Mark as Arrived
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<CheckCircle />}
                    onClick={() => currentTrip.id && onCompleteTrip?.(currentTrip.id)}
                  >
                    Complete Trip
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Navigation
              </Typography>
              <Box sx={{ height: 300, mb: 2 }}>
                <MapComponent role="driver" data={data} />
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Navigation />}
                onClick={() => onStartNavigation?.(currentTrip)}
              >
                Start Navigation
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <DirectionsCar sx={{ fontSize: 56, color: "text.secondary" }} />
          <Typography variant="h6" mt={2} mb={1} color="text.secondary">
            No Current Trip
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You’ll see your next assignment here when it’s available.
          </Typography>
        </Paper>
      )}

      {/* Upcoming Trips */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Upcoming Trips
        </Typography>
        <List>
          {(todaysTrips || []).length ? (
            todaysTrips.map((trip) => (
              <ListItem key={trip.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" fontWeight="medium">
                        {trip.memberName || "—"}
                      </Typography>
                      <Chip
                        label={(trip.status || "pending").toUpperCase()}
                        color={
                          trip.status === "pending"
                            ? "warning"
                            : trip.status === "completed"
                            ? "success"
                            : "info"
                        }
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <AccessTime fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Pickup: {trip.pickupTime || "—"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No upcoming trips
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
