// ==========================================
// DATA LAYER & FIREBASE RTDB CACHE (RUANGBK)
// Selaras dengan Kode 3.1 & Tabel 3.4 Makalah
// ==========================================
(function (global) {
  "use strict";

  const STORAGE_KEYS = {
    SESSION: "ruangbk_session",
    MATERIALS: "ruangbk_materials",
    SCHEDULES: "ruangbk_schedules",
    CONSULTATIONS: "ruangbk_consultations",
    STORIES: "ruangbk_stories",
    COMMENTS: "ruangbk_comments",
    EMPATHY: "ruangbk_empathy",
    REPORTS: "ruangbk_reports"
  };

  const SEED_MATERIALS = {
    "mat-01": {
      judul: "Mengatasi Rasa Canggung Saat Konsultasi ke Ruang BK",
      kategori: "KARIR & BELAJAR",
      isi: "Ruang BK bukan tempat hukuman, melainkan ruang aman untuk merancang masa depan dan bercerita tanpa penghakiman. Tentukan satu topik utama sebelum datang, ajukan jadwal lewat RuangBK agar tidak bentrok dengan jam pelajaran, dan ingat bahwa semua cerita dilindungi asas kerahasiaan konseling.",
      authorUid: "seed-guru-bk",
      createdAt: 1731542400000
    },
    "mat-02": {
      judul: "Cara Memilih Jurusan Kuliah Sesuai Minat & Bakat",
      kategori: "PANDUAN BK",
      isi: "Kenali potensi diri sejak kelas X hingga XII agar tidak salah arah saat kelulusan. Catat mata pelajaran yang paling membuatmu antusias, diskusikan hasil evaluasi belajar bersama Guru BK, dan pelajari prospek karir jurusan yang diminati.",
      authorUid: "seed-guru-bk",
      createdAt: 1731628800000
    }
  };

  const SEED_SCHEDULES = {
    "sch-01": {
      tanggal: "2026-11-27",
      jamMulai: "09:00",
      jamSelesai: "09:45",
      tempat: "Ruang BK 1 (Tatap Muka)",
      guruUid: "seed-guru-bk",
      tersedia: true
    },
    "sch-02": {
      tanggal: "2026-11-28",
      jamMulai: "10:30",
      jamSelesai: "11:15",
      tempat: "Ruang BK 1 (Tatap Muka)",
      guruUid: "seed-guru-bk",
      tersedia: true
    }
  };

  const SEED_STORIES = {
    "story-105": {
      alias: "Anonim #105",
      isi: "Kadang masih suka bingung mau ambil jurusan kuliah apa setelah lulus nanti, takut salah pilih dan mengecewakan orang tua...",
      kategori: "Curhat",
      authorUid: "seed-siswa-105",
      status: "tampil",
      createdAt: 1731715200000
    },
    "story-201": {
      alias: "Anonim #201",
      isi: "Buat teman-teman yang lagi capek belajar buat ujian akhir, istirahat sebentar nggak apa-apa kok. Yang penting besok lanjut pelan-pelan lagi!",
      kategori: "Motivasi",
      authorUid: "seed-siswa-201",
      status: "tampil",
      createdAt: 1731722400000
    },
    "story-202": {
      alias: "Anonim #202",
      isi: "Ada yang pernah merasa susah fokus saat belajar di rumah karena suasana berisik? Biasanya kalian mengatasinya gimana ya?",
      kategori: "Pertanyaan",
      authorUid: "seed-siswa-202",
      status: "tampil",
      createdAt: 1731726000000
    },
    "story-203": {
      alias: "Anonim #203",
      isi: "Hari ini akhirnya berani daftar konseling ke Guru BK setelah sekian lama ragu. Ternyata beneran lega banget bisa cerita tanpa dihakimi.",
      kategori: "Curhat",
      authorUid: "seed-siswa-203",
      status: "tampil",
      createdAt: 1731729600000
    },
    "story-204": {
      alias: "Anonim #204",
      isi: "Ingat, nilai ulangan yang kurang memuaskan bukan berarti masa depanmu hancur. Masih banyak kesempatan buat memperbaiki dan berkembang.",
      kategori: "Motivasi",
      authorUid: "seed-siswa-204",
      status: "tampil",
      createdAt: 1731733200000
    },
    "story-205": {
      alias: "Anonim #205",
      isi: "Akhir-akhir ini sering overthinking soal pergaulan di kelas. Takut dianggap aneh kalau nggak ikut-ikutan tren teman.",
      kategori: "Curhat",
      authorUid: "seed-siswa-205",
      status: "tampil",
      createdAt: 1731736800000
    },
    "story-206": {
      alias: "Anonim #206",
      isi: "Kalau mau konsultasi soal pemilihan jurusan SNBP/SNBT, sebaiknya bawa rapor semester 1 sampai 4 ya?",
      kategori: "Pertanyaan",
      authorUid: "seed-siswa-206",
      status: "tampil",
      createdAt: 1731740400000
    },
    "story-207": {
      alias: "Anonim #207",
      isi: "Terima kasih buat yang sudah kasih empati di ceritaku kemarin. Rasanya hangat banget tahu masih ada yang peduli.",
      kategori: "Lainnya",
      authorUid: "seed-siswa-207",
      status: "tampil",
      createdAt: 1731744000000
    },
    "story-208": {
      alias: "Anonim #208",
      isi: "Jadwal ekskul sama tugas kelompok minggu ini numpuk banget. Lagi belajar atur waktu pakai teknik Pomodoro biar nggak keteteran.",
      kategori: "Curhat",
      authorUid: "seed-siswa-208",
      status: "tampil",
      createdAt: 1731747600000
    },
    "story-209": {
      alias: "Anonim #209",
      isi: "Semangat buat kamu yang hari ini merasa sendirian di sekolah. Kamu berharga, dan pelan-pelan semuanya pasti membaik!",
      kategori: "Motivasi",
      authorUid: "seed-siswa-209",
      status: "tampil",
      createdAt: 1731751200000
    },
    "story-210": {
      alias: "Anonim #210",
      isi: "Apakah cerita yang kita kirim di Safe Space ini benar-benar tidak bisa dilihat nama aslinya oleh teman sekelas?",
      kategori: "Pertanyaan",
      authorUid: "seed-siswa-210",
      status: "tampil",
      createdAt: 1731754800000
    },
    "story-211": {
      alias: "Anonim #211",
      isi: "Kadang pengen cerita ke orang tua kalau lagi stres sama pelajaran, tapi takut malah dibilang kurang bersyukur.",
      kategori: "Curhat",
      authorUid: "seed-siswa-211",
      status: "tampil",
      createdAt: 1731758400000
    },
    "story-212": {
      alias: "Anonim #212",
      isi: "Setiap langkah kecil yang kamu ambil hari ini tetap dihitung sebagai kemajuan. Jangan bandingkan prosesmu dengan orang lain.",
      kategori: "Motivasi",
      authorUid: "seed-siswa-212",
      status: "tampil",
      createdAt: 1731762000000
    },
    "story-213": {
      alias: "Anonim #213",
      isi: "Baru pindah sekolah semester ini dan masih canggung buat mulai ngobrol sama teman baru. Ada tips biar lebih percaya diri?",
      kategori: "Pertanyaan",
      authorUid: "seed-siswa-213",
      status: "tampil",
      createdAt: 1731765600000
    },
    "story-214": {
      alias: "Anonim #214",
      isi: "Hari ini berhasil presentasi di depan kelas tanpa gemetar berlebihan! Ternyata latihan di depan cermin semalam membantu banget.",
      kategori: "Lainnya",
      authorUid: "seed-siswa-214",
      status: "tampil",
      createdAt: 1731769200000
    },
    "story-215": {
      alias: "Anonim #215",
      isi: "Lagi bingung antara lanjut kuliah atau kerja dulu setelah lulus SMK nanti. Pengen diskusi bareng Guru BK minggu depan.",
      kategori: "Curhat",
      authorUid: "seed-siswa-215",
      status: "tampil",
      createdAt: 1731772800000
    },
    "story-216": {
      alias: "Anonim #216",
      isi: "Jangan lupa minum air putih dan tidur cukup malam ini ya, teman-teman. Kesehatan mental juga butuh tubuh yang istirahat.",
      kategori: "Motivasi",
      authorUid: "seed-siswa-216",
      status: "tampil",
      createdAt: 1731776400000
    },
    "story-217": {
      alias: "Anonim #217",
      isi: "Berapa lama biasanya pengajuan jadwal konseling disetujui oleh Guru BK?",
      kategori: "Pertanyaan",
      authorUid: "seed-siswa-217",
      status: "tampil",
      createdAt: 1731780000000
    },
    "story-218": {
      alias: "Anonim #218",
      isi: "Merasa bersalah karena sering menunda tugas padahal tahu deadline-nya sudah dekat. Mau mulai ubah kebiasaan buruk ini pelan-pelan.",
      kategori: "Curhat",
      authorUid: "seed-siswa-218",
      status: "tampil",
      createdAt: 1731783600000
    },
    "story-220": {
      alias: "Anonim #220",
      isi: "Suka banget sama suasana Safe Space di sini. Rasanya tenang bisa baca cerita yang saling menguatkan satu sama lain.",
      kategori: "Lainnya",
      authorUid: "seed-siswa-220",
      status: "tampil",
      createdAt: 1731787200000
    },
    "story-219": {
      alias: "Anonim #219",
      isi: "Ada yang tahu masalah siswa kelas X-2 yang kemarin dipanggil ke ruang BK? Ceritain di sini, dong.",
      authorUid: "seed-siswa-219",
      status: "disembunyikan",
      createdAt: 1731718800000
    }
  };

  let listenersAttached = false;
  let syncCallback = null;
  let seedAttempted = false;

  function getDb() {
    return global.RuangBKFirebase && global.RuangBKFirebase.db
      ? global.RuangBKFirebase.db
      : null;
  }

  function readCache(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeCache(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // Abaikan jika quota storage penuh
    }
  }

  function mapObjectToArray(obj, idField) {
    if (!obj || typeof obj !== "object") return [];
    return Object.keys(obj)
      .map(function (key) {
        const item = obj[key];
        if (!item || typeof item !== "object") return null;
        return Object.assign({ [idField || "id"]: key }, item);
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      });
  }

  function notifySync() {
    if (typeof syncCallback === "function") {
      syncCallback();
    }
  }

  const RuangBKStorage = {
    init: function () {
      if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
        writeCache(STORAGE_KEYS.MATERIALS, SEED_MATERIALS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
        writeCache(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
        writeCache(STORAGE_KEYS.CONSULTATIONS, {});
      }
      if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
        writeCache(STORAGE_KEYS.STORIES, SEED_STORIES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
        writeCache(STORAGE_KEYS.COMMENTS, {});
      }
      if (!localStorage.getItem(STORAGE_KEYS.EMPATHY)) {
        writeCache(STORAGE_KEYS.EMPATHY, {});
      }
      if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
        writeCache(STORAGE_KEYS.REPORTS, {});
      }
    },

    // ==========================================
    // SESSION LOKAL
    // ==========================================
    getSession: function () {
      return readCache(STORAGE_KEYS.SESSION, null);
    },

    setSession: function (user) {
      writeCache(STORAGE_KEYS.SESSION, user);
    },

    clearSession: function () {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    // ==========================================
    // SINKRONISASI REAL-TIME & SEED DATA
    // ==========================================
    syncFromFirebase: function (onUpdate) {
      if (typeof onUpdate === "function") {
        syncCallback = onUpdate;
      }
      const db = getDb();
      if (!db || listenersAttached) return;
      listenersAttached = true;

      const nodeMap = [
        { path: "materials", key: STORAGE_KEYS.MATERIALS },
        { path: "schedules", key: STORAGE_KEYS.SCHEDULES },
        { path: "consultations", key: STORAGE_KEYS.CONSULTATIONS },
        { path: "stories", key: STORAGE_KEYS.STORIES },
        { path: "comments", key: STORAGE_KEYS.COMMENTS },
        { path: "empathy", key: STORAGE_KEYS.EMPATHY },
        { path: "reports", key: STORAGE_KEYS.REPORTS }
      ];

      nodeMap.forEach(function (entry) {
        db.ref(entry.path).on(
          "value",
          function (snapshot) {
            const val = snapshot.val() || {};
            writeCache(entry.key, val);
            notifySync();
          },
          function (error) {
            console.warn("[RuangBKStorage] Gagal sync node " + entry.path + ":", error && error.message);
          }
        );
      });
    },

    seedInitialDataIfEmpty: async function () {
      const db = getDb();
      if (!db || seedAttempted) return;
      seedAttempted = true;

      const seeds = [
        { path: "materials", data: SEED_MATERIALS, key: STORAGE_KEYS.MATERIALS },
        { path: "schedules", data: SEED_SCHEDULES, key: STORAGE_KEYS.SCHEDULES },
        { path: "stories", data: SEED_STORIES, key: STORAGE_KEYS.STORIES }
      ];

      await Promise.all(
        seeds.map(async function (item) {
          try {
            const snap = await db.ref(item.path).limitToFirst(1).once("value");
            if (!snap.exists()) {
              await db.ref(item.path).set(item.data);
              writeCache(item.key, item.data);
            }
          } catch (err) {
            console.warn("[RuangBKStorage] Seed " + item.path + " dilewati:", err && err.message);
          }
        })
      );
    },

    // ==========================================
    // USERS (users/$uid)
    // ==========================================
    getUser: async function (uid) {
      const db = getDb();
      if (!db || !uid) return null;
      const snap = await db.ref("users/" + uid).once("value");
      return snap.exists() ? snap.val() : null;
    },

    saveUser: async function (uid, profile) {
      const db = getDb();
      if (!db || !uid) throw new Error("Firebase DB atau UID tidak tersedia.");
      const payload = {
        nama: profile.nama || "",
        role: profile.role === "guru_bk" ? "guru_bk" : "siswa",
        jenjang: profile.jenjang || "SMA",
        sekolahKelas: profile.sekolahKelas || "",
        nisn: profile.nisn || "",
        createdAt: profile.createdAt || Date.now()
      };
      await db.ref("users/" + uid).set(payload);
      return payload;
    },

    updateUser: async function (uid, patch) {
      const db = getDb();
      if (!db || !uid) throw new Error("Firebase DB atau UID tidak tersedia.");
      await db.ref("users/" + uid).update(patch);
    },

    updateUserProfile: async function (uid, payload) {
      const db = getDb();
      const session = this.getSession() || {};
      const role = session.role === "guru_bk" || session.role === "counselor" ? "guru_bk" : "siswa";
      const jenjang = session.jenjang || "SMA";

      const cleanPayload = role === "guru_bk"
        ? {
            nama: String(payload.nama || "").trim(),
            asalSekolah: String(payload.asalSekolah || "").trim(),
            ruangDefault: String(payload.ruangDefault || "").trim()
          }
        : {
            nama: String(payload.nama || "").trim(),
            asalSekolah: String(payload.asalSekolah || "").trim(),
            kelas: String(payload.kelas || "").trim(),
            jurusan: jenjang === "SMP" ? "" : String(payload.jurusan || "").trim()
          };

      const sekolahKelas = role === "guru_bk"
        ? (cleanPayload.asalSekolah || session.sekolahKelas || "Guru BK")
        : ([cleanPayload.asalSekolah, cleanPayload.kelas, cleanPayload.jurusan].filter(Boolean).join(" • ") || session.sekolahKelas || "Siswa");

      cleanPayload.sekolahKelas = sekolahKelas;

      if (db && uid) {
        await db.ref("users/" + uid).update(cleanPayload);
      }

      const updatedSession = Object.assign({}, session, cleanPayload, {
        name: cleanPayload.nama || session.name || session.nama || "Pengguna",
        detail: role === "guru_bk" ? sekolahKelas : `${jenjang} • ${sekolahKelas}`
      });
      this.setSession(updatedSession);
      return updatedSession;
    },

    // ==========================================
    // MATERIALS (materials/$materialId)
    // ==========================================
    getMaterials: function () {
      return mapObjectToArray(readCache(STORAGE_KEYS.MATERIALS, SEED_MATERIALS), "id");
    },

    getArticles: function () {
      return this.getMaterials();
    },

    fetchMaterials: async function () {
      const db = getDb();
      if (!db) return this.getMaterials();
      const snap = await db.ref("materials").once("value");
      const val = snap.val() || {};
      writeCache(STORAGE_KEYS.MATERIALS, val);
      return mapObjectToArray(val, "id");
    },

    createMaterial: async function (data) {
      const db = getDb();
      const payload = {
        judul: data.judul || "",
        kategori: data.kategori || "PANDUAN BK",
        isi: data.isi || "",
        authorUid: data.authorUid || "",
        createdAt: data.createdAt || Date.now()
      };
      const cache = readCache(STORAGE_KEYS.MATERIALS, {});
      let id = "mat-" + Date.now();
      if (db) {
        const ref = db.ref("materials").push();
        id = ref.key;
        await ref.set(payload);
      }
      cache[id] = payload;
      writeCache(STORAGE_KEYS.MATERIALS, cache);
      return Object.assign({ id: id }, payload);
    },

    updateMaterial: async function (materialId, patch) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.MATERIALS, {});
      if (cache[materialId]) {
        cache[materialId] = Object.assign({}, cache[materialId], patch);
        writeCache(STORAGE_KEYS.MATERIALS, cache);
      }
      if (db) {
        await db.ref("materials/" + materialId).update(patch);
      }
    },

    deleteMaterial: async function (materialId) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.MATERIALS, {});
      delete cache[materialId];
      writeCache(STORAGE_KEYS.MATERIALS, cache);
      if (db) {
        await db.ref("materials/" + materialId).remove();
      }
    },

    // ==========================================
    // SCHEDULES (schedules/$scheduleId)
    // ==========================================
    getSchedules: function () {
      return mapObjectToArray(readCache(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES), "id");
    },

    fetchSchedules: async function () {
      const db = getDb();
      if (!db) return this.getSchedules();
      const snap = await db.ref("schedules").once("value");
      const val = snap.val() || {};
      writeCache(STORAGE_KEYS.SCHEDULES, val);
      return mapObjectToArray(val, "id");
    },

    createSchedule: async function (data) {
      const db = getDb();
      const payload = {
        tanggal: data.tanggal || "",
        jamMulai: data.jamMulai || "",
        jamSelesai: data.jamSelesai || "",
        tempat: data.tempat || "",
        guruUid: data.guruUid || "",
        tersedia: data.tersedia !== false
      };
      const cache = readCache(STORAGE_KEYS.SCHEDULES, {});
      let id = "sch-" + Date.now();
      if (db) {
        const ref = db.ref("schedules").push();
        id = ref.key;
        await ref.set(payload);
      }
      cache[id] = payload;
      writeCache(STORAGE_KEYS.SCHEDULES, cache);
      return Object.assign({ id: id }, payload);
    },

    updateSchedule: async function (scheduleId, patch) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.SCHEDULES, {});
      if (cache[scheduleId]) {
        cache[scheduleId] = Object.assign({}, cache[scheduleId], patch);
        writeCache(STORAGE_KEYS.SCHEDULES, cache);
      }
      if (db) {
        await db.ref("schedules/" + scheduleId).update(patch);
      }
    },

    deleteSchedule: async function (scheduleId) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.SCHEDULES, {});
      delete cache[scheduleId];
      writeCache(STORAGE_KEYS.SCHEDULES, cache);
      if (db) {
        await db.ref("schedules/" + scheduleId).remove();
      }
    },

    // ==========================================
    // CONSULTATIONS (consultations/$consultationId)
    // ==========================================
    getConsultations: function () {
      return mapObjectToArray(readCache(STORAGE_KEYS.CONSULTATIONS, {}), "id");
    },

    fetchConsultations: async function () {
      const db = getDb();
      if (!db) return this.getConsultations();
      const snap = await db.ref("consultations").once("value");
      const val = snap.val() || {};
      writeCache(STORAGE_KEYS.CONSULTATIONS, val);
      return mapObjectToArray(val, "id");
    },

    createConsultation: async function (data) {
      const db = getDb();
      const payload = {
        studentUid: data.studentUid || "",
        namaSiswa: data.namaSiswa || "",
        topik: data.topik || "",
        scheduleId: data.scheduleId || "",
        tanggal: data.tanggal || "",
        jam: data.jam || "",
        tempat: data.tempat || "",
        status: data.status || "menunggu",
        createdAt: data.createdAt || Date.now()
      };
      const cache = readCache(STORAGE_KEYS.CONSULTATIONS, {});
      let id = "cns-" + Date.now();
      if (db) {
        const ref = db.ref("consultations").push();
        id = ref.key;
        await ref.set(payload);
      }
      cache[id] = payload;
      writeCache(STORAGE_KEYS.CONSULTATIONS, cache);
      return Object.assign({ id: id }, payload);
    },

    updateConsultationStatus: async function (consultationId, status, extra) {
      const db = getDb();
      const patch = Object.assign({ status: status }, extra || {});
      const cache = readCache(STORAGE_KEYS.CONSULTATIONS, {});
      if (cache[consultationId]) {
        cache[consultationId] = Object.assign({}, cache[consultationId], patch);
        writeCache(STORAGE_KEYS.CONSULTATIONS, cache);
      }
      if (db) {
        await db.ref("consultations/" + consultationId).update(patch);
      }
    },

    deleteConsultation: async function (consultationId) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.CONSULTATIONS, {});
      delete cache[consultationId];
      writeCache(STORAGE_KEYS.CONSULTATIONS, cache);
      if (db) {
        await db.ref("consultations/" + consultationId).remove();
      }
    },

    // ==========================================
    // STORIES (stories/$storyId)
    // ==========================================
    getStories: function () {
      return mapObjectToArray(readCache(STORAGE_KEYS.STORIES, SEED_STORIES), "id");
    },

    getPosts: function () {
      return this.getStories();
    },

    fetchStories: async function () {
      const db = getDb();
      if (!db) return this.getStories();
      const snap = await db.ref("stories").once("value");
      const val = snap.val() || {};
      writeCache(STORAGE_KEYS.STORIES, val);
      return mapObjectToArray(val, "id");
    },

    createStory: async function (data) {
      const db = getDb();
      const payload = {
        alias: data.alias || "Anonim #" + Math.floor(100 + Math.random() * 900),
        isi: data.isi || "",
        authorUid: data.authorUid || "",
        status: data.status || "tampil",
        createdAt: data.createdAt || Date.now()
      };
      const cache = readCache(STORAGE_KEYS.STORIES, {});
      let id = "story-" + Date.now();
      if (db) {
        const ref = db.ref("stories").push();
        id = ref.key;
        await ref.set(payload);
      }
      cache[id] = payload;
      writeCache(STORAGE_KEYS.STORIES, cache);
      return Object.assign({ id: id }, payload);
    },

    updateStoryStatus: async function (storyId, status) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.STORIES, {});
      if (cache[storyId]) {
        cache[storyId].status = status;
        writeCache(STORAGE_KEYS.STORIES, cache);
      }
      if (db) {
        await db.ref("stories/" + storyId).update({ status: status });
      }
    },

    deleteStory: async function (storyId) {
      const db = getDb();
      const storiesCache = readCache(STORAGE_KEYS.STORIES, {});
      delete storiesCache[storyId];
      writeCache(STORAGE_KEYS.STORIES, storiesCache);

      const commentsCache = readCache(STORAGE_KEYS.COMMENTS, {});
      delete commentsCache[storyId];
      writeCache(STORAGE_KEYS.COMMENTS, commentsCache);

      const empathyCache = readCache(STORAGE_KEYS.EMPATHY, {});
      delete empathyCache[storyId];
      writeCache(STORAGE_KEYS.EMPATHY, empathyCache);

      if (db) {
        await Promise.all([
          db.ref("stories/" + storyId).remove(),
          db.ref("comments/" + storyId).remove(),
          db.ref("empathy/" + storyId).remove()
        ]);
      }
    },

    // ==========================================
    // COMMENTS (comments/$storyId/$commentId)
    // ==========================================
    getComments: function (storyId) {
      const all = readCache(STORAGE_KEYS.COMMENTS, {});
      return mapObjectToArray(all[storyId] || {}, "id");
    },

    fetchComments: async function (storyId) {
      const db = getDb();
      if (!db) return this.getComments(storyId);
      const snap = await db.ref("comments/" + storyId).once("value");
      const val = snap.val() || {};
      const all = readCache(STORAGE_KEYS.COMMENTS, {});
      all[storyId] = val;
      writeCache(STORAGE_KEYS.COMMENTS, all);
      return mapObjectToArray(val, "id");
    },

    addComment: async function (storyId, data) {
      const db = getDb();
      const payload = {
        alias: data.alias || "Anonim #" + Math.floor(100 + Math.random() * 900),
        isi: data.isi || "",
        authorUid: data.authorUid || "",
        createdAt: data.createdAt || Date.now()
      };
      const all = readCache(STORAGE_KEYS.COMMENTS, {});
      all[storyId] = all[storyId] || {};
      let id = "cmt-" + Date.now();
      if (db) {
        const ref = db.ref("comments/" + storyId).push();
        id = ref.key;
        await ref.set(payload);
      }
      all[storyId][id] = payload;
      writeCache(STORAGE_KEYS.COMMENTS, all);
      return Object.assign({ id: id }, payload);
    },

    deleteComment: async function (storyId, commentId) {
      const db = getDb();
      const all = readCache(STORAGE_KEYS.COMMENTS, {});
      if (all[storyId]) {
        delete all[storyId][commentId];
        writeCache(STORAGE_KEYS.COMMENTS, all);
      }
      if (db) {
        await db.ref("comments/" + storyId + "/" + commentId).remove();
      }
    },

    findStoryById: function (storyId) {
      const stories = readCache(STORAGE_KEYS.STORIES, SEED_STORIES);
      if (stories && stories[storyId]) {
        return Object.assign({ id: storyId }, stories[storyId]);
      }
      return null;
    },

    findCommentById: function (commentId) {
      const all = readCache(STORAGE_KEYS.COMMENTS, {});
      const storyIds = Object.keys(all || {});
      for (let i = 0; i < storyIds.length; i += 1) {
        const sId = storyIds[i];
        if (all[sId] && all[sId][commentId]) {
          return {
            storyId: sId,
            comment: Object.assign({ id: commentId }, all[sId][commentId])
          };
        }
      }
      return null;
    },

    // ==========================================
    // EMPATHY (empathy/$storyId/$uid: true)
    // ==========================================
    getEmpathyMap: function (storyId) {
      const all = readCache(STORAGE_KEYS.EMPATHY, {});
      return all[storyId] || {};
    },

    toggleEmpathy: async function (storyId, uid) {
      if (!uid) throw new Error("UID diperlukan untuk tanggapan empati.");
      const db = getDb();
      const all = readCache(STORAGE_KEYS.EMPATHY, {});
      all[storyId] = all[storyId] || {};
      const currentlyLiked = Boolean(all[storyId][uid]);

      if (currentlyLiked) {
        delete all[storyId][uid];
        writeCache(STORAGE_KEYS.EMPATHY, all);
        if (db) {
          await db.ref("empathy/" + storyId + "/" + uid).remove();
        }
        return false;
      }

      all[storyId][uid] = true;
      writeCache(STORAGE_KEYS.EMPATHY, all);
      if (db) {
        await db.ref("empathy/" + storyId + "/" + uid).set(true);
      }
      return true;
    },

    // ==========================================
    // REPORTS (reports/$reportId)
    // ==========================================
    getReports: function () {
      return mapObjectToArray(readCache(STORAGE_KEYS.REPORTS, {}), "id");
    },

    fetchReports: async function () {
      const db = getDb();
      if (!db) return this.getReports();
      const snap = await db.ref("reports").once("value");
      const val = snap.val() || {};
      writeCache(STORAGE_KEYS.REPORTS, val);
      return mapObjectToArray(val, "id");
    },

    createReport: async function (data) {
      const db = getDb();
      const payload = {
        jenisKonten: data.jenisKonten === "komentar" ? "komentar" : "cerita",
        kontenId: data.kontenId || "",
        alasan: data.alasan || "",
        reporterUid: data.reporterUid || "",
        status: data.status || "baru",
        createdAt: data.createdAt || Date.now()
      };
      const cache = readCache(STORAGE_KEYS.REPORTS, {});
      let id = "rep-" + Date.now();
      if (db) {
        const ref = db.ref("reports").push();
        id = ref.key;
        await ref.set(payload);
      }
      cache[id] = payload;
      writeCache(STORAGE_KEYS.REPORTS, cache);
      return Object.assign({ id: id }, payload);
    },

    updateReportStatus: async function (reportId, status) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.REPORTS, {});
      if (cache[reportId]) {
        cache[reportId].status = status;
        writeCache(STORAGE_KEYS.REPORTS, cache);
      }
      if (db) {
        await db.ref("reports/" + reportId).update({ status: status });
      }
    },

    markReportsReviewedByContent: async function (kontenId) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.REPORTS, {});
      const matchingIds = Object.keys(cache || {}).filter(function (id) {
        return cache[id] && cache[id].kontenId === kontenId && cache[id].status !== "ditinjau";
      });
      matchingIds.forEach(function (id) {
        cache[id].status = "ditinjau";
      });
      writeCache(STORAGE_KEYS.REPORTS, cache);

      if (db && matchingIds.length > 0) {
        const updates = {};
        matchingIds.forEach(function (id) {
          updates["reports/" + id + "/status"] = "ditinjau";
        });
        await db.ref().update(updates);
      }
    },

    deleteReport: async function (reportId) {
      const db = getDb();
      const cache = readCache(STORAGE_KEYS.REPORTS, {});
      delete cache[reportId];
      writeCache(STORAGE_KEYS.REPORTS, cache);
      if (db) {
        await db.ref("reports/" + reportId).remove();
      }
    }
  };

  global.RuangBKStorage = RuangBKStorage;
}(window));
