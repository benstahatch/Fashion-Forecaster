import React from "react";

export default function CreateBoardModal({
  name,
  season,
  year,
  onNameChange,
  onSeasonChange,
  onYearChange,
  onClose,
  onSubmit,
  canCreateBoard
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17, 17, 17, 0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 10
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          border: "1px solid #e5dfd7",
          padding: "32px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "28px"
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "12px"
              }}
            >
              Create Board
            </p>
            <h2 style={{ margin: 0, fontSize: "32px", lineHeight: 1.1 }}>
              New Forecast Palette
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 14px",
              border: "1px solid #d7d1c8",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
          <input
            type="text"
            placeholder="Board Name"
            value={name}
            onChange={onNameChange}
            style={{ padding: "14px" }}
            required
          />
          <input
            type="text"
            placeholder="Season"
            value={season}
            onChange={onSeasonChange}
            style={{ padding: "14px" }}
            required
          />
          <input
            type="number"
            value={year}
            min="2000"
            max="2100"
            step="1"
            onChange={onYearChange}
            style={{ padding: "14px" }}
            placeholder="Year"
            required
          />
          <button
            type="submit"
            disabled={!canCreateBoard}
            style={{
              width: "fit-content",
              padding: "14px 24px",
              border: "1px solid #000",
              background: !canCreateBoard ? "#777" : "#000",
              color: "#fff",
              cursor: !canCreateBoard ? "default" : "pointer"
            }}
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}
