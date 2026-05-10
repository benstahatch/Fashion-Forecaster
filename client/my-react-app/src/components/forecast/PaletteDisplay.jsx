import React from "react";

export default function PaletteDisplay({ colors }) {
  return (
    <section className="forecast-shell forecast-block">
      <div className="forecast-section-heading">
        <p className="forecast-kicker">Palette</p>
        <h2>Core Color Story</h2>
      </div>

      <div className="palette-display">
        {colors.map((color) => (
          <article className="palette-card" key={color.hex}>
            <div
              className="palette-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <div className="palette-meta">
              <p>{color.name}</p>
              <span>{color.hex}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
