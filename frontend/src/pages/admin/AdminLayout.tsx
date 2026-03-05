// AdminLayout.tsx (reduced sidebar width)
import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import logo from "@/assets/ICC LOGO (1).svg";

const drawerWidth = 220; // ✅ reduced (was 260)
const APPBAR_H_XS = 56;
const APPBAR_H_SM = 64;

const navItems = [
  { label: "Home", icon: <DashboardIcon />, path: "/admin/home" },
  { label: "Members", icon: <PeopleIcon />, path: "/admin/members" },
  { label: "Drivers", icon: <DirectionsCarIcon />, path: "/admin/drivers" },
  { label: "Administrators", icon: <AdminPanelSettingsIcon />, path: "/admin/admins" },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 2.25, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: "'Russo One', sans-serif",
            fontWeight: 400,
            color: "#142C54",
            lineHeight: 1.05,
            fontSize: 24, // ✅ slightly smaller to fit narrower sidebar
            letterSpacing: 0.5,
          }}
        >
          LET’S GO <br /> TO ICC <br /> CPT
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: active ? "rgba(255,153,0,0.12)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,153,0,0.12)" },
                px: 1.25,
              }}
            >
              <ListItemIcon sx={{ color: active ? "#FF9900" : "#64748B", minWidth: 38 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: active ? 900 : 700,
                  color: active ? "#142C54" : "#475569",
                  fontSize: 13, // ✅ tighter
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ px: 2, pb: 2, textAlign: "center" }}>
        <Box component="img" src={logo} alt="ICC Logo" sx={{ height: 60 }} /> {/* ✅ smaller */}
        <Typography sx={{ fontSize: 11, color: "#94A3B8", mt: 0.5 }}>
          ©️ 2026 Let’s Go ICC Cape Town
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <CssBaseline />

      {/* SIDEBAR */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer - stays BELOW the AppBar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: { xs: APPBAR_H_XS, sm: APPBAR_H_SM },
              height: {
                xs: `calc(100% - ${APPBAR_H_XS}px)`,
                sm: `calc(100% - ${APPBAR_H_SM}px)`,
              },
              borderRight: "1px solid #E2E8F0",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop permanent */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #E2E8F0",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* TOP BAR (shifted to right, NEVER overlaps sidebar) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          color: "#142C54",
          zIndex: (t) => t.zIndex.drawer + 2,
          left: { md: drawerWidth },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: APPBAR_H_XS, sm: APPBAR_H_SM } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>Hello, Admin</Typography>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
              Have a nice day 🙂
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#FF9900" }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          px: { xs: 2, md: 3 },
          pt: { xs: `${APPBAR_H_XS + 16}px`, sm: `${APPBAR_H_SM + 16}px` },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}