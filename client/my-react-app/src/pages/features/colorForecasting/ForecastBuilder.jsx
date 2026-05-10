import React, { useEffect, useState } from "react";
import {
  attachColorToForecast,
  createForecast,
  getColors
} from "./data/colorService";

export default function ForecastBuilder() {
  const [colors, setColors] = useState([]);
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [season, setSeason] = useState("");
  const [themeName, setThemeName] = useState("");
  const [culturalContext, setCulturalContext] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [inspiration, setInspiration] = useState("");

  useEffect(() => {
    async function loadColors() {
      const data = await getColors();
      setColors(data || []);
    }

    loadColors();
  }, []);

  function handleColorToggle(colorId) {
    setSelectedColorIds((currentIds) =>
      currentIds.includes(colorId)
        ? currentIds.filter((id) => id !== colorId)
        : [...currentIds, colorId]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const forecast = await createForecast({
        season,
        theme_name: themeName,
        cultural_context: culturalContext,
        target_market: targetMarket,
        inspiration
      });

      if (!forecast) {
        console.error("Failed to save forecast");
        return;
      }

      for (const colorId of selectedColorIds) {
        await attachColorToForecast(forecast.id, colorId);
      }

      setSeason("");
      setThemeName("");
      setCulturalContext("");
      setTargetMarket("");
      setInspiration("");
      setSelectedColorIds([]);
      console.log("Forecast saved successfully", forecast);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
      <h1>Forecast Builder</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "16px" }}>
          <input
            type="text"
            placeholder="Season"
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Theme Name"
            value={themeName}
            onChange={(event) => setThemeName(event.target.value)}
            required
          />

          <textarea
            placeholder="Cultural Context"
            value={culturalContext}
            onChange={(event) => setCulturalContext(event.target.value)}
            rows={5}
          />

          <textarea
            placeholder="Target Market"
            value={targetMarket}
            onChange={(event) => setTargetMarket(event.target.value)}
            rows={5}
          />

          <textarea
            placeholder="Inspiration"
            value={inspiration}
            onChange={(event) => setInspiration(event.target.value)}
            rows={5}
          />

          <div>
            <p>Select Colors</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "12px"
              }}
            >
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorToggle(color.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "10px",
                    border: selectedColorIds.includes(color.id)
                      ? "2px solid #111111"
                      : "1px solid #d0d0d0",
                    background: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: color.hex
                    }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit">Save Forecast</button>
        </div>
      </form>
    </div>
  );
}
