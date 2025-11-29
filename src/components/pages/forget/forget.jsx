import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../loader";
import "./forget.css";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://elite-day-3-5.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMsg("Check your email for reset instructions.");
        setEmail("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-page">
      {/* LEFT */}
      <div className="forgot-left">
        <h1>Forgot Password?</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={loading}>
            {loading ? <Loader /> : "Send Reset Link"}
          </button>
        </form>

        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}

        <Link to="/login">← Back to login</Link>
      </div>

      {/* RIGHT */}
      <div className="forgot-right">
        <img src="/Frame (2).png" alt="" />
      </div>
    </div>
  );
}