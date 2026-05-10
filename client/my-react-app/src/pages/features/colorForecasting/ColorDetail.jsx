import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getColors,
  getColorById,
  getCollectionsByColor
} from "./data/colorService";
import {
  createColorStory,
  deleteColorStory,
  fetchColorStoriesByColor,
  updateColorStory
} from "./data/colorStoryService";
import {
  addColorToBoard,
  getTrendBoards
} from "./services/trendBoardService";
import { pantoneColors as referenceColorOptions } from "./data/pantoneColors";
import { findClosestColors, findClosestPantones } from "./utils/colorUtils";

export default function ColorDetail({ colorId, onBack }) {
  const navigate = useNavigate();
  const [activeColorId, setActiveColorId] = useState(colorId);
  const [color, setColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referenceMatches, setReferenceMatches] = useState([]);
  const [relatedColors, setRelatedColors] = useState([]);
  const [stories, setStories] = useState([]);
  const [narrative, setNarrative] = useState("");
  const [designApplication, setDesignApplication] = useState("");
  const [fabricSuggestions, setFabricSuggestions] = useState("");
  const [collections, setCollections] = useState([]);
  const [trendBoards, setTrendBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [storyError, setStoryError] = useState("");
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editingNarrative, setEditingNarrative] = useState("");
  const [editingDesignApplication, setEditingDesignApplication] = useState("");
  const [editingFabricSuggestions, setEditingFabricSuggestions] = useState("");
  const [editingStoryError, setEditingStoryError] = useState("");
  const [isUpdatingStory, setIsUpdatingStory] = useState(false);
  const [openStoryMenuId, setOpenStoryMenuId] = useState(null);
  const [boardMessage, setBoardMessage] = useState("");
  const [boardError, setBoardError] = useState("");
  const [isAddingToBoard, setIsAddingToBoard] = useState(false);

  useEffect(() => {
    async function loadTrendBoards() {
      try {
        const boards = await getTrendBoards();
        setTrendBoards(boards || []);
        if ((boards || []).length > 0) {
          setSelectedBoardId(boards[0].id);
        }
      } catch (error) {
        console.error("Unable to load trend boards:", error);
        setTrendBoards([]);
      }
    }

    loadTrendBoards();
  }, []);

  useEffect(() => {
    setActiveColorId(colorId);
  }, [colorId]);

  useEffect(() => {
    async function loadColorDetail() {
      setIsLoading(true);

      try {
        const [currentColor, allColors] = await Promise.all([
          getColorById(activeColorId),
          getColors()
        ]);

        setColor(currentColor);

        if (!currentColor) {
          setReferenceMatches([]);
          setRelatedColors([]);
          setCollections([]);
          setStories([]);
          return;
        }

        const [matchingCollections, colorStories] = await Promise.all([
          getCollectionsByColor(currentColor.hex),
          fetchColorStoriesByColor(currentColor.id)
        ]);

        // TODO: A future Pantone workflow needs a trusted Pantone dataset,
        // stable Pantone IDs/codes, distance thresholds, and an optional
        // save/validation path before this can become true validation.
        setReferenceMatches(findClosestPantones(currentColor.hex, referenceColorOptions, 3));
        setRelatedColors(findClosestColors(currentColor.hex, allColors || [], 4));
        setCollections(matchingCollections || []);
        setStories(colorStories || []);
      } catch (error) {
        console.error("Unable to load color detail:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadColorDetail();
  }, [activeColorId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStoryError("");

    if (!color) {
      return;
    }

    setIsSavingStory(true);

    try {
      const story = await createColorStory({
        color_id: color.id,
        narrative,
        design_application: designApplication,
        fabric_suggestions: fabricSuggestions
      });

      if (!story) {
        setStoryError("Unable to save story.");
        return;
      }

      const colorStories = await fetchColorStoriesByColor(color.id);
      setStories(colorStories || []);
      setNarrative("");
      setDesignApplication("");
      setFabricSuggestions("");
    } catch (error) {
      console.error("Unable to save color story:", error);
      setStoryError("Unable to save story.");
    } finally {
      setIsSavingStory(false);
    }
  }

  async function handleAddToTrendBoard() {
    setBoardMessage("");
    setBoardError("");

    if (!selectedBoardId || !color) {
      setBoardError("Select a trend board first.");
      return;
    }

    setIsAddingToBoard(true);

    try {
      const result = await addColorToBoard(selectedBoardId, color.id);

      if (!result?.ok) {
        setBoardError(
          result?.reason === "duplicate"
            ? "This color is already on the board."
            : "This color could not be added right now."
        );
        return;
      }

      const selectedBoard = trendBoards.find((board) => board.id === selectedBoardId);
      setBoardMessage(
        selectedBoard
          ? `${color.name} added to ${selectedBoard.name}.`
          : `${color.name} added to the selected board.`
      );
    } catch (error) {
      console.error("Unable to add color to trend board:", error);
      setBoardError("Unable to add this color right now.");
    } finally {
      setIsAddingToBoard(false);
    }
  }

  function handleStartStoryEdit(story) {
    setOpenStoryMenuId(null);
    setEditingStoryId(story.id);
    setEditingNarrative(story.narrative || "");
    setEditingDesignApplication(story.design_application || "");
    setEditingFabricSuggestions(story.fabric_suggestions || "");
    setEditingStoryError("");
  }

  function handleCancelStoryEdit() {
    setEditingStoryId(null);
    setEditingNarrative("");
    setEditingDesignApplication("");
    setEditingFabricSuggestions("");
    setEditingStoryError("");
    setIsUpdatingStory(false);
  }

  async function handleSaveStoryEdit(storyId) {
    setEditingStoryError("");
    setIsUpdatingStory(true);

    try {
      const updatedStory = await updateColorStory(storyId, {
        narrative: editingNarrative,
        design_application: editingDesignApplication,
        fabric_suggestions: editingFabricSuggestions
      });

      if (!updatedStory) {
        setEditingStoryError("Unable to update story.");
        return;
      }

      const colorStories = await fetchColorStoriesByColor(color.id);
      setStories(colorStories || []);
      handleCancelStoryEdit();
    } catch (error) {
      console.error("Unable to update color story:", error);
      setEditingStoryError("Unable to update story.");
    } finally {
      setIsUpdatingStory(false);
    }
  }

  async function handleDeleteStory(storyId) {
    if (!color) {
      return;
    }

    const shouldDelete = window.confirm("Delete this color story?");

    if (!shouldDelete) {
      return;
    }

    setOpenStoryMenuId(null);

    if (editingStoryId === storyId) {
      handleCancelStoryEdit();
    }

    try {
      const didDelete = await deleteColorStory(storyId);

      if (!didDelete) {
        setEditingStoryError("Unable to delete story.");
        return;
      }

      const colorStories = await fetchColorStoriesByColor(color.id);
      setStories(colorStories || []);
    } catch (error) {
      console.error("Unable to delete color story:", error);
      setEditingStoryError("Unable to delete story.");
    }
  }

  function handleBackToColors() {
    if (onBack) {
      onBack();
    }

    navigate("/color");
  }

  if (isLoading) {
    return <div style={{ padding: "60px" }}>Loading...</div>;
  }

  if (!color) {
    return (
      <div style={{ padding: "60px" }}>
        <button
          onClick={handleBackToColors}
          style={{
            marginBottom: "24px",
            padding: "10px 18px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back to Colors
        </button>
        <p style={{ margin: 0 }}>Color not found.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
      <button
        onClick={handleBackToColors}
        style={{
          marginBottom: "40px",
          padding: "10px 18px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer"
        }}
      >
        ← Back to Colors
      </button>

      <section style={{ marginBottom: "100px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 300px) minmax(0, 1fr)",
            gap: "48px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              width: "300px",
              maxWidth: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: color.hex,
              border: "1px solid #d9d2c9"
            }}
          />

          <div>
            <p
              style={{
                margin: "0 0 12px",
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: "12px"
              }}
            >
              {color.season || "Uncategorized"}
            </p>

            <h1
              style={{
                margin: "0 0 16px",
                fontSize: "64px",
                lineHeight: 1,
                letterSpacing: "-0.02em"
              }}
            >
              {color.name}
            </h1>

            <p style={{ margin: 0, fontSize: "18px", color: "#666" }}>
              {color.hex}
            </p>

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <select
                value={selectedBoardId}
                onChange={(event) => setSelectedBoardId(event.target.value)}
                style={{ padding: "12px 14px" }}
              >
                <option value="">Select Trend Board</option>
                {trendBoards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name} · {board.season} {board.year}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddToTrendBoard}
                disabled={isAddingToBoard || trendBoards.length === 0}
                style={{
                  padding: "12px 18px",
                  border: "1px solid #000",
                  background: isAddingToBoard || trendBoards.length === 0 ? "#d9d2c9" : "#000",
                  color: "#fff",
                  cursor: isAddingToBoard || trendBoards.length === 0 ? "default" : "pointer"
                }}
              >
                {isAddingToBoard ? "Adding..." : "Add to Trend Board"}
              </button>
              <Link
                to={selectedBoardId ? `/boards/${selectedBoardId}` : "/trend-boards"}
                state={{
                  fromColorId: color.id,
                  focusColorId: color.id
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 18px",
                  border: "1px solid #ccc",
                  color: "inherit",
                  textDecoration: "none"
                }}
              >
                View Boards
              </Link>
            </div>
            {trendBoards.length === 0 && (
              <p style={{ margin: "14px 0 0", color: "#777" }}>
                Create a trend board first to start building a palette.
              </p>
            )}
            {boardMessage && (
              <p style={{ margin: "14px 0 0", color: "#2f5d50", fontWeight: 500 }}>
                {boardMessage}
              </p>
            )}
            {boardError && (
              <p style={{ margin: "14px 0 0", color: "#8a3b2e", fontWeight: 500 }}>
                {boardError}
              </p>
            )}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "100px" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "28px" }}>
          Reference Color Matches
        </h2>
        <p style={{ margin: "-22px 0 40px", maxWidth: "620px", color: "#6f6a64", lineHeight: 1.7 }}>
          Reference matches shown for inspiration and comparison. Full Pantone-linked
          validation is planned for a future iteration.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "28px"
          }}
        >
          {referenceMatches.map((referenceMatch, index) => (
            <div
              key={referenceMatch.id || referenceMatch.code || referenceMatch.hex || `${color.id}-reference-${index}`}
              style={{
                padding: "24px",
                border: "1px solid #e5dfd7",
                background: "#faf8f5"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "70px",
                  backgroundColor: referenceMatch.hex,
                  marginBottom: "16px"
                }}
              />

              <p style={{ margin: "0 0 6px", fontWeight: 500 }}>
                {referenceMatch.name}
              </p>

              <p style={{ margin: "0 0 4px", color: "#666" }}>
                {referenceMatch.code}
              </p>

              <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
                {referenceMatch.hex}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "100px" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "28px" }}>
          Related Colors
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "28px"
          }}
        >
          {relatedColors.map((relatedColor) => (
            <button
              key={relatedColor.id}
              type="button"
              onClick={() => setActiveColorId(relatedColor.id)}
              style={{
                padding: 0,
                border: "1px solid #e5dfd7",
                background: "#ffffff",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  backgroundColor: relatedColor.hex
                }}
              />
              <div style={{ padding: "18px" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 500 }}>
                  {relatedColor.name}
                </p>
                <p style={{ margin: 0, color: "#666" }}>
                  {relatedColor.hex}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "100px" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "28px" }}>
          Historical Collections
        </h2>

        {collections.length === 0 && (
          <p style={{ color: "#777" }}>
            No collections currently reference this color.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "32px"
          }}
        >
          {collections.map((collection) => (
            <div
              key={collection.id}
              style={{
                padding: "30px",
                border: "1px solid #e5dfd7",
                background: "#faf8f5"
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>
                {collection.brand}
              </h3>

              <p style={{ margin: "0 0 6px", color: "#666" }}>
                {collection.designer}
              </p>

              <p style={{ margin: "0 0 6px" }}>
                {collection.season} {collection.year}
              </p>

              <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>
                {collection.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "100px" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "28px" }}>
          Color Stories
        </h2>

        <div style={{ display: "grid", gap: "50px" }}>
          {stories.length === 0 && (
            <p style={{ color: "#777" }}>No stories yet.</p>
          )}

          {stories.map((story) => (
            <div
              key={story.id}
              style={{
                position: "relative",
                padding: "40px",
                border: "1px solid #e5dfd7",
                background: "#ffffff"
              }}
            >
              <div style={{ position: "absolute", top: "18px", right: "18px" }}>
                <button
                  type="button"
                  onClick={() => setOpenStoryMenuId((currentId) => (
                    currentId === story.id ? null : story.id
                  ))}
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "none",
                    borderRadius: "999px",
                    background: "#f6f4ef",
                    cursor: "pointer",
                    fontSize: "20px",
                    lineHeight: 1
                  }}
                >
                  ⋯
                </button>
                {openStoryMenuId === story.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      right: 0,
                      minWidth: "160px",
                      border: "1px solid #ddd5ca",
                      background: "#fff",
                      boxShadow: "0 12px 24px rgba(17, 17, 17, 0.08)"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleStartStoryEdit(story)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer"
                      }}
                    >
                      Edit Story
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "#b42318"
                      }}
                    >
                      Delete Story
                    </button>
                  </div>
                )}
              </div>

              {editingStoryId === story.id ? (
                <div style={{ display: "grid", gap: "18px" }}>
                  <textarea
                    value={editingNarrative}
                    onChange={(event) => setEditingNarrative(event.target.value)}
                    rows={6}
                    style={{ padding: "14px", marginTop: "8px" }}
                  />

                  <div>
                    <strong>Design Application</strong>
                    <textarea
                      value={editingDesignApplication}
                      onChange={(event) => setEditingDesignApplication(event.target.value)}
                      rows={4}
                      style={{ width: "100%", padding: "14px", marginTop: "8px" }}
                    />
                  </div>

                  <div>
                    <strong>Fabric Suggestions</strong>
                    <textarea
                      value={editingFabricSuggestions}
                      onChange={(event) => setEditingFabricSuggestions(event.target.value)}
                      rows={4}
                      style={{ width: "100%", padding: "14px", marginTop: "8px" }}
                    />
                  </div>

                  {editingStoryError && (
                    <p style={{ margin: 0, color: "#b42318" }}>
                      {editingStoryError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => handleSaveStoryEdit(story.id)}
                      disabled={isUpdatingStory}
                      style={{
                        padding: "12px 18px",
                        border: "1px solid #000",
                        background: isUpdatingStory ? "#444" : "#000",
                        color: "#fff",
                        cursor: isUpdatingStory ? "default" : "pointer"
                      }}
                    >
                      {isUpdatingStory ? "Saving..." : "Save Story"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelStoryEdit}
                      disabled={isUpdatingStory}
                      style={{
                        padding: "12px 18px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: isUpdatingStory ? "default" : "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ margin: "0 0 24px", lineHeight: 1.8 }}>
                    {story.narrative}
                  </p>

                  <div style={{ marginBottom: "18px" }}>
                    <strong>Design Application</strong>
                    <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
                      {story.design_application}
                    </p>
                  </div>

                  <div>
                    <strong>Fabric Suggestions</strong>
                    <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
                      {story.fabric_suggestions}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "120px" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "28px" }}>
          Add Color Story
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "24px",
            maxWidth: "650px"
          }}
        >
          <textarea
            placeholder="Narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={6}
            style={{ padding: "14px" }}
          />

          <textarea
            placeholder="Design Application"
            value={designApplication}
            onChange={(e) => setDesignApplication(e.target.value)}
            rows={4}
            style={{ padding: "14px" }}
          />

          <textarea
            placeholder="Fabric Suggestions"
            value={fabricSuggestions}
            onChange={(e) => setFabricSuggestions(e.target.value)}
            rows={4}
            style={{ padding: "14px" }}
          />

          {storyError && (
            <p style={{ margin: 0, color: "#b42318" }}>
              {storyError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSavingStory}
            style={{
              width: "fit-content",
              padding: "14px 24px",
              border: "1px solid #000",
              background: isSavingStory ? "#444" : "#000",
              color: "#fff",
              cursor: isSavingStory ? "default" : "pointer"
            }}
          >
            {isSavingStory ? "Saving..." : "Save Story"}
          </button>
        </form>
      </section>
    </div>
  );
}
