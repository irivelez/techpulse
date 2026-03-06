import RSSParser from "rss-parser";
import { Source } from "./sources";

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    "User-Agent": "TechPulse/1.0 (Intelligence Aggregator)",
  },
});

export interface FeedItem {
  sourceKey: string;
  sourceName: string;
  sourceType: string;
  signalWeight: number;
  priority: string;
  title: string;
  url: string;
  content: string;
  publishedAt: string | null;
}

export async function fetchFeed(source: Source): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return (feed.items || []).slice(0, 10).map((item) => ({
      sourceKey: source.key,
      sourceName: source.name,
      sourceType: source.type,
      signalWeight: source.signalWeight,
      priority: source.priority,
      title: item.title || "Untitled",
      url: item.link || item.guid || "",
      content: item.contentSnippet || item["content:encoded"] || item.content || item.summary || "",
      publishedAt: item.isoDate || item.pubDate || null,
    }));
  } catch (error) {
    console.error(`Failed to fetch ${source.name}: ${error}`);
    return [];
  }
}

export async function fetchAllFeeds(sources: Source[]): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    sources.map((source) => fetchFeed(source))
  );

  const items: FeedItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  return items;
}
