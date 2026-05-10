import { supabase } from "./supabaseClient";

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

export async function ensureProfile(user) {
  if (!user?.id) {
    return null;
  }

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
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
    .select("id")
    .single();

  if (insertError) {
    console.error("Ensure profile insert error:", insertError);
    return null;
  }

  return insertedProfile;
}
