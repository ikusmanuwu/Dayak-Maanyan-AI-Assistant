import React from "react";
import { MessageSquare, BookOpen, Database, Code2, Bot, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "simulator" | "dictionary" | "memory" | "code";
  setActiveTab: (tab: "simulator" | "dictionary" | "memory" | "code") => void;
  learnedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, learnedCount }) => {
  return (
    <header className="border-b border-emerald-900/20 bg-stone-900 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-amber-200 shadow-lg border border-emerald-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-100 font-serif">
                  Dayak Ma'anyan AI Assistant
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini Flash + SQLite
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Aplikasi Telegram Bot Python (v20+ async) • Core KB • Recursive Auto-Learning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/60 p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "simulator"
                  ? "bg-emerald-700 text-white shadow-sm font-semibold"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Simulator Bot</span>
            </button>

            <button
              onClick={() => setActiveTab("dictionary")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "dictionary"
                  ? "bg-emerald-700 text-white shadow-sm font-semibold"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kamus Inti</span>
            </button>

            <button
              onClick={() => setActiveTab("memory")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "memory"
                  ? "bg-emerald-700 text-white shadow-sm font-semibold"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Memori SQLite</span>
              {learnedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-950 font-bold">
                  {learnedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "code"
                  ? "bg-emerald-700 text-white shadow-sm font-semibold"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Kode Python & Setup</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
