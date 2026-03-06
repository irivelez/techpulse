import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { SOURCES } from "@/lib/sources";
import { fetchAllFeeds } from "@/lib/rss";

// Cron job: ingest RSS feeds from all sources
// Called by Vercel Cron every 2 hours
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await fetchAllFeeds(SOURCES);
    let inserted = 0;
    let skipped = 0;

    for (const item of items) {
      if (!item.url) {
        skipped++;
        continue;
      }

      const { error } = await supabaseAdmin.from("articles").upsert(
        {
          source_key: item.sourceKey,
          source_name: item.sourceName,
          source_type: item.sourceType,
          title: item.title,
          url: item.url,
          content: item.content?.slice(0, 10000),
          published_at: item.publishedAt,
          signal_weight: item.signalWeight,
          priority: item.priority,
          processed: false,
        },
        { onConflict: "url", ignoreDuplicates: true }
      );

      if (error) {
        skipped++;
      } else {
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      fetched: items.length,
      inserted,
      skipped,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Ingestion failed", detail: String(error) },
      { status: 500 }
    );
  }
}

// Allow manual trigger from dashboard
export async function POST(request: Request) {
  const { secret } = await request.json();
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reuse GET logic
  const fakeRequest = new Request(request.url, {
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  return GET(fakeRequest);
}
