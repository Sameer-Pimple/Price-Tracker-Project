import React, { useState } from "react";
import "./Login.css";
import { FaEnvelope, FaPhoneAlt, FaUser, FaKey } from "react-icons/fa";
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
    phone: "",
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
       name: formData.username, // match DTO
       email: formData.email,
       mobilenum: Number(formData.phone), // DTO expects Long
       password: formData.password,
     });

     console.log("Register Success:", data);

     // If backend returns JWT
     if (data.token) {
       localStorage.setItem("token", data.token);
     }
    login(data.token);

     navigate(`/`,{
         state:{
             message: "Registration Successful"}
             });
   } catch (error) {
     console.error("Register Error:", error);
     setErrors({ api: "Email Already Exists." });
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

          <div className={`input-box ${errors.phone ? "error-border" : ""}`}>
            <FaPhoneAlt className="input-icon" />
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}

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

        <button className="social-login">
          <FcGoogle />
          <span className="googlelable">Login With Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signin;
