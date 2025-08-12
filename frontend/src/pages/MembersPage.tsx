import React, { useMemo, useState } from "react";
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
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

type Member = {
  id: string;
  name: string;
  contact: string;
  address: string;
  isActive: boolean;
};
type DriverStatus = "available" | "busy" | "offline";
type Driver = {
  id: string;
  name: string;
  contact: string;
  area: string;
  vehicleType: string;
  vehicleNumber: string;
  status: DriverStatus;
};
type BookingStatus =
  | "pending"
  | "accepted"
  | "on-the-way"
  | "arrived"
  | "completed"
  | "cancelled";
type Booking = {
  id: string;
  memberId: string;
  memberName: string;
  memberContact: string;
  driverId?: string;
  driverName?: string;
  driverContact?: string;
  pickupAddress: string;
  destination: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
};

/** ===== Demo seed data (replace with API/context later) ===== */
const seedMembers: Member[] = [
  {
    id: "m1",
    name: "Sarah K",
    contact: "082 111 2222",
    address: "Heathfield",
    isActive: true,
  },
  {
    id: "m2",
    name: "Andre K",
    contact: "071 333 4444",
    address: "Ottery",
    isActive: true,
  },
  {
    id: "m3",
    name: "John D",
    contact: "083 555 6666",
    address: "Wynberg",
    isActive: false,
  },
];

const seedDrivers: Driver[] = [
  {
    id: "d1",
    name: "Peter M",
    contact: "072 101 2020",
    area: "Heathfield",
    vehicleType: "Sedan",
    vehicleNumber: "CA 123-456",
    status: "available",
  },
  {
    id: "d2",
    name: "Grace L",
    contact: "074 303 4040",
    area: "Wynberg",
    vehicleType: "Hatchback",
    vehicleNumber: "CA 777-888",
    status: "busy",
  },
];

const seedBookings: Booking[] = [
  {
    id: "BKG-1001",
    memberId: "m1",
    memberName: "Sarah K",
    memberContact: "082 111 2222",
    driverId: "d1",
    driverName: "Peter M",
    driverContact: "072 101 2020",
    pickupAddress: "Heathfield",
    destination: "Church – ICC",
    status: "accepted",
    createdAt: new Date().toISOString(),
  },
];

/** ===== Very simple “closest driver” by area (dummy coords) ===== */
const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  Heathfield: { lat: -34.0409, lng: 18.4681 },
  Wynberg: { lat: -34.005, lng: 18.4676 },
  Ottery: { lat: -34.0172, lng: 18.5117 },
  "Church – ICC": { lat: -33.9249, lng: 18.4241 },
};
function dist(a: string, b: string) {
  const A = AREA_COORDS[a],
    B = AREA_COORDS[b];
  if (!A || !B) return Number.POSITIVE_INFINITY;
  const dx = A.lat - B.lat,
    dy = A.lng - B.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

/** ===== Member Page (minimal) ===== */
const MemberPage: React.FC = () => {
  // Replace with your context/API in production
  const [members] = useState<Member[]>(seedMembers);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);

  // Current member (for demo, selectable)
  const activeMembers = useMemo(
    () => members.filter((m) => m.isActive),
    [members]
  );
  const [memberId, setMemberId] = useState<string>(
    activeMembers[0]?.id ?? "m1"
  );
  const me = members.find((m) => m.id === memberId);

  // Booking form
  const [pickupArea, setPickupArea] = useState<string>(
    me?.address || "Heathfield"
  );
  const [destination, setDestination] = useState<string>("Church – ICC");
  const [note, setNote] = useState<string>(""); // optional field you can remove
  const [suggestedDriver, setSuggestedDriver] = useState<Driver | undefined>(
    undefined
  );

  const availableDrivers = drivers.filter((d) => d.status === "available");

  function findClosestAvailableDriver(area: string) {
    if (availableDrivers.length === 0) return undefined;
    return availableDrivers.reduce(
      (best, d) => (dist(area, d.area) < dist(area, best.area) ? d : best),
      availableDrivers[0]
    );
  }

  const suggestDriver = () =>
    setSuggestedDriver(findClosestAvailableDriver(pickupArea));

  const bookTrip = () => {
    if (!me) return;
    const chosen = suggestedDriver ?? findClosestAvailableDriver(pickupArea);
    const newBooking: Booking = {
      id: "BKG-" + Math.floor(1000 + Math.random() * 9000),
      memberId: me.id,
      memberName: me.name,
      memberContact: me.contact,
      driverId: chosen?.id,
      driverName: chosen?.name,
      driverContact: chosen?.contact,
      pickupAddress: pickupArea,
      destination,
      status: chosen ? "accepted" : "pending",
      createdAt: new Date().toISOString(),
    };
    setBookings((s) => [newBooking, ...s]);
    if (chosen) {
      setDrivers((list) =>
        list.map((d) => (d.id === chosen.id ? { ...d, status: "busy" } : d))
      );
    }
    setSuggestedDriver(undefined);
    setNote("");
  };

  const myBookings = bookings.filter((b) => b.memberId === me?.id);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          Member
        </Typography>

        {/* Choose active member (demo only; hook to auth in real app) */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Who am I?</InputLabel>
              <Select
                label="Who am I?"
                value={memberId}
                onChange={(e) => {
                  setMemberId(e.target.value);
                  const m = members.find((mm) => mm.id === e.target.value);
                  if (m) setPickupArea(m.address);
                }}
              >
                {activeMembers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Book a Trip */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Book a Trip
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Pickup Area</InputLabel>
              <Select
                label="Pickup Area"
                value={pickupArea}
                onChange={(e) => setPickupArea(e.target.value)}
              >
                {Object.keys(AREA_COORDS).map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Destination</InputLabel>
              <Select
                label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {Object.keys(AREA_COORDS).map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <Button variant="outlined" onClick={suggestDriver}>
              Suggest Closest Driver
            </Button>
            <Button variant="contained" onClick={bookTrip}>
              Book
            </Button>
          </Stack>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Suggested Driver:
            </Typography>
            {suggestedDriver ? (
              <Typography>
                {suggestedDriver.name} ({suggestedDriver.area}) —{" "}
                {suggestedDriver.contact}
              </Typography>
            ) : (
              <Typography>-</Typography>
            )}
          </Box>
        </Paper>

        {/* My Bookings */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            My Bookings
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>#{b.id}</TableCell>
                    <TableCell>{b.driverName ?? "-"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {b.pickupAddress} → {b.destination}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={b.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {myBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
};

export default MemberPage;
