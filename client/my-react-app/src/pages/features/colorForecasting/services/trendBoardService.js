import { getAuthenticatedUserId } from "../../../../lib/authUser";
import { logSupabaseError, supabase } from "../../../../lib/supabaseClient";

function isDuplicateBoardColorError(error) {
  return error?.code === "23505" || error?.status === 409;
}

export async function getTrendBoards() {
  const { data: boards, error } = await supabase
    .from("trend_boards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("getTrendBoards", error, {
      table: "trend_boards",
      orderBy: "created_at.desc"
    });
    return [];
  }

  const boardsWithCounts = await Promise.all(
    (boards || []).map(async (board) => {
      const { count, error: countError } = await supabase
        .from("trend_board_colors")
        .select("*", { count: "exact", head: true })
        .eq("board_id", board.id);

      if (countError) {
        logSupabaseError("getTrendBoards.countColors", countError, {
          table: "trend_board_colors",
          filter: { board_id: board.id },
          select: "count"
        });
      }

      return { ...board, colorCount: count || 0 };
    })
  );

  return boardsWithCounts;
}

export async function createTrendBoard({ name, season, year }) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("trend_boards")
    .insert([
      {
        user_id: userId,
        name: name.trim(),
        season: season.trim(),
        year
      }
    ])
    .select()
    .single();

  if (error) {
    logSupabaseError("createTrendBoard", error, {
      table: "trend_boards",
      payload: {
        user_id: userId,
        name: name.trim(),
        season: season.trim(),
        year
      }
    });
    return null;
  }

  return data;
}

export async function updateTrendBoardName(boardId, name) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from("trend_boards")
    .update({ name: name.trim() })
    .eq("id", boardId)
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("updateTrendBoardName", error, {
      table: "trend_boards",
      filter: { id: boardId, user_id: userId },
      payload: { name: name.trim() }
    });
    return false;
  }

  return true;
}

export async function deleteTrendBoard(boardId) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from("trend_boards")
    .delete()
    .eq("id", boardId)
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("deleteTrendBoard", error, {
      table: "trend_boards",
      filter: { id: boardId, user_id: userId }
    });
    return false;
  }

  return true;
}

export async function addColorToBoard(boardId, colorId) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { ok: false, reason: "error" };
  }

  const { error } = await supabase
    .from("trend_board_colors")
    .insert([
      {
        user_id: userId,
        board_id: boardId,
        color_id: colorId
      }
    ]);

  if (error) {
    logSupabaseError("addColorToBoard", error, {
      table: "trend_board_colors",
      payload: {
        user_id: userId,
        board_id: boardId,
        color_id: colorId
      }
    });
    return {
      ok: false,
      reason: isDuplicateBoardColorError(error) ? "duplicate" : "error"
    };
  }

  return { ok: true };
}

export async function removeColorFromBoard(boardId, colorId) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from("trend_board_colors")
    .delete()
    .eq("board_id", boardId)
    .eq("color_id", colorId)
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("removeColorFromBoard", error, {
      table: "trend_board_colors",
      filter: {
        board_id: boardId,
        color_id: colorId,
        user_id: userId
      }
    });
    return false;
  }

  return true;
}

export async function getBoardColors(boardId) {
  const { data, error } = await supabase
    .from("trend_board_colors")
    .select("colors(*)")
    .eq("board_id", boardId);

  if (error) {
    logSupabaseError("getBoardColors", error, {
      table: "trend_board_colors",
      select: "colors(*)",
      filter: { board_id: boardId }
    });
    return [];
  }

  return (data || [])
    .map((item) => item.colors)
    .filter(Boolean);
}
