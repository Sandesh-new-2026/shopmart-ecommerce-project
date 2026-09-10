import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(() => location.state?.order || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.order) {
      return undefined;
    }
    api.get("/orders").then((response) => {
      const found = response.data.orders.find((item) => item._id === id);
      if (found) setOrder(found);
      else setError("Order details were not found.");
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "Unable to load order details.");
    });
  }, [id, location.state]);

  if (!order) return <main className="order-details-page"><Link to="/orders">← My Orders</Link><p>{error || "Loading order..."}</p></main>;

  return (
    <main className="order-details-page">
      <Link to="/orders">← My Orders</Link>
      <section className="order-details-card">
        <div className="order-details-heading">
          <div><span>ORDER DETAILS</span><h1>Order #{String(order._id || order.id).slice(-8).toUpperCase()}</h1></div>
          <strong>{order.status || "Placed"}</strong>
        </div>
        <p>Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : order.date}</p>
        <div className="order-line-list">{order.items?.length ? order.items.map((item) => <div className="order-line" key={item.productId || item.name}><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>) : <div className="order-line"><span>{order.product}</span><strong>{order.price}</strong></div>}</div>
        <div className="order-total"><span>Total</span><strong>{order.totalAmount ? `₹${order.totalAmount.toLocaleString("en-IN")}` : order.price}</strong></div>
        {order.deliveryAddress && <><h2>Delivery address</h2><p>{order.deliveryAddress.recipient}<br />{order.deliveryAddress.line1}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}<br />{order.deliveryAddress.phone}</p></>}
      </section>
    </main>
  );
}

export default OrderDetails;
