import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ColorDetail from "./ColorDetail";
import ColorCard from "./components/ColorCard";
import {
  deleteColor,
  fetchColors,
  insertColor,
  updateColorName
} from "./data/colorService";
import "./colorForecasting.css";

const SEASON_OPTIONS = [
  "Fall",
  "Winter",
  "Spring",
  "Summer",
  "Fall/Winter",
  "Spring/Summer"
];

export default function ColorForecasting() {
  const location = useLocation();
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);

  const [newName, setNewName] = useState("");
  const [newSeason, setNewSeason] = useState("");
  const [newHex, setNewHex] = useState("#000000");
  const [hexInput, setHexInput] = useState("#000000");
  const [hexError, setHexError] = useState("");
  const isValidHex = /^#[0-9A-Fa-f]{6}$/;

  async function loadColors() {
    try {
      const data = await fetchColors();
      setColors(data || []);
    } catch (error) {
      console.error("Unable to load colors:", error);
      setColors([]);
    }
  }

  async function handleRenameColor(color) {
    const nextName = window.prompt("Rename color", color.name);

    if (nextName === null) {
      return;
    }

    const trimmedName = nextName.trim();

    if (!trimmedName || trimmedName === color.name) {
      return;
    }

    try {
      const didUpdate = await updateColorName(color.id, trimmedName);

      if (!didUpdate) {
        return;
      }

      await loadColors();
    } catch (error) {
      console.error("Unable to rename color:", error);
    }
  }

  async function handleDuplicateColor(color) {
    try {
      const didInsert = await insertColor({
        name: `${color.name} Copy`,
        hex: color.hex,
        season: color.season || null
      });

      if (!didInsert) {
        return;
      }

      await loadColors();
    } catch (error) {
      console.error("Unable to duplicate color:", error);
    }
  }

  async function handleDeleteColor(color) {
    const shouldDelete = window.confirm(`Delete "${color.name}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      const didDelete = await deleteColor(color.id);

      if (!didDelete) {
        return;
      }

      await loadColors();
    } catch (error) {
      console.error("Unable to delete color:", error);
    }
  }

  useEffect(() => {
    loadColors();
  }, []);

  useEffect(() => {
    if (location.state?.selectedColorId) {
      setSelectedColorId(location.state.selectedColorId);
    }
  }, [location.state]);

  //  If a color is selected, render ColorDetail instead
  if (selectedColorId) {
    return (
      <ColorDetail
        colorId={selectedColorId}
        onBack={() => setSelectedColorId(null)}
      />
    );
  }

  const groupedColors = colors.reduce((groups, color) => {
    const season =
      color.season && color.season.trim()
        ? color.season
        : "Uncategorized";

    if (!groups[season]) {
      groups[season] = [];
    }

    groups[season].push(color);
    return groups;
  }, {});

  return (
    <main className="color-page">
      <section className="hero">
        <div className="hero-text">
          <p className="small-label">Color Forecasting</p>
          <h1> Color Forecasting</h1>
          <p className="hero-copy">
            Build and explore seasonal colors used across forecasting palettes.
          </p>
        </div>
      </section>

      <section className="card-section">
        <div className="section-divider" aria-hidden="true" />
        <div className="section-header">
          <p className="small-label">Color Library</p>
          <h2>COLOR LIBRARY</h2>
          <p className="hero-copy">
            Explore seasonal colors used in forecasting palettes.
          </p>
        </div>

        <div className="color-form">
          <div className="form-field name-field">
            <input
              type="text"
              placeholder="Color Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="form-field name-field">
            <select
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value)}
            >
              <option value="">Season</option>
              {SEASON_OPTIONS.map((seasonOption) => (
                <option key={seasonOption} value={seasonOption}>
                  {seasonOption}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field color-picker-field">
            <input
              type="color"
              value={newHex}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setNewHex(value);
                setHexInput(value);
                setHexError("");
              }}
            />
          </div>

          <div className="form-field hex-field">
            <input
              type="text"
              placeholder="#RRGGBB"
              value={hexInput}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                const isHexValid = isValidHex.test(value);

                setHexInput(value);

                if (isHexValid) {
                  setNewHex(value);
                  setHexError("");
                  return;
                }

                setHexError("Invalid hex code");
              }}
            />

            {hexError && <p className="hex-error">Invalid hex code</p>}
          </div>

          <button
            onClick={async () => {
              if (!newName.trim()) return;

              const didInsert = await insertColor({
                name: newName,
                hex: newHex,
                season: newSeason.trim() || null
              });

              if (!didInsert) return;

              await loadColors();

              setNewName("");
              setNewSeason("");
              setNewHex("#000000");
              setHexInput("#000000");
              setHexError("");
            }}
          >
            Add Color
          </button>
        </div>

        {Object.entries(groupedColors).map(([season, seasonColors]) => (
          <div key={season}>
            <h3>{season}</h3>
            <div className="card-grid">
              {seasonColors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)} //  click handler
                  style={{ cursor: "pointer" }}
                >
                  <ColorCard
                    id={color.id}
                    name={color.name}
                    hex={color.hex}
                    onRename={() => handleRenameColor(color)}
                    onDuplicate={() => handleDuplicateColor(color)}
                    onViewDetails={() => setSelectedColorId(color.id)}
                    onDelete={() => handleDeleteColor(color)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
