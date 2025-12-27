// pages/Register.tsx
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

import { registerSchema } from "@/validations/auth";
import { BASE, asJson } from "@/api";
import RegisterLayout from "@/components/RegisterLayout";

import registerImage from "@/assets/register-illustration.svg";

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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const role = watch("role");
  const isDriver = role === "driver";

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

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

      {/* BODY */}
      <RegisterLayout image={<img src={registerImage} width="120%" />}>
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
                {/* FIRST NAME */}
                <TextField
                  label="First name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: "#FF9900" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* LAST NAME */}
                <TextField
                  label="Last name"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
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

                {/* DRIVER — EXPAND DOWN ONLY */}
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
                      <TextField label="Car Model" {...register("carModel")} sx={inputSx} />
                      <TextField label="Car Color" {...register("carColor")} sx={inputSx} />
                      <TextField label="Car Plate" {...register("carPlate")} sx={inputSx} />
                      <TextField label="Car Type" {...register("carType")} sx={inputSx} />
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
                    bgcolor: "#FFF7ED",
                    border: "1px solid #FF9900",
                    color: "#9A3412",
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
                    "&:hover": { bgcolor: "#e68a00" },
                  }}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>

                <Divider />

                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: "12px",
                    borderColor: "#142C54",
                    color: "#142C54",
                  }}
                >
                  Already have an account? Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </RegisterLayout>
    </>
  );
};

export default Register;
