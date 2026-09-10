import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AccountPages.css";
import api from "../services/api";
import BackToTopButton from "./BackToTopButton";

const SavedAddresses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [form, setForm] = useState({
    label: "Home",
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const normalizeAddress = (address) => ({
    ...address,
    label: address.label || address.type || "Home",
    recipient: address.recipient || address.name || "",
    line1: address.line1 || address.address || "",
    city: address.city || "",
    state: address.state || "",
    postalCode: address.postalCode || address.pincode || "",
    phone: address.phone || address.mobile || "",
  });

  useEffect(() => {
    const loadAddresses = async () => {
      if (!localStorage.getItem("token")) {
        setError("Log in to load and save your delivery addresses.");
        return;
      }
      try {
        const response = await api.get("/addresses");
        setAddresses((response.data.addresses || []).map(normalizeAddress));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load addresses.");
      }
    };
    loadAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addAddress = async () => {
    if (!localStorage.getItem("token")) {
      setError("Please log in before saving an address.");
      navigate("/login");
      return;
    }
    if (
      !form.name ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      setError("Complete every address field before saving.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const cleanForm = {
        label: form.label,
        recipient: form.name,
        line1: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        phone: form.mobile,
      };

      if (editingId) {
        await api.delete(`/addresses/${editingId}`);
      }
      const response = await api.post("/addresses", { ...cleanForm, isDefault: addresses.length === 0 });
      setAddresses((current) => editingId
        ? [...current.filter((address) => address._id !== editingId), normalizeAddress(response.data.address)]
        : [...current, normalizeAddress(response.data.address)]);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError("Your login session expired. Please log in again.");
      } else {
        setError(requestError.response?.data?.message || "Unable to save this address.");
      }
      return;
    } finally {
      setIsSaving(false);
    }

    setForm({
      label: "Home",
      name: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setEditingId(null);

    setShowForm(false);
  };

  return (
    <div className="account-page">

      <div className="account-page-header">
        <Link to="/" className="account-home-btn" aria-label="Go to home">⌂</Link>
        <button
          onClick={() => window.history.back()}
          className="account-back-btn"
        >
          ←
        </button>

        <div>
          <h1>Saved Addresses</h1>
          <p>Manage your delivery addresses</p>
        </div>
      </div>

      <div className="account-page-container">

        <div className="account-sidebar">
          <div className="account-avatar">T</div>

          <h3>Test User</h3>
          <p>test123@gmail.com</p>

          <div className="account-menu">
            <a href="/edit-profile"><span className="account-menu-icon">👤</span>Personal Information</a>

            <a href="/orders"><span className="account-menu-icon">📦</span>My Orders</a>

            <a href="/wishlist"><span className="account-menu-icon">❤️</span>Wishlist</a>

            <a
              className="active"
              href="/addresses"
            >
              <span className="account-menu-icon">📍</span>Saved Addresses
            </a>

            <a href="/security"><span className="account-menu-icon">🔒</span>Account Security</a>
            <Link to="/reviews"><span className="account-menu-icon">✍</span>Write a Review</Link>
            <button type="button" className="account-menu-logout" onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}><span className="account-menu-icon">↪</span>Logout</button>
          </div>
        </div>

        <div className="account-content">

          <div className="account-content-title">
            <div>
              <span>DELIVERY</span>
              <h2>Saved Addresses</h2>
            </div>

            <button
              className="blue-action-btn"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              + Add New Address
            </button>
          </div>

          {showForm && (
            <div className="address-form">

              <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>

              <div className="address-form-grid">
                <select
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  aria-label="Address type"
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>

                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                />

                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />

                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />

                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                />

                <input
                  name="address"
                  placeholder="Full Address"
                  value={form.address}
                  onChange={handleChange}
                  className="address-full"
                />

              </div>

              <div className="address-actions">
                <button
                  onClick={() => setShowForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  onClick={addAddress}
                  disabled={isSaving}
                  className="blue-action-btn"
                >
                  {isSaving ? "Saving..." : "Save Address"}
                </button>
              </div>

            </div>
          )}
          {error && <p className="account-error" role="alert">{error}</p>}

          {addresses.map((item) => (
            <div
              className="address-card"
              key={item._id || item.id}
            >
              <div className="address-card-top">
                <span className="address-type">
                  {item.label}
                </span>

                <div>
                  <button type="button" onClick={() => {
                    setEditingId(item._id || item.id);
                    setForm({
                      label: item.label || "Home",
                      name: item.recipient,
                      mobile: item.phone,
                      address: item.line1,
                      city: item.city,
                      state: item.state,
                      pincode: item.postalCode,
                    });
                    setShowForm(true);
                  }}>Edit</button>
                  <button type="button" onClick={async () => {
                    try {
                      await api.delete(`/addresses/${item._id}`);
                      setAddresses((current) => current.filter((address) => address._id !== item._id && address.id !== item.id));
                      setError("");
                    } catch (requestError) {
                      setError(requestError.response?.data?.message || "Unable to delete this address.");
                    }
                  }}>Delete</button>
                </div>
              </div>

              <h3>{item.recipient}</h3>

              <p>
                {item.phone}
              </p>

              <p>
                {item.line1}, {item.city},{" "}
                {item.state} - {item.postalCode}
              </p>
            </div>
          ))}

        </div>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default SavedAddresses;