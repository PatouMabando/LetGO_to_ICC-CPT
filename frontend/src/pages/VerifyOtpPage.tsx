import {
  Button,
  Paper,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/routes";

import AuthLayout from "@/components/AuthLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import otpImage from "@/assets/otpImage.svg";

const VerifyOtpPage = () => {
  const { verifyOtp, phoneNumber } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Prevent direct access / refresh
  useEffect(() => {
    if (!phoneNumber) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [phoneNumber, navigate]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const user = await verifyOtp(code);

      if (user.role === "admin") {
        navigate(ROUTES.ADMIN_ROOT, { replace: true });
      } else if (user.role === "driver") {
        navigate(ROUTES.DRIVER_ROOT, { replace: true });
      } else {
        navigate(ROUTES.MEMBER_ROOT, { replace: true });
      }
    } catch (err: any) {
      setError(err.message +" Wrong number? click the back arrow to change"|| "Invalid verification code");
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
          {/* TITLE */}
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#142C54", textAlign: "center" }}
          >
            Verify that’s you
          </Typography>

          {/* SUBTITLE */}
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
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                maxLength={1}
                inputMode="numeric"
                style={{
                  width: window.innerWidth < 400 ? 38 : 44,
                  height: window.innerWidth < 400 ? 38 : 44,
                  textAlign: "center",
                  fontSize: "1.2rem",
                  borderRadius: 8,
                  border: "1.5px solid #142C54",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#FF9900")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#142C54")
                }
              />
            ))}
          </Stack>

          {error && (
            <Alert
              severity="warning"
              sx={{
                borderRadius: 2,
                bgcolor: "#FFF7ED",        // soft orange background
                color: "#9A3412",          // dark orange text
                border: "1px solid #FF9900",
                "& .MuiAlert-icon": {
                  color: "#FF9900",
                },
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
  {/* BACK */}
  <Button
    onClick={() => navigate(ROUTES.LOGIN)}
    sx={{
      minWidth: "auto",
      p: 1,
      borderRadius: "50%",
      bgcolor: "rgba(255,255,255,0.85)",
      color: "#142C54",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      "&:hover": {
        bgcolor: "#FF9900",
        color: "#fff",
      },
    }}
  >
    <ArrowBackIcon sx={{ fontSize: 32 }} />
  </Button>

  {/* NEXT */}
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
