import React from "react";

export default function HeroSection({ label, title }) {
  return (
    <section className="hero-section">
      <div className="hero-image" />
      <div className="hero-overlay">
        <div className="hero-content">
          <p>{label}</p>
          <h1>{title}</h1>
        </div>
      </div>
    </section>
  );
}
