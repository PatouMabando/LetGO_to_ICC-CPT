import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  People,
  DirectionsCar,
  CalendarToday,
  FiberManualRecord,
  Phone,
  ManageAccounts,
} from "@mui/icons-material";
import MapComponent from "@/components/MapComponent";

const AdminDashboard = () => {
  // Mock data for demonstration
  const data = {
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
        memberName: "John Smith",
        memberContact: "+27 21 123 4567",
        driverName: "Mike Johnson",
        driverContact: "+27 21 234 5678",
        pickupAddress: "123 Main St, Cape Town",
        destination: "ICC Church, Observatory",
        status: "on-the-way",
      },
      {
        id: "TRP002",
        memberName: "Sarah Davis",
        memberContact: "+27 21 345 6789",
        driverName: null,
        driverContact: null,
        pickupAddress: "456 Oak Ave, Woodstock",
        destination: "ICC Church, Observatory",
        status: "pending",
      },
      {
        id: "TRP003",
        memberName: "David Wilson",
        memberContact: "+27 21 456 7890",
        driverName: "Chris Brown",
        driverContact: "+27 21 567 8901",
        pickupAddress: "789 Pine Rd, Claremont",
        destination: "ICC Church, Observatory",
        status: "completed",
      },
    ],
    drivers: [
      {
        id: 1,
        name: "Mike Johnson",
        area: "City Bowl",
        trips: 8,
        status: "busy",
      },
      {
        id: 2,
        name: "Chris Brown",
        area: "Southern Suburbs",
        trips: 12,
        status: "available",
      },
      {
        id: 3,
        name: "David Lee",
        area: "Northern Suburbs",
        trips: 6,
        status: "available",
      },
      {
        id: 4,
        name: "Tom Wilson",
        area: "Atlantic Seaboard",
        trips: 0,
        status: "offline",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "on-the-way":
        return "info";
      case "completed":
        return "success";
      case "available":
        return "success";
      case "busy":
        return "warning";
      case "offline":
        return "error";
      default:
        return "default";
    }
  };

  const getDriverStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#4caf50";
      case "busy":
        return "#ff9800";
      case "offline":
        return "#9e9e9e";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Box>
      {/* Overview Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {data.stats.totalMembers}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Members
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {data.stats.activeMembers} active
                </Typography>
              </Box>
              <People sx={{ fontSize: 60, opacity: 0.6 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {data.stats.totalDrivers}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Drivers
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {data.stats.availableDrivers} available
                </Typography>
              </Box>
              <DirectionsCar sx={{ fontSize: 60, opacity: 0.6 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {data.stats.totalBookings}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Bookings
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {data.stats.activeBookings} active
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 60, opacity: 0.6 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Live Operations Map */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Live Operations Map
        </Typography>
        <Box sx={{ height: 300 }}>
          <MapComponent role="admin" data={data} />
        </Box>
      </Paper>

      {/* Recent Bookings */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Recent Bookings
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Member</strong>
                </TableCell>
                <TableCell>
                  <strong>Driver</strong>
                </TableCell>
                <TableCell>
                  <strong>Route</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.recentBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      #{booking.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {booking.memberName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.memberContact}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {booking.driverName ? (
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {booking.driverName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.driverContact}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.pickupAddress} → {booking.destination}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status.replace("-", " ").toUpperCase()}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      startIcon={<ManageAccounts />}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Driver Status Overview */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
          Driver Status
        </Typography>
        <List>
          {data.drivers.map((driver) => (
            <ListItem key={driver.id} divider>
              <ListItemIcon>
                <FiberManualRecord
                  sx={{ color: getDriverStatusColor(driver.status) }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {driver.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {driver.area}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={3}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold">
                          {driver.trips}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Today's Trips
                        </Typography>
                      </Box>
                      <Chip
                        label={driver.status.toUpperCase()}
                        color={getStatusColor(driver.status)}
                        size="small"
                      />
                    </Box>
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

export default AdminDashboard;
