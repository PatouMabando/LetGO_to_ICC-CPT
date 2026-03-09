// src/pages/admin/MembersPage.tsx
import React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  Select,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useAuth } from "@/context/AuthContext";
import { adminApi, type Member, type Status } from "@/api/admin";

const statusChipSx = (s: Status) => {
  if (s === "approved")
    return {
      bgcolor: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.35)",
    };
  if (s === "pending")
    return {
      bgcolor: "rgba(245,158,11,0.12)",
      color: "#92400E",
      border: "1px solid rgba(245,158,11,0.35)",
    };
  return {
    bgcolor: "rgba(239,68,68,0.10)",
    color: "#991B1B",
    border: "1px solid rgba(239,68,68,0.30)",
  };
};

const cardSx = {
  borderRadius: 3,
  border: "1px solid rgba(255,153,0,0.35)",
  bgcolor: "#fff",
  transition:
    "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    borderColor: "rgba(255,153,0,0.7)",
  },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

export default function MembersPage() {
  const { token } = useAuth();
  const [rows, setRows] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminApi
      .getMembers(token)
      .then(setRows)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const changeStatus = async (id: string, status: Status) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await adminApi.setUserStatus(token, id, status);
    } catch {
      adminApi.getMembers(token).then(setRows);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    try {
      await adminApi.deleteUser(token, id);
    } catch {
      adminApi.getMembers(token).then(setRows);
    }
  };

  const editUser = (id: string) => {
    alert(`Edit member ${id} (page later)`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#FF9900" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={2}
        gap={1}
      >
        <Box>
          <Typography sx={{ fontWeight: 950, color: "#142C54", fontSize: 22 }}>
            Members
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13, fontWeight: 700 }}>
            Manage members • status (pending/approved/blocked)
          </Typography>
        </Box>

        <Button
          sx={{
            bgcolor: "#FF9900",
            color: "#fff",
            borderRadius: 2,
            fontWeight: 950,
            textTransform: "none",
            "&:hover": { bgcolor: "#e68a00" },
          }}
        >
          + Add Member
        </Button>
      </Stack>

      {/* ✅ DESKTOP TABLE (md+) */}
      <Paper
        elevation={0}
        sx={{
          ...cardSx,
          overflow: "hidden",
          display: { xs: "none", md: "block" },
        }}
      >
        <TableContainer sx={{ width: "100%" }}>
          <Table sx={{ minWidth: 840 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#FF9900" }}>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>
                  Member
                </TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>
                  Address
                </TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 950, color: "#fff" }}
                  align="right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  sx={{ "&:hover td": { bgcolor: "rgba(255,153,0,0.03)" } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,153,0,0.14)",
                          color: "#142C54",
                          fontWeight: 950,
                        }}
                      >
                        {initials(r.fullName)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 900 }}>
                        {r.fullName}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ color: "#475569", fontWeight: 700 }}>
                    {r.phoneNumber}
                  </TableCell>

                  <TableCell sx={{ color: "#475569", fontWeight: 700 }}>
                    {r.address || "-"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={r.status.toUpperCase()}
                      size="small"
                      sx={{
                        fontWeight: 950,
                        height: 24,
                        ...statusChipSx(r.status),
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={1}
                      alignItems="center"
                    >
                      <Select
                        size="small"
                        value={r.status}
                        onChange={(e) =>
                          changeStatus(r.id, e.target.value as Status)
                        }
                        sx={{
                          borderRadius: 2,
                          minWidth: 135,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,153,0,0.45)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,153,0,0.85)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#FF9900",
                            borderWidth: 2,
                          },
                        }}
                      >
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="blocked">Blocked</MenuItem>
                      </Select>

                      <IconButton
                        size="small"
                        sx={{
                          color: "#64748B",
                          "&:hover": { color: "#FF9900" },
                        }}
                        onClick={() => editUser(r.id)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        sx={{
                          color: "#64748B",
                          "&:hover": { color: "#EF4444" },
                        }}
                        onClick={() => deleteUser(r.id)}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: "#64748B" }}
                  >
                    No members
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ✅ MOBILE CARDS (xs/sm) */}
      <Stack spacing={1.2} sx={{ display: { xs: "flex", md: "none" } }}>
        {rows.map((r) => (
          <Paper key={r.id} elevation={0} sx={{ ...cardSx, p: 1.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,153,0,0.14)",
                    color: "#142C54",
                    fontWeight: 950,
                  }}
                >
                  {initials(r.fullName)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{ fontWeight: 950, color: "#0F172A", lineHeight: 1.15 }}
                  >
                    {r.fullName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#64748B", fontWeight: 800 }}
                  >
                    {r.phoneNumber}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={r.status.toUpperCase()}
                size="small"
                sx={{ fontWeight: 950, height: 22, ...statusChipSx(r.status) }}
              />
            </Stack>

            <Typography
              sx={{ mt: 1, fontSize: 12.5, color: "#475569", fontWeight: 800 }}
            >
              Address:{" "}
              <span style={{ fontWeight: 700, color: "#64748B" }}>
                {r.address}
              </span>
            </Typography>

            <Divider sx={{ my: 1.2 }} />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Select
                size="small"
                value={r.status}
                onChange={(e) => changeStatus(r.id, e.target.value as Status)}
                sx={{
                  borderRadius: 2,
                  minWidth: 140,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,153,0,0.45)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,153,0,0.85)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF9900",
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>

              <Stack direction="row" spacing={0.5}>
                <IconButton
                  size="small"
                  sx={{ color: "#64748B", "&:hover": { color: "#FF9900" } }}
                  onClick={() => editUser(r.id)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "#64748B", "&:hover": { color: "#EF4444" } }}
                  onClick={() => deleteUser(r.id)}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}

        {rows.length === 0 && (
          <Paper elevation={0} sx={{ ...cardSx, p: 2, textAlign: "center" }}>
            <Typography sx={{ color: "#64748B", fontWeight: 800 }}>
              No members
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
