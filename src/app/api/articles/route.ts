import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = supabaseAdmin
    .from("articles")
    .select("id, title, url, source_name, source_type, summary, relevance_score, tags, priority, signal_weight, published_at, ingested_at")
    .eq("processed", true)
    .gt("relevance_score", 10)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (filter === "critical") {
    query = query.in("priority", ["critical"]);
  } else if (filter === "high") {
    query = query.in("priority", ["critical", "high"]);
  } else if (filter === "opportunities") {
    query = query.gte("relevance_score", 70);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
