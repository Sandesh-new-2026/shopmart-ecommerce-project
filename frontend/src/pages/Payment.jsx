import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { readCart } from "../utils/cart";
import BackToTopButton from "../components/BackToTopButton";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cartItems] = useState(() => state?.cartItems || readCart());
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    label: "Home",
    recipient: "Demo Customer",
    line1: "101 Demo Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    phone: "9876543210",
  });
  const [authRequired] = useState(() => !localStorage.getItem("token"));

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/auth/me").then((response) => {
      const savedAddress =
        response.data.user.addresses?.find((address) => address.isDefault) ||
        response.data.user.addresses?.[0];
      if (savedAddress) {
        setDeliveryAddress({
          label: savedAddress.label,
          recipient: savedAddress.recipient,
          line1: savedAddress.line1,
          city: savedAddress.city,
          state: savedAddress.state,
          postalCode: savedAddress.postalCode,
          phone: savedAddress.phone,
        });
      }
    }).catch(() => {
      setError("Saved address could not be loaded. You can enter it manually.");
    });
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/orders", {
        paymentMethod,
        deliveryAddress,
        items: cartItems.map((item) => ({
          productId: item._id || item.id,
          quantity: item.quantity,
        })),
      });
      setIsComplete(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to place your order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isComplete) {
    return (
      <main className="payment-page payment-empty">
        <h1>Your checkout is empty</h1>
        <p>Add products to your cart before proceeding to payment.</p>
        <Link to="/" className="payment-shop-link">Continue shopping</Link>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="payment-page payment-complete">
        <div className="payment-success-icon" aria-hidden="true">✓</div>
        <p className="payment-eyebrow">PAYMENT CONFIRMED</p>
        <h1>Thank you for your order!</h1>
        <p>Your order has been placed successfully.</p>
        <button type="button" onClick={() => navigate("/")}>
          Back to shop
        </button>
      </main>
    );
  }

  return (
    <>
    <main className="payment-page">
      {authRequired && (
        <div className="payment-login-notice" role="alert">
          Please log in before proceeding to payment.
          <Link to="/login" state={{ from: "/payment" }}>Log in</Link>
        </div>
      )}
      <header className="payment-header">
        <Link to="/" className="payment-brand">SHOPMART</Link>
        <Link to="/" className="payment-back">← Continue shopping</Link>
      </header>

      <div className="payment-layout">
        <form className="payment-form-card" onSubmit={authRequired ? (event) => { event.preventDefault(); setError("Please log in before placing your order."); } : handleSubmit}>
          <div className="payment-steps" aria-label="Checkout progress">
            <span className="active">1 <b>Delivery</b></span>
            <i />
            <span className="active">2 <b>Payment</b></span>
            <i />
            <span>3 <b>Done</b></span>
          </div>
          <p className="payment-eyebrow">SECURE CHECKOUT</p>
          <h1>Payment details</h1>
          <p className="payment-intro">Choose your preferred payment method.</p>

          <div className="payment-fields payment-delivery-fields">
            <h2>Delivery address</h2>
            <label>
              Address label
              <input value={deliveryAddress.label} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, label: event.target.value })} required />
            </label>
            <label>
              Recipient name
              <input value={deliveryAddress.recipient} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, recipient: event.target.value })} required />
            </label>
            <label>
              Address line
              <input value={deliveryAddress.line1} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, line1: event.target.value })} required />
            </label>
            <div className="payment-field-row">
              <label>City<input value={deliveryAddress.city} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, city: event.target.value })} required /></label>
              <label>State<input value={deliveryAddress.state} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, state: event.target.value })} required /></label>
            </div>
            <div className="payment-field-row">
              <label>PIN code<input inputMode="numeric" value={deliveryAddress.postalCode} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, postalCode: event.target.value })} required /></label>
              <label>Phone<input inputMode="tel" value={deliveryAddress.phone} onChange={(event) => setDeliveryAddress({ ...deliveryAddress, phone: event.target.value })} required /></label>
            </div>
          </div>

          <div className="payment-methods" role="radiogroup" aria-label="Payment method">
            <label className={paymentMethod === "card" ? "selected" : ""}>
              <input
                type="radio"
                name="payment-method"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card payment
            </label>
            <label className={paymentMethod === "upi" ? "selected" : ""}>
              <input
                type="radio"
                name="payment-method"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI payment
            </label>
            <label className={paymentMethod === "cod" ? "selected" : ""}>
              <input
                type="radio"
                name="payment-method"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
            </label>
          </div>

          {error && <p className="payment-error" role="alert">{error}</p>}

          {paymentMethod === "card" && (
            <div className="payment-fields">
              <label>
                Cardholder name
                <input type="text" placeholder="Name on card" autoComplete="cc-name" minLength="2" required />
              </label>
              <label>
                Card number
                <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" pattern="[0-9 ]{13,19}" required />
              </label>
              <div className="payment-field-row">
                <label>
                  Expiry date
                  <input type="text" inputMode="numeric" placeholder="MM / YY" autoComplete="cc-exp" pattern="(0[1-9]|1[0-2]) ?/ ?[0-9]{2}" required />
                </label>
                <label>
                  CVV
                  <input type="password" inputMode="numeric" placeholder="•••" autoComplete="cc-csc" required />
                </label>
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <label className="payment-upi-field">
              UPI ID
              <input
                type="text"
                placeholder="name@bank"
                defaultValue="demo@upi"
                pattern="[A-Za-z0-9._-]+@[A-Za-z0-9.-]+"
                required
              />
            </label>
          )}

          <button type="submit" className="payment-submit" disabled={isSubmitting}>
            Place order · ₹{totalAmount.toLocaleString("en-IN")}
          </button>
        </form>

        <aside className="payment-order-card">
          <h2>Order summary</h2>
          <div className="payment-order-items">
            {cartItems.map((item) => (
              <div className="payment-order-item" key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>Qty {item.quantity}</span>
                </div>
                <b>₹{(item.price * item.quantity).toLocaleString("en-IN")}</b>
              </div>
            ))}
          </div>
          <div className="payment-total">
            <span>Total</span>
            <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
          </div>
        </aside>
      </div>
    </main>
    <BackToTopButton />
    </>
  );
}

export default Payment;
