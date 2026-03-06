"use client";

import { useState } from "react";
import {
  Radar,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Terminal,
} from "lucide-react";
import StatsBar from "@/components/StatsBar";
import ArticleFeed from "@/components/ArticleFeed";
import Briefing from "@/components/Briefing";
import Chat from "@/components/Chat";
import CommandPanel from "@/components/CommandPanel";

type Tab = "feed" | "briefing" | "chat" | "pipeline";

const tabs: { key: Tab; label: string; icon: typeof Radar }[] = [
  { key: "feed", label: "Intelligence Feed", icon: LayoutDashboard },
  { key: "briefing", label: "Daily Briefing", icon: FileText },
  { key: "chat", label: "Ask Brain", icon: MessageSquare },
  { key: "pipeline", label: "Pipeline", icon: Terminal },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-accent">
                <Radar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">TechPulse</h1>
                <p className="text-[10px] text-muted font-mono">
                  Intelligence Second Brain
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
              <span className="text-xs text-muted">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border-subtle bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-accent/15 text-accent-light border border-accent/30"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatsBar />

        {activeTab === "feed" && <ArticleFeed />}

        {activeTab === "briefing" && <Briefing />}

        {activeTab === "chat" && <Chat />}

        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommandPanel />
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                Pipeline Architecture
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-xs font-mono text-accent-light">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Ingest</p>
                    <p className="text-xs text-muted">
                      RSS feeds from 23 sources, every 2 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-xs font-mono text-accent-light">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Synthesize</p>
                    <p className="text-xs text-muted">
                      Claude analyzes, scores, extracts insights
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-xs font-mono text-accent-light">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Brief</p>
                    <p className="text-xs text-muted">
                      Daily intelligence report, auto-generated
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border-subtle">
                  <div className="w-8 h-8 rounded bg-success/20 flex items-center justify-center text-xs font-mono text-success">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Query</p>
                    <p className="text-xs text-muted">
                      Chat with your intelligence corpus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
