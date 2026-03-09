/**
 * @file src/pages/LoginPage.tsx
 * @description Login by phone number -> send OTP -> redirect to /verify-otp
 *
 * FIX (STEP 2):
 * - Handles backend errors returned by asJson() (object form: { status, error, message, data })
 * - Displays err.error OR err.message cleanly
 * - Keeps cooldown logic + design unchanged
 * - Adds Register link ("Don’t have an account? Create one")
 */

import { Box, Button, Paper, Stack, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { z } from "zod";
import { loginSchema } from "@/validations/auth";
import { useAuth } from "@/context/AuthContext";
import PhoneInput from "@/components/PhoneInput";
import AuthLayout from "@/components/AuthLayout";

import loginImage from "@/assets/loginimage.svg";
import logo from "@/assets/ICC LOGO (1).svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type LoginFormValues = z.input<typeof loginSchema>;

const RESEND_DELAY = 30; // seconds

// same “orange focus” style as Register
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

type ApiError = {
  status?: number;
  error?: string;
  message?: string;
  data?: any;
};

const getErrorMessage = (err: unknown) => {
  // Our asJson now throws an object, not Error()
  const e = err as ApiError;

  return (
    e?.error?.trim?.() ||
    e?.message?.trim?.() ||
    (typeof (err as any)?.toString === "function" ? String(err) : "") ||
    "Login failed. Please try again."
  );
};

const Login = () => {
  const { startLogin, setPhoneNumber } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { phone: "" },
  });

  const phoneValue = watch("phone");

  // Reset cooldown & error when phone number changes
  useEffect(() => {
    setCooldown(0);
    setError(null);
  }, [phoneValue]);

  // Countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = handleSubmit(async (data) => {
    const phone = data.phone;
    const storageKey = `otpCooldown_${phone}`;
    const lastSent = localStorage.getItem(storageKey);

    // Same phone requesting too fast
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - Number(lastSent)) / 1000);
      if (elapsed < RESEND_DELAY) {
        setError("You have already requested a verification code.");
        setCooldown(RESEND_DELAY - elapsed);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      await startLogin(phone);
      setPhoneNumber(phone);

      localStorage.setItem(storageKey, Date.now().toString());
      navigate("/verify-otp");
    } catch (err) {

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  const isDisabled = loading || cooldown > 0;

  return (
    <AuthLayout image={<img src={loginImage} width="63%" />}>
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

      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 360,
          bgcolor: "transparent",
        }}
      >
        <Stack spacing={3}>
          {/* HEADER */}
          <Stack spacing={2} alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="ICC Logo"
              sx={{ height: 100 }}
            />

            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ color: "#142C54", textAlign: "center" }}
            >
              Let’s go to{" "}
              <Box component="span" sx={{ color: "#FF9900" }}>
                ICC
              </Box>{" "}
              Cape Town
            </Typography>
          </Stack>

          {/* FORM */}
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2.5}>
              <PhoneInput
                register={register}
                errors={errors}
                name="phone"
                placeholder="+27780492663"
                textFieldSx={inputSx} // make sure PhoneInput supports this prop
              />

              {/* MAIN ERROR */}
              {error && (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#FFF7ED",
                    color: "#9A3412",
                    border: "1px solid #FF9900",
                    "& .MuiAlert-icon": { color: "#FF9900" },
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* COUNTDOWN MESSAGE */}
              {cooldown > 0 && (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#FFF7ED",
                    color: "#7C2D12",
                    border: "1px dashed #FF9900",
                    fontSize: "0.9rem",
                    "& .MuiAlert-icon": { color: "#FF9900" },
                  }}
                >
                  Please wait <strong>{cooldown}</strong> second
                  {cooldown > 1 ? "s" : ""} before requesting a new code.
                </Alert>
              )}

              {/* BUTTON — ALWAYS ORANGE (even disabled) */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isDisabled}
                sx={{
                  bgcolor: "#FF9900",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e68a00" },
                  "&.Mui-disabled": {
                    bgcolor: "#FF9900",
                    color: "#ffffff",
                    opacity: 0.75,
                    cursor: "not-allowed",
                  },
                }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>

              {/* REGISTER LINK */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "0.95rem",
                }}
              >
                Don’t have an account?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#FF9900",
                    cursor: "pointer",
                    fontWeight: 700,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Create one
                </Box>
              </Typography>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </AuthLayout>
  );
};

export default Login;
