import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Topbar from "../../headers/Header";
import Loader from "../../loader";
import { useAuth } from "../../auth";
import { useNavigate } from "react-router-dom";
import "./categories.css";

export default function Categories() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState("Buyer");
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // protect page
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // 🚀 Load categories (React-approved version NO WARNING)
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://elite-day-3-5.onrender.com/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Categories fetch failed:", err);

        // fallback dummy
        setCategories([
          { id: 1, role: "Buyer", category: "Clothes", product: "Jeans" },
          { id: 2, role: "Buyer", category: "Electronics", product: "Speaker" },
          { id: 3, role: "Seller", category: "Mobile", product: "iPhone" },
          { id: 4, role: "Seller", category: "Laptop", product: "Dell" },
        ]);
      }

      setLoading(false);
    };

    load();
  }, [token]);

  // Filter + Search
  const filtered = categories.filter((item) => {
    const matchesRole =
      filterRole === "All" || item.role.toLowerCase() === filterRole.toLowerCase();

    const matchesSearch =
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  // Add category/product
  const handleAddCategory = async () => {
    setErrorMsg("");

    if (!newCategory.trim() || !newProduct.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("https://elite-day-3-5.onrender.com/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
          category: newCategory.trim(),
          product: newProduct.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add category.");
        setSaving(false);
        return;
      }

      // success
      setSaving(false);
      setShowModal(false);
      setNewCategory("");
      setNewProduct("");

      // reload list
      setLoading(true);
      try {
        const reload = await fetch("https://elite-day-3-2.onrender.com/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reloadData = await reload.json();
        setCategories(Array.isArray(reloadData) ? reloadData : reloadData.data || []);
      }catch{
        console.log("done")
      }

      setLoading(false);
    } catch (err) {
      console.error("Add category failed:", err);
      setErrorMsg("Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div className="categories-layout">
      <Sidebar />

      <div className="categories-right">
        <Topbar />

        <div className="categories-main">
          <div className="cat-header">
            <h2 className="categories-title">Categories</h2>

            <div className="cat-actions">
              <input
                type="text"
                className="cat-search"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="cat-filter"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>

              <button className="cat-add-btn" onClick={() => setShowModal(true)}>
                + Add Category
              </button>
            </div>
          </div>

          {loading ? (
            <div className="cat-loader">
              <Loader size={50} color="#00c6d8" />
            </div>
          ) : (
            <div className="cat-box">
              <table className="cat-table">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Product</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        No category found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>{c.role}</td>
                        <td>{c.category}</td>
                        <td>{c.product}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      {showModal && (
        <div className="cat-modal-overlay">
          <div className="cat-modal">
            <h3>Add Category / Product</h3>

            <label>Role</label>
            <select
              className="modal-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>

            <label>Category</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <label>Product</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter product"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
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
                onClick={handleAddCategory}
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