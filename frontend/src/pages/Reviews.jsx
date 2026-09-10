import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Reviews.css";

function Reviews() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/products").then((response) => {
      const available = response.data.products || [];
      setProducts(available);
      setSelectedId(available[0]?._id || "");
    }).catch(() => setMessage("Unable to load products."));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem("token")) {
      setMessage("Please log in before submitting a review.");
      return;
    }
    try {
      await api.post(`/reviews/${selectedId}`, { rating, comment });
      setComment("");
      setMessage("Review submitted and saved successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage(`Review authentication failed (${error.response.data?.message || "401"}). Please log in again.`);
      } else {
        setMessage(error.response?.data?.message || "Unable to save your review.");
      }
    }
  };

  return <main className="reviews-page"><Link to="/" className="reviews-back">← Home</Link><section className="reviews-card"><span>YOUR FEEDBACK</span><h1>Write a review</h1><p>Tell us about a product you purchased.</p><form onSubmit={submit}><label>Product<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} required>{products.map((product) => <option value={product._id} key={product._id}>{product.name}</option>)}</select></label><label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write your review..." required /><button type="submit">Submit Review</button></form>{message && <p className="reviews-message">{message}</p>}</section></main>;
}

export default Reviews;
