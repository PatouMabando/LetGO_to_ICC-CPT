import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Button
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={{
        color: "#64748B",
        textTransform: "none",
        fontWeight: 600,
        fontSize: 13,
        "&:hover": { color: "#EF4444", bgcolor: "rgba(239,68,68,0.08)" },
      }}
    >
      Logout
    </Button>
  );
}
