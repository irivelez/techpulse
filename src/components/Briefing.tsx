"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from "lucide-react";

interface BriefingData {
  id: string;
  date: string;
  title: string;
  executive_summary: string;
  key_developments: Array<{ title: string; detail: string; source: string }>;
  opportunities: Array<{ title: string; detail: string; urgency: string }>;
  threats: Array<{ title: string; detail: string }>;
  action_items: Array<{
    action: string;
    priority: string;
    timeframe: string;
  }>;
  source_count: number;
}

const urgencyColors: Record<string, string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-success",
};

const priorityBadge: Record<string, string> = {
  high: "bg-danger/20 text-danger",
  medium: "bg-warning/20 text-warning",
  low: "bg-success/20 text-success",
};

export default function Briefing() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/briefing/latest")
      .then((r) => r.json())
      .then((data) => {
        setBriefing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center text-muted">
        <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2" />
        Loading briefing...
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="text-center text-muted py-4">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No briefing available yet.</p>
          <p className="text-xs mt-1">Run the intelligence pipeline to generate your first briefing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border bg-accent/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-light" />
            <span className="text-xs font-mono text-muted">{briefing.date}</span>
          </div>
          <span className="text-xs text-muted">{briefing.source_count} sources analyzed</span>
        </div>
        <h2 className="text-lg font-bold">{briefing.title}</h2>
        <p className="text-sm text-muted-light mt-2 leading-relaxed">
          {briefing.executive_summary}
        </p>
      </div>

      {/* Key Developments */}
      {briefing.key_developments?.length > 0 && (
        <div className="p-5 border-b border-border-subtle">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Key Developments
          </h3>
          <div className="space-y-3">
            {briefing.key_developments.map((dev, i) => (
              <div key={i} className="flex gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-accent-light shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{dev.title}</p>
                  <p className="text-xs text-muted-light mt-0.5">{dev.detail}</p>
                  {dev.source && (
                    <span className="text-[10px] text-muted">via {dev.source}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {briefing.opportunities?.length > 0 && (
        <div className="p-5 border-b border-border-subtle">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-success" />
            Opportunities
          </h3>
          <div className="space-y-3">
            {briefing.opportunities.map((opp, i) => (
              <div key={i} className="flex gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${urgencyColors[opp.urgency] || "text-muted"}`} />
                <div>
                  <p className="text-sm font-medium">{opp.title}</p>
                  <p className="text-xs text-muted-light mt-0.5">{opp.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threats */}
      {briefing.threats?.length > 0 && (
        <div className="p-5 border-b border-border-subtle">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
            Threats & Risks
          </h3>
          <div className="space-y-3">
            {briefing.threats.map((threat, i) => (
              <div key={i} className="flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-danger/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{threat.title}</p>
                  <p className="text-xs text-muted-light mt-0.5">{threat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {briefing.action_items?.length > 0 && (
        <div className="p-5">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-light" />
            Action Items
          </h3>
          <div className="space-y-2">
            {briefing.action_items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityBadge[item.priority] || priorityBadge.medium}`}>
                  {item.priority}
                </span>
                <span className="flex-1">{item.action}</span>
                <span className="text-[10px] text-muted font-mono">{item.timeframe}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
