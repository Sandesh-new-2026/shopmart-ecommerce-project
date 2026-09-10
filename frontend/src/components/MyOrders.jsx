import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AccountPages.css";
import api from "../services/api";
import BackToTopButton from "./BackToTopButton";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.orders || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your orders.");
      }
    };
    if (localStorage.getItem("token")) loadOrders();
  }, []);

  const fallbackOrders = [
    {
      id: "ORD-10245",
      date: "08 Sep 2026",
      product: "Wireless Headphones",
      price: "₹1,999",
      status: "Delivered",
      statusClass: "delivered",
    },
    {
      id: "ORD-10238",
      date: "05 Sep 2026",
      product: "Smart Watch",
      price: "₹2,499",
      status: "On the way",
      statusClass: "shipping",
    },
  ];
  const visibleOrders = orders.length ? orders : fallbackOrders;

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
          <h1>My Orders</h1>
          <p>View and manage your orders</p>
        </div>
      </div>

      <div className="account-page-container">

        <div className="account-sidebar">
          <div className="account-avatar">T</div>

          <h3>Test User</h3>
          <p>test123@gmail.com</p>

          <div className="account-menu">
            <a href="/edit-profile"><span className="account-menu-icon">👤</span>Personal Information</a>

            <a className="active" href="/orders">
              <span className="account-menu-icon">📦</span>My Orders
            </a>

            <a href="/wishlist"><span className="account-menu-icon">❤️</span>Wishlist</a>

            <a href="/addresses"><span className="account-menu-icon">📍</span>Saved Addresses</a>

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
              <span>ORDERS</span>
              <h2>My Orders</h2>
            </div>

            <strong>{visibleOrders.length} Orders</strong>
          </div>
          {error && <p className="account-error" role="alert">{error}</p>}

          {visibleOrders.flatMap((order) => order.items?.length ? order.items.map((item) => ({
            id: order._id,
            sourceOrder: order,
            date: new Date(order.createdAt).toLocaleDateString("en-IN"),
            product: item.name,
            price: `₹${(item.price * item.quantity).toLocaleString("en-IN")}`,
            status: order.status || "Placed",
            statusClass: order.status === "delivered" ? "delivered" : "shipping",
          })) : [order]).map((order) => (
            <div className="order-card" key={order.id}>

              <div className="order-image">
                📦
              </div>

              <div className="order-details">
                <h3>{order.product}</h3>

                <p>
                  Order ID: {order.id}
                </p>

                <p>
                  Ordered on {order.date}
                </p>

                <strong>{order.price}</strong>
              </div>

              <div className={`order-status ${order.statusClass}`}>
                <span></span>
                {order.status}
              </div>

              <Link className="order-view-btn" to={`/orders/${order.id}`} state={{ order: order.sourceOrder || order }}>
                View Details
              </Link>

            </div>
          ))}

        </div>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default MyOrders;