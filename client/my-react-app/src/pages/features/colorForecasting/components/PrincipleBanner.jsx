import React from "react";

export default function PrincipleBanner({ title, description }) {
  return (
    <section className="principle-banner">
      <div className="section-copy">
        <p className="section-label">Forecasting Principle</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
