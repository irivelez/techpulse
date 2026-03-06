import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { synthesizeArticle } from "@/lib/claude";

// Cron job: process unprocessed articles with Claude
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get unprocessed articles, prioritize by signal weight
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("processed", false)
      .order("signal_weight", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(15); // Process 15 at a time to manage API costs

    if (error) throw error;
    if (!articles?.length) {
      return NextResponse.json({ success: true, processed: 0, message: "No articles to process" });
    }

    let processed = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        const analysis = await synthesizeArticle({
          title: article.title,
          content: article.content || "",
          source_name: article.source_name,
          source_type: article.source_type,
          signal_weight: article.signal_weight,
        });

        // Update article with AI analysis
        await supabaseAdmin
          .from("articles")
          .update({
            summary: analysis.summary,
            relevance_score: analysis.relevance_score,
            tags: analysis.tags,
            processed: true,
          })
          .eq("id", article.id);

        // Insert extracted insights
        if (analysis.insights?.length) {
          const insightRows = analysis.insights.map(
            (insight: {
              type: string;
              title: string;
              content: string;
              impact_score: number;
              actionability: string;
            }) => ({
              article_id: article.id,
              insight_type: insight.type,
              title: insight.title,
              content: insight.content,
              impact_score: insight.impact_score,
              actionability: insight.actionability,
              categories: analysis.tags,
            })
          );

          await supabaseAdmin.from("insights").insert(insightRows);
        }

        processed++;
      } catch (err) {
        console.error(`Failed to process article ${article.id}:`, err);
        // Mark as processed to avoid infinite retry loops
        await supabaseAdmin
          .from("articles")
          .update({ processed: true, relevance_score: 0 })
          .eq("id", article.id);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Synthesis error:", error);
    return NextResponse.json(
      { error: "Synthesis failed", detail: String(error) },
      { status: 500 }
    );
  }
}
