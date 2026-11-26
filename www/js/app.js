(function (global) {
  "use strict";

  let currentScreen = "login";
  let toastTimer;
  let initialized = false;

  const navIcons = {
    home: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    calendar: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    chat: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    profile: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function navigateTo(screenId) {
    closeModal();
    currentScreen = screenId;
    global.scrollTo(0, 0);

    const session = global.RuangBKStorage.getSession();
    switch (screenId) {
      case "login":
        renderBottomNav(null);
        global.renderLoginScreen();
        break;
      case "register":
        renderBottomNav(null);
        global.renderRegisterScreen();
        break;
      case "student-dashboard":
        global.renderStudentDashboard();
        renderBottomNav("siswa", "home");
        break;
      case "student-booking":
        global.renderStudentBooking();
        renderBottomNav("siswa", "home");
        break;
      case "student-history":
        global.renderStudentHistory();
        renderBottomNav("siswa", "calendar");
        break;
      case "student-safespace":
        global.renderSafeSpace();
        renderBottomNav("siswa", "chat");
        break;
      case "student-edukasi":
        global.renderStudentEdukasi();
        renderBottomNav("siswa", "home");
        break;
      case "counselor-dashboard":
        global.renderCounselorDashboard();
        renderBottomNav("guru_bk", "home");
        break;
      case "counselor-schedule":
        global.renderCounselorSchedule();
        renderBottomNav("guru_bk", "calendar");
        break;
      case "counselor-materials":
        global.renderCounselorMaterials();
        renderBottomNav("guru_bk", "home");
        break;
      case "counselor-moderation":
        global.renderCounselorModeration();
        renderBottomNav("guru_bk", "chat");
        break;
      case "profile":
        renderQuickProfileScreen(session);
        renderBottomNav(session ? session.role : "student", "profile");
        break;
      default:
        renderBottomNav(null);
        global.renderLoginScreen();
    }
  }

  function renderBottomNav(role, activeTab) {
    const container = document.getElementById("bottom-nav-container");
    if (!container) {
      throw new Error("Elemen #bottom-nav-container tidak ditemukan.");
    }
    if (!role) {
      container.innerHTML = "";
      return;
    }

    const routes = role === "guru_bk" || role === "counselor"
      ? {
        home: "counselor-dashboard",
        calendar: "counselor-schedule",
        chat: "counselor-moderation",
        profile: "profile"
      }
      : {
        home: "student-dashboard",
        calendar: "student-history",
        chat: "student-safespace",
        profile: "profile"
      };

    container.innerHTML = `
      <nav class="floating-bottom-nav" aria-label="Navigasi Utama">
        <button class="nav-item-btn ${activeTab === "home" ? "active" : ""}" onclick="navigateTo('${routes.home}')" aria-label="Beranda">${navIcons.home}</button>
        <button class="nav-item-btn ${activeTab === "calendar" ? "active" : ""}" onclick="navigateTo('${routes.calendar}')" aria-label="Jadwal">${navIcons.calendar}</button>
        <button class="nav-item-btn ${activeTab === "chat" ? "active" : ""}" onclick="navigateTo('${routes.chat}')" aria-label="Safe Space">${navIcons.chat}</button>
        <button class="nav-item-btn ${activeTab === "profile" ? "active" : ""}" onclick="navigateTo('${routes.profile}')" aria-label="Profil">${navIcons.profile}</button>
      </nav>
    `;
  }

  function renderPlaceholderScreen(title, description, backTarget) {
    document.getElementById("app-screen").innerHTML = `
      <div class="app-page">
        <div class="card-box" style="text-align:center;">
          <h2 style="font-size:18px; margin-bottom:8px;">${escapeHtml(title)}</h2>
          <p style="font-size:13px; color:var(--text-secondary); margin-bottom:20px;">${escapeHtml(description)}</p>
          <button class="btn-pill btn-blue" onclick="navigateTo('${backTarget}')">Kembali</button>
        </div>
      </div>
    `;
  }

  const THEME_KEY = "ruangbk_theme";

  function getTheme() {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", normalized);
    localStorage.setItem(THEME_KEY, normalized);
    return normalized;
  }

  function setAppTheme(theme) {
    const active = applyTheme(theme);
    showToast(active === "dark" ? "Mode Gelap diaktifkan." : "Mode Terang diaktifkan.");
    if (currentScreen === "profile") {
      renderQuickProfileScreen(global.RuangBKStorage.getSession());
    }
  }

  function openChangePasswordModal() {
    openModal(`
      <form id="change-password-form" class="report-modal-body">
        <div class="report-modal-head">
          <h3>Ubah Kata Sandi</h3>
          <p>Masukkan kata sandi baru minimal 8 karakter untuk menjaga keamanan akunmu.</p>
        </div>

        <div>
          <label class="booking-sublabel" for="new-pass-input">Kata Sandi Baru</label>
          <input type="password" id="new-pass-input" class="input-box" minlength="8" placeholder="Minimal 8 karakter" required />
        </div>

        <div>
          <label class="booking-sublabel" for="confirm-pass-input">Konfirmasi Kata Sandi</label>
          <input type="password" id="confirm-pass-input" class="input-box" minlength="8" placeholder="Ulangi kata sandi baru" required />
        </div>

        <p id="change-pass-error" class="prof-modal-error" hidden></p>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
          <button type="submit" id="btn-save-password" class="btn-pill btn-blue">Simpan Kata Sandi</button>
        </div>
      </form>
    `);

    document.getElementById("change-password-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const newPass = document.getElementById("new-pass-input").value;
      const confirmPass = document.getElementById("confirm-pass-input").value;
      const errEl = document.getElementById("change-pass-error");
      const submitBtn = document.getElementById("btn-save-password");

      errEl.hidden = true;
      if (newPass.length < 8) {
        errEl.textContent = "Kata sandi baru minimal 8 karakter.";
        errEl.hidden = false;
        return;
      }
      if (newPass !== confirmPass) {
        errEl.textContent = "Konfirmasi kata sandi tidak cocok.";
        errEl.hidden = false;
        return;
      }

      const authInstance = (global.RuangBKFirebase && global.RuangBKFirebase.auth) || (global.firebase && global.firebase.auth && global.firebase.auth());
      const currentUser = authInstance && authInstance.currentUser;
      if (!currentUser) {
        errEl.textContent = "Demi keamanan, silakan keluar dan masuk kembali sebelum mengganti kata sandi.";
        errEl.hidden = false;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Menyimpan...";

      try {
        await currentUser.updatePassword(newPass);
        closeModal();
        showToast("Kata sandi berhasil diperbarui.");
      } catch (err) {
        const code = err && err.code;
        errEl.textContent = code === "auth/requires-recent-login"
          ? "Demi keamanan, silakan keluar dan masuk kembali sebelum mengganti kata sandi."
          : ((err && err.message) || "Gagal memperbarui kata sandi.");
        errEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Simpan Kata Sandi";
      }
    });
  }

  function openPrivacyInfoModal() {
    openModal(`
      <div class="report-modal-body">
        <div class="report-modal-head">
          <h3>Privasi &amp; Kerahasiaan RuangBK</h3>
          <p>Komitmen kami dalam melindungi data dan kenyamanan siswa serta Guru BK.</p>
        </div>
        <ul class="ss-guide-modal-list">
          <li><span><strong>Minimisasi Data:</strong> RuangBK hanya menyimpan nama, jenjang, sekolah/kelas, email, dan NISN tanpa meminta nomor HP, alamat rumah, atau foto pribadi.</span></li>
          <li><span><strong>Anonimitas Safe Space:</strong> Identitas aslimu tidak pernah ditampilkan pada cerita atau komentar di Safe Space.</span></li>
          <li><span><strong>Asas Kerahasiaan BK:</strong> Data pengajuan konseling dan profil hanya digunakan untuk layanan bimbingan dan konseling sekolah oleh Guru BK yang berwenang.</span></li>
        </ul>
        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-blue" onclick="closeModal()">Tutup</button>
        </div>
      </div>
    `);
  }

  function renderProfileScreen(session) {
    const user = session || { nama: "Pengguna", detail: "-", role: "siswa", jenjang: "SMA" };
    const displayName = user.nama || user.name || "Pengguna";
    const isCounselor = user.role === "guru_bk" || user.role === "counselor";
    const jenjang = user.jenjang || "SMA";
    const roleLabel = isCounselor ? "Guru BK" : `Siswa • ${jenjang}`;
    const currentTheme = getTheme();
    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (p) { return p[0]; })
      .join("")
      .toUpperCase() || "U";

    const asalSekolah = user.asalSekolah || "";
    const kelas = user.kelas || "";
    const jurusan = user.jurusan || "";
    const ruangDefault = user.ruangDefault || "";

    const isStudentIncomplete = !isCounselor && (!kelas.trim() || (jenjang !== "SMP" && !jurusan.trim()));

    const kelasPlaceholder = jenjang === "SMP"
      ? "Contoh: VII-A"
      : (jenjang === "SMK" ? "Contoh: XII RPL 1" : "Contoh: XI-2");

    const smaMajors = ["IPA", "IPS", "Bahasa", "Kurikulum Merdeka", "Lainnya"];

    const jurusanFieldHtml = isCounselor || jenjang === "SMP"
      ? ""
      : jenjang === "SMA"
        ? `
          <div class="prof-field">
            <label class="booking-sublabel" for="prof-jurusan">Jurusan / Peminatan</label>
            <select id="prof-jurusan" class="input-box">
              <option value="">Pilih Jurusan</option>
              ${smaMajors.map(function (m) {
                return `<option value="${m}" ${jurusan === m ? "selected" : ""}>${m}</option>`;
              }).join("")}
            </select>
          </div>
        `
        : `
          <div class="prof-field">
            <label class="booking-sublabel" for="prof-jurusan">Jurusan / Kompetensi Keahlian</label>
            <input type="text" id="prof-jurusan" class="input-box" list="smk-jurusan-list" value="${escapeHtml(jurusan)}" placeholder="Contoh: RPL, TKJ, Akuntansi, Multimedia" />
            <datalist id="smk-jurusan-list">
              <option value="RPL"></option>
              <option value="TKJ"></option>
              <option value="Akuntansi"></option>
              <option value="Multimedia"></option>
              <option value="DKV"></option>
              <option value="TBSM"></option>
            </datalist>
          </div>
        `;

    const profileHtml = `
      <div class="profile-page-container">
        <header class="prof-page-header">
          <div>
            <h1>Profil Saya</h1>
            <p>Kelola informasi akun, preferensi tampilan, dan keamanan akun RuangBK.</p>
          </div>
        </header>

        <!-- Kartu 1: Ringkasan Akun & Status Kelengkapan -->
        <section class="card-box prof-card prof-summary-card">
          <div class="prof-summary-top">
            <div class="profile-avatar-lg prof-avatar-inline">${escapeHtml(initials)}</div>
            <div class="prof-summary-info">
              <div class="prof-name-row">
                <h2 class="profile-name">${escapeHtml(displayName)}</h2>
                <span class="prof-role-badge">${escapeHtml(roleLabel)}</span>
              </div>
              <p class="prof-readonly-meta">
                ${escapeHtml(user.email || "-")}${!isCounselor && user.nisn ? ` • NISN ${escapeHtml(user.nisn)}` : ""}
              </p>
              <p class="prof-readonly-detail">${escapeHtml(user.detail || user.sekolahKelas || "-")}</p>
            </div>
          </div>

          ${isStudentIncomplete
            ? `<div class="prof-status-banner amber">
                <span>Profil belum lengkap — lengkapi kelas dan jurusan agar Guru BK lebih mudah mengenalimu.</span>
              </div>`
            : `<div class="prof-status-banner green">
                <span>&#10003; Profil Lengkap</span>
              </div>`
          }
        </section>

        <!-- Kartu 2: Form Lengkapi / Edit Profil -->
        <section class="card-box prof-card">
          <h3 class="prof-section-title">Lengkapi / Edit Profil</h3>
          <form id="profile-edit-form" class="form-stack">
            <div class="prof-field">
              <label class="booking-sublabel" for="prof-nama">${isCounselor ? "Nama Lengkap &amp; Gelar" : "Nama Lengkap"}</label>
              <input type="text" id="prof-nama" class="input-box" value="${escapeHtml(displayName)}" required />
            </div>

            ${isCounselor
              ? `
                <div class="prof-field">
                  <label class="booking-sublabel" for="prof-sekolah">Asal Sekolah</label>
                  <input type="text" id="prof-sekolah" class="input-box" value="${escapeHtml(asalSekolah)}" placeholder="Contoh: SMAN 1 Nusantara" required />
                </div>
                <div class="prof-field">
                  <label class="booking-sublabel" for="prof-ruang">Lokasi / Ruang BK Default (Opsional)</label>
                  <input type="text" id="prof-ruang" class="input-box" value="${escapeHtml(ruangDefault)}" placeholder="Contoh: Ruang BK 1 (Tatap Muka)" />
                </div>
              `
              : `
                <div class="prof-two-col">
                  <div class="prof-field">
                    <label class="booking-sublabel" for="prof-jenjang">Jenjang</label>
                    <input type="text" id="prof-jenjang" class="input-box" value="${escapeHtml(jenjang)}" disabled />
                  </div>
                  <div class="prof-field">
                    <label class="booking-sublabel" for="prof-sekolah">Asal Sekolah</label>
                    <input type="text" id="prof-sekolah" class="input-box" value="${escapeHtml(asalSekolah)}" placeholder="Contoh: SMAN 1 Nusantara" required />
                  </div>
                </div>
                <div class="${jenjang === "SMP" ? "prof-field" : "prof-two-col"}">
                  <div class="prof-field">
                    <label class="booking-sublabel" for="prof-kelas">Tingkat &amp; Kelas</label>
                    <input type="text" id="prof-kelas" class="input-box" value="${escapeHtml(kelas)}" placeholder="${escapeHtml(kelasPlaceholder)}" required />
                  </div>
                  ${jurusanFieldHtml}
                </div>
              `
            }

            <div class="prof-form-actions">
              <button type="submit" id="btn-save-profile" class="btn-pill btn-blue">Simpan Perubahan</button>
            </div>
          </form>
        </section>

        <!-- Kartu 3: Keamanan Akun & Preferensi -->
        <section class="card-box prof-card">
          <h3 class="prof-section-title">Keamanan Akun &amp; Preferensi</h3>

          <div class="theme-section prof-theme-box">
            <span class="theme-section-label">Tampilan Aplikasi</span>
            <div class="theme-toggle-group" role="group" aria-label="Pilih Tema">
              <button type="button" class="theme-option-btn ${currentTheme === "light" ? "active" : ""}" onclick="setAppTheme('light')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                <span>Light Mode</span>
              </button>
              <button type="button" class="theme-option-btn ${currentTheme === "dark" ? "active" : ""}" onclick="setAppTheme('dark')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          <div class="prof-pref-list">
            <button type="button" class="prof-pref-btn" id="btn-open-change-password">
              <div>
                <strong>Ubah Kata Sandi</strong>
                <small>Perbarui kata sandi akun untuk menjaga keamanan akses.</small>
              </div>
              <span>Ubah &rarr;</span>
            </button>

            <button type="button" class="prof-pref-btn" id="btn-open-privacy-info">
              <div>
                <strong>Privasi &amp; Kerahasiaan</strong>
                <small>Pelajari bagaimana RuangBK melindungi data dan identitasmu.</small>
              </div>
              <span>Lihat &rarr;</span>
            </button>
          </div>
        </section>

        <!-- Kartu 4: Keluar (Logout) -->
        <section class="card-box prof-card prof-logout-card">
          <button type="button" class="btn-pill prof-logout-btn" onclick="handleLogout()">Keluar dari Akun</button>
        </section>
      </div>
    `;

    const appScreen = document.getElementById("app-screen");
    if (isCounselor && typeof global.renderCounselorShell === "function") {
      appScreen.innerHTML = global.renderCounselorShell("profile", profileHtml);
    } else if (typeof global.renderStudentShell === "function") {
      appScreen.innerHTML = global.renderStudentShell("profile", profileHtml);
    } else {
      appScreen.innerHTML = `<div class="app-page">${profileHtml}</div>`;
    }

    document.getElementById("btn-open-change-password").addEventListener("click", openChangePasswordModal);
    document.getElementById("btn-open-privacy-info").addEventListener("click", openPrivacyInfoModal);

    document.getElementById("profile-edit-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const saveBtn = document.getElementById("btn-save-profile");
      const nama = document.getElementById("prof-nama").value.trim();
      const asalSekolahVal = document.getElementById("prof-sekolah").value.trim();

      if (!nama || !asalSekolahVal) {
        showToast("Nama dan asal sekolah wajib diisi.");
        return;
      }

      const payload = isCounselor
        ? {
            nama: nama,
            asalSekolah: asalSekolahVal,
            ruangDefault: (document.getElementById("prof-ruang").value || "").trim()
          }
        : {
            nama: nama,
            asalSekolah: asalSekolahVal,
            kelas: (document.getElementById("prof-kelas").value || "").trim(),
            jurusan: jenjang === "SMP" ? "" : ((document.getElementById("prof-jurusan") && document.getElementById("prof-jurusan").value) || "").trim()
          };

      saveBtn.disabled = true;
      saveBtn.textContent = "Menyimpan...";

      try {
        const updatedSession = await global.RuangBKStorage.updateUserProfile(user.uid, payload);
        showToast("Profil berhasil diperbarui");
        renderProfileScreen(updatedSession);
      } catch (err) {
        showToast((err && err.message) || "Gagal memperbarui profil.");
        saveBtn.disabled = false;
        saveBtn.textContent = "Simpan Perubahan";
      }
    });
  }

  function renderQuickProfileScreen(session) {
    renderProfileScreen(session);
  }

  function openModal(contentHtml) {
    const overlay = document.getElementById("modal-overlay");
    if (!overlay) {
      throw new Error("Elemen #modal-overlay tidak ditemukan.");
    }
    overlay.innerHTML = `<div class="modal-dialog">${contentHtml}</div>`;
    overlay.classList.add("open");
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (!overlay) {
      throw new Error("Elemen #modal-overlay tidak ditemukan.");
    }
    overlay.classList.remove("open");
    overlay.innerHTML = "";
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) {
      throw new Error("Elemen #toast-container tidak ditemukan.");
    }
    global.clearTimeout(toastTimer);
    container.textContent = "";
    const toast = document.createElement("div");
    toast.className = "toast-pill";
    toast.textContent = message;
    container.appendChild(toast);
    toastTimer = global.setTimeout(function () {
      container.textContent = "";
    }, 2400);
  }

  async function handleLogout() {
    try {
      if (global.RuangBKFirebase && global.RuangBKFirebase.auth) {
        await global.RuangBKFirebase.auth.signOut();
      }
    } catch (err) {
      console.warn("[Auth] SignOut error:", err && err.message);
    }
    global.RuangBKStorage.clearSession();
    showToast("Anda telah keluar.");
    navigateTo("login");
  }

  function refreshActiveScreenOnSync() {
    if (currentScreen === "student-dashboard" && typeof global.renderStudentDashboard === "function") {
      global.renderStudentDashboard();
    } else if (currentScreen === "student-edukasi" && typeof global.renderStudentEdukasi === "function") {
      global.renderStudentEdukasi();
    } else if (currentScreen === "student-history" && typeof global.renderStudentHistory === "function") {
      global.renderStudentHistory();
    } else if (currentScreen === "student-safespace" && typeof global.renderSafeSpace === "function") {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.id === "safespace-story-input" || activeEl.id === "safespace-comment-input");
      if (!isTyping) {
        global.renderSafeSpace();
      }
    } else if (currentScreen === "counselor-dashboard" && typeof global.renderCounselorDashboard === "function") {
      global.renderCounselorDashboard();
    } else if (currentScreen === "counselor-schedule" && typeof global.renderCounselorSchedule === "function") {
      global.renderCounselorSchedule();
    } else if (currentScreen === "counselor-materials" && typeof global.renderCounselorMaterials === "function") {
      global.renderCounselorMaterials();
    } else if (currentScreen === "counselor-moderation" && typeof global.renderCounselorModeration === "function") {
      global.renderCounselorModeration();
    }
  }

  function initApp() {
    if (initialized) return;
    initialized = true;
    applyTheme(getTheme());
    global.RuangBKStorage.init();

    const auth = global.RuangBKFirebase && global.RuangBKFirebase.auth;
    if (auth) {
      auth.onAuthStateChanged(async function (firebaseUser) {
        if (firebaseUser) {
          global.RuangBKStorage.syncFromFirebase(refreshActiveScreenOnSync);
          global.RuangBKStorage.seedInitialDataIfEmpty();

          let session = global.RuangBKStorage.getSession();
          if (!session || session.uid !== firebaseUser.uid) {
            try {
              const profile = await global.RuangBKStorage.getUser(firebaseUser.uid);
              session = typeof global.buildSessionFromProfile === "function"
                ? global.buildSessionFromProfile(firebaseUser.uid, firebaseUser.email, profile)
                : {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  nama: (profile && profile.nama) || firebaseUser.email || "Pengguna",
                  role: (profile && profile.role) || "siswa",
                  jenjang: (profile && profile.jenjang) || "SMA",
                  sekolahKelas: (profile && profile.sekolahKelas) || "Siswa",
                  detail: (profile && profile.sekolahKelas) || "Siswa"
                };
              global.RuangBKStorage.setSession(session);
            } catch (err) {
              console.warn("[Auth] Gagal memuat profil user:", err && err.message);
            }
          }

          if (currentScreen === "login" || currentScreen === "register") {
            const target = session && (session.role === "guru_bk" || session.role === "counselor")
              ? "counselor-dashboard"
              : "student-dashboard";
            navigateTo(target);
          }
        } else {
          global.RuangBKStorage.clearSession();
          if (currentScreen !== "register") {
            navigateTo("login");
          }
        }
      });
    } else {
      const session = global.RuangBKStorage.getSession();
      if (session) {
        navigateTo(session.role === "guru_bk" || session.role === "counselor" ? "counselor-dashboard" : "student-dashboard");
      } else {
        navigateTo("login");
      }
    }
  }

  global.navigateTo = navigateTo;
  global.showToast = showToast;
  global.openModal = openModal;
  global.closeModal = closeModal;
  global.setAppTheme = setAppTheme;
  global.handleLogout = handleLogout;

  document.addEventListener("deviceready", initApp, false);
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
}(window));
