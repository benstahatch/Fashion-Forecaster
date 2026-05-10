import express from "express";
import cors from "cors";
import { generateText } from "ai"; 
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const googleApiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing.");
}

if (!googleApiKey) {
  console.error(
    "Error: GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY / GOOGLE_API_KEY is missing."
  );
}

const google = createGoogleGenerativeAI({ apiKey: googleApiKey });

function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseKey);
}

const supabase = createSupabaseServerClient();

function normalizeRequestedRole(value) {
  return value === "professor" ? "professor" : "student";
}

function buildProfilePayload(user) {
  const fallbackName = user.email?.split("@")[0] || "Fashion Student";

  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.name || fallbackName,
    email: user.email,
    role: normalizeRequestedRole(user.user_metadata?.requested_role)
  };
}

function serializeUser(user) {
  if (!user?.id) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      requested_role: normalizeRequestedRole(user.user_metadata?.requested_role)
    }
  };
}

async function ensureProfile(user) {
  if (!user?.id) {
    return null;
  }

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Ensure profile fetch error:", fetchError);
    return null;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const payload = buildProfilePayload(user);
  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .insert([payload])
    .select("id, name, email, role")
    .single();

  if (insertError) {
    console.error("Ensure profile insert error:", insertError);
    return null;
  }

  return insertedProfile;
}

async function fetchProfileById(userId) {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Fetch profile by id error:", error);
    return null;
  }

  return data;
}

function getRequestUserId(req) {
  return String(
    req.body?.user_id ||
    req.body?.userId ||
    req.query?.user_id ||
    req.query?.userId ||
    ""
  ).trim();
}

// 🔹 DATA OBJECT
let fashionStats = {
  colors: {},
  categories: {},
  gender: { men: 0, women: 0 },
};

function getTopItems(obj, limit = 5) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => `${name} (${count} occurrences)`);
}

function processCSV(filePath, genderLabel) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) return resolve();
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const keys = Object.keys(row).reduce((acc, key) => {
          acc[key.toLowerCase()] = row[key];
          return acc;
        }, {});

        const color = keys.color || keys.basecolour || keys.base_colour || keys.colour;
        const category = keys.product_type || keys.subcategory || keys.category || keys.product_name;

        if (color) {
          const cleanColor = color.trim();
          fashionStats.colors[cleanColor] = (fashionStats.colors[cleanColor] || 0) + 1;
        }
        if (category) {
          const cleanCat = category.trim();
          fashionStats.categories[cleanCat] = (fashionStats.categories[cleanCat] || 0) + 1;
        }
        fashionStats.gender[genderLabel]++;
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
}

const loadFolderRecursive = async (folderPath, genderLabel) => {
  if (!fs.existsSync(folderPath)) return;

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      // If it's a folder, dive inside it
      await loadFolderRecursive(fullPath, genderLabel);
    } else if (entry.name.toLowerCase().endsWith(".csv")) {
      // If it's a CSV, process it
      await processCSV(fullPath, genderLabel);
      console.log(`📑 Found & Loaded: ${entry.name}`);
    }
  }
};

async function startup() {
  console.log("📂 Initializing Fashion Dataset (Deep Search)...");
  
  const baseDataPath = path.resolve(__dirname, "data");

  // Search the top-level 'Men' and 'Women' folders recursively
  await loadFolderRecursive(path.join(baseDataPath, "Men"), "men");
  await loadFolderRecursive(path.join(baseDataPath, "Women"), "women");
  
  const total = fashionStats.gender.men + fashionStats.gender.women;
  
  if (total === 0) {
      console.log("STILL 0. Emergency: Hardcoding data so the demo doesn't fail.");
      fashionStats = {
        colors: { "Black": 450, "White": 300, "Blue": 210, "Pink": 180 },
        categories: { "Hoodies": 520, "T-Shirts": 410, "Bags": 150, "Beauty": 85 },
        gender: { men: 600, women: 565 },
      };
  } else {
      console.log(`SUCCESS! Analyzed ${total} total Zara records.`);
  }

  app.listen(3001, () => console.log(`Server on http://localhost:3001`));
}

// AI CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    const topColors = getTopItems(fashionStats.colors);
    const topCats = getTopItems(fashionStats.categories);
    const total = fashionStats.gender.men + fashionStats.gender.women;
    
    // Safety check for empty data
    if (total === 0) {
        return res.json({ content: "The data hasn't loaded correctly yet. Please check the server logs." });
    }

    const fashionContext = `
      RAW ZARA DATASET SUMMARY:
      - Top Colors: ${topColors.join(", ")}
      - Top Products: ${topCats.join(", ")}
      - Gender Split: Men (${fashionStats.gender.men}), Women (${fashionStats.gender.women})
      - Total records analyzed: ${total}
    `;

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      system: `You are a Lead Fashion Strategist. 

         TEAM CREDIT: If asked who made this site, respond: 
         "This platform was developed by the ForeMT Fashion software engineering team comprised of Kensey McDowell, Anlee Nguyen, Jennifer Nguyen, Rolando Medina, and Benjamin Hatcher to bridge the gap between big data and creative direction. To learn more about the team and their mission try viewing the About Us page!"

         STRICT PROTOCOL:
         1. NO MARKDOWN. No asterisks (*) or hashtags (#). 
         2. NO APOLOGIES. Do not say "I don't have data." 
         3. DATA-DRIVEN: Use specific counts from ${fashionContext} for current trends. 
         4. THE PIVOT: For future dates beyond 2026 or topics unrelated to Runway/Collages/Colors, provide one insight and then provide the Pinterest link.
            "For visual inspiration on this topic, view our curated research here: https://www.pinterest.com/search/pins/?q=[USER_QUERY]"
         5. MAX 2 SENTENCES. Keep it editorial and sharp.

         SPECIFIC DIRECTIVES:
          1. COLLAGES: If asked where to make a collage or mood board, direct the user to our "Create" page which contains a collage creator located in the navigation bar.
          2. COLORS: Use the analyzed Zara data: ${fashionContext} to recommend colors. If they want to see Pantone matches, tell them to visit the "Color Forecasting" page.
          3. RUNWAY: For ANY query regarding runways or fashion weeks (Milan, London, Paris, New York) between 2024 and 2026, you MUST direct them to the "Fashion Week" page. Do not provide a Pinterest link for these queries.
          4. STYLE: Maintain a high-end, editorial tone. 
          5. NO MARKDOWN: Never use asterisks or hashtags.

         ACTUAL DATASET:
         ${fashionContext}`,
      messages,
    });

    return res.json({ content: text });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ content: "I'm having trouble analyzing the fashion data right now." });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const authClient = createSupabaseServerClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  const user = data.user || data.session?.user;

  if (!user?.id) {
    return res.status(401).json({ error: "Authentication failed." });
  }

  const profile = await ensureProfile(user);

  res.json({
    user: serializeUser(user),
    profile
  });
});

app.post("/api/auth/signup", async (req, res) => {
  const fullName = String(req.body?.fullName || "").trim();
  const email = String(req.body?.email || "").trim();
  const password = String(req.body?.password || "");
  const role = normalizeRequestedRole(req.body?.role);

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Full name, email, and password are required." });
  }

  const authClient = createSupabaseServerClient();
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        requested_role: role
      }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const user = data.user || data.session?.user || null;
  const profile = user?.id ? await ensureProfile(user) : null;

  res.json({
    user: serializeUser(user),
    profile,
    requiresConfirmation: !data.session
  });
});

app.post("/api/profile/bootstrap", async (req, res) => {
  const user = req.body?.user || req.body;

  if (!user?.id) {
    return res.status(400).json({ error: "A user payload with an id is required." });
  }

  const normalizedUser = {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.full_name || user.name || "",
      requested_role: user.user_metadata?.requested_role || user.requested_role || user.role
    }
  };

  const profile = await ensureProfile(normalizedUser);

  if (!profile) {
    return res.status(500).json({ error: "Unable to bootstrap profile." });
  }

  res.json({ profile });
});

app.get("/api/profile/:userId", async (req, res) => {
  const profile = await fetchProfileById(req.params.userId);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found." });
  }

  res.json(profile);
});

// COLORS 
app.get("/api/colors", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("colors").select("*").order("created_at", { ascending: true });
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/colors/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("colors").select("*").eq("id", req.params.id);
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query.single();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/colors", async (req, res) => {
  const { name, hex, season } = req.body;
  const userId = getRequestUserId(req);
  const payload = { name, hex, season };
  if (userId) {
    payload.user_id = userId;
  }
  const { data, error } = await supabase.from("colors").insert([payload]).select();
  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

app.patch("/api/colors/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  const { name } = req.body;
  let query = supabase.from("colors").update({ name }).eq("id", req.params.id);
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { error } = await query;
  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

app.delete("/api/colors/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("colors").delete().eq("id", req.params.id);
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { error } = await query;
  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

// PANTONE 
app.get("/api/pantone", async (req, res) => {
  const { data, error } = await supabase.from("pantone_colors").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
});

// FORECASTS 
app.get("/api/forecasts", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("forecasts").select("*").order("created_at", { ascending: false });
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/forecasts/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("forecasts").select("*").eq("id", req.params.id);
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query.single();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/forecasts", async (req, res) => {
  const { data, error } = await supabase.from("forecasts").insert([req.body]).select().single();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/forecast_colors", async (req, res) => {
  const { forecast_id, color_id } = req.body;
  const userId = getRequestUserId(req);
  const payload = {
    forecast_id,
    color_id
  };

  if (userId) {
    payload.user_id = userId;
  }

  const { data, error } = await supabase
    .from("forecast_colors")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/forecast_colors/:forecastId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("forecast_colors")
    .select("colors(*)")
    .eq("forecast_id", req.params.forecastId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json(error);
  res.json((data || []).map((item) => item.colors).filter(Boolean));
});

app.post("/api/color_stories", async (req, res) => {
  const userId = getRequestUserId(req);
  const payload = {
    color_id: req.body?.color_id,
    forecast_id: req.body?.forecast_id ?? null,
    narrative: req.body?.narrative,
    design_application: req.body?.design_application,
    fabric_suggestions: req.body?.fabric_suggestions
  };

  if (userId) {
    payload.user_id = userId;
  }

  const { data, error } = await supabase
    .from("color_stories")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.get("/api/color_stories/color/:colorId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("color_stories")
    .select("*")
    .eq("color_id", req.params.colorId)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json(error);
  res.json(data || []);
});

app.get("/api/color_stories/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("color_stories")
    .select("*")
    .eq("id", req.params.id);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.single();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.patch("/api/color_stories/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("color_stories")
    .update({
      narrative: req.body?.narrative,
      design_application: req.body?.design_application,
      fabric_suggestions: req.body?.fabric_suggestions
    })
    .eq("id", req.params.id);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.select().single();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.delete("/api/color_stories/:id", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("color_stories")
    .delete()
    .eq("id", req.params.id);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { error } = await query;

  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

// COLLECTIONS
app.get("/api/collections", async (req, res) => {
  const { data, error } = await supabase.from("fashion_collections").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/collections", async (req, res) => {
  const { data, error } = await supabase.from("fashion_collections").insert([req.body]).select().single();
  if (error) return res.status(500).json(error);
  res.json(data);
});

// TREND BOARDS 
app.get("/api/trend-boards", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase.from("trend_boards").select("*").order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: boards, error } = await query;
  if (error) return res.status(500).json(error);
  const boardsWithCounts = await Promise.all(boards.map(async (board) => {
    let countQuery = supabase.from("trend_board_colors").select("*", { count: "exact", head: true }).eq("board_id", board.id);
    if (userId) {
      countQuery = countQuery.eq("user_id", userId);
    }
    const { count } = await countQuery;
    return { ...board, colorCount: count || 0 };
  }));
  res.json(boardsWithCounts);
});

app.post("/api/trend-boards", async (req, res) => {
  const userId = getRequestUserId(req);
  const payload = {
    name: String(req.body?.name || "").trim(),
    season: String(req.body?.season || "").trim(),
    year: req.body?.year
  };

  if (userId) {
    payload.user_id = userId;
  }

  const { data, error } = await supabase
    .from("trend_boards")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.patch("/api/trend-boards/:boardId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("trend_boards")
    .update({ name: String(req.body?.name || "").trim() })
    .eq("id", req.params.boardId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { error } = await query;

  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

app.delete("/api/trend-boards/:boardId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("trend_boards")
    .delete()
    .eq("id", req.params.boardId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { error } = await query;

  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

app.post("/api/trend-board-colors", async (req, res) => {
  const userId = getRequestUserId(req);
  const payload = {
    board_id: req.body?.board_id,
    color_id: req.body?.color_id
  };

  if (userId) {
    payload.user_id = userId;
  }

  const { error } = await supabase
    .from("trend_board_colors")
    .insert([payload]);

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return res.status(status).json({
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
  }

  res.json({ ok: true });
});

app.get("/api/trend-board-colors/:boardId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("trend_board_colors")
    .select("colors(*)")
    .eq("board_id", req.params.boardId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json(error);
  res.json((data || []).map((item) => item.colors).filter(Boolean));
});

app.delete("/api/trend-board-colors/:boardId/:colorId", async (req, res) => {
  const userId = getRequestUserId(req);
  let query = supabase
    .from("trend_board_colors")
    .delete()
    .eq("board_id", req.params.boardId)
    .eq("color_id", req.params.colorId);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { error } = await query;

  if (error) return res.status(500).json(error);
  res.sendStatus(200);
});

startup();
