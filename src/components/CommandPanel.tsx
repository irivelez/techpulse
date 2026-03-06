"use client";

import { useState } from "react";
import { Play, RefreshCw, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function CommandPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; data: string }>>({});

  const runCommand = async (action: string) => {
    setLoading(action);
    setResults((prev) => ({ ...prev, [action]: { success: true, data: "Running..." } }));

    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      setResults((prev) => ({
        ...prev,
        [action]: { success: res.ok, data: JSON.stringify(data, null, 2) },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [action]: { success: false, data: `Error: ${error}` },
      }));
    } finally {
      setLoading(null);
    }
  };

  const runFullPipeline = async () => {
    await runCommand("ingest");
    await runCommand("synthesize");
    await runCommand("briefing");
  };

  const commands = [
    {
      key: "ingest",
      label: "Ingest Feeds",
      description: "Fetch RSS from all 23 sources",
      icon: RefreshCw,
    },
    {
      key: "synthesize",
      label: "Synthesize",
      description: "AI-analyze unprocessed articles (15 per batch)",
      icon: Play,
    },
    {
      key: "briefing",
      label: "Generate Briefing",
      description: "Create daily intelligence report",
      icon: FileText,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
        Pipeline Controls
      </h3>

      {/* Full pipeline button */}
      <button
        onClick={runFullPipeline}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-light
                 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        Run Full Pipeline
      </button>

      {/* Individual commands */}
      <div className="space-y-2">
        {commands.map((cmd) => (
          <div key={cmd.key}>
            <button
              onClick={() => runCommand(cmd.key)}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-background border border-border-subtle
                       rounded-lg hover:border-accent/40 hover:bg-card-hover disabled:opacity-50
                       text-left transition-colors group"
            >
              {loading === cmd.key ? (
                <Loader2 className="w-4 h-4 text-accent-light animate-spin" />
              ) : (
                <cmd.icon className="w-4 h-4 text-muted group-hover:text-accent-light" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{cmd.label}</p>
                <p className="text-xs text-muted">{cmd.description}</p>
              </div>
              {results[cmd.key] && !loading && (
                results[cmd.key].success ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-danger shrink-0" />
                )
              )}
            </button>
            {results[cmd.key] && results[cmd.key].data !== "Running..." && (
              <pre className="mt-1 p-2 bg-background rounded text-[10px] text-muted-light font-mono overflow-x-auto max-h-32">
                {results[cmd.key].data}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
