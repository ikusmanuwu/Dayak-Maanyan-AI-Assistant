import React, { useState, useEffect } from "react";
import { Code2, Copy, Check, Download, ExternalLink, Terminal, ShieldCheck, Zap, BookCheck } from "lucide-react";
import { PythonFileDoc } from "../types";

export const CodeViewerAndGuide: React.FC = () => {
  const [files, setFiles] = useState<PythonFileDoc[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/python-files")
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const currentFile = files[activeFileIndex] || {
    filename: "bot.py",
    title: "Aplikasi Telegram Bot Utama",
    content: "# Loading..."
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCurrent = () => {
    const blob = new Blob([currentFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 mb-2">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Production-Ready Python Telegram Bot Source Code
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-serif">
              Kode Sumber & Panduan Menjalankan Bot
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Seluruh file Python yang siap dijalankan langsung di komputer lokal Anda atau di server cloud gratis 24/7. Menggunakan <code>python-telegram-bot</code> (v20+), <code>google-genai</code> SDK, dan <code>sqlite3</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow"
            >
              {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
              {copied ? "Tersalin ke Clipboard!" : "Salin File Ini"}
            </button>
            <button
              onClick={handleDownloadCurrent}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-all border border-stone-700 shadow"
            >
              <Download className="w-4 h-4" />
              Unduh File
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Guide Checklist (100% GRATIS) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-stone-800 pb-4">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Langkah Demi Langkah Menjalankan Bot (100% GRATIS)
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Ikuti 5 langkah mudah berikut untuk menjalankan bot di laptop atau VPS Anda:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">LANGKAH 1</span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">1 Menit</span>
              </div>
              <h4 className="text-sm font-semibold text-stone-200 mb-1">Dapatkan Token Bot Telegram</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Buka Telegram, cari <strong>@BotFather</strong>, ketik <code>/start</code> lalu <code>/newbot</code>. Ikuti petunjuk untuk membuat nama bot dan dapatkan HTTP API Token.
              </p>
            </div>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Buka @BotFather di Telegram <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">LANGKAH 2</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Gratis</span>
              </div>
              <h4 className="text-sm font-semibold text-stone-200 mb-1">Dapatkan Gemini API Key</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Buka <strong>Google AI Studio</strong>, masuk dengan akun Google Anda, klik <strong>"Get API key"</strong> lalu <strong>"Create API key"</strong>. Simpan key yang berawalan <code>AIzaSy...</code>.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Buka Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-400">LANGKAH 3</span>
                <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">Terminal</span>
              </div>
              <h4 className="text-sm font-semibold text-stone-200 mb-1">Instal & Jalankan</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Buat file <code>.env</code> dari <code>.env.example</code>, masukkan kedua token di atas, lalu jalankan:
              </p>
              <div className="mt-2 bg-black/60 rounded p-2 font-mono text-[11px] text-emerald-300 border border-stone-800">
                pip install -r requirements.txt<br/>
                python bot.py
              </div>
            </div>
            <span className="mt-3 text-[11px] text-stone-400">
              Bot langsung online dan siap menerima obrolan!
            </span>
          </div>
        </div>
      </div>

      {/* Code Viewer Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        {/* File Tabs */}
        <div className="bg-stone-950 px-4 pt-3 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3.5 py-2 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 ${
                activeFileIndex === idx
                  ? "bg-stone-900 text-emerald-400 border-t-2 border-emerald-500 font-bold"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/60"
              }`}
            >
              <span>{file.filename}</span>
            </button>
          ))}
        </div>

        {/* File Meta Header */}
        <div className="bg-stone-900/90 px-5 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-200 font-mono">
              {currentFile.filename}
            </span>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-400">{currentFile.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-stone-400 hover:text-emerald-400 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-stone-950 border border-stone-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Disalin!" : "Salin"}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-stone-950 overflow-x-auto max-h-[600px] text-xs font-mono leading-relaxed text-stone-200">
          {loading ? (
            <div className="text-center py-12 text-stone-500">Memuat berkas kode...</div>
          ) : (
            <pre className="whitespace-pre">
              <code>{currentFile.content}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
