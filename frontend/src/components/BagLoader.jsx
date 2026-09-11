import "./BagLoader.css";

function BagLoader({ label = "Getting things ready..." }) {
  return (
    <div className="bag-loader" role="status" aria-live="polite">
      <div className="bag-loader-art" aria-hidden="true">
        <span className="bag-loader-handle"></span>
        <span className="bag-loader-body">
          <span className="bag-loader-mark">S</span>
        </span>
        <span className="bag-loader-dot bag-loader-dot-one"></span>
        <span className="bag-loader-dot bag-loader-dot-two"></span>
        <span className="bag-loader-dot bag-loader-dot-three"></span>
      </div>
      <strong>{label}</strong>
      <span className="bag-loader-caption">A little Shopmart magic...</span>
    </div>
  );
}

export default BagLoader;
