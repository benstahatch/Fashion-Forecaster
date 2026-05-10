import React, { useEffect, useRef, useState } from "react";

const menuWrapperStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  zIndex: 2
};

const menuButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
  height: "30px",
  border: "none",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.92)",
  color: "#111111",
  boxShadow: "0 2px 8px rgba(17, 17, 17, 0.06)",
  cursor: "pointer",
  lineHeight: 1,
  fontSize: "18px",
  padding: 0
};

const menuStyle = {
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  minWidth: "180px",
  padding: "8px 0",
  border: "1px solid rgba(216, 210, 202, 0.9)",
  background: "#ffffff",
  boxShadow: "0 12px 24px rgba(17, 17, 17, 0.08)"
};

const menuItemStyle = {
  display: "block",
  width: "100%",
  padding: "10px 14px",
  border: "none",
  background: "transparent",
  color: "#111111",
  textAlign: "left",
  fontSize: "14px",
  cursor: "pointer"
};

const dividerStyle = {
  height: "1px",
  margin: "6px 0",
  background: "rgba(216, 210, 202, 0.9)"
};

export default function BoardActionMenu({
  boardName,
  onRename,
  onDuplicate,
  onViewDetails,
  onDelete
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleAction(event, action) {
    event.stopPropagation();
    setIsOpen(false);
    await action?.();
  }

  return (
    <div
      ref={menuRef}
      style={menuWrapperStyle}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        style={menuButtonStyle}
        aria-label={`Open actions for ${boardName}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        ⋯
      </button>

      {isOpen && (
        <div style={menuStyle} role="menu">
          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={(event) => handleAction(event, onRename)}
          >
            Rename Board
          </button>
          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={(event) => handleAction(event, onDuplicate)}
          >
            Duplicate Board
          </button>
          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={(event) => handleAction(event, onViewDetails)}
          >
            View Details
          </button>
          <div style={dividerStyle} aria-hidden="true" />
          <button
            type="button"
            role="menuitem"
            style={{
              ...menuItemStyle,
              color: "#b42318"
            }}
            onClick={(event) => handleAction(event, onDelete)}
          >
            Delete Board
          </button>
        </div>
      )}
    </div>
  );
}
