import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Loader from "../../loader";
import "./reset.css";

export default function Reset() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!password.trim() || !confirm.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://elite-day-3-5.onrender.com/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("Password has been reset successfully!");
        setPassword("");
        setConfirm("");

        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="reset-page">

      {/* LEFT SIDE */}
      <div className="reset-left">
        <h1 className="reset-title">Create new password</h1>
        <p className="reset-sub">Enter a strong password for your account.</p>

        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="password"
            placeholder="New password"
            className="reset-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="reset-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="reset-btn" disabled={loading}>
            {loading ? <Loader size={18} /> : "Reset Password"}
          </button>

          {msg && <div className="reset-msg">{msg}</div>}
          {error && <div className="reset-error">{error}</div>}
        </form>

        <Link to="/login" className="reset-back">← Back to login</Link>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="reset-right">
        <img
          src="/Frame (3).png"
          alt="Reset password illustration"
          className="reset-illustration"
        />
      </div>

    </div>
  );
}