import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
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
import MemberDashboard from "@/components/MemberDashboard";
import DriverDashboard from "@/components/DriverDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const roles = [
  { id: "member", name: "Member View", icon: <People /> },
  { id: "driver", name: "Driver View", icon: <DirectionsCar /> },
  { id: "admin", name: "Admin View", icon: <Settings /> },
];

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState("member");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const renderDashboard = () => {
    switch (currentRole) {
      case "member":
        return <MemberDashboard />;
      case "driver":
        return <DriverDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderDashboard()}
      </Box>
    </Box>
  );
};

export default Dashboard;
