import { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountPages.css";
import BackToTopButton from "./BackToTopButton";
import api from "../services/api";

const AccountSecurity = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (
      !password.current ||
      !password.newPassword ||
      !password.confirm
    ) {
      setStatus("Complete all password fields.");
      return;
    }

    if (
      password.newPassword !==
      password.confirm
    ) {
      setStatus("New passwords do not match.");
      return;
    }

    setSaving(true);
    setStatus("");
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: password.current,
        newPassword: password.newPassword,
      });
      setStatus(response.data.message);
      setPassword({ current: "", newPassword: "", confirm: "" });
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to update your password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-page">

      <div className="account-page-header">
        <button
          onClick={() => window.history.back()}
          className="account-back-btn"
        >
          ←
        </button>

        <Link to="/" className="account-home-btn" aria-label="Go to home">⌂</Link>
        <div>
          <h1>Account Security</h1>
          <p>Protect your account and personal information</p>
        </div>
      </div>

      <div className="account-page-container">

        <div className="account-sidebar">
          <div className="account-avatar">T</div>

          <h3>Test User</h3>
          <p>test123@gmail.com</p>

          <div className="account-menu">
            <a href="/edit-profile">
              <span className="account-menu-icon">👤</span>Personal Information
            </a>

            <a href="/orders">
              <span className="account-menu-icon">📦</span>My Orders
            </a>

            <a href="/wishlist">
              <span className="account-menu-icon">❤️</span>Wishlist
            </a>

            <a href="/addresses">
              <span className="account-menu-icon">📍</span>Saved Addresses
            </a>

            <a
              className="active"
              href="/security"
            >
              <span className="account-menu-icon">🔒</span>Account Security
            </a>
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
              <span>SECURITY</span>
              <h2>Account Security</h2>
            </div>
          </div>

          {/* PASSWORD */}

          <div className="security-card">

            <div className="security-icon">
              🔐
            </div>

            <div className="security-card-content">

              <h3>Change Password</h3>

              <p>
                Update your password regularly to keep
                your account secure.
              </p>

              <div className="security-form">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="current"
                  value={password.current}
                  onChange={handleChange}
                  placeholder="Current Password"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="confirm"
                  value={password.confirm}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                />

                <label className="show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) =>
                      setShowPassword(
                        e.target.checked
                      )
                    }
                  />

                  Show password
                </label>

                <button
                  type="button"
                  className="blue-action-btn"
                  onClick={changePassword}
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
                {status && <p className="security-status-message">{status}</p>}

              </div>
            </div>
            <BackToTopButton />
          </div>

          {/* SECURITY STATUS */}

          <div className="security-status">

            <div className="security-status-icon">
              ✓
            </div>

            <div>
              <h3>Your account is secure</h3>

              <p>
                Your email address and mobile number
                are verified.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;