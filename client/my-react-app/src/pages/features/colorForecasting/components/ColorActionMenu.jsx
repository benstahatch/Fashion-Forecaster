import React, { useEffect, useRef, useState } from "react";

export default function ColorActionMenu({
  colorName,
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
      className="color-action-menu-wrapper"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="color-action-button"
        aria-label={`Open actions for ${colorName}`}
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
        <div className="color-action-menu" role="menu">
          <button
            type="button"
            className="color-action-menu-item"
            role="menuitem"
            onClick={(event) => handleAction(event, onRename)}
          >
            Rename Color
          </button>
          <button
            type="button"
            className="color-action-menu-item"
            role="menuitem"
            onClick={(event) => handleAction(event, onDuplicate)}
          >
            Duplicate Color
          </button>
          <button
            type="button"
            className="color-action-menu-item"
            role="menuitem"
            onClick={(event) => handleAction(event, onViewDetails)}
          >
            View Details
          </button>
          <div className="color-action-menu-divider" aria-hidden="true" />
          <button
            type="button"
            className="color-action-menu-item color-action-menu-item-danger"
            role="menuitem"
            onClick={(event) => handleAction(event, onDelete)}
          >
            Delete Color
          </button>
        </div>
      )}
    </div>
  );
}
