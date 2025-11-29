import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import "./sidebar.css";
import { SlLogout } from "react-icons/sl";
import { RxDashboard } from "react-icons/rx";
import { TbCategory2 } from "react-icons/tb";
import { MdOutlineReport } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <RxDashboard/> },
    { label: "Categories", to: "/categories", icon: <TbCategory2/> },
    { label: "Location", to: "/location", icon: <MdOutlineReport/> },
    { label: "Rating", to: "/rating", icon: <FaRegStar/> },
    { label: "Reports", to: "/reports", icon: <MdOutlinePrivacyTip/> },
  ];

  return (
    <aside className="sidebar">
      
      {/* LOGO AREA */}
      <div className="sidebar-logo">
        <div className="logo-circle">V</div>
        <span className="logo-text">Searchkro</span>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT BUTTON */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <SlLogout className="sidebar-icon" />
        Logout
      </button>
    </aside>
  );
}