import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function synthesizeArticle(article: {
  title: string;
  content: string;
  source_name: string;
  source_type: string;
  signal_weight: number;
}) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are an elite intelligence analyst for an AI-driven business founder. Analyze this article and extract structured intelligence.

SOURCE: ${article.source_name} (${article.source_type}, weight: ${article.signal_weight})
TITLE: ${article.title}
CONTENT: ${article.content?.slice(0, 4000) || "No content available"}

Respond in JSON format:
{
  "relevance_score": <0-100, how relevant to agentic AI, AI business, and startup scaling>,
  "summary": "<2-3 sentence summary focusing on what matters for an AI startup founder>",
  "tags": ["<relevant tags>"],
  "insights": [
    {
      "type": "<trend|opportunity|tool|technique|warning|prediction>",
      "title": "<concise insight title>",
      "content": "<actionable insight, 1-2 sentences>",
      "impact_score": <1-10>,
      "actionability": "<immediate|short_term|long_term|watch>"
    }
  ]
}

Only include insights that are genuinely actionable or important. Quality over quantity.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse Claude response");
  return JSON.parse(jsonMatch[0]);
}

export async function generateBriefing(
  articles: Array<{
    title: string;
    summary: string;
    source_name: string;
    relevance_score: number;
    tags: string[];
    published_at: string;
  }>,
  insights: Array<{
    insight_type: string;
    title: string;
    content: string;
    impact_score: number;
  }>
) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are a Chief Intelligence Officer preparing a daily briefing for a LATAM AI startup founder who is building an AI-driven business platform. She needs to stay ahead of everyone in agentic AI, AI business models, and startup scaling.

TODAY'S INTELLIGENCE (${articles.length} articles):
${articles
  .map(
    (a) =>
      `- [${a.relevance_score}/100] ${a.title} (${a.source_name}) - ${a.summary}`
  )
  .join("\n")}

KEY INSIGHTS EXTRACTED:
${insights.map((i) => `- [${i.insight_type}] ${i.title}: ${i.content} (Impact: ${i.impact_score}/10)`).join("\n")}

Generate a daily intelligence briefing in JSON:
{
  "title": "<compelling briefing title for today>",
  "executive_summary": "<3-4 sentences: what happened today that matters, written directly to the founder>",
  "key_developments": [
    {"title": "<development>", "detail": "<why it matters>", "source": "<source name>"}
  ],
  "opportunities": [
    {"title": "<opportunity>", "detail": "<how to capitalize>", "urgency": "<high|medium|low>"}
  ],
  "threats": [
    {"title": "<threat or risk>", "detail": "<what to watch for>"}
  ],
  "action_items": [
    {"action": "<specific action to take>", "priority": "<high|medium|low>", "timeframe": "<today|this_week|this_month>"}
  ]
}

Be direct, specific, and actionable. No fluff. Write like you're briefing a CEO who has 5 minutes.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse briefing response");
  return JSON.parse(jsonMatch[0]);
}

export async function chatWithBrain(
  userMessage: string,
  context: Array<{
    title: string;
    summary: string;
    source_name: string;
    tags: string[];
  }>,
  chatHistory: Array<{ role: string; content: string }>
) {
  const messages = [
    ...chatHistory.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `You are TechPulse, an elite AI intelligence analyst embedded in a founder's second brain. You have access to curated intelligence from top AI voices and sources.

Your knowledge base includes recent articles and insights from: Andrej Karpathy, Greg Isenberg, Simon Willison, swyx, Anthropic, OpenAI, LangChain, and other top AI sources.

RECENT INTELLIGENCE CONTEXT:
${context
  .slice(0, 20)
  .map((a) => `- ${a.title} (${a.source_name}): ${a.summary}`)
  .join("\n")}

Rules:
- Be direct and concise. No fluff.
- Reference specific sources when possible.
- Focus on actionable intelligence for an AI startup founder.
- If asked about something not in your context, say so honestly.
- Think like a strategic advisor, not a search engine.`,
    messages,
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
