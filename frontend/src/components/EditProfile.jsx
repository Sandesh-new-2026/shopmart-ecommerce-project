import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EditProfile.css";
import api from "../services/api";
import BackToTopButton from "./BackToTopButton";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "Test",
    lastName: "User",
    email: "test123@gmail.com",
    mobile: "9876543210",
    gender: "Male",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const response = await api.get("/auth/me");
        const user = response.data.user;
        const names = (user.name || "").trim().split(/\s+/);
        setProfile((current) => ({
          ...current,
          ...user,
          firstName: user.firstName || names[0] || "",
          lastName: user.lastName || names.slice(1).join(" "),
        }));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your profile.");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSave = async () => {
    setError("");
    try {
      const response = await api.put("/auth/me", {
        ...profile,
        name: `${profile.firstName} ${profile.lastName}`.trim(),
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setIsEditing(false);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save your profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const avatarLetter = profile.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      {/* TOP BAR */}
      <div className="profile-topbar">
        <div className="profile-topbar-inner">
          <button
            className="profile-back-btn"
            onClick={() => window.history.back()}
          >
            ←
          </button>
          <Link to="/" className="profile-home-btn" aria-label="Go to home">⌂</Link>

          <div>
            <h1>My Profile</h1>
            <span>Manage your account information</span>
          </div>
          <BackToTopButton />
        </div>
      </div>

      {/* CONTENT */}
      <div className="profile-container">
        {/* LEFT PROFILE CARD */}
        <aside className="profile-sidebar">
          <div className="avatar-wrapper">
            <div className="profile-avatar">{avatarLetter}</div>

            <button
              className="avatar-edit-btn"
              onClick={() => document.getElementById("profile-image").click()}
            >
              📷
            </button>

            <input id="profile-image" type="file" accept="image/*" hidden />
          </div>

          <h2>
            {profile.firstName} {profile.lastName}
          </h2>

          <p>{profile.email}</p>

          <div className="profile-menu">
            <div className="profile-menu-item active">
              <span>👤</span>
              Personal Information
            </div>

            <Link to="/orders" className="profile-menu-item">
              <span>📦</span>
              My Orders
            </Link>

             <Link to="/wishlist" className="profile-menu-item">
              <span>❤️</span>
              Wishlist
            </Link>

             <Link to="/addresses" className="profile-menu-item">
              <span>📍</span>
              Saved Addresses
            </Link>

            <Link to="/security" className="profile-menu-item">
              <span>🔒</span>
              Account Security
            </Link>
            <Link to="/reviews" className="profile-menu-item">
              <span>✍</span>
              Write a Review
            </Link>
            <button
              type="button"
              className="profile-menu-item profile-logout"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="profile-content">
          <div className="profile-section-header">
            <div>
              <span className="profile-section-label">ACCOUNT</span>

              <h2>Personal Information</h2>
            </div>

            {!isEditing && (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                ✎ Edit
              </button>
            )}
          </div>

          {saved && (
            <div className="profile-success">
              ✓ Profile updated successfully
            </div>
          )}
          {error && <div className="profile-error" role="alert">{error}</div>}

          {/* NAME */}
          <div className="profile-form-row">
            <div className="profile-field">
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* GENDER */}
          <div className="profile-field gender-field">
            <label>Gender</label>

            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={profile.gender === "Male"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <span>Male</span>
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={profile.gender === "Female"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <span>Female</span>
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={profile.gender === "Other"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <span>Other</span>
              </label>
            </div>
          </div>

          {/* EMAIL */}
          <div className="profile-field">
            <label>Email Address</label>

            <div className="input-with-status">
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <span className="verified">✓ Verified</span>
            </div>
          </div>

          {/* MOBILE */}
          <div className="profile-field">
            <label>Mobile Number</label>

            <div className="input-with-status">
              <input
                type="tel"
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <span className="verified">✓ Verified</span>
            </div>
          </div>

          {/* BUTTONS */}
          {isEditing && (
            <div className="profile-actions">
              <button className="cancel-profile-btn" onClick={handleCancel}>
                Cancel
              </button>

              <button className="save-profile-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}

          {/* INFORMATION */}
          <div className="profile-info-box">
            <h3>Profile Information</h3>

            <p>
              Keep your personal information updated to make your shopping
              experience faster and easier.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;
