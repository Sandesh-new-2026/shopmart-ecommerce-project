import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            SHOP<span>MART</span>
          </h2>

          <p>
            Your simple destination for discovering
            quality products and modern shopping
            experiences.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <a href="#products">Products</a>
          <Link to="/about">About us</Link>
          <Link to="/careers">Careers</Link>
        </div>

        <div className="footer-contact">
          <h3>Project Features</h3>

          <p>✓ Category Filtering</p>
          <p>✓ Reusable Components</p>
          <p>✓ Custom React Hook</p>
          <p>✓ API Integration</p>
        </div>
        <div className="footer-social">
          <h3>Follow us</h3>
          <div className="footer-social-links">
            <a href="https://twitter.com" aria-label="Twitter">𝕏</a>
            <a href="https://facebook.com" aria-label="Facebook">f</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} SHOPMART. Built with React.
        </p>
      </div>
    </footer>
  );
}

export default Footer;