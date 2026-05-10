import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getColors } from "./data/colorService";
import {
  addColorToBoard,
  getBoardColors,
  getTrendBoards,
  removeColorFromBoard
} from "./services/trendBoardService";

export default function TrendBoardDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [boardColors, setBoardColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [boardMessage, setBoardMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadBoardDetail() {
    setIsLoading(true);

    try {
      const [boards, colorsOnBoard, colors] = await Promise.all([
        getTrendBoards(),
        getBoardColors(boardId),
        getColors()
      ]);

      setBoard((boards || []).find((item) => String(item.id) === String(boardId)) || null);
      setBoardColors(colorsOnBoard || []);
      setAllColors(colors || []);
    } catch (error) {
      console.error("Unable to load board detail:", error);
      setBoard(null);
      setBoardColors([]);
      setAllColors([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBoardDetail();
  }, [boardId]);

  async function handleAddColor(colorId) {
    setBoardMessage("");

    if (boardColors.some((color) => String(color.id) === String(colorId))) {
      setBoardMessage("This color is already on the board or could not be added.");
      return;
    }

    try {
      const result = await addColorToBoard(boardId, colorId);

      if (!result?.ok) {
        setBoardMessage(
          result?.reason === "duplicate"
            ? "This color is already on the board."
            : "Unable to add color right now."
        );
        return;
      }

      const addedColor = allColors.find((color) => String(color.id) === String(colorId));
      if (addedColor) {
        setBoardColors((currentColors) => [...currentColors, addedColor]);
        setBoardMessage(`${addedColor.name} added to ${board?.name || "board"}.`);
      }
    } catch (error) {
      console.error("Unable to add color to board:", error);
      setBoardMessage("Unable to add color right now.");
    }
  }

  async function handleRemoveColor(colorId) {
    setBoardMessage("");

    try {
      const didRemove = await removeColorFromBoard(boardId, colorId);

      if (!didRemove) {
        setBoardMessage("Unable to remove this color right now.");
        return;
      }

      const removedColor = boardColors.find((color) => String(color.id) === String(colorId));
      if (removedColor) {
        setBoardColors((currentColors) => currentColors.filter((color) => String(color.id) !== String(colorId)));
        setBoardMessage(`${removedColor.name} removed from ${board?.name || "board"}.`);
      }
    } catch (error) {
      console.error("Unable to remove color from board:", error);
      setBoardMessage("Unable to remove this color right now.");
    }
  }

  useEffect(() => {
    if (!location.state?.focusColorId || allColors.length === 0) {
      return;
    }

    const focusedColor = allColors.find((color) => String(color.id) === String(location.state.focusColorId));

    if (focusedColor) {
      setBoardMessage(`Continue building from ${focusedColor.name}.`);
    }
  }, [allColors, location.state]);

  if (isLoading) {
    return <div style={{ padding: "60px" }}>Loading...</div>;
  }

  if (!board) {
    return (
      <div style={{ padding: "60px" }}>
        <button
          type="button"
          onClick={() => navigate("/trend-boards")}
          style={{
            marginBottom: "24px",
            padding: "10px 18px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back to Boards
        </button>
        <p style={{ margin: 0 }}>Board not found.</p>
      </div>
    );
  }

  const existingColorIds = new Set(boardColors.map((color) => String(color.id)));
  const searchableColors = allColors.filter((color) => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      color.name.toLowerCase().includes(query) ||
      color.hex.toLowerCase().includes(query) ||
      String(color.season || "").toLowerCase().includes(query)
    );
  });

  const boardInsight = getBoardInsight(boardColors);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
      <section style={{ marginBottom: "72px" }}>
        <button
          type="button"
          onClick={() => navigate("/trend-boards")}
          style={{
            marginBottom: "28px",
            padding: "10px 18px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back to Boards
        </button>
        <p
          style={{
            margin: "0 0 12px",
            color: "#777",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: "12px"
          }}
        >
          {board.season} {board.year}
        </p>
        <h1 style={{ margin: 0, fontSize: "56px", lineHeight: 1.05 }}>
          {board.name}
        </h1>
        {boardMessage && (
          <p style={{ margin: "18px 0 0", color: "#2f5d50", fontWeight: 500 }}>
            {boardMessage}
          </p>
        )}
      </section>

      <section style={{ marginBottom: "80px" }}>
        <h2 style={{ margin: "0 0 28px", fontSize: "28px" }}>Board Colors</h2>
        {boardColors.length === 0 && (
          <p style={{ margin: "0 0 24px", color: "#777" }}>
            Start the board by adding colors below. The palette direction card will update as you build it.
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "28px"
          }}
        >
          {boardColors.map((color) => (
            <div
              key={color.id}
              style={{
                border: "1px solid #e5dfd7",
                background: "#ffffff"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  backgroundColor: color.hex
                }}
              />
              <div style={{ padding: "18px" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 500 }}>{color.name}</p>
                <p style={{ margin: "0 0 14px", color: "#666" }}>{color.hex}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color.id)}
                  style={{
                    width: "fit-content",
                    padding: "10px 16px",
                    border: "1px solid #c9beb3",
                    background: "#fff",
                    color: "#4f4740",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginBottom: "80px",
          padding: "28px",
          border: "1px solid #e5dfd7",
          background: "linear-gradient(135deg, #faf8f5 0%, #f3ece4 100%)"
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#777",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontSize: "12px"
          }}
        >
          Palette Direction
        </p>
        <h2 style={{ margin: "0 0 10px", fontSize: "28px" }}>{boardInsight.title}</h2>
        <p style={{ margin: "0 0 18px", color: "#5f5a54", maxWidth: "700px", lineHeight: 1.6 }}>
          {boardInsight.description}
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {boardInsight.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "8px 12px",
                border: "1px solid #d8cdc1",
                background: "rgba(255, 255, 255, 0.78)",
                fontSize: "13px"
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "28px"
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: "28px" }}>Add Colors</h2>
            <p style={{ margin: 0, color: "#777" }}>
              Search by name, hex, or season to keep building the board quickly.
            </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search colors"
            style={{
              minWidth: "240px",
              padding: "12px 14px",
              border: "1px solid #d8cdc1",
              background: "#fff"
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
            alignItems: "start",
            width: "100%",
            maxHeight: "720px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "8px"
          }}
        >
          {searchableColors.map((color) => (
            <div
              key={color.id}
              style={{
                border: "1px solid #e5dfd7",
                background: "#ffffff",
                minWidth: 0
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  backgroundColor: color.hex
                }}
              />
              <div style={{ padding: "18px" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 500 }}>{color.name}</p>
                <p style={{ margin: "0 0 14px", color: "#666" }}>{color.hex}</p>
                <button
                  type="button"
                  onClick={() => handleAddColor(color.id)}
                  disabled={existingColorIds.has(String(color.id))}
                  style={{
                    width: "fit-content",
                    padding: "10px 16px",
                    border: "1px solid #000",
                    background: existingColorIds.has(String(color.id)) ? "#f0eeea" : "#000",
                    color: existingColorIds.has(String(color.id)) ? "#777" : "#fff",
                    cursor: existingColorIds.has(String(color.id)) ? "default" : "pointer"
                  }}
                >
                  {existingColorIds.has(String(color.id)) ? "Added" : "Add to Board"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function getBoardInsight(colors) {
  if (colors.length === 0) {
    return {
      title: "Blank Canvas",
      description:
        "This board is ready for a point of view. Start with one anchor color, then build contrast around warmth, depth, or seasonal mood.",
      tags: ["Needs hero color", "Build contrast", "Define season"]
    };
  }

  const rgbValues = colors.map((color) => hexToRgb(color.hex));
  const average = rgbValues.reduce(
    (totals, current) => ({
      r: totals.r + current.r,
      g: totals.g + current.g,
      b: totals.b + current.b
    }),
    { r: 0, g: 0, b: 0 }
  );

  const avgR = Math.round(average.r / colors.length);
  const avgG = Math.round(average.g / colors.length);
  const avgB = Math.round(average.b / colors.length);
  const brightness = Math.round((avgR + avgG + avgB) / 3);
  const temperature =
    avgR >= avgB + 12 ? "Warm-led" : avgB >= avgR + 12 ? "Cool-led" : "Balanced";
  const depth = brightness < 110 ? "Deep palette" : brightness > 190 ? "Light palette" : "Mid-tone palette";
  const contrast = getContrastLabel(colors);

  return {
    title: `${temperature} ${depth}`,
    description: `The board currently reads as a ${temperature.toLowerCase()} story with ${contrast.toLowerCase()} and an overall ${depth.toLowerCase()}. Use this as a guide for adding accent shades or tightening the forecast narrative.`,
    tags: [temperature, depth, contrast]
  };
}

function getContrastLabel(colors) {
  const lightnessValues = colors.map((color) => {
    const { r, g, b } = hexToRgb(color.hex);
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  });

  const min = Math.min(...lightnessValues);
  const max = Math.max(...lightnessValues);
  const range = max - min;

  if (range >= 120) {
    return "High contrast";
  }

  if (range >= 60) {
    return "Moderate contrast";
  }

  return "Soft contrast";
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}
