import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw, Bot, User, CheckCircle2, Award, Zap, HelpCircle, ArrowRight } from "lucide-react";
import { ChatMessage } from "../types";

interface TelegramSimulatorProps {
  onNewLearnedWord: () => void;
  learnedCount: number;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ onNewLearnedWord, learnedCount }) => {
  const [telegramStatus, setTelegramStatus] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "bot",
      text: "Tabe! Salam hangat. Aku bot asisten kecerdasan buatan Bahasa Dayak Ma'anyan.\n\nAku menguasai tata bahasa dan kosakata otentik Dayak Ma'anyan (Kalimantan Tengah / Barito Timur). Kamu bisa mengobrol santai denganku, menguji pemahaman dengan latihan, atau bahkan mengajarkanku kosakata baru secara langsung di obrolan!",
      timestamp: "09:00",
      mode: "chat"
    }
  ]);

  useEffect(() => {
    const checkTgStatus = async () => {
      try {
        const res = await fetch("/api/telegram-status");
        const data = await res.json();
        setTelegramStatus(data);
      } catch (e) {
        // ignore
      }
    };
    checkTgStatus();
    const interval = setInterval(checkTgStatus, 6000);
    return () => clearInterval(interval);
  }, []);

  const [inputText, setInputText] = useState("");
  const [currentMode, setCurrentMode] = useState<"chat" | "latihan">("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [lastLearnedNotice, setLastLearnedNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          mode: currentMode,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.detectedLearning) {
        setLastLearnedNotice(`Tercatat ke SQLite: "${data.detectedLearning.term}" = "${data.detectedLearning.meaning}"`);
        onNewLearnedWord();
      }

      const botReplyMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: data.reply || "Puang ka'itung... Maaf ada kendala jaringan.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        detectedLearning: data.detectedLearning,
        mode: currentMode
      };

      setMessages(prev => [...prev, botReplyMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: "Maaf, terjadi gangguan saat menghubungi model AI. Pastikan API key sudah terhubung.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode: "chat" | "latihan") => {
    setCurrentMode(mode);
    const modeNotification: ChatMessage = {
      id: String(Date.now()),
      sender: "bot",
      text: mode === "chat"
        ? "💬 *Mode Chat & Roleplay Diaktifkan*\nMari mengobrol santai dalam bahasa Dayak Ma'anyan alami penutur asli beserta terjemahannya."
        : "🎯 *Mode Latihan & Interactive Testing Diaktifkan*\nMari menguji pengetahuan kosakata dan tata bahasa Dayak Ma'anyan Anda. Aku akan memberikan pertanyaan atau evaluasi!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: mode
    };
    setMessages(prev => [...prev, modeNotification]);
  };

  const samplePrompts = [
    { label: "Sapaan & Tanya Nama", text: "Tabe! Hie ngaran nu?" },
    { label: "Hierarki Kelaparan", text: "Aku layah tatu'u ta'ati, ada waday ka lewu?" },
    { label: "Ajarkan Kata Baru (Auto-Learning)", text: "Kata wusah itu artinya hujan di bahasa Dayak Ma'anyan" },
    { label: "Koreksi Definisi (Auto-Learning)", text: "Salah, harusnya ranu itu artinya air minum" },
    { label: "Minta Soal Latihan", text: "Beri aku satu kuis tebak kata dalam bahasa Dayak Ma'anyan" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Kolom Kiri: Simulator Telegram (Layar Chat) */}
      <div className="lg:col-span-8 flex flex-col bg-stone-900 border border-stone-800 rounded-2xl shadow-xl overflow-hidden min-h-[640px] max-h-[750px]">
        {/* Telegram Header */}
        <div className="bg-stone-950 px-5 py-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow">
                DM
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-100">Dayak Ma'anyan Bot</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/60 font-mono">
                  @{telegramStatus?.status?.botInfo?.username || "maanyan_ai_bot"}
                </span>
                {telegramStatus?.status?.running && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live di Telegram
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                {isLoading ? (
                  <span className="text-emerald-400 animate-pulse">sedang mengetik...</span>
                ) : (
                  <span>online • polling real-time aktif</span>
                )}
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => switchMode("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentMode === "chat"
                  ? "bg-emerald-700 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              💬 Mode Chat
            </button>
            <button
              onClick={() => switchMode("latihan")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentMode === "latihan"
                  ? "bg-emerald-700 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              🎯 Mode Latihan
            </button>
          </div>
        </div>

        {/* Live Telegram Bot Connection Banner */}
        {telegramStatus?.status?.running && (
          <div className="bg-emerald-950/70 border-b border-emerald-800/60 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Bot Telegram Aktif Terhubung:</strong> @{telegramStatus.status.botInfo?.username || "maanyan_ai_bot"} sedang menerima dan memproses pesan Telegram secara live!
              </span>
            </span>
            <a
              href={`https://t.me/${telegramStatus.status.botInfo?.username || "maanyan_ai_bot"}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors shrink-0 ml-3"
            >
              Buka di Telegram ↗
            </a>
          </div>
        )}

        {/* Learning Flash Toast Alert */}
        {lastLearnedNotice && (
          <div className="bg-amber-950/80 border-b border-amber-800/60 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <strong>Dynamic Auto-Learning:</strong> {lastLearnedNotice}
            </span>
            <button
              onClick={() => setLastLearnedNotice(null)}
              className="text-amber-400 hover:text-amber-100 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Telegram Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950/40">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-stone-800/80 text-stone-400 border border-stone-700/50">
              Hari ini • Dynamic System Instruction Memuat {learnedCount} Kosakata SQLite
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center text-amber-300 text-xs shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-stone-800/90 text-stone-200 border border-stone-700/60 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Auto-Learning Badge if detected */}
                  {msg.detectedLearning && (
                    <div className="mt-2.5 pt-2 border-t border-stone-700/60 flex items-start gap-1.5 text-xs text-amber-300 bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-800/40">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-200">Ingatan Baru Tersimpan di SQLite:</span>
                        <div className="font-mono text-stone-200">
                          <strong>{msg.detectedLearning.term}</strong> = {msg.detectedLearning.meaning}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-stone-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-stone-300 text-xs shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center text-amber-300 text-xs shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-800/90 border border-stone-700/60 rounded-2xl rounded-tl-none px-4 py-3 text-stone-400 text-xs flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping delay-200"></span>
                </span>
                <span>Gemini sedang berpikir dalam tata bahasa Dayak Ma'anyan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentMode === "chat"
                  ? "Ketik pesan atau ajarkan kata baru (misal: 'kata wusah artinya hujan')..."
                  : "Ketik jawaban latihan Anda dalam bahasa Ma'anyan atau Indonesia..."
              }
              className="flex-1 bg-stone-900 border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Kolom Kanan: Panduan Interaktif & Trigger Pengujian */}
      <div className="lg:col-span-4 space-y-5">
        {/* Card Status & Mode */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-stone-200 flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            Status Mode Percakapan
          </h2>
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border transition-all ${
              currentMode === "chat" 
                ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-200" 
                : "bg-stone-950/40 border-stone-800 text-stone-400"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  💬 Mode Chat & Roleplay
                </span>
                {currentMode === "chat" && (
                  <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-bold">
                    AKTIF
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-1 text-stone-300">
                Bot bertindak sebagai penutur asli yang santai dan menyertakan terjemahan Indonesia untuk pendampingan.
              </p>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${
              currentMode === "latihan" 
                ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-200" 
                : "bg-stone-950/40 border-stone-800 text-stone-400"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  🎯 Mode Latihan / Testing
                </span>
                {currentMode === "latihan" && (
                  <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-bold">
                    AKTIF
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-1 text-stone-300">
                Bot membuat soal tebak kata, tes terjemahan, dan memberikan evaluasi edukatif.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-stone-200 flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            Contoh Uji Coba Cepat
          </h2>
          <p className="text-xs text-stone-400 mb-3">
            Klik tombol berikut untuk langsung mengirim prompt ke simulator:
          </p>
          <div className="space-y-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading}
                className="w-full text-left p-2.5 rounded-xl bg-stone-950/60 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-700/60 text-xs text-stone-300 hover:text-emerald-200 transition-all flex items-start justify-between group"
              >
                <div>
                  <span className="font-semibold text-stone-200 block text-[11px] text-amber-400/90">
                    {p.label}
                  </span>
                  <span className="italic text-stone-400">"{p.text}"</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 shrink-0 mt-1 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Dynamic Recursive Auto-Learning */}
        <div className="bg-stone-900 border border-emerald-900/40 rounded-2xl p-4 shadow-lg text-xs text-stone-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Cara Kerja Auto-Learning Rekursif</span>
          </div>
          <p className="leading-relaxed text-stone-400">
            Setiap kali Anda mengetik kalimat koreksi (misal: <em>"kata X artinya Y"</em>), model Gemini di latar belakang akan mengekstrak pasangan kata tersebut, menyimpannya ke database SQLite, dan langsung menyisipkannya ke <strong>System Instruction</strong> berikutnya secara dinamis tanpa perlu restart bot!
          </p>
        </div>
      </div>
    </div>
  );
};
