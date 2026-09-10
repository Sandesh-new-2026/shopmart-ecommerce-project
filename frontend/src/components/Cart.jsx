import "./Cart.css";
import { createPortal } from "react-dom";

function Cart({
  cartItems,
  isCartOpen,
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  onCheckout,
}) {
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return createPortal(
    <>
      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-panel" onClick={(event) => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <p className="cart-label">YOUR SHOPPING BAG</p>
                <h2>Shopping Cart</h2>
              </div>

              <button className="cart-close" onClick={closeCart}>
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>

                <h3>Your cart is empty</h3>

                <p>Add some amazing products to start shopping.</p>

                <button className="continue-shopping" onClick={closeCart}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />

                      <div className="cart-item-details">
                        <h3>{item.name}</h3>

                        <p className="cart-item-category">{item.category}</p>

                        <p className="cart-item-price">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                        <div className="quantity-controls">
                          <button onClick={() => decreaseQuantity(item.id)}>
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button onClick={() => increaseQuantity(item.id)}>
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove product"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total</span>

                    <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
                  </div>

                  <button
                    type="button"
                    className="checkout-button"
                    onClick={onCheckout}
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  , document.body);
}

export default Cart;
