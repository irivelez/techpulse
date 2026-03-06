"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Article {
  id: string;
  title: string;
  url: string;
  source_name: string;
  source_type: string;
  summary: string;
  relevance_score: number;
  tags: string[];
  priority: string;
  published_at: string;
}

const priorityColors: Record<string, string> = {
  critical: "bg-danger/20 text-danger border-danger/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-accent/20 text-accent-light border-accent/30",
  low: "bg-muted/20 text-muted-light border-muted/30",
};

const typeIcons: Record<string, typeof TrendingUp> = {
  trusted_voice: Lightbulb,
  official: AlertTriangle,
  community: TrendingUp,
};

export default function ArticleFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ filter, search, limit: "50" });
    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, search]);

  const filters = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "high", label: "High Priority" },
    { key: "opportunities", label: "Top Signal" },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search intelligence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm
                     placeholder:text-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light/30"
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-muted-light hover:text-foreground hover:border-accent/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3" />
            Loading intelligence...
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Filter className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No articles yet. Run ingestion to start.</p>
            <p className="text-xs mt-1">Use the command panel to trigger a feed sync.</p>
          </div>
        ) : (
          articles.map((article) => {
            const Icon = typeIcons[article.source_type] || TrendingUp;
            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card border border-border-subtle rounded-xl p-4 hover:border-accent/40 hover:bg-card-hover group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted shrink-0" />
                      <span className="text-xs text-muted truncate">{article.source_name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColors[article.priority] || priorityColors.medium}`}>
                        {article.priority}
                      </span>
                      {article.relevance_score && (
                        <span className="text-[10px] font-mono text-accent-light">
                          {article.relevance_score}/100
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-accent-light line-clamp-2">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-xs text-muted-light mt-1.5 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent-light rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.published_at && (
                        <span className="text-[10px] text-muted ml-auto">
                          {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent-light shrink-0 mt-1" />
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
