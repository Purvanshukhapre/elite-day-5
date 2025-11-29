import React, { useEffect, useState } from "react";
import "./header.css";
import { useAuth } from "../auth";

export default function Topbar() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  // ---- FETCH USER PROFILE ----
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://elite-day-3-5.onrender.com/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (res.ok) setUserData(data.user);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const avatarLetter =
    userData?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="topbar">

      {/* SEARCH BAR */}
      <div className="topbar-search-container">
        <img src="/icons/search.svg" alt="" className="search-icon" />
        <input
          type="text"
          placeholder="Search anything..."
          className="topbar-search"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="topbar-right">

        {/* Notification icon */}
        <img src="/icons/bell.svg" alt="" className="topbar-bell" />

        {/* User section */}
        <div className="topbar-user" onClick={toggleMenu}>
          <span className="topbar-username">
            {userData?.name || "Loading..."}
          </span>

          {/* Avatar: dynamic image or fallback circle */}
          {userData?.avatar ? (
            <img src={userData.avatar} alt="" className="topbar-avatar-img" />
          ) : (
            <div className="topbar-avatar">{avatarLetter}</div>
          )}
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="topbar-dropdown">

            <div className="dropdown-user-info">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt=""
                  className="dropdown-avatar-img"
                />
              ) : (
                <div className="dropdown-avatar">{avatarLetter}</div>
              )}

              <div className="dropdown-name">
                {userData?.name || "User"}
              </div>
            </div>

            <button className="dropdown-item" onClick={logout}>
              <img src="/icons/logout.svg" alt="" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}