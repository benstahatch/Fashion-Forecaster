import React, { useEffect, useState } from "react";
import {
  findNearestPantones,
  getColorsForForecast,
  getForecastById
} from "./data/colorService";

export default function ForecastDetail({ forecastId }) {
  const [forecast, setForecast] = useState(null);
  const [colors, setColors] = useState([]);
  const [referenceMatches, setReferenceMatches] = useState([]);

  useEffect(() => {
    async function loadForecast() {
      const [forecastData, colorData] = await Promise.all([
        getForecastById(forecastId),
        getColorsForForecast(forecastId)
      ]);

      setForecast(forecastData);
      setColors(colorData || []);

      const matches = await Promise.all(
        (colorData || []).map(async (color) => ({
          color,
          pantones: await findNearestPantones(color.hex, 3)
        }))
      );

      setReferenceMatches(matches);
    }

    loadForecast();
  }, [forecastId]);

  if (!forecast) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px" }}>
      <section style={{ marginBottom: "72px" }}>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "11px",
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.18em"
          }}
        >
          {forecast.season}
        </p>
        <h1
          style={{
            margin: "0 0 24px",
            fontSize: "48px",
            lineHeight: 1.1
          }}
        >
          {forecast.theme_name}
        </h1>
      </section>

      <section style={{ marginBottom: "72px", display: "grid", gap: "32px" }}>
        <div>
          <h2 style={{ margin: "0 0 12px" }}>Cultural Context</h2>
          <p style={{ margin: 0, maxWidth: "650px", lineHeight: 1.8 }}>
            {forecast.cultural_context}
          </p>
        </div>

        <div>
          <h2 style={{ margin: "0 0 12px" }}>Target Market</h2>
          <p style={{ margin: 0, maxWidth: "650px", lineHeight: 1.8 }}>
            {forecast.target_market}
          </p>
        </div>

        <div>
          <h2 style={{ margin: "0 0 12px" }}>Inspiration</h2>
          <p style={{ margin: 0, maxWidth: "650px", lineHeight: 1.8 }}>
            {forecast.inspiration}
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "72px" }}>
        <h2 style={{ margin: "0 0 20px" }}>Reference Color Matches</h2>
        <p style={{ margin: "0 0 20px", maxWidth: "650px", lineHeight: 1.8, color: "#666" }}>
          Reference matches shown for inspiration and comparison. Full Pantone-linked
          validation is planned for a future iteration.
        </p>
        <div style={{ display: "grid", gap: "20px" }}>
          {referenceMatches.map(({ color, pantones }) => (
            <div
              key={color.id}
              style={{ paddingBottom: "20px", borderBottom: "1px solid #e2ddd5" }}
            >
              <p style={{ margin: "0 0 10px", fontWeight: 600 }}>
                {color.name} {color.hex}
              </p>
              <div style={{ display: "grid", gap: "8px" }}>
                {pantones.map((pantone, index) => (
                  <p key={pantone.id || pantone.code || pantone.hex || `${color.id}-${index}`} style={{ margin: 0, color: "#555" }}>
                    {pantone.name} ({pantone.code}) {pantone.hex}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: "0 0 20px" }}>Colors</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start"
          }}
        >
          {colors.map((color) => (
            <div
              key={color.id}
              style={{
                width: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: color.hex,
                  marginBottom: "12px",
                  border: "1px solid #d8d2ca"
                }}
              />
              <p style={{ margin: "0 0 6px" }}>{color.name}</p>
              <p style={{ margin: 0, color: "#666" }}>{color.hex}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
