import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import "./policy.css";

export default function LegalPolicy() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState([]);

  const [search, setSearch] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // protect page
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // Load policies safely
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://elite-day-3-2.onrender.com/policy", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];

        // Ensure each item has "open" property
        setPolicies(list.map((p) => ({ ...p, open: false })));
      } catch (err) {
        console.error("Legal Policy fetch failed:", err);

        // fallback dummy
        setPolicies([
          {
            id: 1,
            title: "How do I book a service?",
            desc: "You can book any service by selecting a category...",
            open: true,
          },
          {
            id: 2,
            title: "How do I track my provider?",
            desc: "Tracking is available inside the app after booking...",
            open: false,
          },
          {
            id: 3,
            title: "How do I rate a provider?",
            desc: "After completing service you can submit rating...",
            open: false,
          },
        ]);
      }

      setLoading(false);
    };

    load();
  }, [token]);

  // Toggle accordion
  const toggle = (index) => {
    setPolicies((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, open: !item.open } : { ...item, open: false }
      )
    );
  };

  // Filter by search
  const filtered = policies.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Add new policy
  const handleAdd = async () => {
    setErrorMsg("");

    if (!newTitle.trim() || !newDesc.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/legal-policy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          desc: newDesc.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add policy.");
        setSaving(false);
        return;
      }

      // Close modal
      setSaving(false);
      setShowModal(false);
      setNewTitle("");
      setNewDesc("");

      // Reload
      const reload = await fetch("/api/legal-policy", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reloadData = await reload.json();
      setPolicies(
        (Array.isArray(reloadData) ? reloadData : reloadData.data || []).map(
          (p) => ({ ...p, open: false })
        )
      );
    } catch (err) {
      console.error("Add policy failed:", err);
      setErrorMsg("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="policy-layout">
      <Sidebar />

      <div className="policy-right">
        <Topbar />

        <div className="policy-main">
          <div className="policy-header">
            <h2 className="policy-title">Legal Policy</h2>

            <div className="policy-actions">
              <input
                type="text"
                className="policy-search"
                placeholder="Search policy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button className="policy-add-btn" onClick={() => setShowModal(true)}>
                + Add Policy
              </button>
            </div>
          </div>

          {loading ? (
            <div className="policy-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <div className="policy-box">
              {filtered.length === 0 ? (
                <p className="empty-text">No policy found.</p>
              ) : (
                filtered.map((item, index) =>
                  item.open ? (
                    <div className="policy-item-open" key={index}>
                      <div
                        className="policy-header-row open"
                        onClick={() => toggle(index)}
                      >
                        <h4>{item.title}</h4>
                        <span>−</span>
                      </div>

                      <p className="policy-desc">{item.desc}</p>
                    </div>
                  ) : (
                    <div
                      className="policy-item"
                      key={index}
                      onClick={() => toggle(index)}
                    >
                      <span>{item.title}</span>
                      <span className="arrow">›</span>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ADD POLICY MODAL */}
      {showModal && (
        <div className="policy-modal-overlay">
          <div className="policy-modal">
            <h3>Add New Policy</h3>

            <label>Title</label>
            <input
              type="text"
              className="modal-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter policy title"
            />

            <label>Description</label>
            <textarea
              className="modal-textarea"
              rows="4"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Enter policy description"
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
                onClick={handleAdd}
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