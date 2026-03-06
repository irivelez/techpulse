"use client";

import { useEffect, useState } from "react";
import { Activity, Brain, FileText, Zap } from "lucide-react";

interface Stats {
  total_articles: number;
  total_insights: number;
  total_briefings: number;
  unprocessed: number;
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const items = [
    { icon: FileText, label: "Articles", value: stats?.total_articles || 0, color: "text-accent-light" },
    { icon: Brain, label: "Insights", value: stats?.total_insights || 0, color: "text-success" },
    { icon: Zap, label: "Briefings", value: stats?.total_briefings || 0, color: "text-warning" },
    { icon: Activity, label: "Pending", value: stats?.unprocessed || 0, color: "text-muted-light" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
        >
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <div>
            <p className="text-2xl font-bold font-mono">{item.value}</p>
            <p className="text-xs text-muted">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
