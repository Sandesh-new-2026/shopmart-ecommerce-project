import { Link } from "react-router-dom";

function ProductCard({ product, addToCart, isWishlisted, toggleWishlist }) {
  const productId = product._id || product.id;
  return (
    <article className="product-card">
      <div className="product-image-box">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/500x400?text=Product";
          }}
        />
      </div>

      <div className="product-info">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <button
            type="button"
            className={`wishlist-button ${isWishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>

        <p className="product-category">
          {product.category}
        </p>

        <div className="product-rating">
          <span>
            {"★".repeat(Math.round(product.rating))}
          </span>

          <small>({product.rating})</small>
        </div>

        <div className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </div>

        <div className="product-actions">
          <Link className="details-button" to={productId ? `/products/${encodeURIComponent(productId)}` : "/"} state={{ product }}>View Details</Link>
          <button type="button" className="add-cart-button" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
