import { GoogleGenAI } from "@google/genai";

// In-memory session tracking for Telegram users
interface UserSession {
  mode: "chat" | "latihan";
  history: Array<{ role: "user" | "model"; text: string }>;
}

const userSessions = new Map<number, UserSession>();

export interface TelegramBotStatus {
  connected: boolean;
  running: boolean;
  botInfo: {
    id?: number;
    first_name?: string;
    username?: string;
  } | null;
  lastUpdateId: number;
  lastError?: string;
  processedMessagesCount: number;
}

let botStatus: TelegramBotStatus = {
  connected: false,
  running: false,
  botInfo: null,
  lastUpdateId: 0,
  processedMessagesCount: 0
};

let pollingActive = false;
let pollingTimer: NodeJS.Timeout | null = null;

export function getBotStatus(): TelegramBotStatus {
  return botStatus;
}

// Telegram API Helper
async function callTelegramApi(token: string, method: string, body?: any): Promise<any> {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const options: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || `Telegram API error on ${method}`);
  }
  return data.result;
}

export async function verifyTelegramToken(token: string) {
  try {
    const me = await callTelegramApi(token, "getMe");
    botStatus.connected = true;
    botStatus.botInfo = {
      id: me.id,
      first_name: me.first_name,
      username: me.username
    };
    return { success: true, bot: me };
  } catch (err: any) {
    botStatus.connected = false;
    botStatus.lastError = err.message;
    return { success: false, error: err.message };
  }
}

export function startTelegramPoller(
  token: string,
  aiClient: GoogleGenAI,
  getSystemInstruction: (mode: "chat" | "latihan") => string,
  onAutoLearn: (term: string, meaning: string, category?: string, example?: string) => void
) {
  if (pollingActive) {
    console.log("[Telegram Poller] Poller already running");
    return;
  }

  pollingActive = true;
  botStatus.running = true;
  console.log("[Telegram Poller] Starting live long-polling for Telegram bot...");

  // Send keyboard markup
  const getModeKeyboard = (currentMode: "chat" | "latihan") => {
    return {
      inline_keyboard: [
        [
          {
            text: currentMode === "chat" ? "✅ Mode Chat (Aktif)" : "💬 Mode Chat (Roleplay)",
            callback_data: "set_mode_chat"
          },
          {
            text: currentMode === "latihan" ? "✅ Mode Latihan (Aktif)" : "🎯 Mode Latihan (Kuis)",
            callback_data: "set_mode_latihan"
          }
        ],
        [
          { text: "📚 Buka Kamus", callback_data: "cmd_kamus" },
          { text: "💡 Hierarki Lapar", callback_data: "cmd_lapar" }
        ]
      ]
    };
  };

  const poll = async () => {
    if (!pollingActive) return;

    try {
      const updates = await callTelegramApi(token, "getUpdates", {
        offset: botStatus.lastUpdateId ? botStatus.lastUpdateId + 1 : -1,
        timeout: 25,
        allowed_updates: ["message", "callback_query"]
      });

      if (Array.isArray(updates) && updates.length > 0) {
        for (const update of updates) {
          botStatus.lastUpdateId = Math.max(botStatus.lastUpdateId, update.update_id);

          // Handle Callback Queries (Button clicks)
          if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message?.chat?.id;
            const fromId = cb.from?.id;
            const data = cb.data;

            if (chatId && fromId) {
              if (!userSessions.has(fromId)) {
                userSessions.set(fromId, { mode: "chat", history: [] });
              }
              const session = userSessions.get(fromId)!;

              if (data === "set_mode_chat") {
                session.mode = "chat";
                await callTelegramApi(token, "answerCallbackQuery", {
                  callback_query_id: cb.id,
                  text: "Mode Chat diaktifkan!"
                });
                await callTelegramApi(token, "sendMessage", {
                  chat_id: chatId,
                  text: "💬 *Mode Chat & Roleplay Diaktifkan!*\nAku adalah penutur asli Dayak Ma'anyan. Mari mengobrol santai! Kamu juga bisa langsung mengajarkan kata baru padaku.",
                  parse_mode: "Markdown",
                  reply_markup: getModeKeyboard("chat")
                });
              } else if (data === "set_mode_latihan") {
                session.mode = "latihan";
                await callTelegramApi(token, "answerCallbackQuery", {
                  callback_query_id: cb.id,
                  text: "Mode Latihan diaktifkan!"
                });
                await callTelegramApi(token, "sendMessage", {
                  chat_id: chatId,
                  text: "🎯 *Mode Latihan & Kuis Diaktifkan!*\nMari uji kemampuan bahasa Dayak Ma'anyan Anda! Aku akan memberikan kuis atau mengevaluasi kalimat Anda.",
                  parse_mode: "Markdown",
                  reply_markup: getModeKeyboard("latihan")
                });
              } else if (data === "cmd_kamus") {
                await callTelegramApi(token, "answerCallbackQuery", { callback_query_id: cb.id });
                await callTelegramApi(token, "sendMessage", {
                  chat_id: chatId,
                  text: "📖 *Cuplikan Kosakata Inti Dayak Ma'anyan:*\n\n" +
                    "• *kuman / nguta* = makan\n" +
                    "• *nahi* = nasi | *ranu* = air | *waday* = kue\n" +
                    "• *lewu* = rumah | *ume* = ladang | *tumpuk* = kampung\n" +
                    "• *ta'ati* = sekarang | *kariwe die* = nanti sore\n" +
                    "• *tatu'u* = sangat / banget (contoh: *layah tatu'u*)\n" +
                    "• *Hie ngaran nu?* = Siapa namamu?\n\n" +
                    "Ketik kata apa saja untuk diterjemahkan atau ajarkan kata baru!",
                  parse_mode: "Markdown"
                });
              } else if (data === "cmd_lapar") {
                await callTelegramApi(token, "answerCallbackQuery", { callback_query_id: cb.id });
                await callTelegramApi(token, "sendMessage", {
                  chat_id: chatId,
                  text: "🔥 *3 Tingkatan Rasa Lapar Khas Dayak Ma'anyan:*\n\n" +
                    "1️⃣ *Layah* = Lapar biasa / wajar saat jam makan tiba.\n" +
                    "2️⃣ *Kalauan* = Sangat lapar karena telat makan / habis kerja berat di ladang (*ume*).\n" +
                    "3️⃣ *Hinut* = Tingkat ekstrem! Lapar sampai lemas, gemetar, dan mau pingsan.\n\n" +
                    "Contoh: _\"Hinut aku daya puang kuman sangari\"_ (Lapar mau pingsan karena belum makan seharian).",
                  parse_mode: "Markdown"
                });
              }
            }
          }

          // Handle incoming text message
          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const fromId = update.message.from?.id || chatId;
            const text = update.message.text.trim();

            if (!userSessions.has(fromId)) {
              userSessions.set(fromId, { mode: "chat", history: [] });
            }
            const session = userSessions.get(fromId)!;

            botStatus.processedMessagesCount += 1;

            // Command /start
            if (text.startsWith("/start")) {
              const welcomeMsg = 
                `🌿 *Tabe! Salam hangat.*\n\n` +
                `Aku adalah **Dayak Ma'anyan AI Assistant** (@${botStatus.botInfo?.username || "bot"}), bot asisten kecerdasan buatan penutur asli Bahasa Dayak Ma'anyan (Kalimantan Tengah / Barito Timur).\n\n` +
                `✨ *Fitur Unggulan Bot:*\n` +
                `• **Mode Chat & Roleplay**: Mengobrol santai dwibahasa (Ma'anyan + arti Indonesia).\n` +
                `• **Mode Latihan**: Kuis dan uji kemampuan kosakata.\n` +
                `• **Recursive Auto-Learning**: Kamu bisa langsung mengoreksi atau mengajarkan kata baru di obrolan! (Contoh: _"kata wusah artinya hujan"_).\n\n` +
                `Pilih mode di bawah atau langsung ketik pesan Anda:`;

              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: welcomeMsg,
                parse_mode: "Markdown",
                reply_markup: getModeKeyboard(session.mode)
              });
              continue;
            }

            // Command /chat
            if (text.startsWith("/chat")) {
              session.mode = "chat";
              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: "💬 *Mode Chat & Roleplay Aktif!*\nSilakan ajak saya mengobrol dalam bahasa Dayak Ma'anyan atau tanyakan arti kata.",
                parse_mode: "Markdown",
                reply_markup: getModeKeyboard("chat")
              });
              continue;
            }

            // Command /latihan
            if (text.startsWith("/latihan")) {
              session.mode = "latihan";
              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: "🎯 *Mode Latihan / Kuis Aktif!*\nKetik jawaban Anda atau minta soal latihan.",
                parse_mode: "Markdown",
                reply_markup: getModeKeyboard("latihan")
              });
              continue;
            }

            // Command /lapar
            if (text.startsWith("/lapar")) {
              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: "🔥 *Hierarki 3 Tingkat Kelaparan Dayak Ma'anyan:*\n" +
                  "1. *Layah* = Lapar biasa.\n" +
                  "2. *Kalauan* = Sangat lapar.\n" +
                  "3. *Hinut* = Lapar lemas mau pingsan.",
                parse_mode: "Markdown"
              });
              continue;
            }

            // Kirim indikator "typing..." ke Telegram
            try {
              await callTelegramApi(token, "sendChatAction", {
                chat_id: chatId,
                action: "typing"
              });
            } catch (e) {
              // ignore
            }

            // 1. Cek Auto-Learning
            let learnedNotification = "";
            const triggers = ["artinya", "artian", "harusnya", "salah", "koreksi", "kata", "bukan", "adalah"];
            if (triggers.some(t => text.toLowerCase().includes(t)) || text.length > 20) {
              try {
                const detectionPrompt = `Analisis apakah pesan ini mengajarkan kosakata baru, mengoreksi terjemahan, atau aturan bahasa Dayak Ma'anyan:
"${text}"

Kembalikan HANYA format JSON:
{
  "is_teaching": true / false,
  "term": "kata ma'anyan atau kosongkan",
  "meaning": "arti indonesia atau kosongkan",
  "category": "kategori kata",
  "example": "contoh kalimat",
  "rule": "penjelasan aturan jika ada"
}`;
                const detResp = await aiClient.models.generateContent({
                  model: "gemini-2.5-flash",
                  contents: detectionPrompt,
                  config: {
                    responseMimeType: "application/json",
                    temperature: 0.1
                  }
                });
                const parsed = JSON.parse(detResp.text?.trim() || "{}");
                if (parsed.is_teaching && parsed.term && parsed.meaning) {
                  onAutoLearn(parsed.term, parsed.meaning, parsed.category, parsed.example);
                  learnedNotification = `\n\n💡 *[Auto-Learning Tersimpan ke Database]*\nKata: *${parsed.term}* = *${parsed.meaning}*`;
                }
              } catch (err) {
                console.warn("[Telegram Poller] Auto-learning check error:", err);
              }
            }

            // 2. Generate balasan dengan Gemini
            try {
              const currentSystemInstruction = getSystemInstruction(session.mode);
              const contents: any[] = [];
              for (const h of session.history.slice(-6)) {
                contents.push({
                  role: h.role === "user" ? "user" : "model",
                  parts: [{ text: h.text }]
                });
              }
              contents.push({
                role: "user",
                parts: [{ text: text }]
              });

              const genResp = await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
                config: {
                  systemInstruction: currentSystemInstruction,
                  temperature: session.mode === "chat" ? 0.7 : 0.4
                }
              });

              const replyText = (genResp.text || "Puang ka'itung... Maaf terjadi kendala teknis.") + learnedNotification;

              // Simpan ke riwayat session
              session.history.push({ role: "user", text: text });
              session.history.push({ role: "model", text: genResp.text || "" });
              if (session.history.length > 12) {
                session.history = session.history.slice(-12);
              }

              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: replyText,
                reply_markup: getModeKeyboard(session.mode)
              });

            } catch (aiErr: any) {
              console.error("[Telegram Poller] Gemini AI Error:", aiErr);
              await callTelegramApi(token, "sendMessage", {
                chat_id: chatId,
                text: "Maaf, terjadi kendala saat memproses bahasa dengan AI. Silakan coba lagi sebentar lagi."
              });
            }
          }
        }
      }
    } catch (err: any) {
      const errorMsg: string = err.message || "";
      botStatus.lastError = errorMsg;

      if (errorMsg.includes("Conflict") || errorMsg.includes("terminated by other getUpdates")) {
        console.log("[Telegram Poller] Instance production terdeteksi aktif. Menghentikan polling agar tidak tabrakan.");
        pollingActive = false;
        botStatus.running = false;
        botStatus.lastError = "Instance production sedang aktif melayani bot Telegram.";
        return;
      }

      console.warn("[Telegram Poller] Polling cycle error:", errorMsg);
    }

    // Lanjutkan poll berikutnya jika masih aktif
    if (pollingActive) {
      pollingTimer = setTimeout(poll, 2500);
    }
  };

  // Mulai polling loop pertama
  poll();
}

export function stopTelegramPoller() {
  pollingActive = false;
  botStatus.running = false;
  if (pollingTimer) {
    clearTimeout(pollingTimer);
    pollingTimer = null;
  }
  console.log("[Telegram Poller] Stopped");
}
