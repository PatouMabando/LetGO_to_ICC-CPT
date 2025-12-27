import React from "react";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Box,
  Divider,
  Card,
  CardContent,
  Fade,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Link as MUILink,
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ChurchIcon from "@mui/icons-material/Church";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import BadgeIcon from "@mui/icons-material/Badge";
import DriveEtaIcon from "@mui/icons-material/DriveEta";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/validations/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-hot-toast";

import { BASE, asJson } from "@/api/index";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const isDriver = watch("role") === "driver";
  const [message, setMessage] = React.useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  const signup = async (data: RegisterFormValues) => {
    const response = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return asJson(response);
  };

  const onSubmit = handleSubmit(async (values: RegisterFormValues) => {
    setMessage(null);
    setIsSigningUp(true);
    try {
      await signup(values);
      setMessage("Registration successful. You can now log in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
      setMessage(error?.message || "Registration failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #F1F8FE 50%, #FAFBFF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
        <Card
          elevation={0}
          sx={{
            mb: 3,
            background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <ChurchIcon sx={{ fontSize: 28 }} />
                <DirectionsBusIcon sx={{ fontSize: 24 }} />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Register to join trips and (optionally) offer lifts
            </Typography>
          </CardContent>
        </Card>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack spacing={3}>
            {message && (
              <Fade in timeout={300}>
                <Alert
                  severity={
                    message.startsWith("Registration successful")
                      ? "success"
                      : "error"
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {message}
                </Alert>
              </Fade>
            )}

            <form onSubmit={onSubmit}>
              <Stack spacing={3}>
                {/* Name Fields */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="First Name"
                    {...register("name")}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Last Name"
                    {...register("lastName")}
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Stack>

                {/* Phone */}
                <TextField
                  label="Mobile Number (E.164)"
                  placeholder="+27821234567"
                  {...register("phoneNumber")}
                  fullWidth
                  required
                  error={!!errors.phoneNumber}
                  helperText={
                    errors.phoneNumber?.message || "Example: +27821234567"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Role */}
                <FormControl fullWidth required error={!!errors.role}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select labelId="role-select-label" {...field}>
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="driver">Driver</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <FormHelperText>
                      {errors.role.message as string}
                    </FormHelperText>
                  )}
                </FormControl>

                {isDriver && (
                  <Fade in>
                    <Box>
                      <Divider sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Driver Details
                        </Typography>
                      </Divider>
                      <Chip
                        icon={<DriveEtaIcon />}
                        label="Provide your vehicle details"
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 2, borderRadius: 2 }}
                      />
                      <Stack spacing={2}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
                          <TextField
                            label="Car Model"
                            {...register("carModel")}
                          />
                          <TextField
                            label="Car Color"
                            {...register("carColor")}
                          />
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
                          <TextField
                            label="Plate Number"
                            {...register("carPlate")}
                          />
                          <TextField
                            label="Car Type"
                            {...register("carType")}
                          />
                        </Stack>
                        <TextField
                          label="Year (YYYY)"
                          {...register("carYear")}
                          error={!!errors.carYear}
                          helperText={errors.carYear?.message}
                          inputProps={{ maxLength: 4, inputMode: "numeric" }}
                        />
                      </Stack>
                    </Box>
                  </Fade>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSigningUp}
                  fullWidth
                >
                  {isSigningUp ? "Registering..." : "Create Account"}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Already have an account?
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={() => navigate("/login")}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
