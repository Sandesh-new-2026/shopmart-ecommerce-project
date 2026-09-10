import { useState } from "react";
import "./FilterDrawer.css";

const categories = [
  {
    value: "all",
    label: "All Categories",
  },
  {
    value: "electronics",
    label: "Electronics",
  },
  {
    value: "fashion",
    label: "Fashion",
  },
  {
    value: "home",
    label: "Home",
  },
];

const ratings = [
  {
    value: 0,
    label: "All Ratings",
  },
  {
    value: 4,
    label: "★ 4 & above",
  },
  {
    value: 3,
    label: "★ 3 & above",
  },
  {
    value: 2,
    label: "★ 2 & above",
  },
];

const DEFAULT_FILTERS = {
  category: "all",
  rating: 0,
  maxPrice: 50000,
  sortBy: "relevance",
  wishlistOnly: false,
};

function FilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  onClear,
}) {
  const [tempFilters, setTempFilters] = useState(
    filters || DEFAULT_FILTERS
  );

  // Drawer open झाल्यावर applied filters temporary मध्ये copy
  if (!isOpen) {
    return null;
  }

  // ================================
  // CATEGORY CHANGE
  // ================================

  const handleCategoryChange = (category) => {
    setTempFilters((previous) => ({
      ...previous,
      category,
    }));
  };

  // ================================
  // RATING CHANGE
  // ================================

  const handleRatingChange = (rating) => {
    setTempFilters((previous) => ({
      ...previous,
      rating,
    }));
  };

  // ================================
  // PRICE CHANGE
  // ================================

  const handlePriceChange = (event) => {
    setTempFilters((previous) => ({
      ...previous,
      maxPrice: Number(event.target.value),
    }));
  };

  const handleSortChange = (event) => {
    setTempFilters((previous) => ({ ...previous, sortBy: event.target.value }));
  };

  // ================================
  // APPLY
  // ================================

  const handleApply = () => {
    setFilters({
      ...tempFilters,
    });

    onClose();
  };

  // ================================
  // CLEAR
  // ================================

  const handleClear = () => {
    const resetFilters = {
      ...DEFAULT_FILTERS,
    };

    setTempFilters(resetFilters);
    setFilters(resetFilters);

    // Keep the navbar search and drawer filters in sync when clearing.
    onClear?.();

    onClose();
  };

  // ================================
  // OUTSIDE CLICK
  // ================================

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="filter-modal-overlay"
      onClick={handleOverlayClick}
    >
      <aside
        className="filter-modal-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =================================
            HEADER
        ================================= */}

        <div className="filter-modal-header">
          <div>
            <span className="filter-modal-label">
              SHOP
            </span>

            <h2>FILTER YOUR RESULTS</h2>

            <p>Refine your product selection</p>
          </div>

          <button
            type="button"
            className="filter-modal-close"
            onClick={onClose}
            aria-label="Close filter"
          >
            ×
          </button>
        </div>

        {/* =================================
            BODY
        ================================= */}

        <div className="filter-modal-body">

          {/* CATEGORY */}

          <section className="filter-modal-section">
            <h3>Category</h3>

            <div className="filter-options">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="filter-modal-option"
                >
                  <input
                    type="radio"
                    name="product-category"
                    value={category.value}
                    checked={
                      tempFilters.category ===
                      category.value
                    }
                    onChange={() =>
                      handleCategoryChange(
                        category.value
                      )
                    }
                  />

                  <span>{category.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="filter-modal-section">
            <h3>Sort products</h3>
            <select
              className="filter-sort-select"
              value={tempFilters.sortBy}
              onChange={handleSortChange}
            >
              <option value="relevance">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating-high">Top rated</option>
            </select>
          </section>

          {/* PRICE */}

          <section className="filter-modal-section">
            <div className="filter-price-heading">
              <h3>Maximum Price</h3>

              <strong>
                ₹
                {Number(
                  tempFilters.maxPrice
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={tempFilters.maxPrice}
              onChange={handlePriceChange}
              className="filter-price-slider"
            />

            <div className="filter-price-values">
              <span>₹0</span>
              <span>₹50,000</span>
            </div>
          </section>

          {/* RATING */}

          <section className="filter-modal-section">
            <h3>Customer Rating</h3>

            <div className="filter-options">
              {ratings.map((rating) => (
                <label
                  key={rating.value}
                  className="filter-modal-option"
                >
                  <input
                    type="radio"
                    name="product-rating"
                    value={rating.value}
                    checked={
                      Number(tempFilters.rating) ===
                      Number(rating.value)
                    }
                    onChange={() =>
                      handleRatingChange(
                        rating.value
                      )
                    }
                  />

                  <span>{rating.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="filter-modal-section">
            <label className="filter-modal-option">
              <input
                type="checkbox"
                checked={Boolean(tempFilters.wishlistOnly)}
                onChange={(event) =>
                  setTempFilters((previous) => ({
                    ...previous,
                    wishlistOnly: event.target.checked,
                  }))
                }
              />
              <span>Show My Wishlist products</span>
            </label>
          </section>
        </div>

        {/* =================================
            FOOTER
        ================================= */}

        <div className="filter-modal-footer">
          <button
            type="button"
            className="filter-clear-btn"
            onClick={handleClear}
          >
            CLEAR ALL
          </button>

          <button
            type="button"
            className="filter-apply-btn"
            onClick={handleApply}
          >
            APPLY FILTERS
          </button>
        </div>
      </aside>
    </div>
  );
}

export default FilterDrawer;
