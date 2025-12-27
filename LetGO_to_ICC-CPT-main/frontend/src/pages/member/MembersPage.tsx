import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type Trip = {
  _id: string;
  title: string;
  date: string;
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
  tripId: {
    title: string;
    date: string;
  };
  status: "confirmed" | "cancelled";
};

const API = "http://localhost:5000/api";

export default function MemberPage() {
  const { token } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [area, setArea] = useState("");
  const [drivers, setDrivers] = useState<DriverAssignment[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Load trips + my booking
  useEffect(() => {
    async function load() {
      const [tripsRes, bookingRes] = await Promise.all([
        fetch(`${API}/trips`, { headers }),
        fetch(`${API}/bookings/my`, { headers }),
      ]);

      const tripsData = await tripsRes.json();
      const bookingData = await bookingRes.json();

      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setBooking(bookingData && bookingData._id ? bookingData : null);
    }

    load();
  }, [token]);

  // 🔥 LOAD DRIVERS WHEN TRIP OR AREA CHANGES
  useEffect(() => {
    async function loadDrivers() {
      if (!selectedTrip || !area) {
        setDrivers([]);
        return;
      }

      const res = await fetch(
        `${API}/driver-assignments/${selectedTrip}?area=${area}`,
        { headers }
      );

      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    }

    loadDrivers();
  }, [selectedTrip, area]);

  async function bookSeat(driverAssignmentId: string) {
    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tripId: selectedTrip,
        driverAssignmentId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Booking failed");
      return;
    }

    setBooking(data.booking);
    setDrivers([]);
  }

  async function cancelBooking() {
    if (!booking) return;

    await fetch(`${API}/bookings/${booking._id}`, {
      method: "DELETE",
      headers,
    });

    setBooking(null);
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={3}>
          Member
        </Typography>

        {/* CURRENT BOOKING */}
        {booking && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography fontWeight="bold">Current Booking</Typography>
            <Typography>
              {booking.tripId.title} —{" "}
              {new Date(booking.tripId.date).toLocaleDateString()}
            </Typography>
            <Chip
              label={booking.status.toUpperCase()}
              color="success"
              sx={{ my: 1 }}
            />
            <Button color="error" onClick={cancelBooking}>
              Cancel Booking
            </Button>
          </Paper>
        )}

        {/* BOOK A TRIP */}
        {!booking && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Book a Trip
            </Typography>

            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Trip</InputLabel>
                <Select
                  label="Trip"
                  value={selectedTrip}
                  onChange={(e) => setSelectedTrip(e.target.value)}
                >
                  {trips
                    .filter((t) => t.status === "open")
                    .map((t) => (
                      <MenuItem key={t._id} value={t._id}>
                        {t.title} — {new Date(t.date).toLocaleDateString()}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Pickup Area</InputLabel>
                <Select
                  label="Pickup Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <MenuItem value="Khayelitsha">Khayelitsha</MenuItem>
                  <MenuItem value="Wynberg">Wynberg</MenuItem>
                  <MenuItem value="Ottery">Ottery</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        )}

        {/* DRIVERS */}
        {!booking && drivers.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight="bold" mb={2}>
              Available Drivers
            </Typography>

            <Stack spacing={2}>
              {drivers.map((d) => (
                <Paper key={d._id} sx={{ p: 2 }}>
                  <Typography>
                    {d.driverId.name} {d.driverId.lastName}
                  </Typography>
                  <Typography color="text.secondary">Area: {d.area}</Typography>
                  <Typography color="text.secondary">
                    Seats: {d.availableSeats}
                  </Typography>
                  <Button variant="contained" onClick={() => bookSeat(d._id)}>
                    Book Seat
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}

        {!booking && selectedTrip && area && drivers.length === 0 && (
          <Typography color="text.secondary">
            No drivers available for this area
          </Typography>
        )}
      </Container>
    </Box>
  );
}
