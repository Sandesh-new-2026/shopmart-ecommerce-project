import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";
import Navbar from "../components/Navbar";
import { addCartItem, readCart } from "../utils/cart";
import BagLoader from "../components/BagLoader";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    const load = async () => {
      try {
        const productResponse = location.state?.product
          ? { data: { product: location.state.product } }
          : await api.get(`/products/${id}`);
        setProduct(productResponse.data.product);
        try {
          const reviewResponse = await api.get(`/reviews/${id}`);
          setReviews(reviewResponse.data.reviews || []);
        } catch {
          setReviews([]);
        }
      } catch (error) {
        console.error("Product details error:", error);
        setMessage("Unable to load this product.");
      }
    };
    load();
  }, [id, location.state]);

  useEffect(() => {
    const syncCart = (event) => setCartItems(event.detail || readCart());
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem("token")) {
      setMessage("Please log in before submitting a review.");
      return;
    }
    try {
      const response = await api.post(`/reviews/${id}`, { rating, comment });
      setReviews((current) => [response.data.review, ...current.filter((review) => review.userId !== response.data.review.userId)]);
      setComment("");
      setMessage("Your review was saved.");
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage(`Review authentication failed (${error.response.data?.message || "401"}). Please log in again.`);
      } else {
        setMessage(error.response?.data?.message || "Unable to save your review.");
      }
    }
  };

  if (!product) return <main className="details-page"><BagLoader label={message || "Loading product..."} /></main>;

  return (
    <>
      <Navbar cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)} openCart={() => window.location.assign("/payment")} />
      <main className="details-page">
      <Link to="/" className="details-back">← Continue shopping</Link>
      <section className="details-card">
        <div className="details-image"><img src={product.image} alt={product.name} /></div>
        <div className="details-copy">
          <span>{product.category}</span>
          <h1>{product.name}</h1>
          <div className="details-rating">{"★".repeat(Math.round(product.rating || 0))} <small>{product.rating || 0}/5</small></div>
          <p className="details-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
          <p>{product.description || `Quality ${product.category || "products"}, carefully selected for your everyday shopping needs.`}</p>
          <button type="button" onClick={() => {
            addCartItem(product);
            setMessage("Added to cart.");
          }}>Add to Cart</button>
        </div>
      </section>
      <section className="reviews-section">
        <h2>Customer reviews</h2>
        <form onSubmit={submitReview} className="review-form">
          <label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write your review..." required />
          <button type="submit">Send Review</button>
        </form>
        {message && <p className="details-message">{message}</p>}
        <div className="review-list">{reviews.map((review) => <article key={review._id}><strong>{review.userName}</strong><span>{"★".repeat(review.rating)}</span><p>{review.comment}</p></article>)}</div>
      </section>
      </main>
    </>
  );
}

export default ProductDetails;
