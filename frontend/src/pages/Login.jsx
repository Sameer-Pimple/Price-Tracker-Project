import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaKey, FaShieldAlt } from "react-icons/fa"; // Added FaShieldAlt for OTP icon
import { FcGoogle } from "react-icons/fc";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Track if the user is in Forgot Password mode
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
      const { name, value } = e.target;

    if (name === "otp" && value.length > 6) return;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Email is required";
    }

    if (!isForgotPassword) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!formData.otp.trim()) {
        newErrors.otp = "OTP is required";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New Password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New Password must be at least 6 characters";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const data = await api.loginUser({
        email: formData.username,
        password: formData.password,
      });

      if (data && data.AccessToken) {
        login(data.AccessToken);
      }
      navigate("/", {
        state: { message: "Login Successful" },
      });
    } catch (error) {
      setErrors({ api: "Invalid username or password" });
      setMessage("Invalid username or password");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  // API handler for Triggering/Requesting the OTP
  const handleGetOtp = async (e) => {
      e.preventDefault();

    if (!formData.username.trim()) {
      setErrors({ username: "Please enter your email to get OTP" });
      return;
    }
    setErrors({});
    try {
      setIsOtpSent(true);
      await api.sendForgotOTP({ email: formData.username });
      setMessage("OTP sent successfully to your email!");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setIsOtpSent(false);
      setMessage("Failed to send OTP. Please try again.");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  // API handler for Resetting Password via Forgot Password form submission
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      // Replace with your exact forgot password API endpoint
      await api.updateUser({
        email: formData.username,
        otp: formData.otp,
        password: formData.newPassword,
      });

      setMessage("Password reset successful! Please login with your new password.");
      setAlertType("success");
      setShowAlert(true);
      setIsForgotPassword(false); // Switch back to login view
    } catch (error) {
      setMessage("Invalid OTP or Failed to reset password.");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  return (
    <div className="login-container">
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertType} variant="filled">
          {message}
        </Alert>
      </Snackbar>

      <div className="login-card">
        <img src="/logo.ico" alt="Logo" className="icon-box" />

        <h2>{isForgotPassword ? "Reset Password" : "Login"}</h2>
        <p className="subtitle">{isForgotPassword ? "Recover your account" : "Welcome Again"}</p>

        {/* Dynamic form submission routing based on mode */}
        <form onSubmit={isForgotPassword ? handleUpdateUser : handleSubmit}>

          {/* Email Box */}
          <div className={`input-box ${errors.username ? "error-border" : ""}`}>
            <FaUser className="input-icon" />
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <p className="error-text">{errors.username}</p>}

          {/* Render regular Login view fields */}
          {!isForgotPassword && (
            <>
              <div className={`input-box ${errors.password ? "error-border" : ""}`}>
                <FaKey className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}

              <div className="forgot">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => { setErrors({}); setIsForgotPassword(true); }}
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {/* Render Forgot Password exclusive fields */}
          {isForgotPassword && (
            <>
              {/* Inline OTP input & Get OTP Button row */}
              <div className="otp-inline-row">
                <div className={`input-box otp-input-box ${errors.otp ? "error-border" : ""}`}>
                  <FaShieldAlt className="input-icon" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>
                <button type="button"
                 className="get-otp-btn"
                 onClick={handleGetOtp}
                  disabled={isOtpSent}
                  style={{ cursor: isOtpSent ? "not-allowed" : "pointer" }}
                  >
                  {isOtpSent ? "Sent" : "Get OTP"}
                </button>
              </div>
              {errors.otp && <p className="error-text">{errors.otp}</p>}

              {/* Set New Password field */}
              <div className={`input-box ${errors.newPassword ? "error-border" : ""}`}>
                <FaKey className="input-icon" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Set New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}

              <div className="forgot">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => { setErrors({}); setIsForgotPassword(false); }}
                >
                  Back to Login
                </button>
              </div>
            </>
          )}

          <button type="submit" className="login-btn">
            {isForgotPassword ? "Update Password" : "Submit"}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            <div className="divider">
              <span>Or sign in with</span>
            </div>
            <button className="social-login">
              <FcGoogle />
              <span className="googlelable">Login With Google</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;