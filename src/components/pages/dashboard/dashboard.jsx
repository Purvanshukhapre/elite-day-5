import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import "./dashboard.css";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [legalPolicy, setLegalPolicy] = useState([]);
  const [ratingStats, setRatingStats] = useState({ positive: 0, negative: 0 });

  // Protect route
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // LOAD ALL DASHBOARD DATA (dynamic)
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const [catRes, locRes, legalRes, rateRes] = await Promise.all([
          fetch("https://elite-day-3-5.onrender.com/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://elite-day-3-5.onrender.com/locations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://elite-day-3-5.onrender.com/policy", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://elite-day-3-5.onrender.com/ratings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const catData = await catRes.json();
        const locData = await locRes.json();
        const legalData = await legalRes.json();
        const rateData = await rateRes.json();

        setCategories(Array.isArray(catData) ? catData : catData.data || []);
        setLocations(Array.isArray(locData) ? locData : locData.data || []);
        setLegalPolicy(Array.isArray(legalData) ? legalData : legalData.data || []);
        setRatingStats({
          positive: rateData.positive || 0,
          negative: rateData.negative || 0,
        });
      } catch (err) {
        console.error("Dashboard API error:", err);
      }

      setLoading(false);
    };

    loadData();
  }, [token]);

  // Rating Circle Math
  const r = 55;
  const circumference = 2 * Math.PI * r;
  const positiveLength = (ratingStats.positive / 100) * circumference;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-right">
        <Topbar />

        <div className="dashboard-main">
          <h2 className="page-title">Dashboard</h2>

          {loading ? (
            <div className="dash-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <>
              {/* ROW 1 — TWO CARD LAYOUT */}
              <div className="dash-row-2">

                {/* Categories */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>Categories</h3>
                    <button className="view-btn" onClick={() => navigate("/categories")}>View</button>
                  </div>

                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Role</th>
                        <th>Category</th>
                        <th>Product</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{c.role}</td>
                          <td>{c.category}</td>
                          <td>{c.product}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Location */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>Location</h3>
                    <button className="view-btn" onClick={() => navigate("/location")}>View</button>
                  </div>

                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.map((loc, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{loc.role}</td>
                          <td>{loc.location}</td>
                          <td>{loc.region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROW 2 — THREE CARD LAYOUT */}
              <div className="dash-row-3">

                {/* Legal Policy */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>Legal Policy</h3>
                    <button className="view-btn" onClick={() => navigate("/legalpolicy")}>View</button>
                  </div>

                  <div className="legal-policy-box">
                    {legalPolicy.map((item, index) =>
                      item.open ? (
                        <div className="legal-open" key={index}>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      ) : (
                        <button className="legal-item" key={index}>
                          {item.title} <span>›</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Reports */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>Reports</h3>
                    <button className="view-btn" onClick={() => navigate("/reports")}>View</button>
                  </div>

                  <p className="report-text">
                    Overview of recent user reports & activities...
                  </p>
                </div>

                {/* Rating */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>Rating</h3>
                    <button className="view-btn" onClick={() => navigate("/rating")}>View</button>
                  </div>

                  <div className="rating-chart-container">
                    <svg width="140" height="140" className="rating-chart">
                      <circle cx="70" cy="70" r="55" stroke="#e5e5e5" strokeWidth="12" fill="none" />
                      <circle
                        cx="70"
                        cy="70"
                        r="55"
                        stroke="#00c853"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${positiveLength} ${circumference}`}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    </svg>

                    <div className="rating-legend">
                      <p>Positive — {ratingStats.positive}%</p>
                      <p>Negative — {ratingStats.negative}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}