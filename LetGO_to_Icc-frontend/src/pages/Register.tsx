/**
 * @file src/pages/Register.tsx
 * @description
 * Registration page (public).
 * - UI matches the Login theme (orange focus + rounded fields).
 * - Fields:
 *   - All roles: Full name, Phone number, Role
 *   - Member/Driver: Address (hidden for Admin)
 *   - Driver only: Vehicle details (expands)
 * - Data safety:
 *   - When role switches to Admin → clears address automatically
 *   - When role switches away from Driver → clears car fields automatically
 */

import React from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Divider,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Collapse,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { registerSchema } from "@/validations/auth";
import { BASE, asJson } from "@/api";
import RegisterLayout from "@/components/RegisterLayout";

import registerImage from "@/assets/register-illustration.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& fieldset": { borderColor: "#CBD5E1" },
    "&:hover fieldset": { borderColor: "#FF9900" },
    "&.Mui-focused fieldset": {
      borderColor: "#FF9900",
      borderWidth: 2,
    },
  },
};

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const role = watch("role");
  const isDriver = role === "driver";

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  // ✅ Keep submitted payload clean when user changes role
  React.useEffect(() => {
    // Admin doesn't need address
    if (role === "admin") {
      setValue("address", "");
    }

    // If not driver, clear driver-only fields
    if (role !== "driver") {
      setValue("carModel", "");
      setValue("carColor", "");
      setValue("carPlate", "");
      setValue("carType", "");
      setValue("carYear", "");
    }
  }, [role, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      await asJson(res);
      navigate("/login");
    } catch (err: any) {
      setMessage(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      {/* HEADER */}
      <Box sx={{ bgcolor: "#142C54", py: 4, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "#fff",
          }}
        >
          Become a{" "}
          <Box component="span" sx={{ color: "#FF9900" }}>
            Verified Member
          </Box>
        </Typography>
      </Box>
 {/* BACK ARROW */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <Button
          onClick={() => navigate("/")}
          sx={{
            minWidth: "auto",
            p: 1,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.85)",
            color: "#142C54",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "#FF9900", color: "#fff" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </Button>
      </Box>
      {/* BODY */}
      <RegisterLayout image={<img src={registerImage} width="100%" />}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 440,
            bgcolor: "transparent",
            alignSelf: "center",
          }}
        >
          <Stack spacing={3}>
            <form onSubmit={onSubmit} noValidate>
              <Stack spacing={2.5}>
                {/* FULL NAME */}
                <TextField
                  label="Full name"
                  {...register("fullName")}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* PHONE */}
                <TextField
                  label="Phone number"
                  placeholder="+27780492663"
                  {...register("phoneNumber")}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* ADDRESS (hidden for admin) */}
                {role !== "admin" && (
                  <TextField
                    label="Address"
                    placeholder="e.g. Cape Town Station"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#FF9900" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {/* ROLE */}
                <FormControl fullWidth error={!!errors.role} sx={inputSx}>
                  <InputLabel>Role</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Role">
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="driver">Driver</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>

                {/* DRIVER — EXPANDS DOWN ONLY */}
                <Collapse in={isDriver} timeout={300} unmountOnExit>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#F8FAFC",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        mb: 2,
                        color: "#142C54",
                      }}
                    >
                      Driver details
                    </Typography>

                    <Stack spacing={2}>
                      <TextField
                        label="Car Model"
                        {...register("carModel")}
                        error={!!errors.carModel}
                        helperText={errors.carModel?.message}
                        sx={inputSx}
                      />
                      <TextField
                        label="Car Color"
                        {...register("carColor")}
                        error={!!errors.carColor}
                        helperText={errors.carColor?.message}
                        sx={inputSx}
                      />
                      <TextField
                        label="Car Plate"
                        {...register("carPlate")}
                        error={!!errors.carPlate}
                        helperText={errors.carPlate?.message}
                        sx={inputSx}
                      />
                      <TextField
                        label="Car Type"
                        {...register("carType")}
                        error={!!errors.carType}
                        helperText={errors.carType?.message}
                        sx={inputSx}
                      />
                      <TextField
                        label="Car Year"
                        {...register("carYear")}
                        error={!!errors.carYear}
                        helperText={errors.carYear?.message}
                        sx={inputSx}
                        inputProps={{ inputMode: "numeric", maxLength: 4 }}
                      />
                    </Stack>
                  </Box>
                </Collapse>

                {/* MAIN ERROR */}
                {message && (
                  <Fade in>
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                        bgcolor: "#FFF7ED",
                        border: "1px solid #FF9900",
                        color: "#9A3412",
                        "& .MuiAlert-icon": { color: "#FF9900" },
                      }}
                    >
                      {message}
                    </Alert>
                  </Fade>
                )}

                {/* SUBMIT */}
                <Button
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FF9900",
                    borderRadius: "12px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#e68a00" },
                  }}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>

                <Divider />

                  {/* ✅ REGISTER LINK */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "0.95rem",
                }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#FF9900",
                    cursor: "pointer",
                    fontWeight: 700,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Login
                </Box>
              </Typography>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </RegisterLayout>
    </>
  );
};

export default Register;