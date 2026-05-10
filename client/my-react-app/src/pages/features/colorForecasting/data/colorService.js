import { getAuthenticatedUserId } from "../../../../lib/authUser";
import { logSupabaseError, supabase } from "../../../../lib/supabaseClient";

let isCollectionsTableUnavailable = false;

function hexToRgb(hex) {
  const normalizedHex = hex.replace("#", "");
  const value = normalizedHex.length === 3
    ? normalizedHex.split("").map((char) => char + char).join("")
    : normalizedHex;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

function getRgbDistance(source, target) {
  const rDiff = source.r - target.r;
  const gDiff = source.g - target.g;
  const bDiff = source.b - target.b;

  return Math.sqrt((rDiff ** 2) + (gDiff ** 2) + (bDiff ** 2));
}

export async function fetchColors() {
  const { data, error } = await supabase
    .from("colors")
    .select("*, pantone_color:pantone_color_id(*)")
    .order("created_at", { ascending: true });

  if (error) {
    logSupabaseError("fetchColors", error, {
      table: "colors",
      orderBy: "created_at.asc"
    });
    return [];
  }

  return data;
}

export async function getColors() {
  return fetchColors();
}

export async function getColorById(id) {
  const { data, error } = await supabase
    .from("colors")
    .select("*, pantone_color:pantone_color_id(*)")
    .eq("id", id)
    .single();

  if (error) {
    logSupabaseError("getColorById", error, {
      table: "colors",
      filter: { id }
    });
    return null;
  }

  return data;
}

export async function findNearestPantones(hex, limit = 5) {
  const { data, error } = await supabase
    .from("pantone_colors")
    .select("*");

  if (error) {
    console.error("[Pantone Debug] findNearestPantones query failed", {
      hex,
      limit,
      message: error?.message ?? null,
      code: error?.code ?? null,
      status: error?.status ?? null
    });
    logSupabaseError("findNearestPantones", error, {
      table: "pantone_colors"
    });
    return [];
  }

  console.log("[Pantone Debug] findNearestPantones query result", {
    hex,
    limit,
    rowCount: data?.length ?? 0
  });

  const sourceRgb = hexToRgb(hex);

  return (data || [])
    .map((pantone) => ({
      ...pantone,
      distance: getRgbDistance(sourceRgb, {
        r: pantone.r,
        g: pantone.g,
        b: pantone.b
      })
    }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, limit);
}

export async function insertColor(color) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { name, hex, season } = color;
  console.log("[Pantone Debug] insertColor start", { hex, name, season });

  const [nearestPantone] = await findNearestPantones(hex, 1);
  console.log("[Pantone Debug] insertColor nearest match", {
    hex,
    nearestPantone: nearestPantone ?? null
  });

  const payload = {
    user_id: userId,
    name,
    hex,
    season,
    pantone_color_id: nearestPantone?.id ?? null,
    match_distance: nearestPantone?.distance ?? null,
    is_pantone_matched: Boolean(nearestPantone)
  };

  console.log("[Pantone Debug] insertColor payload", payload);

  const { error } = await supabase
    .from("colors")
    .insert([payload]);

  if (error) {
    logSupabaseError("insertColor", error, {
      table: "colors",
      payload
    });
    return false;
  }

  return true;
}

export async function updateColorName(id, name) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from("colors")
    .update({ name })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("updateColorName", error, {
      table: "colors",
      filter: { id, user_id: userId },
      payload: { name }
    });
    return false;
  }

  return true;
}

export async function deleteColor(id) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from("colors")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("deleteColor", error, {
      table: "colors",
      filter: { id, user_id: userId }
    });
    return false;
  }

  return true;
}

export async function createForecast({
  season,
  theme_name,
  cultural_context,
  target_market,
  inspiration
}) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("forecasts")
    .insert([
      {
        user_id: userId,
        season,
        theme_name,
        cultural_context,
        target_market,
        inspiration
      }
    ])
    .select()
    .single();

  if (error) {
    logSupabaseError("createForecast", error, {
      table: "forecasts",
      payload: {
        user_id: userId,
        season,
        theme_name,
        cultural_context,
        target_market,
        inspiration
      }
    });
    return null;
  }

  return data;
}

export async function getForecasts() {
  const { data, error } = await supabase
    .from("forecasts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("getForecasts", error, {
      table: "forecasts",
      orderBy: "created_at.desc"
    });
    return [];
  }

  return data;
}

export async function getForecastById(id) {
  const { data, error } = await supabase
    .from("forecasts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    logSupabaseError("getForecastById", error, {
      table: "forecasts",
      filter: { id }
    });
    return null;
  }

  return data;
}

export async function attachColorToForecast(forecast_id, color_id) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("forecast_colors")
    .insert([
      {
        user_id: userId,
        forecast_id,
        color_id
      }
    ])
    .select()
    .single();

  if (error) {
    logSupabaseError("attachColorToForecast", error, {
      table: "forecast_colors",
      payload: {
        user_id: userId,
        forecast_id,
        color_id
      }
    });
    return null;
  }

  return data;
}

export async function getColorsForForecast(forecast_id) {
  const { data, error } = await supabase
    .from("forecast_colors")
    .select("colors(*)")
    .eq("forecast_id", forecast_id);

  if (error) {
    logSupabaseError("getColorsForForecast", error, {
      table: "forecast_colors",
      select: "colors(*)",
      filter: { forecast_id }
    });
    return [];
  }

  return (data || [])
    .map((item) => item.colors)
    .filter(Boolean);
}

export async function createColorStory({
  color_id,
  forecast_id = null,
  narrative,
  design_application,
  fabric_suggestions
}) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("color_stories")
    .insert([
      {
        user_id: userId,
        color_id,
        forecast_id,
        narrative,
        design_application,
        fabric_suggestions
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Create color story error:", error);
    return null;
  }

  return data;
}

export async function getColorStoriesByColor(color_id) {
  const { data, error } = await supabase
    .from("color_stories")
    .select("*")
    .eq("color_id", color_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get color stories by color error:", error);
    return [];
  }

  return data;
}

export async function getColorStoryById(id) {
  const { data, error } = await supabase
    .from("color_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get color story by id error:", error);
    return null;
  }

  return data;
}

export async function createCollection({
  designer,
  brand,
  season,
  year,
  description,
  palette
}) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("fashion_collections")
    .insert([
      {
        user_id: userId,
        designer,
        brand,
        season,
        year,
        description,
        palette
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Create collection error:", error);
    return null;
  }

  return data;
}

export async function getCollections() {
  if (isCollectionsTableUnavailable) {
    return [];
  }

  const { data, error } = await supabase
    .from("fashion_collections")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("fashion_collections")) {
      isCollectionsTableUnavailable = true;
      return [];
    }
    console.error("Get collections error:", error);
    return [];
  }

  return data;
}

export async function getCollectionsByColor(hex) {
  if (isCollectionsTableUnavailable) {
    return [];
  }

  const { data, error } = await supabase
    .from("fashion_collections")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("fashion_collections")) {
      isCollectionsTableUnavailable = true;
      return [];
    }
    console.error("Get collections by color error:", error);
    return [];
  }

  const normalizedHex = hex.toUpperCase();
  const matches = (data || []).filter((collection) => {
    let palette = collection.palette;

    if (typeof palette === "string") {
      try {
        palette = JSON.parse(palette);
      } catch (parseError) {
        console.error("Parse collection palette error:", parseError);
        return false;
      }
    }

    if (!Array.isArray(palette)) {
      return false;
    }

    return palette.some((value) => String(value).toUpperCase() === normalizedHex);
  });

  return matches;
}
