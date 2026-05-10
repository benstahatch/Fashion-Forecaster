import React from "react";
import BoardActionMenu from "./BoardActionMenu";

export default function BoardCard({
  board,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onViewDetails,
  onRename,
  onDuplicate,
  onDelete
}) {
  return (
    <article
      onClick={onViewDetails}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        padding: "28px",
        border: "1px solid #e5dfd7",
        background: "#faf8f5",
        color: "inherit",
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 10px 24px rgba(17, 17, 17, 0.06)"
          : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease"
      }}
    >
      <BoardActionMenu
        boardName={board.name}
        onRename={onRename}
        onDuplicate={onDuplicate}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />

      <p
        style={{
          margin: "0 0 10px",
          color: "#777",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          fontSize: "12px",
          paddingRight: "40px"
        }}
      >
        {String(board.season).toUpperCase()} {board.year}
      </p>
      <h3 style={{ margin: 0, fontSize: "28px", lineHeight: 1.1 }}>
        {board.name}
      </h3>
      <p style={{ margin: "18px 0 0", color: "#666", fontSize: "14px" }}>
        {board.colorCount || 0} {(board.colorCount || 0) === 1 ? "Color" : "Colors"}
      </p>
    </article>
  );
}
