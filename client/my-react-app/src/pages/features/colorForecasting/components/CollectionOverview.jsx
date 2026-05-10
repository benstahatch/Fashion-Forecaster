import React from "react";

export default function CollectionOverview({ label, title, description }) {
  return (
    <section className="overview-section">
      <div className="section-copy section-copy-centered">
        <p className="section-label">{label}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
