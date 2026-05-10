import React from "react";

export default function PaletteCard({ name, code, tone }) {
  return (
    <article className="palette-card">
      <div className="palette-swatch" style={{ backgroundColor: tone }} />
      <div className="palette-card-copy">
        <h3>{name}</h3>
        <p>{code}</p>
      </div>
    </article>
  );
}
