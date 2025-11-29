import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

export default function Reports() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("Buyer");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Protect page
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // Load reports (safe)
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setReports(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Reports fetch failed:", err);

        // fallback dummy
        setReports([
          {
            id: 1,
            role: "Buyer",
            title: "Fake product received",
            desc: "Product quality was very poor and different from listing.",
          },
          {
            id: 2,
            role: "Seller",
            title: "Buyer refused to pay",
            desc: "The buyer refused COD payment and caused delays.",
          },
          {
            id: 3,
            role: "Buyer",
            title: "Late delivery",
            desc: "Delivery was delayed by 4 days.",
          },
        ]);
      }

      setLoading(false);
    };

    load();
  }, [token]);

  // Filter + search
  const filtered = reports.filter((r) => {
    const matchRole =
      filterRole === "All" || r.role.toLowerCase() === filterRole.toLowerCase();

    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase());

    return matchRole && matchSearch;
  });

  // Add new report
  const handleAddReport = async () => {
    setModalError("");

    if (!newTitle.trim() || !newDesc.trim()) {
      setModalError("All fields are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("https://elite-day-3-2.onrender.com/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          title: newTitle.trim(),
          desc: newDesc.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.message || "Failed to add report.");
        setSaving(false);
        return;
      }

      // Reset modal
      setSaving(false);
      setShowModal(false);
      setNewTitle("");
      setNewDesc("");

      // Reload list
      const reload = await fetch("https://elite-day-3-2.onrender.com/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reloadData = await reload.json();
      setReports(Array.isArray(reloadData) ? reloadData : reloadData.data || []);
    } catch (err) {
      console.error("Add report failed:", err);
      setModalError("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="reports-layout">
      <Sidebar />

      <div className="reports-right">
        <Topbar />

        <div className="reports-main">
          <div className="reports-header">
            <h2 className="reports-title">Reports</h2>

            <div className="reports-actions">
              <input
                type="text"
                className="reports-search"
                placeholder="Search by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="reports-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>

              <button
                className="reports-add-btn"
                onClick={() => setShowModal(true)}
              >
                + Add Report
              </button>
            </div>
          </div>

          {loading ? (
            <div className="reports-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <div className="reports-box">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Role</th>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">No reports found</td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>{i + 1}</td>
                        <td>{r.role}</td>
                        <td>{r.title}</td>
                        <td className="reports-desc">{r.desc}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD REPORT MODAL */}
      {showModal && (
        <div className="reports-modal-overlay">
          <div className="reports-modal">
            <h3>Add New Report</h3>

            <label>Role</label>
            <select
              className="modal-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>

            <label>Title</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter report title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <label>Description</label>
            <textarea
              rows="4"
              className="modal-textarea"
              placeholder="Enter report description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />

            {modalError && <div className="modal-error">{modalError}</div>}

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
                onClick={handleAddReport}
                disabled={saving}
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