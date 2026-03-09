import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { BASE, asJson } from "@/api/index";

type BookingStatus = "confirmed" | "cancelled" | "in_progress" | "completed";

type Booking = {
  id: string;
  userId: string;
  driverId:
    | {
        id: string;
        fullName: string;
        phoneNumber: string;
      }
    | string
    | null;
  type: string;
  time: string;
  address: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

export default function BookingsPage() {
  const { token, role } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(`${BASE}/api/bookings/history`, { headers })
      .then(asJson<Booking[]>)
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const driverName = (b: Booking) => {
    if (!b.driverId) return "-";
    if (typeof b.driverId === "string") return b.driverId;
    return b.driverId.fullName || "-";
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = !statusFilter || b.status === statusFilter;
      const text =
        `${b.pickupLocation} ${b.dropoffLocation} ${driverName(b)} ${b.type}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, search]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#FF9900" }} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Bookings
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Search location, driver or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as BookingStatus | "")
            }
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell>Dropoff</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.type}</TableCell>
                <TableCell>{b.pickupLocation}</TableCell>
                <TableCell>{b.dropoffLocation}</TableCell>
                <TableCell>{driverName(b)}</TableCell>

                <TableCell>
                  {new Date(b.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Chip
                    label={b.status}
                    color={b.status === "confirmed" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
