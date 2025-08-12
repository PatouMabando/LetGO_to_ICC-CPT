import React from "react";
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
} from "@mui/material";
import {
  Timer,
  Phone,
  Star,
  CheckCircle,
  DirectionsCar,
  CalendarToday,
  History,
} from "@mui/icons-material";
import MapComponent from "@/components/MapComponent";

const MemberDashboard = ({ data, theme }) => {
  return (
    <Box>
      {data.currentBooking ? (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Current Trip
            </Typography>
            <Box display="flex" alignItems="center">
              <Timer sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                {data.currentBooking.estimatedArrival}
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
                  <Typography fontWeight="medium">
                    {data.currentBooking.driverName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {data.currentBooking.vehicleNumber}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Phone fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {data.currentBooking.driverContact}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 2 }}>
                  <Typography variant="subtitle1" mb={1} fontWeight="bold">
                    Trip Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>From:</strong> {data.currentBooking.pickupAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>To:</strong> {data.currentBooking.destination}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={data.currentBooking.status
                        .replace("-", " ")
                        .toUpperCase()}
                      color={
                        data.currentBooking.status === "on-the-way"
                          ? "warning"
                          : "success"
                      }
                      sx={{ color: "white", fontWeight: "bold" }}
                    />
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" mb={1} fontWeight="bold">
                Live Tracking
              </Typography>
              <Box sx={{ height: 300, mb: 2 }}>
                <MapComponent role="member" data={data} />
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Book a Trip
          </Button>
        </Paper>
      )}

      {/* Recent Trips Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Recent Trips
        </Typography>
        <List>
          {data.recentBookings?.map((booking) => (
            <ListItem key={booking.id} divider>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {booking.destination}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        value={booking.rating}
                        readOnly
                        size="small"
                        precision={1}
                      />
                      <CheckCircle color="success" fontSize="small" />
                    </Box>
                  </Box>
                }
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(booking.date).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color="success"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
              />
            </ListItem>
          )) || (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    No recent trips found
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CalendarToday
              sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
            />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Schedule Trip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plan your next journey
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <History sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Trip History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View all past trips
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDashboard;
