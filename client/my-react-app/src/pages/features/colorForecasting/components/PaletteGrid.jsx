import React, { useState } from "react";
import PaletteCard from "./PaletteCard";

export default function PaletteGrid({ label, title, cards }) {
  const [hexInput, setHexInput] = useState("");
  const [colors, setColors] = useState(cards);
  const [error, setError] = useState("");

  function handleAddColor() {
    const value = hexInput.trim();
    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);

    if (!isValidHex) {
      setError("Use a 6-digit hex value like #A1B2C3.");
      return;
    }

    setColors((prev) => [
      ...prev,
      {
        name: value.toUpperCase(),
        code: "Custom Hex",
        tone: value
      }
    ]);
    setHexInput("");
    setError("");
  }

  return (
    <section className="palette-section">
      <div className="section-copy">
        <p className="section-label">{label}</p>
        <h2>{title}</h2>
      </div>

      <div className="hex-adder">
        <input
          type="text"
          placeholder="#A1B2C3"
          value={hexInput}
          onChange={(event) => {
            setHexInput(event.target.value);
            if (error) {
              setError("");
            }
          }}
        />
        <button type="button" onClick={handleAddColor}>
          Add Hex
        </button>
      </div>

      {error ? <p className="hex-error">{error}</p> : null}

      <div className="palette-grid">
        {colors.map((card, index) => (
          <PaletteCard key={`${card.code}-${card.tone}-${index}`} {...card} />
        ))}
      </div>
    </section>
  );
}
