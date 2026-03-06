export interface Source {
  key: string;
  name: string;
  type: "trusted_voice" | "official" | "community";
  feedUrl: string;
  priority: string;
  signalWeight: number;
}

// Flattened sources from trusted-sources.json for easy iteration
export const SOURCES: Source[] = [
  // Critical priority trusted voices
  { key: "karpathy_blog", name: "Andrej Karpathy (Blog)", type: "trusted_voice", feedUrl: "https://karpathy.bearblog.dev/feed/?type=rss", priority: "critical", signalWeight: 1.5 },
  { key: "karpathy_substack", name: "Andrej Karpathy (Substack)", type: "trusted_voice", feedUrl: "https://karpathy.substack.com/feed", priority: "critical", signalWeight: 1.5 },
  { key: "karpathy_youtube", name: "Andrej Karpathy (YouTube)", type: "trusted_voice", feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UCWN3xxRkmTPmbKwht9FuE5A", priority: "critical", signalWeight: 1.5 },
  { key: "bcherny_medium", name: "Boris Cherny (Claude Code)", type: "trusted_voice", feedUrl: "https://medium.com/feed/@bcherny", priority: "critical", signalWeight: 1.5 },

  // High priority trusted voices
  { key: "gregisenberg_substack", name: "Greg Isenberg", type: "trusted_voice", feedUrl: "https://latecheckout.substack.com/feed", priority: "high", signalWeight: 1.3 },
  { key: "gregisenberg_podcast", name: "Greg Isenberg (Podcast)", type: "trusted_voice", feedUrl: "https://feeds.megaphone.fm/startup-ideas-podcast", priority: "high", signalWeight: 1.3 },
  { key: "joaomdmoura_crewai", name: "Joao Moura (CrewAI)", type: "trusted_voice", feedUrl: "https://blog.crewai.com/rss/", priority: "high", signalWeight: 1.4 },
  { key: "alliekmiller", name: "Allie K. Miller", type: "trusted_voice", feedUrl: "https://aiwithallie.beehiiv.com/rss", priority: "high", signalWeight: 1.2 },
  { key: "swyx_latentspace", name: "swyx (Latent Space)", type: "trusted_voice", feedUrl: "https://www.latent.space/feed", priority: "high", signalWeight: 1.3 },
  { key: "simonw", name: "Simon Willison", type: "trusted_voice", feedUrl: "https://simonwillison.net/atom/everything/", priority: "high", signalWeight: 1.2 },
  { key: "garymarcus", name: "Gary Marcus", type: "trusted_voice", feedUrl: "https://garymarcus.substack.com/feed", priority: "high", signalWeight: 1.2 },
  { key: "dwarkesh", name: "Dwarkesh Patel", type: "trusted_voice", feedUrl: "https://www.dwarkeshpatel.com/feed", priority: "high", signalWeight: 1.3 },
  { key: "paulgraham", name: "Paul Graham", type: "trusted_voice", feedUrl: "http://www.aaronsw.com/2002/feeds/pgessays.rss", priority: "high", signalWeight: 1.3 },
  { key: "minimaxir", name: "Max Woolf", type: "trusted_voice", feedUrl: "https://minimaxir.com/index.xml", priority: "high", signalWeight: 1.2 },
  { key: "shubhamsaboo", name: "Shubham Saboo (Unwind AI)", type: "trusted_voice", feedUrl: "https://unwindai.substack.com/feed", priority: "high", signalWeight: 1.3 },

  // Medium priority
  { key: "steveblank", name: "Steve Blank", type: "trusted_voice", feedUrl: "https://steveblank.com/feed/", priority: "medium", signalWeight: 1.1 },
  { key: "gwern", name: "Gwern Branwen", type: "trusted_voice", feedUrl: "https://gwern.substack.com/feed", priority: "medium", signalWeight: 1.2 },
  { key: "natemeyvis", name: "Nate Meyvis", type: "trusted_voice", feedUrl: "https://www.natemeyvis.com/feed/", priority: "medium", signalWeight: 1.1 },

  // Official sources
  { key: "anthropic_news", name: "Anthropic (News)", type: "official", feedUrl: "https://www.anthropic.com/news/rss", priority: "critical", signalWeight: 2.0 },
  { key: "anthropic_research", name: "Anthropic (Research)", type: "official", feedUrl: "https://www.anthropic.com/research/rss", priority: "critical", signalWeight: 2.0 },
  { key: "openai_blog", name: "OpenAI", type: "official", feedUrl: "https://openai.com/blog/rss.xml", priority: "high", signalWeight: 1.5 },
  { key: "langchain_blog", name: "LangChain", type: "official", feedUrl: "https://blog.langchain.dev/rss/", priority: "high", signalWeight: 1.3 },

  // Community
  { key: "hackernoon_ai", name: "HackerNoon AI", type: "community", feedUrl: "https://hackernoon.com/tagged/artificial-intelligence/feed", priority: "medium", signalWeight: 1.0 },
];
