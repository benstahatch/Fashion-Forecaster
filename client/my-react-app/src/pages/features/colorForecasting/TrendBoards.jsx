import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateBoardModal from "../../../components/CreateBoardModal";
import BoardCard from "./components/BoardCard";
import {
  createTrendBoard,
  deleteTrendBoard,
  getTrendBoards,
  updateTrendBoardName
} from "./services/trendBoardService";

export default function TrendBoards() {
  const location = useLocation();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [year, setYear] = useState("");

  async function loadBoards() {
    try {
      const data = await getTrendBoards();
      setBoards(data || []);
    } catch (error) {
      console.error("Unable to load boards:", error);
      setBoards([]);
    }
  }

  useEffect(() => {
    loadBoards();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const board = await createTrendBoard({
      name,
      season,
      year: Number.parseInt(year, 10)
    });

    if (!board) {
      return;
    }

    setName("");
    setSeason("");
    setYear("");
    await loadBoards();
    setIsModalOpen(false);
  }

  async function handleRenameBoard(board) {
    const nextName = window.prompt("Rename board", board.name);

    if (nextName === null) {
      return;
    }

    const trimmedName = nextName.trim();

    if (!trimmedName || trimmedName === board.name) {
      return;
    }

    try {
      const didUpdate = await updateTrendBoardName(board.id, trimmedName);

      if (!didUpdate) {
        return;
      }

      await loadBoards();
    } catch (error) {
      console.error("Unable to rename board:", error);
    }
  }

  async function handleDuplicateBoard(board) {
    try {
      const createdBoard = await createTrendBoard({
        name: `${board.name} Copy`,
        season: board.season,
        year: board.year
      });

      if (!createdBoard) {
        return;
      }

      await loadBoards();
    } catch (error) {
      console.error("Unable to duplicate board:", error);
    }
  }

  async function handleDeleteBoard(board) {
    const shouldDelete = window.confirm(`Delete "${board.name}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      const didDelete = await deleteTrendBoard(board.id);

      if (!didDelete) {
        return;
      }

      await loadBoards();
    } catch (error) {
      console.error("Unable to delete board:", error);
    }
  }

  const canCreateBoard = Boolean(name.trim() && season.trim() && year !== "");

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
      {isModalOpen && (
        <CreateBoardModal
          name={name}
          season={season}
          year={year}
          onNameChange={(event) => setName(event.target.value)}
          onSeasonChange={(event) => setSeason(event.target.value)}
          onYearChange={(event) => setYear(event.target.value)}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          canCreateBoard={canCreateBoard}
        />
      )}

      <section style={{ marginBottom: "72px" }}>
        <button
          type="button"
          onClick={() => navigate("/color")}
          style={{
            marginBottom: "28px",
            padding: "10px 18px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back to Forecasting
        </button>

        {location.state?.fromColorId && (
          <button
            type="button"
            onClick={() => navigate("/color", {
              state: { selectedColorId: location.state.fromColorId }
            })}
            style={{
              marginBottom: "28px",
              padding: "10px 18px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            ← Back to Color
          </button>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap"
          }}
        >
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
              Trend Boards
            </p>
            <h1 style={{ margin: 0, fontSize: "56px", lineHeight: 1.05 }}>
              Forecasting Palettes
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              width: "fit-content",
              padding: "14px 24px",
              border: "1px solid #000",
              background: "#000",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            + Create Board
          </button>
        </div>
      </section>

      <section style={{ marginTop: "12px" }}>
        {boards.length === 0 && (
          <p style={{ margin: "0 0 24px", color: "#777" }}>
            No boards yet. Create your first forecasting palette to start building a gallery.
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "28px"
          }}
        >
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              isHovered={hoveredBoardId === board.id}
              onMouseEnter={() => setHoveredBoardId(board.id)}
              onMouseLeave={() => setHoveredBoardId(null)}
              onViewDetails={() => navigate(`/boards/${board.id}`)}
              onRename={() => handleRenameBoard(board)}
              onDuplicate={() => handleDuplicateBoard(board)}
              onDelete={() => handleDeleteBoard(board)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
