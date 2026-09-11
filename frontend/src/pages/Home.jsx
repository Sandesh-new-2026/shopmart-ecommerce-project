import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import FilterDrawer from "../components/FilterDrawer";
import BackToTopButton from "../components/BackToTopButton";
import Chatbot from "../components/Chatbot";
import BagLoader from "../components/BagLoader";
import { addCartItem, readCart, saveCart } from "../utils/cart";

import "../App.css";

const PRODUCTS_PER_PAGE = 6;

function Home() {
  const navigate = useNavigate();
  // ================= PRODUCTS =================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsAreaRef = useRef(null);

  // ================= CART =================

  const [cartItems, setCartItems] = useState(readCart);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  // ================= FILTERS =================

  const [filters, setFilters] = useState({
    category: "all",
    maxPrice: 50000,
    rating: 0,
    sortBy: "relevance",
    wishlistOnly: false,
  });

  // ================= GET PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products");

        setProducts(response.data.products || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const syncCart = (event) => setCartItems(event.detail || readCart());
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  // ================= FILTER PRODUCTS =================

const filteredProducts = useMemo(() => {
  const text = search.trim().toLowerCase();

  const matchingProducts = products.filter((product) => {
  const wishlistMatch =
    !filters.wishlistOnly ||
    wishlist.some((item) => String(item._id || item.id) === String(product._id || product.id));
  const searchMatch =
      text === "" ||
      product.name?.toLowerCase().includes(text) ||
      product.title?.toLowerCase().includes(text) ||
      product.category?.toLowerCase().includes(text);

    const categoryMatch =
      filters.category === "all" ||
      product.category?.toLowerCase() ===
        filters.category.toLowerCase();

    const ratingMatch =
      filters.rating === 0 ||
      Number(product.rating) >= Number(filters.rating);

    const priceMatch =
      Number(product.price) <= Number(filters.maxPrice);

    return (
      searchMatch &&
      wishlistMatch &&
      categoryMatch &&
      ratingMatch &&
      priceMatch
    );
  });

  return [...matchingProducts].sort((first, second) => {
    if (filters.sortBy === "price-low") return Number(first.price) - Number(second.price);
    if (filters.sortBy === "price-high") return Number(second.price) - Number(first.price);
    if (filters.sortBy === "rating-high") return Number(second.rating) - Number(first.rating);
    return 0;
  });
}, [products, search, filters, wishlist]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    productsAreaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ================= ADD TO CART =================

  const addToCart = (product) => {
    setCartItems(addCartItem(product));
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((current) => {
      const next = current.some((item) => (item._id || item.id) === id)
        ? current.filter((item) => (item._id || item.id) !== id)
        : [...current, product];
      localStorage.setItem("wishlist", JSON.stringify(next));
      setWishlistMessage(current.some((item) => (item._id || item.id) === id) ? "Removed from My Wishlist." : "Product added to My Wishlist.");
      window.setTimeout(() => setWishlistMessage(""), 2200);
      return next;
    });
  };

  // ================= QUANTITY =================

  const updateQuantity = (id, change) => {
    setCartItems((previousItems) => {
      const next = previousItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item,
        )
        .filter((item) => item.quantity > 0);
      saveCart(next);
      return next;
    });
  };

  const increaseQuantity = (id) => {
    updateQuantity(id, 1);
  };

  const decreaseQuantity = (id) => {
    updateQuantity(id, -1);
  };

  const removeFromCart = (id) => {
    setCartItems((previousItems) => {
      const next = previousItems.filter((item) => item.id !== id);
      saveCart(next);
      return next;
    });
  };

  // ================= CART COUNT =================

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // ================= UI =================

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      {/* 
      <Navbar
        cartCount={totalCartItems}
        openCart={() => setIsCartOpen(true)}
        openFilter={() => setIsFilterOpen(true)}
        onSearchSubmit={() => productsAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      /> */}

      <Navbar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        cartCount={totalCartItems}
        openCart={() => setIsCartOpen(true)}
        openFilter={() => setIsFilterOpen(true)}
      />
      {wishlistMessage && <div className="wishlist-toast" role="status">{wishlistMessage}</div>}

      {/* ================= HERO ================= */}

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-badge">✦ SHOPMART</span>

          <h2>
            Discover Products
            <br />
            You'll Love
          </h2>

          <p>
            Explore quality products at great prices with a simple and beautiful
            shopping experience.
          </p>

          <a href="#products" className="hero-btn">
            Shop Now
            <span> →</span>
          </a>
        </div>
      </section>

      {/* ================= SHOP SECTION ================= */}

      <section className="shop-section" id="products">
        {/* ================= FILTER SIDEBAR ================= */}

        {/* ================= PRODUCTS ================= */}

        <main
          className="products-area"
          ref={productsAreaRef}
          style={{ scrollMarginTop: "90px" }}
        >
          {/* PRODUCTS HEADER */}
          <div className="products-heading">
            <div>
              <span className="products-small-title">OUR COLLECTION</span>

              <h2>Products</h2>

              <p>
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "product" : "products"
                    } available`}
              </p>
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="products-loading">
              <BagLoader label="Loading your collection..." />
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="products-error">
              <div className="error-icon">!</div>

              <h3>{error}</h3>

              <p>Please check your backend server and try again.</p>

              <button type="button" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  addToCart={addToCart}
                  isWishlisted={wishlist.some((item) => (item._id || item.id) === (product._id || product.id))}
                  toggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length > PRODUCTS_PER_PAGE && (
            <nav className="pagination" aria-label="Product pages">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={page === currentPage ? "active" : ""}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}

          {/* NO PRODUCTS */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>

              <h3>No products found</h3>

              <p>
                Try changing your search, category, rating or price filters.
              </p>

            </div>
          )}
        </main>
      </section>

      {/* ================= FOOTER ================= */}

      <Footer />

      {/* ================= CART ================= */}

      <Cart
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate("/payment", { state: { cartItems } });
        }}
      />

      {/* <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      /> */}
      <FilterDrawer
        key={isFilterOpen ? "filter-drawer-open" : "filter-drawer-closed"}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={(nextFilters) => {
          setFilters(nextFilters);
          setCurrentPage(1);
        }}
        onClear={() => {
          setSearch("");
          setCurrentPage(1);
        }}
      />

      <BackToTopButton />
      <Chatbot />
    </div>
  );
}

export default Home;
