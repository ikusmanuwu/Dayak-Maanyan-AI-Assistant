import React, { useState } from "react";
import { Search, Flame, BookOpen, Volume2, Sparkles, Filter } from "lucide-react";
import { INITIAL_CORE_VOCAB, GRAMMAR_EXPLANATIONS } from "../data/initialData";
import { VocabItem } from "../types";

export const KnowledgeBaseExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    "Kosakata Dasar",
    "Tunjuk & Objek",
    "Aktivitas & Waktu",
    "Tingkat Kelaparan",
    "Kata Hubung & Partikel",
    "Kata Ganti",
    "Frasa Tanya"
  ];

  const filteredVocab = INITIAL_CORE_VOCAB.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 border border-emerald-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge Base Inti (Core KB)
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-serif">
            Kamus & Tata Bahasa Dayak Ma'anyan
          </h2>
          <p className="mt-2 text-sm text-stone-300 leading-relaxed">
            Kumpulan kosakata baku, dialek khas Barito Timur, dan aturan tata bahasa yang sudah dilatihkan ke dalam sistem instruksi AI. Setiap kata di bawah ini dipahami secara mendalam oleh bot.
          </p>
        </div>

        {/* Sorotan Khusus: Tingkat Kelaparan */}
        <div className="mt-6 pt-6 border-t border-emerald-900/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4" />
            Konsep Unik Ma'anyan: Hierarki 3 Tingkat Kelaparan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-400 text-sm">1. Layah</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Tingkat 1</span>
              </div>
              <p className="text-xs text-stone-200 font-medium">Lapar Biasa</p>
              <p className="text-[11px] text-stone-400 mt-1">Rasa lapar wajar saat tiba jam makan siang atau sore.</p>
              <span className="inline-block mt-2 text-[10px] text-stone-400 italic">"Aku layah, hayu nguta"</span>
            </div>

            <div className="bg-stone-900/80 border border-amber-900/40 p-3.5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400 text-sm">2. Kalauan</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">Tingkat 2</span>
              </div>
              <p className="text-xs text-stone-200 font-medium">Sangat Lapar</p>
              <p className="text-[11px] text-stone-400 mt-1">Lapar berat karena telat makan beberapa jam setelah bekerja di ladang.</p>
              <span className="inline-block mt-2 text-[10px] text-stone-400 italic">"Kalauan tatu'u daya bagawi ka ume"</span>
            </div>

            <div className="bg-stone-900/80 border border-rose-900/40 p-3.5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-rose-400 text-sm">3. Hinut</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono">Tingkat 3 (Ekstrem)</span>
              </div>
              <p className="text-xs text-stone-200 font-medium">Lapar Lemas Mau Pingsan</p>
              <p className="text-[11px] text-stone-400 mt-1">Kondisi lemas tidak berdaya, pandangan kabur karena tidak ada makanan seharian.</p>
              <span className="inline-block mt-2 text-[10px] text-stone-400 italic">"Hinut aku daya puang kuman sangari"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata (contoh: kuman, ranu, lapar, sungai)..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white font-semibold shadow"
                  : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item, idx) => (
          <div
            key={idx}
            className="bg-stone-900 border border-stone-800 hover:border-emerald-700/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {item.term}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {item.category}
                </span>
              </div>

              <div className="text-sm font-semibold text-stone-100 mb-1">
                = {item.meaning}
              </div>

              {item.notes && (
                <p className="text-xs text-stone-400 mb-2 leading-relaxed">
                  {item.notes}
                </p>
              )}
            </div>

            {item.example && (
              <div className="mt-3 pt-2.5 border-t border-stone-800/80 text-xs text-stone-400 bg-stone-950/40 p-2 rounded-lg">
                <span className="text-[10px] text-amber-400/90 font-semibold block mb-0.5">
                  Contoh Penggunaan:
                </span>
                <span className="italic text-stone-300">"{item.example}"</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVocab.length === 0 && (
        <div className="text-center py-12 bg-stone-900 border border-stone-800 rounded-2xl">
          <p className="text-sm text-stone-400">Tidak ada kosakata yang cocok dengan pencarian "{searchQuery}".</p>
        </div>
      )}

      {/* Pedoman Tata Bahasa Tambahan */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-bold text-stone-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Pedoman Tata Bahasa Inti Dayak Ma'anyan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRAMMAR_EXPLANATIONS.map((rule, idx) => (
            <div key={idx} className="bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <h4 className="text-sm font-semibold text-amber-300 mb-1">{rule.title}</h4>
              <p className="text-xs text-stone-400 mb-2">{rule.desc}</p>
              <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                {rule.points.map((pt, pIdx) => (
                  <li key={pIdx} className="leading-relaxed">{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
