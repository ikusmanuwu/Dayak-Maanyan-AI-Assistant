import { VocabItem } from "../types";

export const INITIAL_CORE_VOCAB: VocabItem[] = [
  // Kosakata Dasar
  { term: "nguta / kuman", meaning: "makan", category: "Kosakata Dasar", notes: "kuman dan nguta sering digunakan bergantian untuk makan", example: "Aku handak kuman (Aku mau makan)" },
  { term: "nahi", meaning: "nasi", category: "Kosakata Dasar", notes: "makanan pokok", example: "Nahi ta'ati ba'ang (Nasi sekarang sudah masak)" },
  { term: "waday", meaning: "kue / kudapan", category: "Kosakata Dasar", notes: "kue tradisional atau cemilan", example: "Nguta waday kariwe die (Makan kue nanti sore)" },
  { term: "ranu", meaning: "air", category: "Kosakata Dasar", notes: "air minum atau air umum", example: "Mihup ranu (Minum air)" },
  { term: "hungei", meaning: "sungai", category: "Kosakata Dasar", notes: "aliran air atau sungai", example: "Mandi ka hungei (Mandi ke sungai)" },
  { term: "ume", meaning: "ladang", category: "Kosakata Dasar", notes: "ladang padi / perkebunan", example: "Bagawi ka ume (Bekerja ke ladang)" },
  { term: "lewu", meaning: "rumah", category: "Kosakata Dasar", notes: "tempat tinggal", example: "Muli ka lewu (Pulang ke rumah)" },
  { term: "tumpuk", meaning: "kampung / desa", category: "Kosakata Dasar", notes: "pemukiman warga", example: "Tumpuk ite ramai (Kampung kita ramai)" },

  // Tunjuk & Objek
  { term: "yiti", meaning: "ini", category: "Tunjuk & Objek", notes: "kata tunjuk benda dekat", example: "Yiti lewu ku (Ini rumahku)" },
  { term: "yina", meaning: "itu", category: "Tunjuk & Objek", notes: "kata tunjuk benda jauh", example: "Yina ume ere (Itu ladang mereka)" },
  { term: "yiru / iru", meaning: "itu (merujuk objek tertentu)", category: "Tunjuk & Objek", notes: "kata tunjuk objek yang telah dibahas", example: "Yiru waday nu (Itu kuemu)" },
  { term: "iya", meaning: "anak", category: "Tunjuk & Objek", notes: "anak kecil atau keturunan", example: "Iya mandre nelang tenang (Anak tidur dengan tenang)" },
  { term: "ulun", meaning: "orang", category: "Tunjuk & Objek", notes: "manusia atau seseorang", example: "Ulun tumpuk yiti ramah (Orang kampung ini ramah)" },

  // Aktivitas & Waktu
  { term: "bagawi", meaning: "bekerja", category: "Aktivitas & Waktu", notes: "melakukan pekerjaan", example: "Hanye bagawi ka ume (Dia bekerja di ladang)" },
  { term: "naragu", meaning: "memperbaiki", category: "Aktivitas & Waktu", notes: "membenahi barang rusak", example: "Naragu lewu (Memperbaiki rumah)" },
  { term: "mangang", meaning: "memanggang", category: "Aktivitas & Waktu", notes: "memanggang di atas bara api", example: "Mangang lauk ka hungei (Memanggang ikan di sungai)" },
  { term: "mandre", meaning: "tidur", category: "Aktivitas & Waktu", notes: "istirahat tidur", example: "Hayu ite mandre (Mari kita tidur)" },
  { term: "ta'ati", meaning: "sekarang / saat ini", category: "Aktivitas & Waktu", notes: "keterangan waktu sekarang", example: "Ta'ati aku layah (Sekarang aku lapar)" },
  { term: "iengen / kamalem", meaning: "malam / kemalaman", category: "Aktivitas & Waktu", notes: "waktu malam hari", example: "Iengen ta'ati dingin tatu'u (Malam ini sangat dingin)" },
  { term: "kariwe die", meaning: "nanti sore", category: "Aktivitas & Waktu", notes: "keterangan waktu sore hari nanti", example: "Kariwe die ite bapaner lagi (Nanti sore kita bicara lagi)" },

  // Tingkat Kelaparan (Hierarki Khas Ma'anyan)
  { term: "layah", meaning: "lapar (tingkat biasa)", category: "Tingkat Kelaparan", notes: "lapar standar saat tiba waktu makan", example: "Aku layah, hayu nguta (Aku lapar, ayo makan)" },
  { term: "kalauan", meaning: "sangat lapar", category: "Tingkat Kelaparan", notes: "lapar berat karena terlambat makan", example: "Kalauan tatu'u daya luput bagawi (Sangat lapar karena selesai bekerja)" },
  { term: "hinut", meaning: "lapar banget mau pingsan / lemas", category: "Tingkat Kelaparan", notes: "lapar ekstrem hingga lemas", example: "Hinut aku daya puang kuman sangari (Lapar mau pingsan karena belum makan seharian)" },

  // Tata Bahasa & Kata Hubung
  { term: "daya / dagana", meaning: "karena / sebab", category: "Kata Hubung & Partikel", notes: "konjungsi sebab akibat", example: "Aku mandre daya iengen (Aku tidur karena sudah malam)" },
  { term: "kude", meaning: "tapi / tetapi", category: "Kata Hubung & Partikel", notes: "konjungsi pertentangan", example: "Aku handak kuman kude nahi luput (Aku mau makan tapi nasi habis)" },
  { term: "dadijari", meaning: "jadi / makanya / oleh karena itu", category: "Kata Hubung & Partikel", notes: "konjungsi kesimpulan", example: "Dadijari ite mangang waday (Makanya kita memanggang kue)" },
  { term: "ekat", meaning: "cuma / hanya", category: "Kata Hubung & Partikel", notes: "pembatasan", example: "Ekat yiti waday ku (Cuma ini kueku)" },
  { term: "tatu'u", meaning: "sangat / banget / sungguh", category: "Kata Hubung & Partikel", notes: "penegas tingkat intensitas", example: "Ramai tatu'u (Sangat ramai), Layah tatu'u (Sangat lapar)" },
  { term: "nelang", meaning: "sambil / seraya", category: "Kata Hubung & Partikel", notes: "aktivitas simultan", example: "Nguta nahi nelang bapaner (Makan nasi sambil berbicara)" },
  { term: "baya", meaning: "dan / serta", category: "Kata Hubung & Partikel", notes: "penghubung penambahan", example: "Nahi baya waday (Nasi dan kue)" },
  { term: "sindrah", meaning: "bersama / dengan", category: "Kata Hubung & Partikel", notes: "kebersamaan", example: "Kuman sindrah iya (Makan bersama anak)" },
  { term: "hayu", meaning: "mari / ayo", category: "Kata Hubung & Partikel", notes: "ajakan", example: "Hayu ite kuman (Ayo kita makan)" },
  { term: "puang ka'itung", meaning: "lupa / tidak teringat", category: "Ungkapan Khas", notes: "idiom lupa ingatan", example: "Puang ka'itung ngaran nu (Lupa siapa namamu)" },
  { term: "bapaner", meaning: "bicara / mengajar / bercakap", category: "Aktivitas & Waktu", notes: "berbicara bahasa Ma'anyan", example: "Bapaner Dayak Ma'anyan (Berbicara bahasa Dayak Ma'anyan)" },
  { term: "luput", meaning: "selesai / usai", category: "Kata Kerja / Kondisi", notes: "pekerjaan atau kondisi selesai", example: "Bagawi luput (Pekerjaan selesai)" },

  // Kalimat Tanya & Pronomina
  { term: "Hie ngaran nu?", meaning: "Siapa namamu?", category: "Frasa Tanya", notes: "pertanyaan standar menanyakan nama", example: "\"Tabe, hie ngaran nu?\" - \"Ngaran ku Budi\"" },
  { term: "aku", meaning: "aku / saya", category: "Kata Ganti", notes: "orang pertama tunggal", example: "Aku ulun tumpuk yiti (Saya orang kampung ini)" },
  { term: "hanyu", meaning: "kamu / engkau", category: "Kata Ganti", notes: "orang kedua tunggal", example: "Hanyu handak ka awe? (Kamu mau ke mana?)" },
  { term: "hanye", meaning: "dia / ia", category: "Kata Ganti", notes: "orang ketiga tunggal", example: "Hanye mandre (Dia tidur)" },
  { term: "ite / kami", meaning: "kita / kami", category: "Kata Ganti", notes: "orang pertama jamak", example: "Hayu ite bagawi (Mari kita bekerja)" },
  { term: "ere / kere", meaning: "mereka", category: "Kata Ganti", notes: "orang ketiga jamak", example: "Ere kuman nahi (Mereka makan nasi)" }
];

export const GRAMMAR_EXPLANATIONS = [
  {
    title: "Tingkat Kelaparan Khas (Hunger Spectrum)",
    desc: "Masyarakat Dayak Ma'anyan membedakan rasa lapar secara terukur:",
    points: [
      "Layah: Lapar normal harian saat jam makan tiba.",
      "Kalauan: Lapar sangat berat (perut keroncongan karena belum makan lama).",
      "Hinut: Tingkat lapar darurat/ekstrem hingga lemas, gemetar, dan hampir pingsan."
    ]
  },
  {
    title: "Kata Penegas 'Tatu'u' (Sangat / Banget)",
    desc: "Selalu diletakkan di belakang kata sifat untuk menyatakan intensitas tinggi:",
    points: [
      "layah tatu'u = lapar banget",
      "kalauan tatu'u = sangat amat lapar",
      "dingin tatu'u = dingin sekali",
      "ramai tatu'u = sungguh sangat ramai"
    ]
  },
  {
    title: "Aktivitas Simultan dengan 'Nelang' (Sambil)",
    desc: "Menghubungkan dua tindakan yang dikerjakan pada saat bersamaan:",
    points: [
      "kuman nelang bapaner = makan sambil mengobrol",
      "bagawi nelang ngopi = bekerja sambil minum kopi"
    ]
  }
];
