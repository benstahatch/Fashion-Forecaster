import React from "react";
import ColorActionMenu from "./ColorActionMenu";

export default function ColorCard({
  name,
  hex,
  onEditStory,
  onRename,
  onDuplicate,
  onViewDetails,
  onDelete
}) {
  return (
    <article className="color-card">
      <ColorActionMenu
        colorName={name}
        onEditStory={onEditStory}
        onRename={onRename}
        onDuplicate={onDuplicate}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
      />
      <div
        className="color-swatch"
        style={{ backgroundColor: hex }}
      />
      <div className="card-text">
        <p className="pantone-label">
          PANTONE<sup>&reg;</sup>
        </p>
        <p className="pantone-code">{hex}</p>
        <h3>{name}</h3>
      </div>
    </article>
  );
}
