import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import "./login.css";
import Loader from "../../loader";

export default function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in → redirect
  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password.trim()) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("https://elite-production-5537.up.railway.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      setError(data.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    // HANDLE DIFFERENT TOKEN NAMES
    const token = data.token || data.accessToken || data.jwt;

    if (!token) {
      setError("Login failed: No token received from server.");
      setLoading(false);
      return;
    }

    // Save token
    login(token);
    navigate("/", { replace: true });

  } catch (err) {
    console.log(err);
    setError("Network error. Try again.");
  }

  setLoading(false);
};



  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />

          <div className="login-row">
            <Link to="/forgot" className="login-link-small">
              Forgot password?
            </Link>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? <Loader size={20} color="#fff" /> : "Log in"}
          </button>

          {error && <div className="login-error">{error}</div>}
        </form>

        <p className="login-alt">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      {/* RIGHT SIDE IMAGE (Figma Style) */}
      <div className="login-right">
        <img
          src="/Frame.png"
          alt="Login illustration"
          className="login-illustration"
        />
      </div>

    </div>
  );
}