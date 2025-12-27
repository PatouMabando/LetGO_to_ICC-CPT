import React, { useState } from "react";
import {
  Paper,
  Stack,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  Card,
  CardContent,
  Fade,
  Chip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChurchIcon from "@mui/icons-material/Church";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  RegisterOptions,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../context/AuthContext";
import { loginSchema } from "@/validations/auth";
import { useNavigate } from "react-router-dom";
import PhoneInput from "@/components/PhoneInput";
import CustomInput from "@/components/CustomInput";

type LoginFormValues = {
  phone: string;
  otp?: string;
};

const Login: React.FC = () => {
  const { startLogin, verifyOtp, setPhoneNumber, phoneNumber, user } =
    useAuth();

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const onSubmit = handleSubmit(async (data) => {
    setMessage(null);
    setLoading(true);

    try {
      if (stage === "phone") {
        // Send OTP
        const res = await startLogin(data.phone);
        setPhoneNumber(data.phone);
        setDevOtp(res.devOtp);
        setStage("otp");
        setMessage({
          type: "success",
          text: "Verification code sent! Please check your phone.",
        });
      } else {
        // Verify OTP
        if (!data.otp) {
          setMessage({
            type: "error",
            text: "Please enter the 6-digit verification code.",
          });
          setLoading(false);
          return;
        }
        const loggedInUser = await verifyOtp(data.otp);
        setMessage({
          type: "success",
          text: "Welcome! You're all set to book your trip.",
        });
        reset();
        setStage("phone");
        setDevOtp(undefined);
        
        //Role Based Redirect
        if (loggedInUser.role === "admin") {
          navigate("/admin");
        } else if (loggedInUser.role === "driver") {
          navigate("/driver")
        } else {
          navigate("/member")
        }
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.message || "Operation failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  });

  const backToPhone = () => {
    setStage("phone");
    setMessage(null);
    setDevOtp(undefined);
    reset({ phone: phoneNumber, otp: "" });
  };

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
      <Box sx={{ width: "100%", maxWidth: 480, mx: "auto" }}>
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
              Sign In to ICC
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Book your seat for our upcoming journey of faith and fellowship
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
            {user && (
              <Fade in timeout={600}>
                <Alert
                  severity="success"
                  icon={<CheckCircleOutlineIcon />}
                  sx={{
                    borderRadius: 2,
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Welcome back, {user.name}!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.phoneNumber}
                    </Typography>
                  </Box>
                </Alert>
              </Fade>
            )}

            {message && (
              <Fade in timeout={400}>
                <Alert severity={message.type} sx={{ borderRadius: 2 }}>
                  {message.text}
                </Alert>
              </Fade>
            )}

            <form onSubmit={onSubmit}>
              <Stack spacing={3}>
                <PhoneInput register={register} errors={errors} name="phone" />

                {stage === "otp" && (
                  <>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Chip
                        label={`Code sent to ${phoneNumber}`}
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                      />
                      <Button
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        onClick={backToPhone}
                        sx={{ ml: 2, borderRadius: 2 }}
                      >
                        Change Number
                      </Button>
                    </Box>

                    <CustomInput
                      name="otp"
                      register={register}
                      errors={errors}
                      label="6-Digit Verification Code"
                      placeholder="000000"
                      icon={<SecurityIcon color="primary" />}
                      inputStyle={{
                        letterSpacing: "0.5rem",
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: 500,
                      }}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: 2,
                    background:
                      loading || (stage === "otp" && !phoneNumber)
                        ? undefined
                        : "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
                  }}
                >
                  {loading
                    ? stage === "phone"
                      ? "Sending Code..."
                      : "Verifying..."
                    : stage === "phone"
                    ? "Send Verification Code"
                    : "Verify & Continue"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
              >
                Don't have an account?
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              fullWidth
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Sign up
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
