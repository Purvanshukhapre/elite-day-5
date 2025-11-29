import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import "./location.css";

export default function Location() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("Buyer");
  const [newLocation, setNewLocation] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // protect page
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // Load locations (React-approved async inside effect)
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://elite-day-3-5.onrender.com/locations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setLocations(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Locations fetch failed:", err);

        // fallback dummy for UI
        setLocations([
          { id: 1, role: "Buyer", location: "London", region: "Europe" },
          { id: 2, role: "Buyer", location: "Mumbai", region: "Asia" },
          { id: 3, role: "Seller", location: "Berlin", region: "Europe" },
        ]);
      }

      setLoading(false);
    };

    load();
  }, [token]);

  // Filter + Search
  const filtered = locations.filter((item) => {
    const matchesRole =
      filterRole === "All" || item.role.toLowerCase() === filterRole.toLowerCase();

    const matchesSearch =
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      (item.region || "").toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  // Add location
  const handleAddLocation = async () => {
    setErrorMsg("");

    if (!newLocation.trim() || !newRegion.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("https://elite-day-3-5.onrender.com/locations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          location: newLocation.trim(),
          region: newRegion.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add location.");
        setSaving(false);
        return;
      }

      // success
      setSaving(false);
      setShowModal(false);
      setNewLocation("");
      setNewRegion("");

      // reload list (safe)
      setLoading(true);
      try {
        const reload = await fetch("https://elite-day-3-5.onrender.com/locations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reloadData = await reload.json();
        setLocations(Array.isArray(reloadData) ? reloadData : reloadData.data || []);
      } catch (e) {
        console.error("Reload locations failed", e);
      }
      setLoading(false);
    } catch (err) {
      console.error("Add location failed:", err);
      setErrorMsg("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="locations-layout">
      <Sidebar />

      <div className="locations-right">
        <Topbar />

        <div className="locations-main">
          <div className="loc-header">
            <h2 className="locations-title">Locations</h2>

            <div className="loc-actions">
              <input
                type="text"
                className="loc-search"
                placeholder="Search location or region..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="loc-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>

              <button className="loc-add-btn" onClick={() => setShowModal(true)}>
                + Add Location
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loc-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <div className="loc-box">
              <table className="loc-table">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Region</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">No locations found</td>
                    </tr>
                  ) : (
                    filtered.map((loc, i) => (
                      <tr key={loc.id || i}>
                        <td>{i + 1}</td>
                        <td>{loc.role}</td>
                        <td>{loc.location}</td>
                        <td>{loc.region}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD LOCATION MODAL */}
      {showModal && (
        <div className="loc-modal-overlay">
          <div className="loc-modal">
            <h3>Add Location</h3>

            <label>Role</label>
            <select
              className="modal-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>

            <label>Location</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter location (city)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />

            <label>Region</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter region (e.g. Asia)"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
            />

            {errorMsg && <div className="modal-error">{errorMsg}</div>}

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="modal-save"
                disabled={saving}
                onClick={handleAddLocation}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}