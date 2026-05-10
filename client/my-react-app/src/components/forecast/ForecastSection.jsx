import React from "react";

export default function ForecastSection({ title, body }) {
  return (
    <section className="forecast-shell forecast-section forecast-block">
      <div className="forecast-divider" />
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}
