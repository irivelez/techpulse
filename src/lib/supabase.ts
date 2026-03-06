import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function createSafeClient(url: string, key: string): SupabaseClient {
  if (!url || !key) {
    // Return a proxy that throws helpful errors at runtime, not build time
    return new Proxy({} as SupabaseClient, {
      get() {
        throw new Error("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and keys in env.");
      },
    });
  }
  return createClient(url, key);
}

// Client for browser (respects RLS)
export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey);

// Server client for API routes (bypasses RLS)
export const supabaseAdmin = createSafeClient(supabaseUrl, supabaseServiceKey);
