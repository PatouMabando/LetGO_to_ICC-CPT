import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type Trip = {
  _id: string;
  title: string;
  date: string;
  totalSeats: number;
  bookedSeats: number;
  status: "open" | "closed";
};

type DriverAssignment = {
  _id: string;
  area: string;
  availableSeats: number;
  driverId: {
    name: string;
    lastName: string;
  };
};

type Booking = {
  _id: string;
  userId: {
    name: string;
    lastName: string;
    phoneNumber: string;
  };
  tripId: {
    title: string;
  };
  status: "confirmed" | "cancelled";
};

const API = "http://localhost:5000/api";

export default function AdminPage() {
  const { token } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<DriverAssignment[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const [newTrip, setNewTrip] = useState({
    title: "",
    date: "",
    totalSeats: 10,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* ================= LOAD BASE DATA ================= */

  useEffect(() => {
    async function load() {
      try {
        const [t, b] = await Promise.all([
          fetch(`${API}/trips`, { headers }),
          fetch(`${API}/bookings`, { headers }),
        ]);

        const tripsJson = await t.json();
        const bookingsJson = await b.json();

        setTrips(Array.isArray(tripsJson) ? tripsJson : []);
        setBookings(Array.isArray(bookingsJson) ? bookingsJson : []);
      } catch (err) {
        console.error("Admin load failed", err);
        setTrips([]);
        setBookings([]);
      }
    }

    load();
  }, [token]);

  /* ================= DRIVER ASSIGNMENTS ================= */

  async function loadAssignments(tripId: string) {
    setSelectedTrip(tripId);
    setAssignments([]); // reset first

    try {
      const res = await fetch(`${API}/driver-assignments/${tripId}`, {
        headers,
      });

      if (!res.ok) {
        setAssignments([]);
        return;
      }

      const json = await res.json();

      // NORMALIZE RESPONSE
      if (Array.isArray(json)) {
        setAssignments(json);
      } else if (Array.isArray(json.assignments)) {
        setAssignments(json.assignments);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("Failed to load driver assignments", err);
      setAssignments([]);
    }
  }

  /* ================= TRIP ACTIONS ================= */

  async function createTrip() {
    if (!newTrip.title || !newTrip.date) return;

    const res = await fetch(`${API}/trips`, {
      method: "POST",
      headers,
      body: JSON.stringify(newTrip),
    });

    const trip = await res.json();
    setTrips((prev) => [trip, ...prev]);
    setNewTrip({ title: "", date: "", totalSeats: 10 });
  }

  async function closeTrip(tripId: string) {
    await fetch(`${API}/trips/${tripId}/close`, {
      method: "PATCH",
      headers,
    });

    setTrips((list) =>
      list.map((t) => (t._id === tripId ? { ...t, status: "closed" } : t))
    );
  }

  /* ================= RENDER ================= */

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={3}>
          Admin Dashboard
        </Typography>

        {/* CREATE TRIP */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography fontWeight="bold" mb={2}>
            Create Trip
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Title"
              value={newTrip.title}
              onChange={(e) =>
                setNewTrip({ ...newTrip, title: e.target.value })
              }
            />
            <TextField
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={newTrip.date}
              onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
            />
            <TextField
              size="small"
              type="number"
              label="Seats"
              value={newTrip.totalSeats}
              onChange={(e) =>
                setNewTrip({
                  ...newTrip,
                  totalSeats: Number(e.target.value),
                })
              }
            />
            <Button variant="contained" onClick={createTrip}>
              Create
            </Button>
          </Stack>
        </Paper>

        {/* TRIPS */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography fontWeight="bold" mb={2}>
            Trips
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {t.bookedSeats}/{t.totalSeats}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.status}
                        color={t.status === "open" ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => loadAssignments(t._id)}
                      >
                        View Drivers
                      </Button>
                      {t.status === "open" && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => closeTrip(t._id)}
                        >
                          Close
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {trips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No trips
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* DRIVER ASSIGNMENTS */}
        {selectedTrip && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Driver Assignments
            </Typography>

            {assignments.length > 0 ? (
              assignments.map((a) => (
                <Paper key={a._id} sx={{ p: 2, mb: 1 }}>
                  <Typography>
                    {a.driverId.name} {a.driverId.lastName}
                  </Typography>
                  <Typography color="text.secondary">Area: {a.area}</Typography>
                  <Typography color="text.secondary">
                    Seats left: {a.availableSeats}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">
                No drivers assigned to this trip
              </Typography>
            )}
          </Paper>
        )}

        {/* BOOKINGS */}
        <Paper sx={{ p: 2 }}>
          <Typography fontWeight="bold" mb={2}>
            Bookings
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Trip</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      {b.userId.name} {b.userId.lastName}
                    </TableCell>
                    <TableCell>{b.tripId.title}</TableCell>
                    <TableCell>
                      <Chip label={b.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No bookings
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}
