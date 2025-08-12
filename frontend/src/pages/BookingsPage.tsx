import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search } from "lucide-react";

type Booking = {
  id: string;
  passenger: string;
  driver: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
};

const mockBookings: Booking[] = [
  {
    id: "B001",
    passenger: "John Doe",
    driver: "Alice",
    date: "2025-08-12",
    status: "completed",
  },
  {
    id: "B002",
    passenger: "Sarah Lee",
    driver: "Bob",
    date: "2025-08-13",
    status: "pending",
  },
  {
    id: "B003",
    passenger: "Mike Ross",
    driver: "Charlie",
    date: "2025-08-14",
    status: "cancelled",
  },
];

export default function BookingsPage() {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const filteredBookings = mockBookings.filter(
    (b) =>
      (!statusFilter || b.status === statusFilter) &&
      (b.passenger.toLowerCase().includes(search.toLowerCase()) ||
        b.driver.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColors: Record<
    Booking["status"],
    "success" | "warning" | "error"
  > = {
    completed: "success",
    pending: "warning",
    cancelled: "error",
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        color={theme.palette.primary.main}
      >
        Bookings
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            placeholder="Search passenger or driver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
              <TableCell>ID</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.passenger}</TableCell>
                <TableCell>{booking.driver}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={statusColors[booking.status]}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
