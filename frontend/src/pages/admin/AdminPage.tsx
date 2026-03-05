// src/pages/admin/AdminsPage.tsx
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
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type Status = "pending" | "approved" | "blocked";

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
  transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    borderColor: "rgba(255,153,0,0.7)",
  },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? (parts[0]?.[1] ?? "");
  return (a + b).toUpperCase();
}

export default function AdminsPage() {
  const [rows, setRows] = React.useState([
    { id: "a1", fullName: "Main Admin", phone: "+27 999 888 7777", status: "approved" as Status },
    { id: "a2", fullName: "John Mabando", phone: "+27 111 222 3333", status: "pending" as Status },
    { id: "a3", fullName: "Blocked Admin", phone: "+27 555 444 3333", status: "blocked" as Status },
  ]);

  const changeStatus = (id: string, status: Status) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    // TODO: API PATCH /admin/users/:id/status
  };

  const deleteUser = (id: string) => {
    // TODO: confirm modal
    setRows((prev) => prev.filter((r) => r.id !== id));
    // TODO: API DELETE /admin/users/:id
  };

  const editUser = (id: string) => {
    // TODO: navigate to edit page
    alert(`Edit admin ${id} (page later ✅)`);
  };

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
            Administrators
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13, fontWeight: 700 }}>
            Manage admins • status (pending/approved/blocked)
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
          + Add Admin
        </Button>
      </Stack>

      {/* ✅ DESKTOP TABLE (md+) */}
      <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden", display: { xs: "none", md: "block" } }}>
        <TableContainer sx={{ width: "100%" }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#FF9900" }}>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>Admin</TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 950, color: "#fff" }} align="right">
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
                      <Avatar sx={{ bgcolor: "rgba(255,153,0,0.14)", color: "#142C54", fontWeight: 950 }}>
                        {initials(r.fullName)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 900 }}>{r.fullName}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ color: "#475569", fontWeight: 700 }}>{r.phone}</TableCell>

                  <TableCell>
                    <Chip
                      label={r.status.toUpperCase()}
                      size="small"
                      sx={{ fontWeight: 950, height: 24, ...statusChipSx(r.status) }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1} alignItems="center">
                      <Select
                        size="small"
                        value={r.status}
                        onChange={(e) => changeStatus(r.id, e.target.value as Status)}
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
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#64748B" }}>
                    No administrators
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
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(255,153,0,0.14)", color: "#142C54", fontWeight: 950 }}>
                  {initials(r.fullName)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 950, color: "#0F172A", lineHeight: 1.15 }}>
                    {r.fullName}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 800 }}>
                    {r.phone}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={r.status.toUpperCase()}
                size="small"
                sx={{ fontWeight: 950, height: 22, ...statusChipSx(r.status) }}
              />
            </Stack>

            <Divider sx={{ my: 1.2 }} />

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
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
            <Typography sx={{ color: "#64748B", fontWeight: 800 }}>No administrators</Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}