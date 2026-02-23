import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";
import bgimg from "../assets/bgimg.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registered successfully!", {
        className: "custom-toast",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", {
        className: "custom-toast",
      });
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="overlay"></div>

      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ?  <FaEye /> : <FaEyeSlash /> }
            </span>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Register;