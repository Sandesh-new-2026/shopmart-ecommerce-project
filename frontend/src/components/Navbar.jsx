import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Navbar.css";

const getSavedUser = () => {
  if (!localStorage.getItem("token")) return null;
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

function Navbar({
  search = "",
  setSearch = () => {},
  cartCount = 0,
  openCart = () => {},
  openFilter = () => {},
  onSearchSubmit = () => {},
}) {
  const [user, setUser] = useState(getSavedUser);

  useEffect(() => {
    const loadUser = async () => {
      if (!localStorage.getItem("token")) {
        return;
      }

      try {
        const response = await api.get("/auth/me");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      } catch {
        // An expired or invalid token should not make the navbar look signed in.
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.assign("/");
  };

  const displayName =
    user?.name?.trim() ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.email?.split("@")[0] ||
    "Account";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">

        {/* FILTER */}
        <button
          type="button"
          className="nav-icon-btn"
          onClick={openFilter}
          title="Filter"
        >
          ☰
        </button>

      {/* LOGO */}
      <Link to="/" className="navbar-logo">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span>SHOPMART</span>
      </Link>

      {/* SEARCH */}
      <form className="navbar-search" onSubmit={(event) => { event.preventDefault(); onSearchSubmit(search); }}>
        <span className="search-icon" aria-hidden="true">⌕</span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />

        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}
      </form>

      {/* RIGHT SIDE */}
      <div className="navbar-actions">

        {user ? (
          <div className="nav-user" title={user.email}>
            <span className="nav-avatar" aria-hidden="true">
              {userInitial}
            </span>
            <Link to="/edit-profile" className="nav-user-name" title={displayName}>
              <span className="nav-greeting">Hi, </span>{displayName}
            </Link>
            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-login">Login</Link>
            <Link to="/register" className="nav-register">Register</Link>
          </>
        )}
        {!user && <Link to="/edit-profile" className="nav-profile-link">Profile</Link>}
    

        {/* CART */}
        <button
          type="button"
          className="cart-btn"
          onClick={openCart}
        >
          🛒

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
