import React, { useEffect, useState } from "react";
import "./logout.css";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";

export default function LogoutPopup({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [counter, setCounter] = useState(3);

  useEffect(() => {
    let mounted = true;
    let tick;

    // If counter reaches 0, schedule logout asynchronously and return.
    if (counter === 0) {
      // schedule logout on next tick to avoid synchronous state/routing inside effect
      const logoutTimer = setTimeout(() => {
        if (!mounted) return;
        // perform logout
        logout();
        navigate("/login", { replace: true });
      }, 0);

      // cleanup for logoutTimer if unmounted before it runs
      return () => {
        mounted = false;
        clearTimeout(logoutTimer);
      };
    }

    // normal countdown tick
    tick = setTimeout(() => {
      if (!mounted) return;
      setCounter((c) => c - 1);
    }, 1000);

    return () => {
      mounted = false;
      if (tick) clearTimeout(tick);
    };
  }, [counter, logout, navigate]);

  const handleLogoutNow = () => {
    // immediate logout (user clicked button)
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <button className="logout-close" onClick={onClose}>
          ×
        </button>

        <div className="logout-icon">🚪</div>

        <h2 className="logout-title">You are Logged Out?</h2>

        <p className="logout-text">
          You are about to logout in <strong>{counter} secs</strong>. Do you want to continue?
        </p>

        <button className="logout-confirm" onClick={handleLogoutNow}>
          Log Out
        </button>
      </div>
    </div>
  );
}