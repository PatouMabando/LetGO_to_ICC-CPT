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
} from "@mui/material";
import {
  Phone,
  Star,
  Navigation,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
import MapComponent from "@/components/MapComponent";

const DriverDashboard = ({ data, theme }) => {
  return (
    <Box>
      {/* Driver Status Header */}
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
            Driver Status
          </Typography>
          <Chip
            label={data.status.toUpperCase()}
            color={data.status === "busy" ? "warning" : "success"}
            sx={{ color: "white", fontWeight: "bold" }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {data.stats.completedToday}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Completed Trips
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {data.stats.earnings}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Today's Earnings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={1}
              >
                <Typography variant="h4" fontWeight="bold" mr={1}>
                  {data.stats.rating}
                </Typography>
                <Star sx={{ color: "#FFD700" }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Average Rating
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Current Trip */}
      {data.currentTrip && (
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
                    {data.currentTrip.memberName}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Phone
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {data.currentTrip.memberContact}
                    </Typography>
                  </Box>
                </Paper>

                {/* Trip Details */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Trip Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>From:</strong> {data.currentTrip.pickupAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>To:</strong> {data.currentTrip.destination}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pickup Time:</strong> {data.currentTrip.pickupTime}
                  </Typography>
                </Paper>

                {/* Action Buttons */}
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<CheckCircle />}
                  >
                    Mark as Arrived
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<CheckCircle />}
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
              >
                Start Navigation
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Upcoming Trips */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Upcoming Trips
        </Typography>
        <List>
          {data.todaysTrips.map((trip) => (
            <ListItem key={trip.id} divider>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {trip.memberName}
                    </Typography>
                    <Chip
                      label={trip.status.toUpperCase()}
                      color={trip.status === "pending" ? "warning" : "info"}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <AccessTime
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Pickup: {trip.pickupTime}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DriverDashboard;
