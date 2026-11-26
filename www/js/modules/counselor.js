// ==========================================
// COUNSELOR SPACE MODULE (F-10 s.d. F-13)
// ==========================================
(function (global) {
  "use strict";

  let activeConsultFilter = "Semua";
  let showAllDashboardConsults = false;
  let activeModerationTab = "Laporan Baru";

  const REJECT_PRESETS = [
    "Jadwal Guru BK bentrok dengan rapat sekolah",
    "Kuota konseling pada jam tersebut sudah penuh",
    "Silakan pilih slot waktu lain yang tersedia"
  ];

  const MATERIAL_CATEGORIES = [
    "Karir & Belajar",
    "Panduan BK",
    "Kesehatan Mental",
    "Pengembangan Diri"
  ];

  function escapeText(value) {
    return String(value || "").replace(/[&<>"']/g, function (ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch];
    });
  }

  function formatDateId(timestamp) {
    if (!timestamp) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(new Date(Number(timestamp)));
    } catch (_) {
      return "-";
    }
  }

  function getSession() {
    return (global.RuangBKStorage && global.RuangBKStorage.getSession()) || {
      uid: "guru-bk-local",
      nama: "Ibu Ratna Sari, S.Pd",
      role: "guru_bk",
      detail: "Guru BK • SMAN 1"
    };
  }

  function iconSvg(name, size = 18, filled = false) {
    const paths = {
      home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22v-8h6v8"/>',
      calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      shieldHeart: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 14.5s-3-1.9-3-3.9a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2-3 3.9-3 3.9z"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      cap: '<path d="m2 10 10-5 10 5-10 5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
      clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
      mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      chevronRight: '<polyline points="9 18 15 12 9 6"/>',
      arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      layoutGrid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
      activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      shieldSolid: '<path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      barChart: '<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8" rx="1"/><rect x="12" y="6" width="3" height="12" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/>',
      megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
      chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="${filled ? "none" : "currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  function renderCounselorShell(activeRoute, mainHtml, extraShellClass) {
    return `
      <div class="student-shell ${extraShellClass || ""}">
        <aside class="student-sidebar" aria-label="Menu Guru BK">
          <div class="sidebar-waves" aria-hidden="true">
            <svg viewBox="0 0 280 240" preserveAspectRatio="none">
              <path d="M0 110C70 70 150 150 280 95V240H0V110Z" fill="rgba(59, 130, 246, 0.25)"/>
              <path d="M0 155C95 120 185 190 280 140V240H0V155Z" fill="rgba(96, 165, 250, 0.18)"/>
            </svg>
          </div>

          <a class="student-brand" href="#" onclick="event.preventDefault(); navigateTo('counselor-dashboard');">
            <img src="./assets/images/logo.png" class="student-brand-logo" alt="Logo RuangBK" />
            <span>RuangBK</span>
          </a>

          <nav class="student-menu">
            <button type="button" class="${activeRoute === "counselor-dashboard" ? "active" : ""}" onclick="navigateTo('counselor-dashboard')">${iconSvg("home")}<span>Beranda</span></button>
            <button type="button" class="${activeRoute === "counselor-schedule" ? "active" : ""}" onclick="navigateTo('counselor-schedule')">${iconSvg("calendar")}<span>Kelola Jadwal</span></button>
            <button type="button" class="${activeRoute === "counselor-materials" ? "active" : ""}" onclick="navigateTo('counselor-materials')">${iconSvg("book")}<span>Materi Edukasi</span></button>
            <button type="button" class="${activeRoute === "counselor-moderation" ? "active" : ""}" onclick="navigateTo('counselor-moderation')">${iconSvg("shield")}<span>Moderasi Safe Space</span></button>
            <button type="button" class="${activeRoute === "profile" ? "active" : ""}" onclick="navigateTo('profile')">${iconSvg("user")}<span>Profil Saya</span></button>
          </nav>

          <div class="student-side-note">
            <img src="./assets/images/logo.png" class="student-side-note-logo" alt="RuangBK" />
            <p>
              <b>Counselor Space</b>
              <small>Mendampingi siswa dengan empati</small>
            </p>
          </div>
        </aside>

        <main class="student-main">
          ${mainHtml}
        </main>
      </div>
    `;
  }

  // ==========================================
  // F-10: DASHBOARD GURU BK & KELOLA PERMOHONAN
  // ==========================================
  function formatRelativeTime(timestamp) {
    if (!timestamp) return "Baru saja";
    const diffMin = Math.floor((Date.now() - Number(timestamp)) / 60000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return diffMin + " menit lalu";
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return diffHour + " jam lalu";
    return formatDateId(timestamp);
  }

  function buildCounselorActivities(consultations, reports, materials, stories) {
    const events = [];
    consultations.forEach(function (c) {
      events.push({
        createdAt: Number(c.createdAt) || 0,
        iconBg: c.status === "disetujui" ? "cns-act-green" : "cns-act-blue",
        icon: "calendar",
        title: c.status === "disetujui"
          ? `Jadwal disetujui: ${c.namaSiswa || "Siswa"}`
          : `Pengajuan baru: ${c.namaSiswa || "Siswa"}`,
        time: formatRelativeTime(c.createdAt)
      });
    });
    reports.forEach(function (r) {
      events.push({
        createdAt: Number(r.createdAt) || 0,
        iconBg: "cns-act-pink",
        icon: "shield",
        title: `Laporan moderasi ${r.status === "baru" ? "baru" : "diperbarui"}`,
        time: formatRelativeTime(r.createdAt)
      });
    });
    materials.forEach(function (m) {
      events.push({
        createdAt: Number(m.createdAt) || 0,
        iconBg: "cns-act-purple",
        icon: "book",
        title: `Materi: ${m.judul || "Artikel BK"}`,
        time: formatRelativeTime(m.createdAt)
      });
    });
    stories.forEach(function (s) {
      if (s.status === "tampil") {
        events.push({
          createdAt: Number(s.createdAt) || 0,
          iconBg: "cns-act-amber",
          icon: "chat",
          title: `Cerita baru di Safe Space (${s.alias || "Anonim"})`,
          time: formatRelativeTime(s.createdAt)
        });
      }
    });
    return events
      .sort(function (a, b) { return b.createdAt - a.createdAt; })
      .slice(0, 4);
  }

  function openConsultationDetailModal(item) {
    if (!item || !global.openModal) return;
    const st = (item.status || "menunggu").toLowerCase();
    const rejectText = item.alasanPenolakan || item.rejectReason || "";
    const statusLabel = st === "disetujui" ? "Terjadwal" : st === "menunggu" ? "Menunggu" : st === "selesai" ? "Selesai" : "Ditolak";

    global.openModal(`
      <div class="report-modal-body">
        <div class="report-modal-head">
          <h3>Detail Sesi Konseling</h3>
          <p>${escapeText(item.namaSiswa || "Siswa")} • Status: <strong>${statusLabel}</strong></p>
        </div>
        <div class="cns-modal-detail-box">
          <div><span>Topik</span><strong>${escapeText(item.topik || "Konseling")}</strong></div>
          <div><span>Tanggal</span><strong>${escapeText(item.tanggal || "-")}</strong></div>
          <div><span>Jam</span><strong>${escapeText(item.jam || "-")} WIB</strong></div>
          <div><span>Tempat</span><strong>${escapeText(item.tempat || "Ruang BK")}</strong></div>
          ${item.catatan ? `<div><span>Catatan Siswa</span><strong>${escapeText(item.catatan)}</strong></div>` : ""}
          ${rejectText ? `<div><span>Alasan Penolakan</span><strong>${escapeText(rejectText)}</strong></div>` : ""}
        </div>
        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Tutup</button>
          ${st === "menunggu"
            ? `<button type="button" class="btn-pill btn-blue" id="modal-detail-approve">Setujui</button>`
            : ""
          }
          ${st === "disetujui"
            ? `<button type="button" class="btn-pill btn-blue" id="modal-detail-complete">Tandai Selesai</button>`
            : ""
          }
        </div>
      </div>
    `);

    const approveBtn = document.getElementById("modal-detail-approve");
    if (approveBtn) {
      approveBtn.addEventListener("click", async function () {
        await global.RuangBKStorage.updateConsultationStatus(item.id, "disetujui");
        global.closeModal();
        if (global.showToast) global.showToast("Permohonan konseling disetujui.");
        renderCounselorDashboard();
      });
    }
    const completeBtn = document.getElementById("modal-detail-complete");
    if (completeBtn) {
      completeBtn.addEventListener("click", async function () {
        await global.RuangBKStorage.updateConsultationStatus(item.id, "selesai");
        global.closeModal();
        if (global.showToast) global.showToast("Sesi konseling ditandai selesai.");
        renderCounselorDashboard();
      });
    }
  }

  function renderCounselorDashboard() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const session = getSession();
    const displayName = session.nama || session.name || "Ibu Ratna Sari, S.Pd";
    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) { return part[0]; })
      .join("")
      .toUpperCase() || "BK";

    const consultations = global.RuangBKStorage.getConsultations();
    const reports = global.RuangBKStorage.getReports();
    const materials = global.RuangBKStorage.getMaterials();
    const stories = global.RuangBKStorage.getStories();

    const pendingCount = consultations.filter(function (c) { return c.status === "menunggu"; }).length;
    const approvedCount = consultations.filter(function (c) { return c.status === "disetujui"; }).length;
    const newReportCount = reports.filter(function (r) { return (r.status || "baru") === "baru"; }).length;
    const activities = buildCounselorActivities(consultations, reports, materials, stories);

    const now = new Date();
    const todayDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(now);
    const todayDay = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(now);

    const filters = ["Semua", "Menunggu", "Disetujui", "Selesai", "Ditolak"];
    const filteredConsults = activeConsultFilter === "Semua"
      ? consultations
      : consultations.filter(function (c) {
          return (c.status || "").toLowerCase() === activeConsultFilter.toLowerCase();
        });
    const visibleConsults = showAllDashboardConsults
      ? filteredConsults
      : filteredConsults.slice(0, 4);
    const hasMoreConsults = filteredConsults.length > 4;

    const statusBadge = function (status) {
      const st = (status || "menunggu").toLowerCase();
      const map = {
        menunggu: { cls: "cns-badge-amber", label: "Menunggu" },
        disetujui: { cls: "cns-badge-green", label: "Terjadwal" },
        ditolak: { cls: "cns-badge-red", label: "Ditolak" },
        selesai: { cls: "cns-badge-blue", label: "Selesai" }
      };
      const cfg = map[st] || map.menunggu;
      return `<span class="cns-session-badge ${cfg.cls}">${cfg.label}</span>`;
    };

    const html = `
      <div class="cns-dash-container">
        <!-- HEADER DASHBOARD -->
        <header class="cns-header">
          <div class="cns-header-left">
            <h1>Halo, ${escapeText(displayName)} &#128075;</h1>
            <p>Kelola permohonan konsultasi siswa, jadwal pertemuan, materi edukasi, dan moderasi Safe Space.</p>
          </div>
          <div class="cns-header-right">
            <span class="cns-role-pill">Counselor Space</span>
            <button type="button" class="cns-icon-circle" id="counselor-bell-btn" aria-label="Notifikasi">
              ${iconSvg("bell", 19)}
              ${(pendingCount + newReportCount) > 0 ? '<span class="cns-bell-dot"></span>' : ""}
            </button>
            <button type="button" class="cns-avatar-circle" onclick="navigateTo('profile')" aria-label="Profil Guru BK">
              ${escapeText(initials)}
            </button>
          </div>
        </header>

        <!-- GRID UTAMA 2 KOLOM + PENGUMUMAN FULL-WIDTH -->
        <div class="cns-layout-grid">
          <!-- KOLOM KIRI -->
          <div class="cns-left-col">
            <!-- 3 KARTU KPI -->
            <section class="cns-kpi-row" aria-label="Statistik Utama">
              <article class="cns-stat-card cns-stat-clickable" onclick="document.getElementById('counselor-requests-section')?.scrollIntoView({behavior:'smooth'})">
                <div class="cns-stat-icon cns-icon-blue">${iconSvg("users", 21)}</div>
                <div class="cns-stat-copy">
                  <span class="cns-stat-label">Pengajuan Baru</span>
                  <strong class="cns-stat-value">${pendingCount}</strong>
                  <small class="cns-stat-sub">Menunggu persetujuan</small>
                </div>
                <span class="cns-stat-chevron">${iconSvg("chevronRight", 16)}</span>
              </article>

              <article class="cns-stat-card cns-stat-clickable" onclick="navigateTo('counselor-schedule')">
                <div class="cns-stat-icon cns-icon-green">${iconSvg("checkCircle", 21)}</div>
                <div class="cns-stat-copy">
                  <span class="cns-stat-label">Jadwal Aktif</span>
                  <strong class="cns-stat-value">${approvedCount}</strong>
                  <small class="cns-stat-sub">Sesi disetujui</small>
                </div>
                <span class="cns-stat-chevron">${iconSvg("chevronRight", 16)}</span>
              </article>

              <article class="cns-stat-card cns-stat-clickable" onclick="navigateTo('counselor-moderation')">
                <div class="cns-stat-icon cns-icon-pink">${iconSvg("barChart", 21)}</div>
                <div class="cns-stat-copy">
                  <span class="cns-stat-label">Laporan Moderasi</span>
                  <strong class="cns-stat-value">${newReportCount}</strong>
                  <small class="cns-stat-sub">Perlu ditinjau</small>
                </div>
                <span class="cns-stat-chevron">${iconSvg("chevronRight", 16)}</span>
              </article>
            </section>

            <!-- HERO BANNER BIRU (SELEBAR KOLOM KIRI) -->
            <section class="cns-hero-banner">
              <div class="cns-hero-left">
                <h2>Dukung Siswa,<br>Bangun Lingkungan Sekolah<br>yang Lebih Sehat</h2>
                <p>Bersama RuangBK, konseling jadi lebih mudah dan terstruktur.</p>
                <button type="button" class="cns-hero-btn" onclick="navigateTo('counselor-materials')">
                  <span>Lihat Panduan</span>
                  ${iconSvg("arrowRight", 16)}
                </button>
              </div>
              <img src="./assets/images/Friendly%20Academic%20Advising%20Session.png" class="cns-hero-illustration" alt="Ilustrasi Konselor dan Siswa" />
            </section>

            <!-- KONSELING MENDATANG -->
            <article class="cns-panel-card cns-upcoming-card" id="counselor-requests-section">
              <div class="cns-panel-head">
                <h2>Konseling Mendatang</h2>
                <button type="button" class="cns-link-btn" id="toggle-all-consults-btn">
                  ${showAllDashboardConsults ? "Tampilkan Ringkas" : "Lihat Semua"}
                </button>
              </div>

              <div class="cns-filter-row" role="tablist">
                ${filters.map(function (f) {
                  return `<button type="button" class="cns-filter-chip ${activeConsultFilter === f ? "active" : ""}" data-cns-filter="${f}">${f}</button>`;
                }).join("")}
              </div>

              ${visibleConsults.length > 0
                ? `<div class="cns-session-list">
                    ${visibleConsults.map(function (item) {
                      const st = (item.status || "menunggu").toLowerCase();
                      const studentName = item.namaSiswa || "Siswa";
                      const studentInitial = studentName.split(" ").filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase() || "S";
                      const rejectText = item.alasanPenolakan || item.rejectReason || "";
                      return `
                        <div class="cns-session-row">
                          <div class="cns-session-col-student">
                            <div class="cns-student-avatar">${escapeText(studentInitial)}</div>
                            <div class="cns-session-name-wrap">
                              <strong>${escapeText(studentName)}</strong>
                              ${st === "ditolak" && rejectText
                                ? `<small class="cns-reject-note">Alasan: ${escapeText(rejectText)}</small>`
                                : ""
                              }
                            </div>
                          </div>

                          <div class="cns-session-col-topic">${escapeText(item.topik || "Konseling")}</div>

                          <div class="cns-session-col-time">
                            <span>${iconSvg("calendar", 13)} ${escapeText(item.tanggal || "-")}</span>
                            <span>${iconSvg("clock", 13)} ${escapeText(item.jam || "-")} WIB</span>
                          </div>

                          <div class="cns-session-col-actions">
                            ${statusBadge(st)}
                            ${st === "menunggu"
                              ? `<button type="button" class="cns-act-btn cns-act-approve" data-approve-cns="${escapeText(item.id)}">Setujui</button>
                                 <button type="button" class="cns-act-btn cns-act-reject" data-reject-cns="${escapeText(item.id)}">Tolak</button>`
                              : ""
                            }
                            ${st === "disetujui"
                              ? `<button type="button" class="cns-act-btn cns-act-done" data-complete-cns="${escapeText(item.id)}">Selesai</button>`
                              : ""
                            }
                            <button type="button" class="cns-arrow-btn" data-detail-cns="${escapeText(item.id)}" aria-label="Lihat detail sesi">
                              ${iconSvg("chevronRight", 16)}
                            </button>
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>`
                : `<div class="cns-empty-state">
                    <div class="cns-empty-icon">${iconSvg("calendar", 28)}</div>
                    <h3>Belum Ada Jadwal Konseling</h3>
                    <p>Permohonan konseling baru dari siswa akan tampil di sini secara real-time.</p>
                  </div>`
              }
              ${hasMoreConsults && !showAllDashboardConsults
                ? `<div class="cns-more-hint">Menampilkan 4 dari ${filteredConsults.length} sesi. Klik "Lihat Semua" untuk daftar lengkap.</div>`
                : ""
              }
            </article>
          </div>

          <!-- KOLOM KANAN -->
          <aside class="cns-right-col">
            <!-- KPI KE-4: HARI INI -->
            <article class="cns-stat-card cns-today-card">
              <div class="cns-stat-icon cns-icon-cyan">${iconSvg("calendar", 21)}</div>
              <div class="cns-stat-copy">
                <span class="cns-stat-label">Hari Ini</span>
                <strong class="cns-stat-value">${escapeText(todayDate)}</strong>
              </div>
              <span class="cns-day-badge">${escapeText(todayDay)}</span>
            </article>

            <!-- AKTIVITAS TERBARU -->
            <article class="cns-panel-card cns-activity-card">
              <div class="cns-panel-head">
                <h2>Aktivitas Terbaru</h2>
                <button type="button" class="cns-link-btn" onclick="navigateTo('counselor-moderation')">Lihat Semua</button>
              </div>
              <div class="cns-activity-list">
                ${activities.length > 0
                  ? activities.map(function (act) {
                      return `
                        <div class="cns-activity-item">
                          <span class="cns-act-icon ${act.iconBg}">${iconSvg(act.icon, 16)}</span>
                          <div class="cns-act-copy">
                            <p>${escapeText(act.title)}</p>
                            <small>${escapeText(act.sub || "RuangBK")}</small>
                          </div>
                          <span class="cns-act-time">${escapeText(act.time)}</span>
                        </div>
                      `;
                    }).join("")
                  : `<p class="cns-muted-text">Belum ada aktivitas terbaru.</p>`
                }
              </div>
            </article>

            <!-- AKSES CEPAT (2x2 HORIZONTAL) -->
            <article class="cns-panel-card cns-quick-card">
              <div class="cns-panel-head">
                <h2>Akses Cepat</h2>
              </div>
              <div class="cns-quick-grid">
                <button type="button" class="cns-quick-tile" onclick="navigateTo('counselor-schedule')">
                  <span class="cns-quick-icon cns-icon-blue">${iconSvg("calendar", 20)}</span>
                  <strong>Atur Jadwal</strong>
                </button>
                <button type="button" class="cns-quick-tile" onclick="navigateTo('counselor-materials')">
                  <span class="cns-quick-icon cns-icon-green">${iconSvg("book", 20)}</span>
                  <strong>Kelola Materi</strong>
                </button>
                <button type="button" class="cns-quick-tile" onclick="navigateTo('counselor-moderation')">
                  <span class="cns-quick-icon cns-icon-purple">${iconSvg("shield", 20)}</span>
                  <strong>Moderasi Safe Space</strong>
                </button>
                <button type="button" class="cns-quick-tile" id="cns-quick-reports">
                  <span class="cns-quick-icon cns-icon-pink">${iconSvg("barChart", 20)}</span>
                  <strong>Lihat Laporan</strong>
                </button>
              </div>
            </article>
          </aside>

          <!-- BANNER PENGUMUMAN FULL-WIDTH -->
          <section class="cns-announcement-banner" aria-label="Pengumuman">
            <div class="cns-announce-left">
              <span class="cns-announce-icon">${iconSvg("megaphone", 22)}</span>
              <div>
                <h3>Pengumuman</h3>
                <p>Jadwal layanan konseling minggu ini telah diperbarui. Silakan cek jadwal terbaru di menu Atur Jadwal.</p>
              </div>
            </div>
            <button type="button" class="cns-announce-btn" onclick="navigateTo('counselor-schedule')">
              <span>Cek Jadwal</span>
              ${iconSvg("arrowRight", 15)}
            </button>
          </section>
        </div>
      </div>
    `;

    appScreen.innerHTML = renderCounselorShell("counselor-dashboard", html);

    const bellBtn = document.getElementById("counselor-bell-btn");
    if (bellBtn && global.showToast) {
      bellBtn.addEventListener("click", function () {
        global.showToast(`${pendingCount} pengajuan menunggu, ${approvedCount} jadwal aktif, ${newReportCount} laporan baru.`);
      });
    }

    const quickReportsBtn = document.getElementById("cns-quick-reports");
    if (quickReportsBtn) {
      quickReportsBtn.addEventListener("click", function () {
        activeModerationTab = "Laporan Baru";
        global.navigateTo("counselor-moderation");
      });
    }

    const toggleAllBtn = document.getElementById("toggle-all-consults-btn");
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", function () {
        showAllDashboardConsults = !showAllDashboardConsults;
        renderCounselorDashboard();
      });
    }

    document.querySelectorAll("[data-detail-cns]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-detail-cns");
        const target = consultations.find(function (c) { return c.id === id; });
        if (target) openConsultationDetailModal(target);
      });
    });

    document.querySelectorAll("[data-cns-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeConsultFilter = btn.getAttribute("data-cns-filter") || "Semua";
        renderCounselorDashboard();
      });
    });

    // Setujui permohonan
    document.querySelectorAll("[data-approve-cns]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-approve-cns");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Setujui Permohonan Konseling?</h3>
            <p>Status pengajuan akan berubah menjadi <strong>Disetujui</strong> dan langsung terlihat oleh siswa.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-blue" id="confirm-approve-btn">Ya, Setujui</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-approve-btn").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.updateConsultationStatus(id, "disetujui");
            global.closeModal();
            if (global.showToast) global.showToast("Permohonan konseling disetujui.");
            renderCounselorDashboard();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal memperbarui status.");
          }
        });
      });
    });

    // Tolak permohonan
    document.querySelectorAll("[data-reject-cns]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-reject-cns");
        let chosenPreset = REJECT_PRESETS[0];

        global.openModal(`
          <form id="reject-cns-form" class="report-modal-body">
            <div class="report-modal-head">
              <h3>Tolak Permohonan Konseling</h3>
              <p>Pilih atau tulis alasan penolakan agar siswa dapat mengajukan waktu lain.</p>
            </div>
            <div class="report-reason-grid" style="grid-template-columns:1fr;">
              ${REJECT_PRESETS.map(function (r, idx) {
                return `<button type="button" class="report-reason-chip ${idx === 0 ? "active" : ""}" data-reject-preset="${escapeText(r)}">${escapeText(r)}</button>`;
              }).join("")}
            </div>
            <div>
              <label class="booking-sublabel" for="reject-custom-reason">Atau tulis alasan khusus</label>
              <textarea id="reject-custom-reason" class="input-box booking-textarea" rows="2" placeholder="Opsional jika ingin menyesuaikan pesan..."></textarea>
            </div>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="submit" class="btn-pill btn-danger">Tolak Permohonan</button>
            </div>
          </form>
        `);

        document.querySelectorAll("[data-reject-preset]").forEach(function (chip) {
          chip.addEventListener("click", function () {
            chosenPreset = chip.getAttribute("data-reject-preset") || REJECT_PRESETS[0];
            document.querySelectorAll("[data-reject-preset]").forEach(function (c) {
              c.classList.toggle("active", c === chip);
            });
          });
        });

        document.getElementById("reject-cns-form").addEventListener("submit", async function (e) {
          e.preventDefault();
          const custom = (document.getElementById("reject-custom-reason").value || "").trim();
          const alasan = custom || chosenPreset;
          try {
            await global.RuangBKStorage.updateConsultationStatus(id, "ditolak", {
              alasanPenolakan: alasan,
              rejectReason: alasan
            });
            global.closeModal();
            if (global.showToast) global.showToast("Permohonan konseling ditolak.");
            renderCounselorDashboard();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menolak permohonan.");
          }
        });
      });
    });

    // Tandai Selesai
    document.querySelectorAll("[data-complete-cns]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-complete-cns");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Tandai Sesi Selesai?</h3>
            <p>Konsultasi ini akan ditandai sebagai <strong>Selesai</strong> pada riwayat siswa.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-blue" id="confirm-complete-btn">Ya, Tandai Selesai</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-complete-btn").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.updateConsultationStatus(id, "selesai");
            global.closeModal();
            if (global.showToast) global.showToast("Sesi konseling ditandai selesai.");
            renderCounselorDashboard();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal memperbarui status.");
          }
        });
      });
    });
  }

  // ==========================================
  // F-11: ATUR JADWAL PERTEMUAN (CRUD SCHEDULES)
  // ==========================================
  function openScheduleModal(existing) {
    const isEdit = Boolean(existing);
    const todayIso = new Date().toISOString().split("T")[0];
    const session = getSession();

    global.openModal(`
      <form id="schedule-crud-form" class="report-modal-body">
        <div class="report-modal-head">
          <h3>${isEdit ? "Edit Slot Jadwal" : "Tambah Slot Jadwal"}</h3>
          <p>Slot yang berstatus Tersedia akan muncul di halaman Ajukan Konseling siswa.</p>
        </div>

        <div>
          <label class="booking-sublabel" for="sch-tanggal">Tanggal</label>
          <input type="date" id="sch-tanggal" class="input-box" value="${escapeText(isEdit ? existing.tanggal : todayIso)}" required />
        </div>

        <div class="booking-fallback-grid">
          <div>
            <label class="booking-sublabel" for="sch-mulai">Jam Mulai</label>
            <input type="time" id="sch-mulai" class="input-box" value="${escapeText(isEdit ? existing.jamMulai : "09:00")}" required />
          </div>
          <div>
            <label class="booking-sublabel" for="sch-selesai">Jam Selesai</label>
            <input type="time" id="sch-selesai" class="input-box" value="${escapeText(isEdit ? existing.jamSelesai : "09:45")}" required />
          </div>
        </div>

        <div>
          <label class="booking-sublabel" for="sch-tempat">Tempat Pertemuan</label>
          <input type="text" id="sch-tempat" class="input-box" value="${escapeText(isEdit ? existing.tempat : (session.ruangDefault || "Ruang BK 1 (Tatap Muka)"))}" placeholder="Contoh: Ruang BK 1" required />
        </div>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
          <button type="submit" id="btn-save-schedule" class="btn-pill btn-blue">${isEdit ? "Simpan Perubahan" : "Simpan Jadwal"}</button>
        </div>
      </form>
    `);

    document.getElementById("schedule-crud-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const btn = document.getElementById("btn-save-schedule");
      const payload = {
        tanggal: document.getElementById("sch-tanggal").value,
        jamMulai: document.getElementById("sch-mulai").value,
        jamSelesai: document.getElementById("sch-selesai").value,
        tempat: document.getElementById("sch-tempat").value.trim() || "Ruang BK",
        guruUid: session.uid || "guru-bk"
      };

      btn.disabled = true;
      btn.textContent = "Menyimpan...";

      try {
        if (isEdit) {
          await global.RuangBKStorage.updateSchedule(existing.id, payload);
          if (global.showToast) global.showToast("Slot jadwal diperbarui.");
        } else {
          payload.tersedia = true;
          await global.RuangBKStorage.createSchedule(payload);
          if (global.showToast) global.showToast("Slot jadwal baru ditambahkan.");
        }
        global.closeModal();
        renderCounselorSchedule();
      } catch (_) {
        if (global.showToast) global.showToast("Gagal menyimpan jadwal.");
        btn.disabled = false;
        btn.textContent = isEdit ? "Simpan Perubahan" : "Simpan Jadwal";
      }
    });
  }

  function renderCounselorSchedule() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const schedules = global.RuangBKStorage.getSchedules();

    const html = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Kelola Jadwal Pertemuan</h1>
            <p>Atur slot waktu dan tempat konseling yang dapat dipilih oleh siswa.</p>
          </div>
          <button type="button" class="btn-pill btn-blue subpage-cta-btn" id="btn-add-schedule">
            + Tambah Slot Jadwal
          </button>
        </header>

        ${schedules.length > 0
          ? `<div class="counselor-grid-list">
              ${schedules.map(function (sch) {
                const avail = sch.tersedia !== false;
                return `
                  <article class="history-card">
                    <div class="history-card-top">
                      <span class="history-status-badge ${avail ? "status-green" : "status-amber"}">${avail ? "Tersedia" : "Penuh"}</span>
                      <button type="button" class="safespace-icon-btn" data-toggle-sch="${escapeText(sch.id)}">
                        ${avail ? "Tandai Penuh" : "Buka Slot"}
                      </button>
                    </div>
                    <h3 class="history-topic">${escapeText(sch.tanggal)}</h3>
                    <div class="history-meta-grid">
                      <span>${iconSvg("clock")} ${escapeText(sch.jamMulai)} - ${escapeText(sch.jamSelesai)} WIB</span>
                      <span>${iconSvg("mapPin")} ${escapeText(sch.tempat)}</span>
                    </div>
                    <div class="counselor-card-actions">
                      <button type="button" class="safespace-icon-btn" data-edit-sch="${escapeText(sch.id)}">${iconSvg("edit")} Edit</button>
                      <button type="button" class="safespace-icon-btn danger" data-del-sch="${escapeText(sch.id)}">${iconSvg("trash")} Hapus</button>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>`
          : `<div class="subpage-empty-card">
              <p>Belum ada slot jadwal yang dibuat.</p>
            </div>`
        }
      </div>
    `;

    appScreen.innerHTML = renderCounselorShell("counselor-schedule", html);

    document.getElementById("btn-add-schedule").addEventListener("click", function () {
      openScheduleModal(null);
    });

    document.querySelectorAll("[data-toggle-sch]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const id = btn.getAttribute("data-toggle-sch");
        const target = schedules.find(function (s) { return s.id === id; });
        if (!target) return;
        try {
          await global.RuangBKStorage.updateSchedule(id, { tersedia: target.tersedia === false });
          if (global.showToast) global.showToast("Status slot jadwal diperbarui.");
          renderCounselorSchedule();
        } catch (_) {
          if (global.showToast) global.showToast("Gagal mengubah status jadwal.");
        }
      });
    });

    document.querySelectorAll("[data-edit-sch]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-edit-sch");
        const target = schedules.find(function (s) { return s.id === id; });
        if (target) openScheduleModal(target);
      });
    });

    document.querySelectorAll("[data-del-sch]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-del-sch");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Hapus Slot Jadwal?</h3>
            <p>Slot jadwal ini akan dihapus dari daftar pilihan siswa.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-del-sch">Ya, Hapus</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-del-sch").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteSchedule(id);
            global.closeModal();
            if (global.showToast) global.showToast("Slot jadwal dihapus.");
            renderCounselorSchedule();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menghapus jadwal.");
          }
        });
      });
    });
  }

  // ==========================================
  // F-12: KELOLA MATERI EDUKASI (CRUD MATERIALS)
  // ==========================================
  function openMaterialModal(existing) {
    const isEdit = Boolean(existing);
    const session = getSession();

    global.openModal(`
      <form id="material-crud-form" class="report-modal-body">
        <div class="report-modal-head">
          <h3>${isEdit ? "Edit Materi Edukasi" : "Tambah Materi Edukasi"}</h3>
          <p>Materi yang diterbitkan akan langsung tampil di halaman Edukasi BK siswa.</p>
        </div>

        <div>
          <label class="booking-sublabel" for="mat-judul">Judul Materi</label>
          <input type="text" id="mat-judul" class="input-box" value="${escapeText(isEdit ? existing.judul : "")}" placeholder="Contoh: Tips Mengatur Waktu Belajar" required />
        </div>

        <div>
          <label class="booking-sublabel" for="mat-kategori">Kategori</label>
          <select id="mat-kategori" class="input-box" required>
            ${MATERIAL_CATEGORIES.map(function (cat) {
              const selected = isEdit && (existing.kategori || "").toUpperCase() === cat.toUpperCase() ? "selected" : "";
              return `<option value="${escapeText(cat.toUpperCase())}" ${selected}>${escapeText(cat)}</option>`;
            }).join("")}
          </select>
        </div>

        <div>
          <label class="booking-sublabel" for="mat-isi">Isi Artikel Lengkap</label>
          <textarea id="mat-isi" class="input-box booking-textarea" rows="5" required placeholder="Tulis isi materi edukasi untuk siswa...">${escapeText(isEdit ? existing.isi : "")}</textarea>
        </div>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
          <button type="submit" id="btn-save-material" class="btn-pill btn-blue">${isEdit ? "Simpan Perubahan" : "Terbitkan Materi"}</button>
        </div>
      </form>
    `);

    document.getElementById("material-crud-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const btn = document.getElementById("btn-save-material");
      const judul = document.getElementById("mat-judul").value.trim();
      const kategori = document.getElementById("mat-kategori").value;
      const isi = document.getElementById("mat-isi").value.trim();

      if (!judul || !isi) return;
      btn.disabled = true;
      btn.textContent = "Menyimpan...";

      try {
        if (isEdit) {
          await global.RuangBKStorage.updateMaterial(existing.id, {
            judul: judul,
            kategori: kategori,
            isi: isi
          });
          if (global.showToast) global.showToast("Materi edukasi diperbarui.");
        } else {
          await global.RuangBKStorage.createMaterial({
            judul: judul,
            kategori: kategori,
            isi: isi,
            authorUid: session.uid || "guru-bk",
            createdAt: Date.now()
          });
          if (global.showToast) global.showToast("Materi edukasi diterbitkan.");
        }
        global.closeModal();
        renderCounselorMaterials();
      } catch (_) {
        if (global.showToast) global.showToast("Gagal menyimpan materi.");
        btn.disabled = false;
        btn.textContent = isEdit ? "Simpan Perubahan" : "Terbitkan Materi";
      }
    });
  }

  function renderCounselorMaterials() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const materials = global.RuangBKStorage.getMaterials();

    const html = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Kelola Materi Edukasi</h1>
            <p>Publikasikan dan perbarui artikel bimbingan konseling untuk siswa.</p>
          </div>
          <button type="button" class="btn-pill btn-blue subpage-cta-btn" id="btn-add-material">
            + Tambah Materi
          </button>
        </header>

        ${materials.length > 0
          ? `<div class="edu-grid">
              ${materials.map(function (mat) {
                return `
                  <article class="edu-article-card" style="cursor:default;">
                    <div class="edu-card-top">
                      <span class="edu-cat-badge">${escapeText(mat.kategori || "PANDUAN BK")}</span>
                      <span class="edu-date-text">${escapeText(formatDateId(mat.createdAt))}</span>
                    </div>
                    <h2 class="edu-card-title">${escapeText(mat.judul)}</h2>
                    <p class="edu-card-excerpt">${escapeText(mat.isi)}</p>
                    <div class="counselor-card-actions" style="margin-top:auto;">
                      <button type="button" class="safespace-icon-btn" data-edit-mat="${escapeText(mat.id)}">${iconSvg("edit")} Edit</button>
                      <button type="button" class="safespace-icon-btn danger" data-del-mat="${escapeText(mat.id)}">${iconSvg("trash")} Hapus</button>
                    </div>
                  </article>
                `;
              }).join("")}
            </div>`
          : `<div class="subpage-empty-card"><p>Belum ada materi edukasi.</p></div>`
        }
      </div>
    `;

    appScreen.innerHTML = renderCounselorShell("counselor-materials", html);

    document.getElementById("btn-add-material").addEventListener("click", function () {
      openMaterialModal(null);
    });

    document.querySelectorAll("[data-edit-mat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-edit-mat");
        const target = materials.find(function (m) { return m.id === id; });
        if (target) openMaterialModal(target);
      });
    });

    document.querySelectorAll("[data-del-mat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-del-mat");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Hapus Materi Edukasi?</h3>
            <p>Materi ini akan dihapus dan tidak lagi tampil di aplikasi siswa.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-del-mat">Ya, Hapus</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-del-mat").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteMaterial(id);
            global.closeModal();
            if (global.showToast) global.showToast("Materi edukasi dihapus.");
            renderCounselorMaterials();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menghapus materi.");
          }
        });
      });
    });
  }

  // ==========================================
  // F-13: MODERASI SAFE SPACE
  // ==========================================
  function renderCounselorModeration() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const reports = global.RuangBKStorage.getReports();
    const stories = global.RuangBKStorage.getStories();
    const tabs = ["Laporan Baru", "Sudah Ditinjau", "Semua Cerita"];

    let bodyHtml = "";

    if (activeModerationTab === "Semua Cerita") {
      bodyHtml = stories.length > 0
        ? `<div class="safespace-feed-list">
            ${stories.map(function (story) {
              const isHidden = story.status === "disembunyikan";
              return `
                <article class="safespace-card">
                  <div class="safespace-card-head">
                    <div>
                      <strong class="safespace-alias">${escapeText(story.alias || "Anonim")}</strong>
                      <span class="safespace-time">${escapeText(formatDateId(story.createdAt))}</span>
                    </div>
                    <span class="history-status-badge ${isHidden ? "status-red" : "status-green"}">${isHidden ? "Disembunyikan" : "Tampil"}</span>
                  </div>
                  <p class="safespace-body-text">${escapeText(story.isi)}</p>
                  <div class="counselor-card-actions">
                    <button type="button" class="safespace-icon-btn ${isHidden ? "" : "danger"}" data-toggle-story-vis="${escapeText(story.id)}" data-next-status="${isHidden ? "tampil" : "disembunyikan"}">
                      ${isHidden ? "Tampilkan Kembali" : "Sembunyikan Cerita"}
                    </button>
                    ${isHidden
                      ? `<button type="button" class="safespace-icon-btn danger" data-perm-del-story="${escapeText(story.id)}">${iconSvg("trash")} Hapus Permanen</button>`
                      : ""
                    }
                  </div>
                </article>
              `;
            }).join("")}
          </div>`
        : `<div class="subpage-empty-card"><p>Belum ada cerita di Safe Space.</p></div>`;
    } else {
      const targetStatus = activeModerationTab === "Laporan Baru" ? "baru" : "ditinjau";
      const filteredReports = reports.filter(function (r) {
        return (r.status || "baru") === targetStatus;
      });

      bodyHtml = filteredReports.length > 0
        ? `<div class="history-list">
            ${filteredReports.map(function (rep) {
              const isComment = rep.jenisKonten === "komentar";
              let contentSnippet = "(Konten tidak ditemukan atau sudah dihapus)";
              let authorAlias = "Anonim";
              let commentStoryId = "";

              if (isComment) {
                const found = global.RuangBKStorage.findCommentById(rep.kontenId);
                if (found && found.comment) {
                  contentSnippet = found.comment.isi;
                  authorAlias = found.comment.alias || "Anonim";
                  commentStoryId = found.storyId;
                }
              } else {
                const story = global.RuangBKStorage.findStoryById(rep.kontenId);
                if (story) {
                  contentSnippet = story.isi;
                  authorAlias = story.alias || "Anonim";
                }
              }

              return `
                <article class="history-card">
                  <div class="history-card-top">
                    <span class="history-status-badge ${targetStatus === "baru" ? "status-red" : "status-blue"}">
                      ${isComment ? "Laporan Komentar" : "Laporan Cerita"} • ${targetStatus === "baru" ? "Baru" : "Ditinjau"}
                    </span>
                    <span class="history-created">${escapeText(formatDateId(rep.createdAt))}</span>
                  </div>
                  <div class="moderation-meta-row">
                    <span>Penulis: <strong>${escapeText(authorAlias)}</strong></span>
                    <span>Alasan: <strong>${escapeText(rep.alasan)}</strong></span>
                  </div>
                  <blockquote class="moderation-snippet">${escapeText(contentSnippet)}</blockquote>
                  ${targetStatus === "baru"
                    ? `<div class="counselor-card-actions">
                        <button type="button" class="safespace-icon-btn" data-dismiss-report="${escapeText(rep.id)}">Abaikan / Tandai Ditinjau</button>
                        ${isComment
                          ? (commentStoryId
                              ? `<button type="button" class="btn-pill btn-danger btn-sm" data-mod-del-cmt="${escapeText(rep.kontenId)}" data-mod-story-id="${escapeText(commentStoryId)}" data-rep-id="${escapeText(rep.id)}">Hapus Komentar</button>`
                              : "")
                          : `<button type="button" class="btn-pill btn-danger btn-sm" data-mod-hide-story="${escapeText(rep.kontenId)}" data-rep-id="${escapeText(rep.id)}">Sembunyikan Cerita</button>`
                        }
                      </div>`
                    : `<div class="counselor-card-actions">
                        <button type="button" class="safespace-icon-btn" data-reopen-report="${escapeText(rep.id)}">Kembalikan ke Baru</button>
                        <button type="button" class="safespace-icon-btn danger" data-del-report="${escapeText(rep.id)}">${iconSvg("trash")} Hapus Log</button>
                      </div>`
                  }
                </article>
              `;
            }).join("")}
          </div>`
        : `<div class="subpage-empty-card"><p>Tidak ada laporan pada tab "${escapeText(activeModerationTab)}".</p></div>`;
    }

    const html = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Moderasi Safe Space</h1>
            <p>Tinjau laporan konten dari siswa dan jaga keamanan ruang diskusi anonim.</p>
          </div>
        </header>

        <div class="filter-chip-row" role="tablist">
          ${tabs.map(function (t) {
            return `<button type="button" class="filter-chip ${activeModerationTab === t ? "active" : ""}" data-mod-tab="${t}">${t}</button>`;
          }).join("")}
        </div>

        ${bodyHtml}
      </div>
    `;

    appScreen.innerHTML = renderCounselorShell("counselor-moderation", html);

    document.querySelectorAll("[data-mod-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeModerationTab = btn.getAttribute("data-mod-tab") || "Laporan Baru";
        renderCounselorModeration();
      });
    });

    // Abaikan / Tandai Ditinjau
    document.querySelectorAll("[data-dismiss-report]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const repId = btn.getAttribute("data-dismiss-report");
        try {
          await global.RuangBKStorage.updateReportStatus(repId, "ditinjau");
          if (global.showToast) global.showToast("Laporan ditandai sudah ditinjau.");
          renderCounselorModeration();
        } catch (_) {
          if (global.showToast) global.showToast("Gagal memperbarui laporan.");
        }
      });
    });

    // Sembunyikan Cerita dari Laporan
    document.querySelectorAll("[data-mod-hide-story]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const storyId = btn.getAttribute("data-mod-hide-story");
        const repId = btn.getAttribute("data-rep-id");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Sembunyikan Cerita?</h3>
            <p>Cerita ini akan disembunyikan dari feed Safe Space siswa dan laporan ditandai selesai ditinjau.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-hide-story">Ya, Sembunyikan</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-hide-story").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.updateStoryStatus(storyId, "disembunyikan");
            await global.RuangBKStorage.markReportsReviewedByContent(storyId);
            await global.RuangBKStorage.updateReportStatus(repId, "ditinjau");
            global.closeModal();
            if (global.showToast) global.showToast("Cerita disembunyikan dan semua laporan terkait ditinjau.");
            renderCounselorModeration();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menyembunyikan cerita.");
          }
        });
      });
    });

    // Hapus Komentar dari Laporan
    document.querySelectorAll("[data-mod-del-cmt]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const commentId = btn.getAttribute("data-mod-del-cmt");
        const storyId = btn.getAttribute("data-mod-story-id");
        const repId = btn.getAttribute("data-rep-id");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Hapus Komentar?</h3>
            <p>Komentar yang melanggar akan dihapus secara permanen dan laporan ditandai selesai ditinjau.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-del-cmt">Ya, Hapus Komentar</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-del-cmt").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteComment(storyId, commentId);
            await global.RuangBKStorage.updateReportStatus(repId, "ditinjau");
            global.closeModal();
            if (global.showToast) global.showToast("Komentar dihapus dan laporan ditinjau.");
            renderCounselorModeration();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menghapus komentar.");
          }
        });
      });
    });

    // Toggle Visibilitas di Tab Semua Cerita
    document.querySelectorAll("[data-toggle-story-vis]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const storyId = btn.getAttribute("data-toggle-story-vis");
        const nextStatus = btn.getAttribute("data-next-status");
        try {
          await global.RuangBKStorage.updateStoryStatus(storyId, nextStatus);
          if (global.showToast) {
            global.showToast(nextStatus === "tampil" ? "Cerita ditampilkan kembali." : "Cerita disembunyikan.");
          }
          renderCounselorModeration();
        } catch (_) {
          if (global.showToast) global.showToast("Gagal mengubah status cerita.");
        }
      });
    });

    // Kembalikan Laporan ke Status Baru
    document.querySelectorAll("[data-reopen-report]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const repId = btn.getAttribute("data-reopen-report");
        try {
          await global.RuangBKStorage.updateReportStatus(repId, "baru");
          if (global.showToast) global.showToast("Laporan dikembalikan ke daftar Baru.");
          renderCounselorModeration();
        } catch (_) {
          if (global.showToast) global.showToast("Gagal mengembalikan status laporan.");
        }
      });
    });

    // Hapus Log Laporan
    document.querySelectorAll("[data-del-report]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const repId = btn.getAttribute("data-del-report");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Hapus Log Laporan?</h3>
            <p>Riwayat laporan ini akan dihapus permanen agar daftar moderasi tetap rapi.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-del-report">Ya, Hapus Log</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-del-report").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteReport(repId);
            global.closeModal();
            if (global.showToast) global.showToast("Log laporan dihapus.");
            renderCounselorModeration();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menghapus log laporan.");
          }
        });
      });
    });

    // Hapus Permanen Cerita Tersembunyi (beserta comments & empathy)
    document.querySelectorAll("[data-perm-del-story]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const storyId = btn.getAttribute("data-perm-del-story");
        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Hapus Cerita Permanen?</h3>
            <p>Cerita beserta seluruh komentar dan dukungan empati di dalamnya akan dihapus permanen dari database.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-perm-del-story">Ya, Hapus Permanen</button>
            </div>
          </div>
        `);
        document.getElementById("confirm-perm-del-story").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteStory(storyId);
            global.closeModal();
            if (global.showToast) global.showToast("Cerita dan data terkait dihapus permanen.");
            renderCounselorModeration();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal menghapus cerita.");
          }
        });
      });
    });
  }

  global.renderCounselorDashboard = renderCounselorDashboard;
  global.renderCounselorSchedule = renderCounselorSchedule;
  global.renderCounselorMaterials = renderCounselorMaterials;
  global.renderCounselorModeration = renderCounselorModeration;
}(window));
