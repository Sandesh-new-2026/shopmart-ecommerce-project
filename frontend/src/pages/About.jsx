import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./InfoPage.css";

function About() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <Link to="/" className="info-brand">SHOPMART</Link>
        <span>ABOUT SHOPMART</span>
        <h1>Shopping made simpler.</h1>
        <p>We bring trusted products, fair prices and a calm, modern shopping experience together in one place.</p>
      </header>
      <main className="info-content">
        <section className="info-card"><span>01</span><h2>Curated for everyday life</h2><p>Our collection focuses on useful products you can feel confident bringing home.</p></section>
        <section className="info-card"><span>02</span><h2>Designed around you</h2><p>Fast discovery, clear details and a smooth checkout keep shopping effortless on every screen.</p></section>
        <section className="info-card"><span>03</span><h2>Here for the long term</h2><p>We are building a thoughtful store that earns your trust with every order.</p></section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
