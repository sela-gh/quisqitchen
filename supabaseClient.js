import { createClient } from "@supabase/supabase-js";

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// If you're on Create React App instead, use process.env.REACT_APP_SUPABASE_URL
// (and REACT_APP_SUPABASE_ANON_KEY) and swap the two lines below accordingly.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // The app still works with local demo data when these are missing —
  // this just flags it clearly instead of failing silently.
  console.warn(
    "[Quis Qitchen] Supabase env vars are missing. Add VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_ANON_KEY to your .env file. Falling back to local demo data."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
