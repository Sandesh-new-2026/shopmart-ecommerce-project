import "./ProductFilter.css";

function ProductFilter({
  products,
  filters,
  setFilters,
  clearFilters,
  closeFilter,
}) {
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const brands = [
    ...new Set(
      products
        .map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

  const toggleFilter = (type, value) => {
    setFilters((previous) => ({
      ...previous,
      [type]: previous[type].includes(value)
        ? previous[type].filter((item) => item !== value)
        : [...previous[type], value],
    }));
  };

  return (
    <div className="product-filter">

      {/* Header */}
      <div className="filter-title">
        <h3>FILTERS</h3>

        <button
          className="filter-close"
          onClick={closeFilter}
        >
          ✕
        </button>
      </div>


      {/* CATEGORY */}
      <div className="filter-section">
        <div className="filter-heading">
          <span>Category</span>
          <span>−</span>
        </div>

        {categories.map((category) => (
          <label
            className="filter-option"
            key={category}
          >
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() =>
                toggleFilter("categories", category)
              }
            />

            <span>{category}</span>
          </label>
        ))}
      </div>


      {/* BRAND */}
      {brands.length > 0 && (
        <div className="filter-section">
          <div className="filter-heading">
            <span>Brand</span>
            <span>−</span>
          </div>

          {brands.map((brand) => (
            <label
              className="filter-option"
              key={brand}
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() =>
                  toggleFilter("brands", brand)
                }
              />

              <span>{brand}</span>
            </label>
          ))}
        </div>
      )}


      {/* RATING */}
      <div className="filter-section">
        <div className="filter-heading">
          <span>Customer Rating</span>
          <span>−</span>
        </div>

        {[4, 3, 2, 1].map((rating) => (
          <label
            className="filter-option"
            key={rating}
          >
            <input
              type="checkbox"
              checked={filters.ratings.includes(rating)}
              onChange={() =>
                toggleFilter("ratings", rating)
              }
            />

            <span className="stars">
              {"★".repeat(rating)}
            </span>

            <span>& above</span>
          </label>
        ))}
      </div>


      {/* PRICE */}
      <div className="filter-section">
        <div className="filter-heading">
          <span>Price</span>
          <span>−</span>
        </div>

        <div className="price-inputs">

          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((previous) => ({
                ...previous,
                minPrice: Number(e.target.value),
              }))
            }
          />

          <span>to</span>

          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((previous) => ({
                ...previous,
                maxPrice: Number(e.target.value),
              }))
            }
          />

        </div>
      </div>


      {/* CLEAR */}
      <button
        className="clear-filter"
        onClick={clearFilters}
      >
        Clear All Filters
      </button>

    </div>
  );
}

export default ProductFilter;