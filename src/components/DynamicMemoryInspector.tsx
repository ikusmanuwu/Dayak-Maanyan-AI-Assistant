import React, { useState, useEffect } from "react";
import { Database, Plus, Trash2, Sparkles, RefreshCw, CheckCircle, ShieldAlert } from "lucide-react";
import { LearnedVocabItem } from "../types";

interface DynamicMemoryInspectorProps {
  onRefresh: () => void;
}

export const DynamicMemoryInspector: React.FC<DynamicMemoryInspectorProps> = ({ onRefresh }) => {
  const [learnedItems, setLearnedItems] = useState<LearnedVocabItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form input untuk mengajarkan kata baru manual
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [category, setCategory] = useState("Umum");
  const [example, setExample] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vocab");
      const data = await res.json();
      setLearnedItems(data.learned || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocab();
  }, []);

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !meaning.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: term.trim(),
          meaning: meaning.trim(),
          category: category.trim(),
          example: example.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessToast(`Kosakata "${term}" berhasil dicatat ke memori database!`);
        setTerm("");
        setMeaning("");
        setExample("");
        fetchVocab();
        onRefresh();
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetMemory = async () => {
    if (!window.confirm("Apakah Anda yakin ingin mengosongkan riwayat kosakata hasil pembelajaran?")) return;
    try {
      await fetch("/api/reset-learned", { method: "POST" });
      fetchVocab();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 mb-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Dynamic Auto-Learning Memory Inspector
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-serif">
              Inspektor Database SQLite (Memori Rekursif)
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Memantau kumpulan kosakata dan aturan tata bahasa baru yang berhasil diekstrak oleh Gemini dari pesan obrolan pengguna Telegram dan disimpan ke SQLite.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchVocab}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors border border-stone-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Segarkan Data
            </button>
            <button
              onClick={handleResetMemory}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-xs font-medium text-rose-300 transition-colors border border-rose-800/50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Memori
            </button>
          </div>
        </div>

        {/* Dynamic Injection Notice */}
        <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Bagaimana ini bekerja di Telegram Bot?</strong> Setiap kali pengguna Telegram membalas atau mengajarkan kata baru, fungsi <code>detect_and_learn_from_message()</code> menyimpan pasangan kata ke tabel SQLite <code>learned_vocab</code>. Pada setiap giliran respon berikutnya, fungsi <code>build_dynamic_system_instruction()</code> secara otomatis mengambil isi tabel ini dan memasukkannya ke instruksi model Gemini!
          </p>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-950 border border-emerald-700 px-4 py-3 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Grid: Form Tambah Manual + Tabel Database */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Tambah Kosakata Manual */}
        <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Ajarkan Kata Baru Secara Manual
          </h3>
          <p className="text-xs text-stone-400">
            Gunakan form ini untuk menyimulasikan penambahan kosakata langsung ke memori database.
          </p>

          <form onSubmit={handleAddManual} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase mb-1">
                Kata Dayak Ma'anyan *
              </label>
              <input
                type="text"
                required
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="misal: wusah, manuk, lewu..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase mb-1">
                Arti Bahasa Indonesia *
              </label>
              <input
                type="text"
                required
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="misal: hujan, ayam..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Umum">Umum</option>
                <option value="Alam & Cuaca">Alam & Cuaca</option>
                <option value="Hewan / Fauna">Hewan / Fauna</option>
                <option value="Tumbuhan / Flora">Tumbuhan / Flora</option>
                <option value="Aktivitas">Aktivitas</option>
                <option value="Makanan">Makanan</option>
                <option value="Sifat & Keadaan">Sifat & Keadaan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 uppercase mb-1">
                Contoh Kalimat (Opsional)
              </label>
              <textarea
                rows={2}
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Contoh kalimat Ma'anyan dan artinya..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {submitting ? "Menyimpan..." : "Simpan ke Database"}
            </button>
          </form>
        </div>

        {/* Tabel Kosakata Hasil Auto-Learning */}
        <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Daftar Kosakata yang Telah Dipelajari ({learnedItems.length})
              </h3>
              <span className="text-[11px] text-stone-400 font-mono">
                Tabel: `learned_vocab` (SQLite)
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-stone-400">
                Memuat data memori...
              </div>
            ) : learnedItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl p-6">
                <Database className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm text-stone-300 font-medium">Belum Ada Kata Baru yang Dipelajari</p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Coba buka tab <strong>Simulator Bot</strong> dan ketik: <em>"Kata wusah artinya hujan di Ma'anyan"</em> atau tambahkan via formulir di samping.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-3.5 py-2.5">Kosakata Ma'anyan</th>
                      <th className="px-3.5 py-2.5">Arti Indonesia</th>
                      <th className="px-3.5 py-2.5">Kategori</th>
                      <th className="px-3.5 py-2.5">Contoh Kalimat</th>
                      <th className="px-3.5 py-2.5">Kontributor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {learnedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="px-3.5 py-3 font-bold text-emerald-400 font-mono">
                          {item.term_maanyan}
                        </td>
                        <td className="px-3.5 py-3 text-stone-200">
                          {item.meaning_indonesian}
                        </td>
                        <td className="px-3.5 py-3 text-stone-400">
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] border border-stone-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-stone-400 italic">
                          {item.example_sentence || "-"}
                        </td>
                        <td className="px-3.5 py-3 text-stone-500 text-[10px]">
                          {item.contributor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
