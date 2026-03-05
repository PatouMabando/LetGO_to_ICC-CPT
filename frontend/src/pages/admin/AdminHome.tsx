// src/pages/admin/AdminHome.tsx
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";

type Status = "pending" | "approved" | "blocked";

const cardBase = {
  p: 1.35, // ✅ smaller
  borderRadius: 2.5,
  bgcolor: "#fff",
};

const StatCardSx = {
  ...cardBase,
  border: "1px solid rgba(255,153,0,0.28)", // ✅ same border style (soft orange)
  transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
  "&:hover": {
    boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
    transform: "translateY(-2px)",
    borderColor: "rgba(255,153,0,0.65)",
  },
};

const listCardSx = {
  ...cardBase,
  border: "1px solid rgba(255,153,0,0.28)", // ✅ match stat cards
  transition: "box-shadow 140ms ease, border-color 140ms ease",
  "&:hover": {
    boxShadow: "0 10px 22px rgba(15,23,42,0.07)",
    borderColor: "rgba(255,153,0,0.65)",
  },
};

function statusChipSx(status: Status) {
  if (status === "approved") {
    return {
      bgcolor: "rgba(34,197,94,0.12)",
      color: "#15803D",
      border: "1px solid rgba(34,197,94,0.35)",
    };
  }
  if (status === "pending") {
    return {
      bgcolor: "rgba(245,158,11,0.12)",
      color: "#9A3412",
      border: "1px solid rgba(245,158,11,0.35)",
    };
  }
  return {
    bgcolor: "rgba(239,68,68,0.12)",
    color: "#B91C1C",
    border: "1px solid rgba(239,68,68,0.35)",
  };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const a = parts[0]?.[0] || "";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

function StatCard({
  title,
  count,
  icon,
  buttonText,
  onClick,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <Paper elevation={0} sx={StatCardSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: "#64748B",
              fontWeight: 900,
              fontSize: 12, // ✅ smaller
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontWeight: 950,
              fontSize: 22, // ✅ smaller count
              color: "#142C54",
              lineHeight: 1.05,
              mt: 0.3,
            }}
          >
            {count}
          </Typography>
        </Box>

        <Box sx={{ color: "#FF9900", display: "flex", alignItems: "center" }}>
          {/* ✅ smaller icon */}
          {icon}
        </Box>
      </Stack>

      <Button
        onClick={onClick}
        fullWidth
        sx={{
          mt: 1.05,
          py: 0.55, // ✅ smaller button height
          fontSize: 12,
          bgcolor: "#FF9900",
          color: "#fff",
          borderRadius: 2,
          fontWeight: 950,
          textTransform: "none",
          "&:hover": { bgcolor: "#e68a00" },
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  );
}

function RecentListCard({
  title,
  onViewAll,
  items,
}: {
  title: string;
  onViewAll: () => void;
  items: Array<{ name: string; phone: string; status: Status }>;
}) {
  return (
    <Paper elevation={0} sx={listCardSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
        <Typography sx={{ fontWeight: 950, color: "#142C54", fontSize: 14 }}>
          {title}
        </Typography>

        <Button
          onClick={onViewAll}
          sx={{
            textTransform: "none",
            fontWeight: 950,
            color: "#FF9900",
            fontSize: 12,
            px: 1,
            py: 0.4,
            "&:hover": { bgcolor: "rgba(255,153,0,0.08)" },
          }}
        >
          View all
        </Button>
      </Stack>

      <Stack spacing={0.75}>
        {items.map((u) => (
          <Box
            key={u.phone}
            sx={{
              px: 0.9,
              py: 0.8,
              borderRadius: 2,
              border: "1px solid #F1F5F9",
              transition: "background 120ms ease, border-color 120ms ease",
              "&:hover": {
                bgcolor: "rgba(255,153,0,0.06)",
                borderColor: "rgba(255,153,0,0.25)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              {/* ✅ initials avatar */}
              <Avatar
                sx={{
                  width: 30, // ✅ smaller
                  height: 30,
                  bgcolor: "rgba(255,153,0,0.16)",
                  color: "#B45309",
                  fontWeight: 950,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {initials(u.name)}
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 950,
                    color: "#0F172A",
                    fontSize: 13,
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {u.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {u.phone}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={u.status.toUpperCase()}
                sx={{
                  height: 22,
                  fontSize: 10.5,
                  fontWeight: 950,
                  ...statusChipSx(u.status),
                }}
              />

              {/* ✅ actions aligned */}
              <Stack direction="row" spacing={0.2} sx={{ flexShrink: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => alert("Edit page later ✅")}
                  sx={{
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(255,153,0,0.10)" },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 17, color: "#FF9900" }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => alert("Delete modal later ✅")}
                  sx={{
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(239,68,68,0.10)" },
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 17, color: "#EF4444" }} />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();

  // ✅ Dummy stats (API later)
  const stats = {
    approvedMembers: 128,
    approvedDrivers: 5,
    pendingDrivers: 2,
    pendingMembers: 4,
    pendingAdmins: 1,
  };

  // ✅ Dummy recents (API later)
  const latestMembers: Array<{ name: string; phone: string; status: Status }> = [
    { name: "Sarah Mabondo", phone: "+27 123 456 7890", status: "approved" },
    { name: "Roger Moyo", phone: "+27 123 987 6543", status: "approved" },
    { name: "Sipho Ndlovu", phone: "+27 123 555 4321", status: "blocked" },
  ];

  const latestDrivers: Array<{ name: string; phone: string; status: Status }> = [
    { name: "Zandi Sithole", phone: "+27 123 456 7890", status: "approved" },
    { name: "Simon Ngema", phone: "+27 123 987 6543", status: "pending" },
    { name: "Nomsa Khumalo", phone: "+27 123 555 4321", status: "blocked" },
  ];

  const latestAdmins: Array<{ name: string; phone: string; status: Status }> = [
    { name: "John Mabando", phone: "+27 111 222 3333", status: "pending" },
    { name: "Main Admin", phone: "+27 999 888 7777", status: "approved" },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* ✅ 5 STAT CARDS IN ONE ROW ON PC */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 0.75, sm: 1, md: 1 }, // ✅ tighter spacing
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)", // ✅ 5 on same row
          },
          alignItems: "stretch",
        }}
      >
        <StatCard
          title="Approved Members"
          count={stats.approvedMembers}
          icon={<PeopleIcon sx={{ fontSize: 28 }} />}
          buttonText="Manage"
          onClick={() => navigate("/admin/members")}
        />

        <StatCard
          title="Approved Drivers"
          count={stats.approvedDrivers}
          icon={<DirectionsCarIcon sx={{ fontSize: 28 }} />}
          buttonText="Manage"
          onClick={() => navigate("/admin/drivers")}
        />

        <StatCard
          title="Pending Drivers"
          count={stats.pendingDrivers}
          icon={<PendingActionsIcon sx={{ fontSize: 28 }} />}
          buttonText="Review"
          onClick={() => navigate("/admin/drivers")}
        />

        <StatCard
          title="Pending Members"
          count={stats.pendingMembers}
          icon={<PendingActionsIcon sx={{ fontSize: 28 }} />}
          buttonText="Review"
          onClick={() => navigate("/admin/members")}
        />

        <StatCard
          title="Pending Admins"
          count={stats.pendingAdmins}
          icon={<AdminPanelSettingsIcon sx={{ fontSize: 28 }} />}
          buttonText="Review"
          onClick={() => navigate("/admin/admins")}
        />
      </Box>

      {/* ✅ 3 RECENT CARDS IN ONE ROW ON PC */}
      <Box
        sx={{
          mt: 1,
          display: "grid",
          gap: { xs: 0.75, sm: 1, md: 1 }, // ✅ tighter spacing
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)", // ✅ 3 on same row
          },
          alignItems: "stretch",
        }}
      >
        <RecentListCard
          title="Recent Members"
          onViewAll={() => navigate("/admin/members")}
          items={latestMembers}
        />

        <RecentListCard
          title="Recent Drivers"
          onViewAll={() => navigate("/admin/drivers")}
          items={latestDrivers}
        />

        <RecentListCard
          title="Recent Administrators"
          onViewAll={() => navigate("/admin/admins")}
          items={latestAdmins}
        />
      </Box>
    </Box>
  );
}