import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import {
  People,
  DirectionsCar,
  Settings,
  Menu as MenuIcon,
  Notifications,
} from "@mui/icons-material";
// import MemberDashboard from "@/components/MemberDashboard";
// import DriverDashboard from "@/components/DriverDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const roles = [
  { id: "member", name: "Member View", icon: <People /> },
  { id: "driver", name: "Driver View", icon: <DirectionsCar /> },
  { id: "admin", name: "Admin View", icon: <Settings /> },
];

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState(null); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Example: Reading role from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role) {
          setCurrentRole(parsed.role); // e.g. "admin", "driver", "member"
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // If you want to fetch from API instead, use:
    /*
    fetch("/api/me")
      .then(res => res.json())
      .then(data => setCurrentRole(data.role))
      .catch(err => console.error("Failed to fetch user role", err));
    */
  }, []);

  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const renderDashboard = () => {
    switch (currentRole) {
      case "member":
        return <div>Member View</div>; // Replace with <MemberDashboard />
      case "driver":
        return <div>Driver View</div>; // Replace with <DriverDashboard />
      case "admin":
        return <AdminDashboard />;
      default:
        return (
          <Typography variant="body1" sx={{ mt: 4 }}>
            Loading dashboard...
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* App Bar */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trip Booking Dashboard
          </Typography>
          <Notifications />
          <Box ml={2}>
            <Typography variant="body2">Last updated</Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {roles.map(({ id, name, icon }) => (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  selected={currentRole === id}
                  onClick={() => {
                    setCurrentRole(id);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderDashboard()}
      </Box>
    </Box>
  );
};

export default Dashboard;
