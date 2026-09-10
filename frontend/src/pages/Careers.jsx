import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./InfoPage.css";

function Careers() {
  return (
    <div className="info-page">
      <header className="info-hero info-hero-careers">
        <Link to="/" className="info-brand">SHOPMART</Link>
        <span>CAREERS</span>
        <h1>Build the future of better shopping.</h1>
        <p>Join a curious, kind team creating useful experiences for millions of everyday moments.</p>
      </header>
      <main className="info-content careers-content">
        <div className="info-intro"><span>OPEN ROLES</span><h2>Find your next opportunity</h2><p>We are growing thoughtfully. Share your profile with us and we will be in touch when the right role opens.</p><a className="info-cta" href="mailto:careers@shopmart.example">careers@shopmart.example</a></div>
        <div className="career-perks"><div><strong>People first</strong><p>Respect, clarity and ownership in every team.</p></div><div><strong>Learn always</strong><p>Space to experiment, improve and grow.</p></div><div><strong>Work well</strong><p>Flexible collaboration with a strong customer focus.</p></div></div>
      </main>
      <Footer />
    </div>
  );
}

export default Careers;
