import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import Loader from "../../loader";
import "./forget.css";

export default function Forgot() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // If logged in → redirect to dashboard
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://elite-day-3-5.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("We have sent reset instructions to your email.");
        setEmail("");
      } else {
        setError(data.message || "Unable to process request.");
      }
    } catch (e){
      console.log(e)
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-page">

      {/* LEFT SIDE */}
      <div className="forgot-left">
        <h1 className="forgot-title">Forgot password?</h1>
        <p className="forgot-sub">
          Enter the email you used to create your account.  
          We will send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Email"
            className="forgot-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="forgot-btn" disabled={loading}>
            {loading ? <Loader size={18} /> : "Send Reset Link"}
          </button>

          {msg && <div className="forgot-msg">{msg}</div>}
          {error && <div className="forgot-error">{error}</div>}
        </form>

        <Link to="/login" className="forgot-back">
          ← Back to login
        </Link>
      </div>

      {/* RIGHT SIDE ILLUSTRATION */}
      <div className="forgot-right">
        <img
          src="/Frame (2).png"
          alt="Forgot password illustration"
          className="forgot-illustration"
        />
      </div>

    </div>
  );
}