import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function logSupabaseError(operation, error, details = {}) {
  console.error(`[Supabase] ${operation} failed`, {
    url: supabaseUrl,
    details,
    message: error?.message ?? null,
    code: error?.code ?? null,
    status: error?.status ?? null,
    hint: error?.hint ?? null,
    detailsText: error?.details ?? null,
    error
  });
}
