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


const AdminPage: React.FC = () => {
  // Replace with your context/API in production
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);

  // Stats
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.isActive).length;
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter(
      (d) => d.status === "available"
    ).length;
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(
      (b) => !["completed", "cancelled"].includes(b.status)
    ).length;
    return {
      totalMembers,
      activeMembers,
      totalDrivers,
      availableDrivers,
      totalBookings,
      activeBookings,
    };
  }, [members, drivers, bookings]);

  const toggleMemberStatus = (id: string) =>
    setMembers((list) =>
      list.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );

  const updateDriverStatus = (id: string, status: DriverStatus) =>
    setDrivers((list) => list.map((d) => (d.id === id ? { ...d, status } : d)));

  const updateBookingStatus = (id: string, status: BookingStatus) =>
    setBookings((list) =>
      list.map((b) =>
        b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
      )
    );

  const [memberForm, setMemberForm] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [driverForm, setDriverForm] = useState({
    name: "",
    contact: "",
    area: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  const addMember = () => {
    if (!memberForm.name.trim()) return;
    const m: Member = {
      id: crypto.randomUUID(),
      name: memberForm.name.trim(),
      contact: memberForm.contact.trim(),
      address: memberForm.address.trim(),
      isActive: true,
    };
    setMembers((s) => [m, ...s]);
    setMemberForm({ name: "", contact: "", address: "" });
  };

  const addDriver = () => {
    if (!driverForm.name.trim()) return;
    const d: Driver = {
      id: crypto.randomUUID(),
      name: driverForm.name.trim(),
      contact: driverForm.contact.trim(),
      area: driverForm.area.trim(),
      vehicleType: driverForm.vehicleType.trim(),
      vehicleNumber: driverForm.vehicleNumber.trim(),
      status: "available",
    };
    setDrivers((s) => [d, ...s]);
    setDriverForm({
      name: "",
      contact: "",
      area: "",
      vehicleType: "",
      vehicleNumber: "",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          Admin
        </Typography>

        {/* Overview */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Members
              </Typography>
              <Typography variant="h5">{stats.totalMembers}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeMembers} active
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Drivers
              </Typography>
              <Typography variant="h5">{stats.totalDrivers}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.availableDrivers} available
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Bookings
              </Typography>
              <Typography variant="h5">{stats.totalBookings}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeBookings} active
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Members */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Members
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              label="Name"
              value={memberForm.name}
              onChange={(e) =>
                setMemberForm({ ...memberForm, name: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Contact"
              value={memberForm.contact}
              onChange={(e) =>
                setMemberForm({ ...memberForm, contact: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Address"
              value={memberForm.address}
              onChange={(e) =>
                setMemberForm({ ...memberForm, address: e.target.value })
              }
            />
            <Button variant="contained" onClick={addMember}>
              Add
            </Button>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Toggle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.name}</TableCell>
                    <TableCell>{m.contact}</TableCell>
                    <TableCell>{m.address}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={m.isActive ? "Active" : "Inactive"}
                        color={m.isActive ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => toggleMemberStatus(m.id)}
                      >
                        {m.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No members
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Drivers */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Drivers
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              label="Name"
              value={driverForm.name}
              onChange={(e) =>
                setDriverForm({ ...driverForm, name: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Contact"
              value={driverForm.contact}
              onChange={(e) =>
                setDriverForm({ ...driverForm, contact: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Area"
              value={driverForm.area}
              onChange={(e) =>
                setDriverForm({ ...driverForm, area: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Vehicle Type"
              value={driverForm.vehicleType}
              onChange={(e) =>
                setDriverForm({ ...driverForm, vehicleType: e.target.value })
              }
            />
            <TextField
              size="small"
              label="Vehicle Number"
              value={driverForm.vehicleNumber}
              onChange={(e) =>
                setDriverForm({ ...driverForm, vehicleNumber: e.target.value })
              }
            />
            <Button variant="contained" onClick={addDriver}>
              Add
            </Button>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Typography fontWeight={600}>{d.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {d.contact}
                      </Typography>
                    </TableCell>
                    <TableCell>{d.area}</TableCell>
                    <TableCell>
                      <Typography>{d.vehicleType}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {d.vehicleNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={d.status}
                          onChange={(e: SelectChangeEvent) =>
                            updateDriverStatus(
                              d.id,
                              e.target.value as DriverStatus
                            )
                          }
                        >
                          <MenuItem value="available">Available</MenuItem>
                          <MenuItem value="busy">Busy</MenuItem>
                          <MenuItem value="offline">Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
                {drivers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No drivers
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Bookings */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Bookings
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>#{b.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{b.memberName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.memberContact}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {b.driverName ?? "-"}
                      {b.driverContact ? (
                        <Typography variant="body2" color="text.secondary">
                          {b.driverContact}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {b.pickupAddress} → {b.destination}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={b.status}
                          onChange={(e: SelectChangeEvent) =>
                            updateBookingStatus(
                              b.id,
                              e.target.value as BookingStatus
                            )
                          }
                        >
                          {[
                            "pending",
                            "accepted",
                            "on-the-way",
                            "arrived",
                            "completed",
                            "cancelled",
                          ].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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

export default AdminPage;
