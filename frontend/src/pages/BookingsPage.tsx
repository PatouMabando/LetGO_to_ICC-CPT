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
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type BookingStatus = "confirmed" | "cancelled";

type Booking = {
  _id: string;
  status: BookingStatus;
  createdAt: string;
  tripId: {
    title: string;
    date: string;
  };
  userId: {
    name: string;
    lastName: string;
    phoneNumber: string;
  };
  driverAssignmentId?: {
    area: string;
    driverId: {
      name: string;
      lastName: string;
    };
  };
};

const API = "http://localhost:5000/api";

export default function BookingsPage() {
  const { token, role } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [search, setSearch] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    async function load() {
      const endpoint = role === "admin" ? "/bookings" : "/bookings/my";

      const res = await fetch(`${API}${endpoint}`, { headers });
      setBookings(await res.json());
    }

    load();
  }, [token, role]);

  async function cancelBooking(id: string) {
    await fetch(`${API}/bookings/${id}`, {
      method: "DELETE",
      headers,
    });

    setBookings((list) =>
      list.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
    );
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = !statusFilter || b.status === statusFilter;
      const text =
        `${b.userId.name} ${b.userId.lastName} ${b.tripId.title}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, search]);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Bookings
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Search member or trip"
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
          </TextField>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Trip</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              {role === "member" && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b._id}>
                <TableCell>
                  {b.userId.name} {b.userId.lastName}
                  <Typography variant="body2" color="text.secondary">
                    {b.userId.phoneNumber}
                  </Typography>
                </TableCell>

                <TableCell>{b.tripId.title}</TableCell>

                <TableCell>
                  {b.driverAssignmentId
                    ? `${b.driverAssignmentId.driverId.name} ${b.driverAssignmentId.driverId.lastName} (${b.driverAssignmentId.area})`
                    : "-"}
                </TableCell>

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

                {role === "member" && (
                  <TableCell>
                    {b.status === "confirmed" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                )}
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
