import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import "./signup.css";
import Loader from "../../loader";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // AUTO-REDIRECT LOGIN HANDLING
  // -------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get("token");

    if (googleToken) {
      localStorage.setItem("token", googleToken);
      navigate("/", { replace: true });
    }

    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // -------------------------------
  // NORMAL EMAIL SIGNUP
  // -------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://elite-production-5537.up.railway.app/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! You can now log in.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  // -------------------------------
  // GOOGLE SIGNUP REDIRECT
  // -------------------------------
  const signupwithgoogle = () => {
    window.location.href =
      "https://elite-production-5537.up.railway.app/googlelogin";
  };

  // -------------------------------
  // UI RENDER
  // -------------------------------
  return (
    <div className="signup-container">

      {/* LEFT IMAGE */}
      <div className="signup-left">
        <img
          src="/Frame (1).png"
          alt="Signup illustration"
          className="signup-image"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="signup-right">
        <h1 className="signup-title">Welcome back</h1>

        <form className="signup-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />

          <button className="signup-btn" disabled={loading}>
            {loading ? <Loader size={20} color="#fff" /> : "Create account"}
          </button>

          {error && <div className="signup-error">{error}</div>}
        </form>

        <p className="signup-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <button className="google-btn" onClick={signupwithgoogle}>
          <FcGoogle className="google-icon" />
          Sign up with Google
        </button>
      </div>
    </div>
  );
}