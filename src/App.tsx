/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TelegramSimulator } from "./components/TelegramSimulator";
import { KnowledgeBaseExplorer } from "./components/KnowledgeBaseExplorer";
import { DynamicMemoryInspector } from "./components/DynamicMemoryInspector";
import { CodeViewerAndGuide } from "./components/CodeViewerAndGuide";

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "dictionary" | "memory" | "code">("simulator");
  const [learnedCount, setLearnedCount] = useState<number>(0);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/vocab");
      const data = await res.json();
      if (data.learned) {
        setLearnedCount(data.learned.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learnedCount={learnedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "simulator" && (
          <TelegramSimulator
            onNewLearnedWord={fetchStats}
            learnedCount={learnedCount}
          />
        )}

        {activeTab === "dictionary" && (
          <KnowledgeBaseExplorer />
        )}

        {activeTab === "memory" && (
          <DynamicMemoryInspector
            onRefresh={fetchStats}
          />
        )}

        {activeTab === "code" && (
          <CodeViewerAndGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-serif italic text-stone-400">
            "Adil Ka' Talino, Bacuramin Ka' Saruga, Basengat Ka' Jubata"
          </p>
          <p>
            Asisten & Model Bahasa Dayak Ma'anyan (Kalimantan Tengah / Barito Timur) • Ditenagai oleh Google Gemini & Python Telegram Bot
          </p>
        </div>
      </footer>
    </div>
  );
}
