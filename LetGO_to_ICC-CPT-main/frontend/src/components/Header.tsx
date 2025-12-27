import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          LetGo to ICC
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/bookings"
            color="inherit"
            underline="none"
          >
            Bookings
          </Link>
          <Link
            component={RouterLink}
            to="/drivers"
            color="inherit"
            underline="none"
          >
            Drivers
          </Link>
          <Link
            component={RouterLink}
            to="/members"
            color="inherit"
            underline="none"
          >
            Members
          </Link>
          <Link
            component={RouterLink}
            to="/admin"
            color="inherit"
            underline="none"
          >
            Admin
          </Link>
        </Stack>
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">{user.name}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
