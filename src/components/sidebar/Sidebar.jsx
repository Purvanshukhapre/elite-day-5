import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar d-flex flex-column" style={{ minHeight: "100vh" }}>
      <h5 className="mb-4">Searchkro</h5>

      <nav className="nav flex-column">
        <Link className="nav-link mb-2" to="/dashboard">Dashboard</Link>
        <Link className="nav-link mb-2" to="#">Categories</Link>
        <Link className="nav-link mb-2" to="#">Reports</Link>
        <Link className="nav-link mb-2" to="#">Legal Policy</Link>
      </nav>

      <div className="mt-auto">
        <button className="btn btn-outline-light btn-sm">Logout</button>
      </div>
    </div>
  );
}