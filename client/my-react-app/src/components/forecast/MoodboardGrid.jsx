import React from "react";

export default function MoodboardGrid({ images }) {
  return (
    <section className="forecast-shell forecast-block">
      <div className="forecast-section-heading">
        <p className="forecast-kicker">Moodboard</p>
        <h2>Visual References</h2>
      </div>

      <div className="moodboard-grid">
        {images.map((image, index) => (
          <figure className="moodboard-card" key={index}>
            <img src={image.src} alt={image.alt} />
          </figure>
        ))}
      </div>
    </section>
  );
}
