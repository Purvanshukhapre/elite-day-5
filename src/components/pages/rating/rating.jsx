import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import "./Rating.css";

export default function Rating() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // list of individual ratings (for table)
  const [ratings, setRatings] = useState([]);

  // aggregated stats for chart
  const [stats, setStats] = useState({
    positive: 0,
    negative: 0,
    average: 0,
    total: 0,
  });

  // UI controls
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // protect route
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // load ratings & stats (safe async inside effect)
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);

      try {
        // fetch list and stats in parallel
        const [listRes, statsRes] = await Promise.all([
          fetch("https://elite-day-3-5.onrender.com/ratings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://elite-day-3-5.onrender.com/ratings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // parse responses
        const listData = await listRes.json();
        const statsData = await statsRes.json();

        // flexible parsing
        const list = Array.isArray(listData) ? listData : listData.data || [];
        const s = statsData && typeof statsData.positive === "number"
          ? statsData
          : statsData.data || { positive: 0, negative: 0, average: 0, total: list.length };

        setRatings(list);
        setStats({
          positive: s.positive ?? 0,
          negative: s.negative ?? Math.max(0, 100 - (s.positive ?? 0)),
          average: s.average ?? 0,
          total: s.total ?? list.length,
        });
      } catch (err) {
        console.error("Ratings load failed:", err);

        // fallback sample
        const fallback = [
          { id: 1, user: "Ravi", role: "Buyer", rating: 4.5, comment: "Great service" },
          { id: 2, user: "Meera", role: "Buyer", rating: 3.0, comment: "Okay experience" },
          { id: 3, user: "Aman", role: "Seller", rating: 4.9, comment: "Excellent" },
        ];

        setRatings(fallback);
        // compute fallback stats
        const pos = Math.round((fallback.filter(r => r.rating >= 4).length / fallback.length) * 100);
        setStats({ positive: pos, negative: 100 - pos, average: (fallback.reduce((s, r) => s + r.rating, 0) / fallback.length).toFixed(2), total: fallback.length });
      }

      setLoading(false);
    };

    load();
  }, [token]);

  // filter & search the table
  const filtered = ratings.filter((r) => {
    const matchesRole = filterRole === "All" || (r.role || "").toLowerCase() === filterRole.toLowerCase();
    const matchesSearch =
      (r.user || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.comment || "").toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // SVG donut math
  const r = 55;
  const circumference = 2 * Math.PI * r;
  const positiveLength = ((Number(stats.positive) || 0) / 100) * circumference;

  return (
    <div className="rating-layout">
      <Sidebar />

      <div className="rating-right">
        <Topbar />

        <div className="rating-main">
          <div className="rating-header">
            <h2 className="rating-title">Ratings</h2>

            <div className="rating-actions">
              <input
                type="text"
                className="rating-search"
                placeholder="Search by user or comment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="rating-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>

              <button className="rating-view-btn" onClick={() => navigate("/rating")}>
                Full Rating Page
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rating-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <div className="rating-grid">
              {/* Left: chart + summary */}
              <div className="rating-card stats-card">
                <div className="card-header">
                  <h3>Overview</h3>
                </div>

                <div className="chart-and-legend">
                  <svg width="140" height="140" viewBox="0 0 140 140" className="rating-donut" aria-hidden>
                    <circle cx="70" cy="70" r={r} stroke="#e5e5e5" strokeWidth="12" fill="none" />
                    <circle
                      cx="70"
                      cy="70"
                      r={r}
                      stroke="#00c853"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${positiveLength} ${circumference}`}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                    />
                  </svg>

                  <div className="stats-legend">
                    <div className="stat-row">
                      <div className="stat-label">Positive</div>
                      <div className="stat-value">{Math.round(stats.positive)}%</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Negative</div>
                      <div className="stat-value">{Math.round(stats.negative)}%</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Average</div>
                      <div className="stat-value">{Number(stats.average).toFixed(2)}</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Total</div>
                      <div className="stat-value">{stats.total}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: table */}
              <div className="rating-card table-card">
                <div className="card-header">
                  <h3>Recent Ratings</h3>
                </div>

                <div className="rating-table-wrap">
                  <table className="rating-table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Rating</th>
                        <th>Comment</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-row">No ratings found</td>
                        </tr>
                      ) : (
                        filtered.map((r, i) => (
                          <tr key={r.id || i}>
                            <td>{i + 1}</td>
                            <td>{r.user || r.name || "Anonymous"}</td>
                            <td>{r.role || "-"}</td>
                            <td>
                              <div className="rating-pill">
                                <strong>{r.rating}</strong>
                                <span className="rating-stars">{getStars(r.rating)}</span>
                              </div>
                            </td>
                            <td className="rating-comment">{r.comment || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// helper to display star icons (unicode) — shows up to 5 with halves
function getStars(value) {
  if (value == null) return "";
  const v = Number(value);
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  let stars = "★".repeat(full);
  if (half) stars += "½";
  return stars;
}