// ==========================================
// STUDENT DASHBOARD MODULE (RUANGBK)
// ==========================================

(function (global) {
  "use strict";

  let activeHeroSlide = 0;
  let activeEdukasiCategory = "Semua";
  let selectedMaterialId = null;
  let selectedBookingTopic = "Konseling Akademik & Rencana Studi";
  let selectedScheduleId = "";
  let activeHistoryStatus = "Semua";

  const BOOKING_TOPICS = [
    "Konseling Akademik & Rencana Studi",
    "Rencana Karir & Jurusan",
    "Pengembangan Pribadi",
    "Masalah Sosial"
  ];

  const HERO_SLIDES = [
    {
      tag: "Konseling Akademik",
      title: "Konseling Akademik & Rencana Studi",
      desc: "Rencanakan masa depanmu dengan bimbingan dari guru BK.",
      cta: "Ajukan Konseling",
      route: "student-booking"
    },
    {
      tag: "Ruang Aman",
      title: "Cerita Anonim Tanpa Penghakiman",
      desc: "Bagikan perasaanmu di Safe Space dan dapatkan dukungan positif.",
      cta: "Buka Safe Space",
      route: "student-safespace"
    },
    {
      tag: "Informasi & Karir",
      title: "Panduan Minat, Bakat & Jurusan",
      desc: "Pelajari tips belajar efektif dan persiapan karir masa depan.",
      cta: "Lihat Informasi BK",
      route: "student-edukasi"
    },
    {
      tag: "Riwayat Sesi",
      title: "Pantau Jadwal & Status Konselingmu",
      desc: "Lihat status pengajuan dan persetujuan jadwal dari guru BK.",
      cta: "Lihat Riwayat",
      route: "student-history"
    }
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

  function svgIcon(name, size = 20, filled = false) {
    const paths = {
      home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22v-8h6v8"/>',
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8M8 14h4"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
      history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      cap: '<path d="m2 10 10-5 10 5-10 5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
      chevronRight: '<polyline points="9 18 15 12 9 6"/>',
      arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      layoutGrid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
      calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
      shieldHeart: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 14.5s-3-1.9-3-3.9a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2-3 3.9-3 3.9z"/>',
      barChart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7" rx="1"/><rect x="12" y="7" width="3" height="11" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/>',
      clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
      mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      sprout: '<path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 14c-4.5 0-7-2.5-7-6.5 4.5 0 7 2.5 7 6.5Z"/><path d="M12 11c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z"/>',
      activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
      heartSolid: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>'
    };

    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="${filled ? "none" : "currentColor"}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  function getDashboardData(session) {
    const consultations = global.RuangBKStorage ? global.RuangBKStorage.getConsultations() : [];
    const stories = global.RuangBKStorage ? global.RuangBKStorage.getStories() : [];
    const materials = global.RuangBKStorage ? global.RuangBKStorage.getMaterials() : [];

    const sessionName = session ? (session.nama || session.name) : "";
    const studentConsultations = consultations.filter(function (item) {
      if (!session) return false;
      if (session.uid && item.studentUid) {
        return item.studentUid === session.uid;
      }
      return sessionName && (item.namaSiswa === sessionName || item.studentName === sessionName);
    });

    const approvedSchedule = studentConsultations.find(function (item) {
      return item.status === "disetujui";
    }) || null;

    const visibleStories = stories.filter(function (story) {
      return story.status !== "disembunyikan" && !story.reported;
    });

    return {
      studentConsultations: studentConsultations,
      approvedSchedule: approvedSchedule,
      posts: visibleStories,
      articles: materials
    };
  }

  function buildActivities(data) {
    const items = [];
    if (data.articles.length > 0) {
      const mat = data.articles[0];
      items.push({
        type: "activity-doc",
        icon: "book",
        title: mat.judul || mat.title,
        time: mat.kategori || mat.readTime || "Artikel BK"
      });
    }
    if (data.studentConsultations.length > 0) {
      const latestConsult = data.studentConsultations[0];
      const consultTime = latestConsult.tanggal
        ? `${latestConsult.tanggal}${latestConsult.jam ? " • " + latestConsult.jam : ""}`
        : (latestConsult.dateLabel || "Jadwal konseling");
      items.push({
        type: "activity-cal",
        icon: "calendar",
        title: `Pengajuan: ${latestConsult.topik || latestConsult.topic}`,
        time: consultTime
      });
    }
    if (data.posts.length > 0) {
      const latestPost = data.posts[0];
      items.push({
        type: "activity-chat",
        icon: "chat",
        title: `Cerita baru di Safe Space (${latestPost.alias || latestPost.anonId})`,
        time: latestPost.timeAgo || "Safe Space"
      });
    }
    return items;
  }

  function renderActiveScheduleCard(approvedSchedule) {
    if (approvedSchedule) {
      const dateLabel = approvedSchedule.tanggal
        ? `${approvedSchedule.tanggal}${approvedSchedule.jam ? " • " + approvedSchedule.jam : ""}`
        : (approvedSchedule.dateLabel || "-");
      const topic = approvedSchedule.topik || approvedSchedule.topic || "Konseling";
      const counselorName = approvedSchedule.counselorName || "Guru BK";
      const place = approvedSchedule.tempat || approvedSchedule.method || "Ruang BK";

      return `
        <div class="schedule-active-card">
          <div class="schedule-active-top">
            <span class="schedule-status-badge">
              ${svgIcon("check", 13)}
              <span>DISETUJUI GURU BK</span>
            </span>
            <span class="schedule-date-chip">
              ${svgIcon("clock", 14)}
              <span>${escapeText(dateLabel)}</span>
            </span>
          </div>
          <h3 class="schedule-topic">${escapeText(topic)}</h3>
          <div class="schedule-meta-row">
            <span class="schedule-meta-item">
              ${svgIcon("user", 15)}
              <span>${escapeText(counselorName)}</span>
            </span>
            <span class="schedule-meta-item">
              ${svgIcon("mapPin", 15)}
              <span>${escapeText(place)}</span>
            </span>
          </div>
        </div>
      `;
    }

    return `
      <div class="schedule-empty-state">
        <div class="schedule-empty-copy">
          <span class="schedule-empty-icon">${svgIcon("calendar", 22)}</span>
          <div>
            <b>Belum ada jadwal konseling aktif</b>
            <p>Ajukan jadwal konseling dengan guru BK sesuai waktu luangmu.</p>
          </div>
        </div>
        <button type="button" class="schedule-cta-pill" onclick="navigateTo('student-booking')">
          <span>Ajukan Konseling</span>
          ${svgIcon("arrowRight", 15)}
        </button>
      </div>
    `;
  }

  function renderStudentDashboard() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const session = (global.RuangBKStorage && global.RuangBKStorage.getSession()) || {
      nama: "Aditya Pratama",
      detail: "SMA • SMAN 1 Kelas XI-2"
    };
    const displayName = session.nama || session.name || "Siswa";
    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AP";

    const data = getDashboardData(session);
    const slide = HERO_SLIDES[activeHeroSlide] || HERO_SLIDES[0];
    const featuredArticle = data.articles[0] || {
      judul: "Mengatasi Rasa Canggung Saat Konsultasi ke RuangBK",
      isi: "Tips agar kamu lebih nyaman saat berbicara dengan guru BK."
    };
    const featuredTitle = featuredArticle.judul || featuredArticle.title || "";
    const featuredSummary = featuredArticle.isi || featuredArticle.summary || "";
    const activities = buildActivities(data);

    const serviceCard = (iconClass, iconName, title, desc, route) => `
      <button type="button" class="student-service-card" onclick="navigateTo('${route}')">
        <span class="student-service-icon ${iconClass}">${svgIcon(iconName, 23)}</span>
        <span class="student-service-copy">
          <b>${escapeText(title)}</b>
          <small>${escapeText(desc)}</small>
        </span>
        <span class="student-service-arrow">${svgIcon("chevronRight", 17)}</span>
      </button>
    `;

    appScreen.innerHTML = `
      <div class="student-shell">
        <aside class="student-sidebar" aria-label="Menu Utama">
          <div class="sidebar-waves" aria-hidden="true">
            <svg viewBox="0 0 280 240" preserveAspectRatio="none">
              <path d="M0 110C70 70 150 150 280 95V240H0V110Z" fill="rgba(59, 130, 246, 0.25)"/>
              <path d="M0 155C95 120 185 190 280 140V240H0V155Z" fill="rgba(96, 165, 250, 0.18)"/>
            </svg>
          </div>

          <a class="student-brand" href="#" onclick="event.preventDefault(); navigateTo('student-dashboard');">
            <img src="./assets/images/logo.png" class="student-brand-logo" alt="Logo RuangBK" />
            <span>RuangBK</span>
          </a>

          <nav class="student-menu">
            <button type="button" class="active" onclick="navigateTo('student-dashboard')">${svgIcon("home", 20)}<span>Beranda</span></button>
            <button type="button" onclick="navigateTo('student-booking')">${svgIcon("edit", 20)}<span>Ajukan Konseling</span></button>
            <button type="button" onclick="navigateTo('student-safespace')">${svgIcon("chat", 20)}<span>Safe Space</span></button>
            <button type="button" onclick="navigateTo('student-edukasi')">${svgIcon("info", 20)}<span>Informasi BK</span></button>
            <button type="button" onclick="navigateTo('student-history')">${svgIcon("history", 20)}<span>Riwayat Sesi</span></button>
            <button type="button" onclick="navigateTo('profile')">${svgIcon("user", 20)}<span>Profil Saya</span></button>
          </nav>

          <div class="student-side-note">
            <img src="./assets/images/logo.png" class="student-side-note-logo" alt="RuangBK" />
            <p>
              <b>RuangBK</b>
              <small>Karena kamu tidak sendiri &#128153;</small>
            </p>
          </div>
        </aside>

        <main class="student-main">
          <header class="student-header">
            <div class="student-header-copy">
              <h1>Halo, ${escapeText(displayName)} &#128075;</h1>
              <p>Selamat datang di RuangBK. Semoga harimu menyenangkan!</p>
            </div>

            <div class="student-header-right">
              <div class="student-header-actions">
                <button type="button" class="student-bell" id="student-bell-btn" aria-label="Status Jadwal Terbaru">
                  ${svgIcon("bell", 19)}
                  ${data.studentConsultations.length > 0 ? '<span class="student-bell-dot"></span>' : ""}
                </button>

                <button type="button" class="student-avatar-btn" onclick="navigateTo('profile')" aria-label="Buka Profil Saya">
                  <span class="student-avatar">${escapeText(initials)}</span>
                </button>
              </div>

              <div class="student-school-pill">
                ${svgIcon("cap", 16)}
                <span>${escapeText(session.detail || "SMA N 1 Kelas XI-2")}</span>
              </div>
            </div>
          </header>

          <div class="student-dashboard-grid">
            <section class="student-primary">
              <article class="student-hero">
                <div class="student-hero-copy">
                  <span class="student-hero-tag"><i></i>${escapeText(slide.tag)}</span>
                  <h2>${escapeText(slide.title)}</h2>
                  <p>${escapeText(slide.desc)}</p>
                  <button type="button" class="student-hero-cta" onclick="navigateTo('${slide.route}')">
                    <span>${escapeText(slide.cta)}</span>
                    ${svgIcon("chevronRight", 16)}
                  </button>
                </div>
                <div class="student-hero-art">
                  <img src="./assets/images/a_clean_modern_flat_vector_illustration_in_a_soft.png" class="student-hero-img" alt="Ilustrasi Konseling Siswa dan Guru BK" />
                </div>
                <div class="student-slider" role="tablist" aria-label="Slide Banner">
                  ${HERO_SLIDES.map((_, idx) => `<button type="button" class="${idx === activeHeroSlide ? "active" : ""}" data-slide="${idx}" aria-label="Slide ${idx + 1}"></button>`).join("")}
                </div>
              </article>

              <section class="student-services">
                <div class="student-section-heading">
                  <h2>${svgIcon("layoutGrid", 19)} Layanan Utama</h2>
                  <p>Akses cepat untuk kebutuhanmu</p>
                </div>
                <div class="student-service-grid">
                  ${serviceCard("service-booking", "calendar", "Ajukan Konseling", "Booking jadwal dengan guru BK", "student-booking")}
                  ${serviceCard("service-safe", "shieldHeart", "Safe Space", "Cerita anonim, dapat dukungan", "student-safespace")}
                  ${serviceCard("service-info", "info", "Informasi BK", "Panduan & karir, tips, dan lainnya", "student-edukasi")}
                  ${serviceCard("service-history", "barChart", "Riwayat Sesi", "Lihat riwayat konselingmu", "student-history")}
                </div>
              </section>

              <article class="student-schedule-box">
                <div class="student-section-heading">
                  <h2>${svgIcon("calendar", 19)} Jadwal Konseling Aktif</h2>
                  <button type="button" class="student-panel-link student-schedule-link" onclick="navigateTo('student-history')">
                    <span>Lihat Riwayat</span>
                    ${svgIcon("arrowRight", 14)}
                  </button>
                </div>
                ${renderActiveScheduleCard(data.approvedSchedule)}
              </article>
            </section>

            <aside class="student-right-column">
              <article class="student-panel student-education">
                <div class="student-panel-title">
                  <h2>${svgIcon("sprout", 19)} Edukasi &amp; Informasi BK</h2>
                  <button type="button" class="student-panel-link" onclick="navigateTo('student-edukasi')">
                    <span>Lihat Semua</span>
                    ${svgIcon("arrowRight", 14)}
                  </button>
                </div>
                <div class="education-illustration">
                  <img src="./assets/images/edu-book-idea.svg" class="education-img" alt="Ilustrasi Edukasi BK" />
                </div>
                <h3>${escapeText(featuredTitle)}</h3>
                <p>${escapeText(featuredSummary)}</p>
                <button type="button" class="student-read" onclick="navigateTo('student-edukasi')">
                  <span>Baca Selengkapnya</span>
                  ${svgIcon("chevronRight", 15)}
                </button>
              </article>

              <article class="student-panel student-activity">
                <div class="student-panel-title">
                  <h2>${svgIcon("activity", 19)} Aktivitas Terbaru</h2>
                  <button type="button" class="student-panel-link" onclick="navigateTo('student-history')">
                    <span>Lihat Semua</span>
                    ${svgIcon("arrowRight", 14)}
                  </button>
                </div>
                <div class="student-activity-list">
                  ${activities.length > 0
                    ? activities.map((act) => `
                        <div class="student-activity-item">
                          <span class="${act.type}">${svgIcon(act.icon, 16)}</span>
                          <div>
                            <p>${escapeText(act.title)}</p>
                            <small>${escapeText(act.time)}</small>
                          </div>
                        </div>
                      `).join("")
                    : `<p style="font-size:12.5px; color:var(--text-secondary);">Belum ada aktivitas terbaru.</p>`
                  }
                </div>
              </article>

              <article class="student-cheer">
                <span class="student-cheer-icon">${svgIcon("heartSolid", 16, true)}</span>
                <div class="student-cheer-copy">
                  <b>Kamu Hebat!</b>
                  <p>Teruslah berusaha dan jangan ragu untuk mencari bantuan.</p>
                </div>
                <img src="./assets/images/motivation-hill.svg" class="cheer-hill-img" alt="" aria-hidden="true" />
              </article>
            </aside>
          </div>
        </main>
      </div>
    `;

    const bellBtn = document.getElementById("student-bell-btn");
    if (bellBtn && global.showToast) {
      bellBtn.addEventListener("click", function () {
        if (data.approvedSchedule) {
          const t = data.approvedSchedule.topik || data.approvedSchedule.topic;
          const d = data.approvedSchedule.tanggal
            ? `${data.approvedSchedule.tanggal} ${data.approvedSchedule.jam || ""}`
            : (data.approvedSchedule.dateLabel || "");
          global.showToast(`Jadwal disetujui: ${t} (${d})`);
        } else if (data.studentConsultations.length > 0) {
          const latest = data.studentConsultations[0];
          global.showToast(`Status pengajuan "${latest.topik || latest.topic}": ${latest.status}`);
        } else {
          global.showToast("Belum ada pembaruan status jadwal konseling.");
        }
      });
    }

    document.querySelectorAll(".student-slider button").forEach(function (dotBtn) {
      dotBtn.addEventListener("click", function () {
        activeHeroSlide = Number(dotBtn.getAttribute("data-slide")) || 0;
        renderStudentDashboard();
      });
    });
  }

  function formatDateId(timestamp) {
    if (!timestamp) return "Materi BK";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(new Date(Number(timestamp)));
    } catch (_) {
      return "Materi BK";
    }
  }

  function renderStudentShell(activeRoute, mainContentHtml) {
    return `
      <div class="student-shell">
        <aside class="student-sidebar" aria-label="Menu Utama">
          <div class="sidebar-waves" aria-hidden="true">
            <svg viewBox="0 0 280 240" preserveAspectRatio="none">
              <path d="M0 110C70 70 150 150 280 95V240H0V110Z" fill="rgba(59, 130, 246, 0.25)"/>
              <path d="M0 155C95 120 185 190 280 140V240H0V155Z" fill="rgba(96, 165, 250, 0.18)"/>
            </svg>
          </div>

          <a class="student-brand" href="#" onclick="event.preventDefault(); navigateTo('student-dashboard');">
            <img src="./assets/images/logo.png" class="student-brand-logo" alt="Logo RuangBK" />
            <span>RuangBK</span>
          </a>

          <nav class="student-menu">
            <button type="button" class="${activeRoute === "student-dashboard" ? "active" : ""}" onclick="navigateTo('student-dashboard')">${svgIcon("home", 20)}<span>Beranda</span></button>
            <button type="button" class="${activeRoute === "student-booking" ? "active" : ""}" onclick="navigateTo('student-booking')">${svgIcon("edit", 20)}<span>Ajukan Konseling</span></button>
            <button type="button" class="${activeRoute === "student-safespace" ? "active" : ""}" onclick="navigateTo('student-safespace')">${svgIcon("chat", 20)}<span>Safe Space</span></button>
            <button type="button" class="${activeRoute === "student-edukasi" ? "active" : ""}" onclick="navigateTo('student-edukasi')">${svgIcon("info", 20)}<span>Informasi BK</span></button>
            <button type="button" class="${activeRoute === "student-history" ? "active" : ""}" onclick="navigateTo('student-history')">${svgIcon("history", 20)}<span>Riwayat Sesi</span></button>
            <button type="button" class="${activeRoute === "profile" ? "active" : ""}" onclick="navigateTo('profile')">${svgIcon("user", 20)}<span>Profil Saya</span></button>
          </nav>

          <div class="student-side-note">
            <img src="./assets/images/logo.png" class="student-side-note-logo" alt="RuangBK" />
            <p>
              <b>RuangBK</b>
              <small>Karena kamu tidak sendiri &#128153;</small>
            </p>
          </div>
        </aside>

        <main class="student-main">
          ${mainContentHtml}
        </main>
      </div>
    `;
  }

  // ==========================================
  // F-03: HALAMAN MATERI EDUKASI BK
  // ==========================================
  function renderStudentEdukasi() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const materials = global.RuangBKStorage ? global.RuangBKStorage.getMaterials() : [];
    const selectedArticle = selectedMaterialId
      ? materials.find(function (m) { return m.id === selectedMaterialId; })
      : null;

    if (selectedArticle) {
      const paragraphs = escapeText(selectedArticle.isi || "")
        .split(/\n+/)
        .filter(Boolean)
        .map(function (p) { return `<p>${p}</p>`; })
        .join("");

      const detailHtml = `
        <div class="subpage-wrap">
          <div class="subpage-topbar">
            <button type="button" class="subpage-back-btn" id="edu-back-btn">
              ${svgIcon("chevronRight", 16)}
              <span>Kembali ke Daftar Materi</span>
            </button>
          </div>

          <article class="edu-detail-card">
            <div class="edu-detail-meta">
              <span class="edu-cat-badge">${escapeText(selectedArticle.kategori || "PANDUAN BK")}</span>
              <span class="edu-date-text">${escapeText(formatDateId(selectedArticle.createdAt))}</span>
            </div>
            <h1 class="edu-detail-title">${escapeText(selectedArticle.judul)}</h1>
            <div class="edu-detail-body">
              ${paragraphs || "<p>Konten artikel belum tersedia.</p>"}
            </div>
          </article>
        </div>
      `;

      appScreen.innerHTML = renderStudentShell("student-edukasi", detailHtml);
      document.getElementById("edu-back-btn").addEventListener("click", function () {
        selectedMaterialId = null;
        renderStudentEdukasi();
      });
      return;
    }

    const categories = ["Semua"];
    materials.forEach(function (item) {
      const cat = (item.kategori || "").trim();
      if (cat && categories.indexOf(cat) === -1) {
        categories.push(cat);
      }
    });

    if (categories.indexOf(activeEdukasiCategory) === -1) {
      activeEdukasiCategory = "Semua";
    }

    const filtered = activeEdukasiCategory === "Semua"
      ? materials
      : materials.filter(function (item) { return (item.kategori || "").trim() === activeEdukasiCategory; });

    const listHtml = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Edukasi &amp; Informasi BK</h1>
            <p>Materi bimbingan dari Guru BK untuk mendukung belajar, karir, dan kesehatan mentalmu.</p>
          </div>
        </header>

        <div class="filter-chip-row" role="tablist" aria-label="Filter Kategori Materi">
          ${categories.map(function (cat) {
            return `<button type="button" class="filter-chip ${activeEdukasiCategory === cat ? "active" : ""}" data-edu-cat="${escapeText(cat)}">${escapeText(cat)}</button>`;
          }).join("")}
        </div>

        ${filtered.length > 0
          ? `<div class="edu-grid">
              ${filtered.map(function (item) {
                return `
                  <article class="edu-article-card" data-edu-id="${escapeText(item.id)}" tabindex="0" role="button">
                    <div class="edu-card-top">
                      <span class="edu-cat-badge">${escapeText(item.kategori || "PANDUAN BK")}</span>
                      <span class="edu-date-text">${escapeText(formatDateId(item.createdAt))}</span>
                    </div>
                    <h2 class="edu-card-title">${escapeText(item.judul)}</h2>
                    <p class="edu-card-excerpt">${escapeText(item.isi)}</p>
                    <div class="edu-card-footer">
                      <span>Baca Selengkapnya</span>
                      ${svgIcon("arrowRight", 15)}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>`
          : `<div class="subpage-empty-card">
              <p>Belum ada materi edukasi pada kategori ini.</p>
            </div>`
        }
      </div>
    `;

    appScreen.innerHTML = renderStudentShell("student-edukasi", listHtml);

    document.querySelectorAll("[data-edu-cat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeEdukasiCategory = btn.getAttribute("data-edu-cat") || "Semua";
        renderStudentEdukasi();
      });
    });

    document.querySelectorAll("[data-edu-id]").forEach(function (card) {
      const openArticle = function () {
        selectedMaterialId = card.getAttribute("data-edu-id");
        renderStudentEdukasi();
      };
      card.addEventListener("click", openArticle);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openArticle();
        }
      });
    });
  }

  // ==========================================
  // F-04: HALAMAN AJUKAN KONSULTASI
  // ==========================================
  function renderStudentBooking() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const session = (global.RuangBKStorage && global.RuangBKStorage.getSession()) || {};
    const allSchedules = global.RuangBKStorage ? global.RuangBKStorage.getSchedules() : [];
    const availableSchedules = allSchedules.filter(function (sch) {
      return sch.tersedia === true;
    });

    if (availableSchedules.length > 0 && !availableSchedules.some(function (s) { return s.id === selectedScheduleId; })) {
      selectedScheduleId = availableSchedules[0].id;
    }

    const todayIso = new Date().toISOString().split("T")[0];

    const bookingHtml = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Ajukan Konseling</h1>
            <p>Pilih topik, slot jadwal, dan tempat pertemuan dengan Guru BK secara privat.</p>
          </div>
          <button type="button" class="subpage-outline-btn" onclick="navigateTo('student-history')">
            ${svgIcon("history", 16)}
            <span>Riwayat Sesi</span>
          </button>
        </header>

        <form id="student-booking-form" class="booking-form-card">
          <div class="booking-field-group">
            <label class="booking-label">1. Pilih Topik Konsultasi</label>
            <div class="topic-chip-grid">
              ${BOOKING_TOPICS.map(function (topic) {
                return `
                  <button type="button" class="topic-chip ${selectedBookingTopic === topic ? "active" : ""}" data-topic="${escapeText(topic)}">
                    <span>${escapeText(topic)}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <div class="booking-field-group">
            <label class="booking-label">2. Pilih Jadwal &amp; Tempat Pertemuan</label>
            ${availableSchedules.length > 0
              ? `<div class="schedule-slot-grid">
                  ${availableSchedules.map(function (sch) {
                    const jamLabel = `${sch.jamMulai || ""}${sch.jamSelesai ? " - " + sch.jamSelesai : ""} WIB`;
                    const isSelected = selectedScheduleId === sch.id;
                    return `
                      <label class="schedule-slot-card ${isSelected ? "selected" : ""}">
                        <input type="radio" name="scheduleSlot" value="${escapeText(sch.id)}" ${isSelected ? "checked" : ""} />
                        <div class="slot-card-top">
                          <span class="slot-date">${svgIcon("calendar", 15)} ${escapeText(sch.tanggal)}</span>
                          <span class="slot-badge-avail">Tersedia</span>
                        </div>
                        <div class="slot-meta">${svgIcon("clock", 14)} ${escapeText(jamLabel)}</div>
                        <div class="slot-meta">${svgIcon("mapPin", 14)} ${escapeText(sch.tempat || "Ruang BK (Tatap Muka)")}</div>
                      </label>
                    `;
                  }).join("")}
                </div>`
              : `<div class="booking-fallback-info">
                  Belum ada slot jadwal resmi dari Guru BK. Silakan ajukan usulan waktu dan tempat di bawah ini:
                </div>
                <div class="booking-fallback-grid">
                  <div>
                    <label class="booking-sublabel" for="fallback-date">Tanggal</label>
                    <input type="date" id="fallback-date" class="input-box" min="${todayIso}" value="${todayIso}" required />
                  </div>
                  <div>
                    <label class="booking-sublabel" for="fallback-time">Jam</label>
                    <input type="time" id="fallback-time" class="input-box" value="09:00" required />
                  </div>
                  <div class="booking-fallback-full">
                    <label class="booking-sublabel" for="fallback-place">Tempat</label>
                    <input type="text" id="fallback-place" class="input-box" value="Ruang BK (Tatap Muka)" required />
                  </div>
                </div>`
            }
          </div>

          <div class="booking-field-group">
            <label class="booking-label" for="booking-notes">3. Catatan Singkat (Opsional)</label>
            <textarea id="booking-notes" class="input-box booking-textarea" rows="3" maxlength="300" placeholder="Tuliskan secara singkat hal yang ingin kamu diskusikan..."></textarea>
          </div>

          <div class="booking-actions">
            <button type="button" class="btn-pill btn-outline-dark" onclick="navigateTo('student-dashboard')">Batal</button>
            <button type="submit" id="btn-booking-submit" class="btn-pill btn-blue">Kirim Pengajuan Konseling</button>
          </div>
        </form>
      </div>
    `;

    appScreen.innerHTML = renderStudentShell("student-booking", bookingHtml);

    document.querySelectorAll("[data-topic]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        selectedBookingTopic = chip.getAttribute("data-topic") || BOOKING_TOPICS[0];
        document.querySelectorAll("[data-topic]").forEach(function (c) {
          c.classList.toggle("active", c === chip);
        });
      });
    });

    document.querySelectorAll('input[name="scheduleSlot"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        selectedScheduleId = radio.value;
        document.querySelectorAll(".schedule-slot-card").forEach(function (card) {
          const input = card.querySelector("input");
          card.classList.toggle("selected", Boolean(input && input.checked));
        });
      });
    });

    document.getElementById("student-booking-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById("btn-booking-submit");
      const notes = (document.getElementById("booking-notes").value || "").trim();

      let scheduleId = "";
      let tanggal = "";
      let jam = "";
      let tempat = "Ruang BK (Tatap Muka)";

      if (availableSchedules.length > 0) {
        const chosen = availableSchedules.find(function (s) { return s.id === selectedScheduleId; }) || availableSchedules[0];
        scheduleId = chosen.id;
        tanggal = chosen.tanggal || "";
        jam = `${chosen.jamMulai || ""}${chosen.jamSelesai ? " - " + chosen.jamSelesai : ""}`;
        tempat = chosen.tempat || "Ruang BK (Tatap Muka)";
      } else {
        tanggal = document.getElementById("fallback-date").value;
        jam = document.getElementById("fallback-time").value;
        tempat = (document.getElementById("fallback-place").value || "").trim() || "Ruang BK (Tatap Muka)";
        if (!tanggal || !jam) {
          if (global.showToast) global.showToast("Tanggal dan jam pertemuan wajib diisi.");
          return;
        }
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      try {
        const payload = {
          studentUid: session.uid || "",
          namaSiswa: session.nama || session.name || "Siswa",
          topik: selectedBookingTopic,
          scheduleId: scheduleId,
          tanggal: tanggal,
          jam: jam,
          tempat: tempat,
          status: "menunggu",
          createdAt: Date.now()
        };
        if (notes) {
          payload.catatan = notes;
        }

        await global.RuangBKStorage.createConsultation(payload);
        if (global.showToast) global.showToast("Pengajuan konseling berhasil dikirim.");
        activeHistoryStatus = "Semua";
        global.navigateTo("student-history");
      } catch (err) {
        if (global.showToast) global.showToast("Gagal mengirim pengajuan. Coba lagi.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pengajuan Konseling";
      }
    });
  }

  // ==========================================
  // F-05: HALAMAN RIWAYAT KONSULTASI & STATUS
  // ==========================================
  function renderStudentHistory() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const session = (global.RuangBKStorage && global.RuangBKStorage.getSession()) || {};
    const consultations = global.RuangBKStorage ? global.RuangBKStorage.getConsultations() : [];
    const sessionName = session.nama || session.name || "";

    const mine = consultations
      .filter(function (item) {
        if (session.uid && item.studentUid) {
          return item.studentUid === session.uid;
        }
        return sessionName && (item.namaSiswa === sessionName || item.studentName === sessionName);
      })
      .sort(function (a, b) {
        return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      });

    const statusFilters = ["Semua", "Menunggu", "Disetujui", "Ditolak", "Selesai"];
    const filtered = activeHistoryStatus === "Semua"
      ? mine
      : mine.filter(function (item) {
          return (item.status || "").toLowerCase() === activeHistoryStatus.toLowerCase();
        });

    const statusBadge = function (status) {
      const normalized = (status || "menunggu").toLowerCase();
      const map = {
        menunggu: { cls: "status-amber", label: "Menunggu" },
        disetujui: { cls: "status-green", label: "Disetujui" },
        ditolak: { cls: "status-red", label: "Ditolak" },
        selesai: { cls: "status-blue", label: "Selesai" }
      };
      const cfg = map[normalized] || map.menunggu;
      return `<span class="history-status-badge ${cfg.cls}">${cfg.label}</span>`;
    };

    const historyHtml = `
      <div class="subpage-wrap">
        <header class="subpage-header">
          <div>
            <h1>Riwayat Sesi &amp; Status</h1>
            <p>Pantau perkembangan pengajuan konselingmu secara real-time.</p>
          </div>
          <button type="button" class="btn-pill btn-blue subpage-cta-btn" onclick="navigateTo('student-booking')">
            + Ajukan Konseling
          </button>
        </header>

        <div class="filter-chip-row" role="tablist" aria-label="Filter Status Konseling">
          ${statusFilters.map(function (st) {
            return `<button type="button" class="filter-chip ${activeHistoryStatus === st ? "active" : ""}" data-hist-status="${st}">${st}</button>`;
          }).join("")}
        </div>

        ${filtered.length > 0
          ? `<div class="history-list">
              ${filtered.map(function (item) {
                const st = (item.status || "menunggu").toLowerCase();
                const rejectMsg = item.rejectReason || item.alasanPenolakan || "";
                const timeText = item.jam ? `${item.jam} WIB` : (item.dateLabel || "-");
                return `
                  <article class="history-card">
                    <div class="history-card-top">
                      ${statusBadge(st)}
                      <span class="history-created">${escapeText(formatDateId(item.createdAt))}</span>
                    </div>
                    <h2 class="history-topic">${escapeText(item.topik || item.topic || "Konseling")}</h2>
                    <div class="history-meta-grid">
                      <span>${svgIcon("calendar", 14)} ${escapeText(item.tanggal || "-")}</span>
                      <span>${svgIcon("clock", 14)} ${escapeText(timeText)}</span>
                      <span>${svgIcon("mapPin", 14)} ${escapeText(item.tempat || item.method || "Ruang BK")}</span>
                    </div>
                    ${item.catatan ? `<p class="history-notes">Catatan: ${escapeText(item.catatan)}</p>` : ""}
                    ${st === "ditolak" && rejectMsg
                      ? `<div class="history-reject-box"><strong>Alasan Penolakan:</strong> ${escapeText(rejectMsg)}</div>`
                      : ""
                    }
                    ${st === "menunggu"
                      ? `<div class="history-card-actions">
                          <button type="button" class="btn-cancel-consult" data-cancel-id="${escapeText(item.id)}">Batalkan Pengajuan</button>
                        </div>`
                      : ""
                    }
                  </article>
                `;
              }).join("")}
            </div>`
          : `<div class="subpage-empty-card">
              <p>${mine.length === 0 ? "Kamu belum memiliki riwayat pengajuan konseling." : "Tidak ada pengajuan dengan status ini."}</p>
              <button type="button" class="btn-pill btn-blue" onclick="navigateTo('student-booking')">+ Ajukan Konseling</button>
            </div>`
        }
      </div>
    `;

    appScreen.innerHTML = renderStudentShell("student-history", historyHtml);

    document.querySelectorAll("[data-hist-status]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeHistoryStatus = btn.getAttribute("data-hist-status") || "Semua";
        renderStudentHistory();
      });
    });

    document.querySelectorAll("[data-cancel-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const consultId = btn.getAttribute("data-cancel-id");
        if (!consultId || !global.openModal) return;

        global.openModal(`
          <div class="confirm-modal-body">
            <h3>Batalkan Pengajuan?</h3>
            <p>Pengajuan konseling yang dibatalkan akan dihapus dari daftar antrean Guru BK.</p>
            <div class="confirm-modal-actions">
              <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Kembali</button>
              <button type="button" class="btn-pill btn-danger" id="confirm-cancel-consult">Ya, Batalkan</button>
            </div>
          </div>
        `);

        document.getElementById("confirm-cancel-consult").addEventListener("click", async function () {
          try {
            await global.RuangBKStorage.deleteConsultation(consultId);
            global.closeModal();
            if (global.showToast) global.showToast("Pengajuan konseling dibatalkan.");
            renderStudentHistory();
          } catch (_) {
            if (global.showToast) global.showToast("Gagal membatalkan pengajuan.");
          }
        });
      });
    });
  }

  global.renderStudentShell = renderStudentShell;
  global.renderStudentDashboard = renderStudentDashboard;
  global.renderStudentEdukasi = renderStudentEdukasi;
  global.renderStudentBooking = renderStudentBooking;
  global.renderStudentHistory = renderStudentHistory;
}(window));
