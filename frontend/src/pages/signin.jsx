import React, { useState } from "react";
import "./Login.css";
import { FaEnvelope, FaPhoneAlt, FaUser, FaKey, FaShieldAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    otp: "", // ensure it's lowercase matching input name
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageColor, setOtpMessageColor] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce maximum length restrictions manually for number types
    if (name === "otp" && value.length > 6) return;
    if (name === "phone" && value.length > 10) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler to simulate sending OTP
  // Handler to get OTP
    const handleGetOtp = async (e) => {
      e.preventDefault(); // prevent form from submitting

      // Quick validation to ensure they type an email first
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email to get OTP" }));
        return;
      }

      // Clear email errors if valid
      setErrors((prev) => ({ ...prev, email: null }));
      setOtpMessage(""); // Reset message banner

      try {
          // If backend sends a 200/201, this resolves perfectly.
          // Note: Your Java backend sends standard HttpStatus.OK (200), not 201.
          setIsOtpSent(true);
          await api.sendOTP({ email: formData.email });


          setOtpMessage("OTP sent successfully");
          setOtpMessageColor("green");

      } catch (error) {
          console.error("Error caught inside component:", error.message);

          setIsOtpSent(false);
          setOtpMessageColor("red");

          // error.message holds the "Email Exist" string pulled from your backend body by the wrapper
          if (error.status === 409 || error.message.includes("Email Exist")) {
              setOtpMessage("Email Already Exists.");
          } else {
              setOtpMessage(error.message || "Something went wrong. Please try again.");
          }
      }

      // Clear the message banner after 5 seconds
      setTimeout(() => setOtpMessage(""), 5000);
    };

  const validate = () => {
    let newErrors = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Minimum 3 characters required";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // OTP Checks
    if (!isOtpSent) {
      newErrors.otp = "Verification required.";
    } else if (!formData.otp) {
      newErrors.otp = "Verification is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be exactly 6 digits";
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const data = await api.registerUser({
        name: formData.username,
        email: formData.email,
        otp: formData.otp,
        mobilenum: Number(formData.phone),
        password: formData.password,
      });

      if (data && data.AccessToken) {
        login(data.AccessToken);
      }
      navigate(`/`, {
        state: { message: "Registration Successful" }
      });
    } catch (error) {
      // 1. Extract the error message or status code from your API response
      const serverMessage = error.response?.data?.message || error.message || "";
      const statusCode = error.response?.status;


      if (statusCode === 400 || serverMessage.toLowerCase().includes("otp")) {
        setErrors({ otp: "Invalid or expired OTP. Please try again." });
      } else {
        // Fallback for other unexpected errors (network issues, etc.)
        setErrors({ api: "Something went wrong. Please try again later." });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/logo.ico" alt="Logo" className="icon-box" />
        <h2>Sign In</h2>
        <p className="subtitle">
          Make a new doc to bring your words, data, and teams together. For free
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username Box */}
          <div className={`input-box ${errors.username ? "error-border" : ""}`}>
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <p className="error-text">{errors.username}</p>}

          {/* Email Box */}
          <div className={`input-box ${errors.email ? "error-border" : ""}`}>
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* OTP Verification Grid/Flexbox Container */}
          <div className="verify-input" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              className="otp-btn"
              onClick={handleGetOtp}
              disabled={isOtpSent}
              style={{ cursor: isOtpSent ? "not-allowed" : "pointer" }}
            >
              {isOtpSent ? "Sent" : "Get OTP"}
            </button>
            <div className={`input-box ${errors.otp ? "error-border" : ""}`}>
                <FaShieldAlt className="input-icon" />
              <input
                type="number"
                name="otp" // normalized to lowercase
                placeholder="Enter 6-Digit OTP"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Success message banner */}
          {otpMessage && (<p className="success-text" style={{ color: otpMessageColor, fontSize: "12px", margin: "4px 0 0 5px",}}>{otpMessage}</p>)}
          {errors.otp && <p className="error-text">{errors.otp}</p>}

          {/* Phone Box */}
          <div className={`input-box ${errors.phone ? "error-border" : ""}`}>
            <FaPhoneAlt className="input-icon" />
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          {/* Password Box */}
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
            <a href="#">Help?</a>
          </div>

          <button type="submit" className="login-btn">
            Create Account
          </button>
          {errors.api && <p className="error-text">{errors.api}</p>}
        </form>

        <div className="divider">
          <span>Or sign in with</span>
        </div>

        <button type="button" className="social-login">
          <FcGoogle />
          <span className="googlelable">Login With Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signin;