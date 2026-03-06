"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || data.error || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "What are the biggest AI trends this week?",
    "What opportunities should I act on today?",
    "Summarize what Karpathy has been saying lately",
    "What are the risks I should be watching?",
  ];

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle flex items-center gap-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
        <span className="text-sm font-medium">TechPulse Intelligence</span>
        <span className="text-xs text-muted ml-auto">Ask your second brain</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-8 h-8 text-accent-light mb-3 opacity-60" />
            <p className="text-sm text-muted mb-4">
              Ask anything about your intelligence feed.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-left px-3 py-2 bg-background border border-border-subtle rounded-lg
                           text-muted-light hover:text-foreground hover:border-accent/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fade-in-up ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-accent-light" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-background border border-border-subtle text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-accent/40 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-accent-light" />
            </div>
            <div className="bg-background border border-border-subtle rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your intelligence brain..."
            rows={1}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm resize-none
                     placeholder:text-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light/30"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:hover:bg-accent
                     text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
