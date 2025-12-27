
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
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
  tripId: {
    title: string;
    date: string;
  };
  area: string;
  availableSeats: number;
};

const API = "http://localhost:5000/api";

export default function DriverPage() {
  const { token } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [assignments, setAssignments] = useState<DriverAssignment[]>([]);

  const [tripId, setTripId] = useState("");
  const [area, setArea] = useState("");
  const [seats, setSeats] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // -------------------------------
  // LOAD DATA
  // -------------------------------
  useEffect(() => {
    async function load() {
      try {
        // Trips
        const tripsRes = await fetch(`${API}/trips`, { headers });
        const tripsJson = await tripsRes.json();
        setTrips(Array.isArray(tripsJson) ? tripsJson : []);

        // Driver assignments
        const assignmentsRes = await fetch(`${API}/driver-assignments/my`, {
          headers,
        });

        if (!assignmentsRes.ok) {
          setAssignments([]);
          return;
        }

        const assignmentsJson = await assignmentsRes.json();

        if (Array.isArray(assignmentsJson)) {
          setAssignments(assignmentsJson);
        } else if (Array.isArray(assignmentsJson.assignments)) {
          setAssignments(assignmentsJson.assignments);
        } else {
          setAssignments([]);
        }
      } catch (err) {
        console.error("DriverPage load error:", err);
        setTrips([]);
        setAssignments([]);
      }
    }

    load();
  }, [token]);

  // -------------------------------
  // DECLARE AVAILABILITY
  // -------------------------------
  async function declareAvailability() {
    if (!tripId || !area || seats < 1) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/driver-assignments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tripId,
          area,
          availableSeats: seats,
        }),
      });

      if (!res.ok) return;

      const json = await res.json();
      setAssignments((prev) => [json, ...prev]);

      setTripId("");
      setArea("");
      setSeats(1);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={3}>
          Driver
        </Typography>

        {/* DECLARE AVAILABILITY */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography fontWeight="bold" mb={2}>
            Declare Availability
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Trip</InputLabel>
              <Select
                label="Trip"
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
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

            <TextField
              label="Area"
              size="small"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Khayelitsha"
            />

            <TextField
              label="Available Seats"
              size="small"
              type="number"
              inputProps={{ min: 1 }}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />

            <Button
              variant="contained"
              onClick={declareAvailability}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Availability"}
            </Button>
          </Stack>
        </Paper>

        {/* MY ASSIGNMENTS */}
        <Paper sx={{ p: 2 }}>
          <Typography fontWeight="bold" mb={2}>
            My Assignments
          </Typography>

          {assignments.length > 0 ? (
            assignments.map((a) => (
              <Paper key={a._id} sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight={600}>{a.tripId.title}</Typography>
                <Typography color="text.secondary">
                  {new Date(a.tripId.date).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">Area: {a.area}</Typography>
                <Typography color="text.secondary">
                  Seats left: {a.availableSeats}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">
              No availability declared yet
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
