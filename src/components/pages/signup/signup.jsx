import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import "./signup.css";
import Loader from "../../loader";  // <-- you forgot this import

export default function Register() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://elite-day-3-2.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! You can now log in.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch{
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE FORM */}
      <div className="register-left">
        <h1 className="register-title">Create account</h1>
        <p className="register-sub">Start your journey with Searchkro</p>

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Name"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />

          <button className="register-btn" disabled={loading}>
            {loading ? <Loader size={20} color="#fff" /> : "Create account"}
          </button>

          {error && <div className="register-error">{error}</div>}
        </form>

        <p className="register-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="register-right">
        <img
          src="/Frame (1).png"
          alt="Create account illustration"
          className="register-illustration"
        />
      </div>

    </div>
  );
}