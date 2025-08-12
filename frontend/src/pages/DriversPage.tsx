import React, { useMemo, useState } from "react";
import {
  Box,
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
  Typography,
} from "@mui/material";

type DriverStatus = "available" | "busy" | "offline";
type BookingStatus =
  | "pending"
  | "accepted"
  | "on-the-way"
  | "arrived"
  | "completed"
  | "cancelled";

type Driver = {
  id: string;
  name: string;
  contact: string;
  area: string;
  vehicleType: string;
  vehicleNumber: string;
  status: DriverStatus;
};

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
  {
    id: "BKG-1002",
    memberId: "m2",
    memberName: "Andre K",
    memberContact: "071 333 4444",
    driverId: "d2",
    driverName: "Grace L",
    driverContact: "074 303 4040",
    pickupAddress: "Ottery",
    destination: "Church – ICC",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

const DriverPage: React.FC = () => {

  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);

  const [driverId, setDriverId] = useState<string>(drivers[0]?.id ?? "d1");
  const me = useMemo(
    () => drivers.find((d) => d.id === driverId),
    [drivers, driverId]
  );

  const myTrips = useMemo(
    () => bookings.filter((b) => b.driverId === me?.id),
    [bookings, me?.id]
  );

  const updateMyStatus = (status: DriverStatus) => {
    setDrivers((list) =>
      list.map((d) => (d.id === driverId ? { ...d, status } : d))
    );
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((list) =>
      list.map((b) =>
        b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
      )
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          Driver
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Who am I?</InputLabel>
              <Select
                label="Who am I?"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                {drivers.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>My Status</InputLabel>
              <Select
                label="My Status"
                value={me?.status ?? "offline"}
                onChange={(e: SelectChangeEvent) =>
                  updateMyStatus(e.target.value as DriverStatus)
                }
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            My Assigned Trips
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Pickup</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myTrips.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>#{b.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{b.memberName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.memberContact}
                      </Typography>
                    </TableCell>
                    <TableCell>{b.pickupAddress}</TableCell>
                    <TableCell>{b.destination}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={b.status}
                          onChange={(e: SelectChangeEvent) =>
                            updateBookingStatus(
                              b.id,
                              e.target.value as BookingStatus
                            )
                          }
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="accepted">Accepted</MenuItem>
                          <MenuItem value="on-the-way">On the way</MenuItem>
                          <MenuItem value="arrived">Arrived</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {myTrips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No trips yet
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

export default DriverPage;
