import "./AccountPages.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../services/api";
import Navbar from "./Navbar";
import { addCartItem, readCart } from "../utils/cart";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [cartCount, setCartCount] = useState(() => readCart().reduce((total, item) => total + item.quantity, 0));
  const [cartItems, setCartItems] = useState(readCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (wishlist.length) return;
    api.get("/products").then((response) => {
      const demoItems = (response.data.products || []).slice(0, 4);
      if (demoItems.length) {
        localStorage.setItem("wishlist", JSON.stringify(demoItems));
        setWishlist(demoItems);
      }
    }).catch(() => {});
  }, [wishlist.length]);
  useEffect(() => {
    const syncCart = (event) => {
      const items = event.detail || readCart();
      setCartItems(items);
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    };
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);
  const addToCart = (item) => {
    addCartItem(item);
  };

  return (
    <div className="account-page">
      <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)} />

      <div className="account-page-header">
        <button
          onClick={() => window.history.back()}
          className="account-back-btn"
        >
          ←
        </button>

        <Link to="/" className="account-home-btn" aria-label="Go to home">⌂</Link>
        <div>
          <h1>My Wishlist</h1>
          <p>Your saved products</p>
        </div>
        <Cart
          cartItems={cartItems}
          isCartOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
          increaseQuantity={(id) => {
            const next = cartItems.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            localStorage.setItem("cartItems", JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("cart-updated", { detail: next }));
          }}
          decreaseQuantity={(id) => {
            const next = cartItems.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0);
            localStorage.setItem("cartItems", JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("cart-updated", { detail: next }));
          }}
          removeFromCart={(id) => {
            const next = cartItems.filter((item) => item.id !== id);
            localStorage.setItem("cartItems", JSON.stringify(next));
            window.dispatchEvent(new CustomEvent("cart-updated", { detail: next }));
          }}
          onCheckout={() => navigate("/payment", { state: { cartItems } })}
        />
      </div>

      <div className="account-page-container">

        <div className="account-sidebar">
          <div className="account-avatar">T</div>

          <h3>Test User</h3>
          <p>test123@gmail.com</p>

          <div className="account-menu">
            <a href="/edit-profile"><span className="account-menu-icon">👤</span>Personal Information</a>

            <a href="/orders"><span className="account-menu-icon">📦</span>My Orders</a>

            <a className="active" href="/wishlist">
              <span className="account-menu-icon">❤️</span>Wishlist
            </a>

            <a href="/addresses"><span className="account-menu-icon">📍</span>Saved Addresses</a>

            <a href="/security"><span className="account-menu-icon">🔒</span>Account Security</a>
            <Link to="/reviews"><span className="account-menu-icon">✍</span>Write a Review</Link>
          </div>
        </div>

        <div className="account-content">
          {!localStorage.getItem("token") && (
            <div className="wishlist-signin">
              <span>Sign in to sync your wishlist across devices.</span>
              <Link to="/login">Sign in</Link>
            </div>
          )}

          <div className="account-content-title">
            <div>
              <span>SAVED</span>
              <h2>My Wishlist</h2>
            </div>

            <strong>{wishlist.length} Items</strong>
          </div>

          <div className="wishlist-grid">

            {wishlist.map((item) => (
              <div
                className="wishlist-card"
                key={item._id || item.id}
              >
                <button className="wishlist-heart" onClick={() => {
                  const next = wishlist.filter((saved) => (saved._id || saved.id) !== (item._id || item.id));
                  localStorage.setItem("wishlist", JSON.stringify(next));
                  setWishlist(next);
                }}>
                  ♥
                </button>

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="wishlist-info">
                  <h3>{item.name}</h3>

                  <div className="wishlist-rating">
                    ★ {item.rating}
                  </div>

                  <strong>{item.price}</strong>

                  <Link
                    className="wishlist-details-link"
                    to={`/products/${encodeURIComponent(item._id || item.id)}`}
                    state={{ product: item }}
                  >
                    View Details
                  </Link>
                  <button className="wishlist-cart-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Wishlist;