// src/pages/VerifyOtpPage.tsx
import { Button, Paper, Stack, Typography, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";
import AuthLayout from "@/components/AuthLayout";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import otpImage from "@/assets/otpImage.svg";

/**
 * FILE: src/pages/VerifyOtpPage.tsx
 * PURPOSE:
 * - Collect 6-digit OTP and verify it
 * - Redirect user to the correct dashboard based on role (admin/driver/member)
 * - Prevent direct access if user refreshes without a phoneNumber in context
 *
 * STATUS GATE (backend):
 * - If user status is "pending" or "blocked", backend returns 403 with { error: "..."}.
 * - We display that message nicely here.
 *
 * UX:
 * - Auto focus next input
 * - Backspace goes to previous input if current is empty
 * - Paste full 6-digit code supported
 * - Avoids window.innerWidth inside render
 */

const OTP_LEN = 6;

const VerifyOtpPage = () => {
  const { verifyOtp, phoneNumber } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LEN }, () => ""),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Responsive input size without using window.innerWidth inside render
  const boxSize = useMemo(() => ({ xs: 38, sm: 44 }), []);

  // Prevent direct access / refresh
  useEffect(() => {
    if (!phoneNumber) navigate(ROUTES.LOGIN, { replace: true });
  }, [phoneNumber, navigate]);

  const focusIndex = (i: number) => {
    const el = inputsRef.current[i];
    el?.focus();
    el?.select?.();
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    setError(null);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < OTP_LEN - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Backspace") return;

    // if current has value, normal backspace should clear it
    if (otp[index]) return;

    // if current empty, go back
    if (index > 0) focusIndex(index - 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(text)) return;

    const digits = text.slice(0, OTP_LEN).split("");
    if (digits.length === 0) return;

    e.preventDefault();
    setError(null);

    setOtp(() => {
      const next = Array.from({ length: OTP_LEN }, (_, i) => digits[i] || "");
      return next;
    });

    const nextIndex = Math.min(digits.length, OTP_LEN - 1);
    focusIndex(nextIndex);
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LEN) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ backend may reject here if status pending/blocked
      const user = await verifyOtp(code);

      if (user.role === "admin") navigate(ROUTES.ADMIN_ROOT, { replace: true });
      else if (user.role === "driver")
        navigate(ROUTES.DRIVER_ROOT, { replace: true });
      else navigate(ROUTES.MEMBER_ROOT, { replace: true });
    } catch (err: any) {
      // ✅ handles both:
      // - thrown Error(message)
      // - thrown { message }
      // - thrown { error }  <-- your backend sends this often
      const msg =
        err?.error?.trim() ||
        err?.message?.trim() ||
        "Invalid verification code. Wrong number? Click the back arrow to change.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={<img src={otpImage} width="70%" />}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 360,
          bgcolor: "transparent",
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#142C54", textAlign: "center" }}
          >
            Verify that’s you
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#6B7280", textAlign: "center" }}
          >
            Enter the code sent to your phone number
          </Typography>

          {/* OTP INPUTS */}
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            justifyContent="center"
          >
            {otp.map((digit, index) => (
              <Box
                key={index}
                component="input"
                ref={(el: HTMLInputElement | null) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index)
                }
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                sx={{
                  width: boxSize,
                  height: boxSize,
                  textAlign: "center",
                  fontSize: "1.2rem",
                  borderRadius: 2,
                  border: "1.5px solid #142C54",
                  outline: "none",
                  transition: "border-color 120ms ease",
                  "&:focus": { borderColor: "#FF9900" },
                }}
              />
            ))}
          </Stack>

          {error && (
            <Alert
              severity="warning"
              sx={{
                borderRadius: 2,
                bgcolor: "#FFF7ED",
                color: "#9A3412",
                border: "1px solid #FF9900",
                "& .MuiAlert-icon": { color: "#FF9900" },
                width: "100%",
              }}
            >
              {error}
            </Alert>
          )}

          {/* ACTIONS */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
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
              <ArrowBackIcon sx={{ fontSize: 32 }} />
            </Button>

            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                bgcolor: "#FF9900",
                borderRadius: 2,
                px: { xs: 3, sm: 4 },
                py: 1,
                fontWeight: 600,
                "&:hover": { bgcolor: "#e68a00" },
              }}
            >
              {loading ? "Verifying..." : "Next"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
