import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side proxy for pipeline commands — no secret needed from browser
export async function POST(request: Request) {
  const { action } = await request.json();
  const secret = process.env.CRON_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(request.url).origin
      : "http://localhost:3000";

  const endpoints: Record<string, string> = {
    ingest: "/api/ingest",
    synthesize: "/api/synthesize",
    briefing: "/api/briefing",
  };

  const endpoint = endpoints[action];
  if (!endpoint) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const url = new URL(endpoint, request.url).toString();
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Pipeline failed", detail: String(error) },
      { status: 500 }
    );
  }
}
