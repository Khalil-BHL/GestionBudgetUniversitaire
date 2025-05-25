import axios from "axios";
import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import estLogo from "../assets/ESTLOGO.webp";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //useEffect(() => {
  // const savedEmail = localStorage.getItem("rememberedEmail");
  // if (savedEmail) {
  //  setEmail(savedEmail);
  ////  setRememberMe(true);
  // }
  //}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Sending login request...");
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect based on role
      switch (response.data.user.role) {
        case "professor":
        case "Prof":
          navigate("/professor/dashboard");
          break;
        case "comptable":
        case "Comptable":
          navigate("/comptable/dashboard");
          break;
        case "directeur":
        case "Direction":
          navigate("/direction/dashboard");
          break;
        case "chef_departement":
        case "Chef Departement":
          navigate("/chef-departement/dashboard");
          break;
        case "admin":
        case "Admin":
          navigate("/admin/dashboard");
          break;
        default:
          console.warn("Unknown role:", response.data.user.role);
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-container">
            <img src={estLogo} alt="EST Logo" className="est-logo" />
          </div>
        </div>

        <div className="form-section">
          <h1 className="app-title">
            UNI<span className="budget-part">BUDGET</span>
          </h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <span className="input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="professor@univ.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <span className="input-icon">
                  <FaKey />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
