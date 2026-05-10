import React from "react";

export default function TargetMarketSection({ label, title, description }) {
  return (
    <section className="target-market-section">
      <div className="target-market-background" />
      <div className="target-market-content">
        <div className="section-copy">
          <p className="section-label">{label}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
