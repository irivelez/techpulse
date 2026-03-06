import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateBriefing } from "@/lib/claude";

// Generate daily briefing from processed articles
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if briefing already exists
    const { data: existing } = await supabaseAdmin
      .from("briefings")
      .select("id")
      .eq("date", today)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: "Briefing already exists for today" });
    }

    // Get today's processed articles (last 24h)
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: articles } = await supabaseAdmin
      .from("articles")
      .select("title, summary, source_name, relevance_score, tags, published_at")
      .eq("processed", true)
      .gte("ingested_at", since)
      .gt("relevance_score", 20)
      .order("relevance_score", { ascending: false })
      .limit(30);

    if (!articles?.length) {
      return NextResponse.json({ success: true, message: "Not enough articles for briefing" });
    }

    // Get recent insights
    const { data: insights } = await supabaseAdmin
      .from("insights")
      .select("insight_type, title, content, impact_score")
      .gte("created_at", since)
      .order("impact_score", { ascending: false })
      .limit(20);

    const briefing = await generateBriefing(articles, insights || []);

    // Save briefing
    const { error } = await supabaseAdmin.from("briefings").insert({
      date: today,
      title: briefing.title,
      executive_summary: briefing.executive_summary,
      key_developments: briefing.key_developments,
      opportunities: briefing.opportunities,
      threats: briefing.threats,
      action_items: briefing.action_items,
      source_count: articles.length,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      briefing_date: today,
      source_count: articles.length,
    });
  } catch (error) {
    console.error("Briefing error:", error);
    return NextResponse.json(
      { error: "Briefing generation failed", detail: String(error) },
      { status: 500 }
    );
  }
}
