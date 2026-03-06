import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const [articles, insights, briefings, unprocessed] = await Promise.all([
    supabaseAdmin.from("articles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("insights").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("briefings").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("processed", false),
  ]);

  // Top sources by article count
  const { data: topSources } = await supabaseAdmin
    .from("articles")
    .select("source_name")
    .eq("processed", true)
    .limit(500);

  const sourceCounts: Record<string, number> = {};
  topSources?.forEach((a) => {
    sourceCounts[a.source_name] = (sourceCounts[a.source_name] || 0) + 1;
  });

  // Top insight types
  const { data: insightTypes } = await supabaseAdmin
    .from("insights")
    .select("insight_type")
    .limit(500);

  const typeCounts: Record<string, number> = {};
  insightTypes?.forEach((i) => {
    typeCounts[i.insight_type] = (typeCounts[i.insight_type] || 0) + 1;
  });

  return NextResponse.json({
    total_articles: articles.count || 0,
    total_insights: insights.count || 0,
    total_briefings: briefings.count || 0,
    unprocessed: unprocessed.count || 0,
    top_sources: Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    insight_types: typeCounts,
  });
}
