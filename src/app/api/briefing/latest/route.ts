import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("briefings")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(null);
  }

  return NextResponse.json(data);
}
