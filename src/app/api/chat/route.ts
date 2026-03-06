import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { chatWithBrain } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Get recent articles for context
    const { data: articles } = await supabaseAdmin
      .from("articles")
      .select("title, summary, source_name, tags")
      .eq("processed", true)
      .gt("relevance_score", 30)
      .order("relevance_score", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(25);

    // Get chat history
    const { data: history } = await supabaseAdmin
      .from("chat_messages")
      .select("role, content")
      .order("created_at", { ascending: false })
      .limit(10);

    const chatHistory = (history || []).reverse();

    // Save user message
    await supabaseAdmin.from("chat_messages").insert({
      role: "user",
      content: message,
    });

    // Get AI response
    const response = await chatWithBrain(
      message,
      articles || [],
      chatHistory
    );

    // Save assistant response
    await supabaseAdmin.from("chat_messages").insert({
      role: "assistant",
      content: response,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat failed", detail: String(error) },
      { status: 500 }
    );
  }
}
