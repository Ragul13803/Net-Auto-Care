  // src/components/otpVerification/OtpVerificationPage.tsx
  import { Box, Button, Card, Typography } from "@mui/material";
  import { useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import axios from "axios";
  import { ToastContainer, toast } from "react-toastify";
  import background from "../assets/bgIMG.png";
  import { MuiOtpInput } from "mui-one-time-password-input";

  const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);

    const email = new URLSearchParams(location.search).get("email") || "";

    const handleOTPChange = (value: string) => {
      setOtp(value);
    };
    
    const handleOtpCancel = () => {
      navigate("/login");
    };

    const handleOtpVerify = async () => {
      if (!otp || otp.length < 6) {
        setError("Please enter a valid 6-digit OTP.");
        toast.error("Please enter a valid 6-digit OTP.");
        return;
      }
    
      try {
        const response = await axios.post("/verifyOtp", { email, otp });
    
        // If API responds with status 200 but contains an error message
        if (response.data?.error) {
          const serverError = response.data.error;
          setError(serverError);
          toast.error(serverError);
          return;
        }
    
        toast.success("OTP verified successfully !!!");
        navigate('/dashboard');
      } catch (err: any) {
        const fallbackError = "OTP verification failed. Please try again.";
        setError(fallbackError);
        toast.error(fallbackError);
      }
    };
    
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          backgroundImage: `url(${background})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Card
          sx={{
            padding: "40px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "260px",
            mr: 8,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "18px", fontWeight: "bold", mb: 2 }}
          >
            OTP Verification
          </Typography>

          <>
            <Typography variant="body2"
              sx={{
                display: "flex", // Make the container a flex container
                justifyContent: "center", // Align the text in the center
                textAlign: "center", // Ensure the text is centered within the container
                width: "100%", // Ensure the full width is used for the alignment
              }}
            >
              Please enter the 6 Digit <br /> OTP (One-Time Password) sent to your registered email to complete your verification.
            </Typography>
            <Box sx={{ padding: "10px" }}>
              <MuiOtpInput
                value={otp}
                onChange={(value) => handleOTPChange(value)}
                length={6}
                sx={{
                  maxWidth: "240px",
                  gap: "12px",
                  "& input": {
                    padding: "10px",
                  },
                }}
              />
            </Box>

            {error && (
              <Typography variant="caption" sx={{ color: "red", mt: 1 }}>
                {error}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={handleOtpVerify}
                sx={{
                  textTransform: "none",
                  bgcolor: "#5744E3",
                  boxShadow: "none",
                  "&:focus": { outline: "none", boxShadow: "none" },
                  "&:hover": { backgroundColor: "#5744E3", boxShadow: "none" },
                }}
              >
                Verify OTP
              </Button>
              <Button
                variant="outlined"
                onClick={handleOtpCancel}
                sx={{
                  textTransform: "none",
                  "&:focus": { border: "none" },
                  mt: "10px",
                }}
              >
                Cancel
              </Button>
            </Box>
          </>

          <ToastContainer />
        </Card>
      </Box>
    );
  };

  export default OtpVerificationPage;