import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaKey } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


const Login = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

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
    const data = await api.loginUser({
      name: formData.username,
      password: formData.password,
    });

    console.log("Login Success:", data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      }
      login(data.token);

      navigate("/", {
         state: {
            message: "Login Successful"
         }
      });
  } catch (error) {
    console.error("Login Error:", error);
    setErrors({ api: "Invalid username or password" });
                  setShowAlert(true);

                  setTimeout(() => {
                     setShowAlert(false);
                  }, 3000);
  }
};



  return (
    <div className="login-container">
        <Snackbar
                open={showAlert}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
             >
                <Alert severity="error">
                   {"Invalid username or password"}
                </Alert>
             </Snackbar>
      <div className="login-card">
        <img src="/logo.ico" alt="Logo" className="icon-box" />

        <h2>Login</h2>
        <p className="subtitle">Welcome Again</p>

        <form onSubmit={handleSubmit}>
          <div className={`input-box ${errors.username ? "error-border" : ""}`}>
            <FaUser className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <p className="error-text">{errors.username}</p>}

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
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Submit
          </button>
        </form>

        <div className="divider">
          <span>Or sign in with</span>
        </div>

        <button className="social-login">
          <FcGoogle />
          <span className="googlelable">Login With Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
