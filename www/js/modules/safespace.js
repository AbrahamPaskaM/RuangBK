// ==========================================
// SAFE SPACE ANONIM MODULE (F-06 s.d. F-09)
// ==========================================
(function (global) {
  "use strict";

  let selectedStoryId = null;
  let activeFeedTab = "all"; // "all" | "popular" | "latest"
  let selectedCategory = "";

  const STORY_CATEGORIES = ["Curhat", "Motivasi", "Pertanyaan", "Lainnya"];

  const REPORT_REASONS = [
    "Privasi siswa",
    "Perundungan / Bullying",
    "Konten tidak pantas",
    "Lainnya"
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

  function formatTimeLabel(timestamp) {
    if (!timestamp) return "Baru saja";
    const diffMs = Date.now() - Number(timestamp);
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return diffMin + " menit lalu";
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return diffHour + " jam lalu";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(new Date(Number(timestamp)));
    } catch (_) {
      return "Baru saja";
    }
  }

  function getSessionAlias(uid) {
    if (!uid) return "Anonim #100";
    let hash = 0;
    for (let i = 0; i < uid.length; i += 1) {
      hash = (hash * 31 + uid.charCodeAt(i)) % 900;
    }
    const num = 100 + Math.abs(hash);
    return "Anonim #" + num;
  }

  function getCurrentUid() {
    const session = global.RuangBKStorage && global.RuangBKStorage.getSession();
    return session && session.uid ? session.uid : "anon-local";
  }

  function getInitials(name) {
    return String(name || "S")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) { return part[0]; })
      .join("")
      .toUpperCase() || "S";
  }

  function iconSvg(name, size) {
    const s = size || 16;
    const icons = {
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
      heartFill: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
      comment: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
      trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      shieldHeart: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 14.5s-3-1.9-3-3.9a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2-3 3.9-3 3.9z"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      back: '<polyline points="15 18 9 12 15 6"/>'
    };
    const isFill = name === "heartFill";
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${isFill ? "currentColor" : "none"}" stroke="${isFill ? "none" : "currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;
  }

  function openGuidelinesModal() {
    if (!global.openModal) return;
    global.openModal(`
      <div class="report-modal-body">
        <div class="report-modal-head">
          <h3>Panduan Safe Space</h3>
          <p>Mari bersama-sama menjaga Safe Space tetap aman, hangat, dan suportif bagi seluruh siswa.</p>
        </div>
        <ul class="ss-guide-modal-list">
          <li>${iconSvg("check", 16)}<span><strong>Gunakan bahasa yang sopan</strong> — Hindari kata kasar, ejekan, atau penghakiman.</span></li>
          <li>${iconSvg("check", 16)}<span><strong>Jaga privasi diri &amp; teman</strong> — Jangan sebutkan nama asli, kelas, atau kontak pribadi.</span></li>
          <li>${iconSvg("check", 16)}<span><strong>Saling mendukung</strong> — Berikan empati dan komentar yang menguatkan.</span></li>
          <li>${iconSvg("check", 16)}<span><strong>Laporkan pelanggaran</strong> — Gunakan tombol Laporkan agar Guru BK dapat meninjau konten yang tidak pantas.</span></li>
        </ul>
        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-blue" onclick="closeModal()">Saya Mengerti</button>
        </div>
      </div>
    `);
  }

  function openReportModal(jenisKonten, kontenId) {
    if (!global.openModal) return;
    let selectedReason = REPORT_REASONS[0];

    global.openModal(`
      <form id="safespace-report-form" class="report-modal-body">
        <div class="report-modal-head">
          <h3>Laporkan ${jenisKonten === "komentar" ? "Komentar" : "Cerita"}</h3>
          <p>Laporan akan ditinjau secara privat oleh Guru BK untuk menjaga keamanan ruang diskusi.</p>
        </div>

        <div class="report-reason-grid">
          ${REPORT_REASONS.map(function (reason, idx) {
            return `<button type="button" class="report-reason-chip ${idx === 0 ? "active" : ""}" data-report-reason="${escapeText(reason)}">${escapeText(reason)}</button>`;
          }).join("")}
        </div>

        <div>
          <label class="booking-sublabel" for="report-extra-note">Catatan tambahan (opsional)</label>
          <textarea id="report-extra-note" class="input-box booking-textarea" rows="2" maxlength="200" placeholder="Jelaskan singkat mengapa konten ini perlu ditinjau..."></textarea>
        </div>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
          <button type="submit" id="btn-submit-report" class="btn-pill btn-danger">Kirim Laporan</button>
        </div>
      </form>
    `);

    document.querySelectorAll("[data-report-reason]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        selectedReason = chip.getAttribute("data-report-reason") || REPORT_REASONS[0];
        document.querySelectorAll("[data-report-reason]").forEach(function (c) {
          c.classList.toggle("active", c === chip);
        });
      });
    });

    document.getElementById("safespace-report-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById("btn-submit-report");
      const extraNote = (document.getElementById("report-extra-note").value || "").trim();
      const fullReason = extraNote ? selectedReason + " — " + extraNote : selectedReason;

      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      try {
        await global.RuangBKStorage.createReport({
          jenisKonten: jenisKonten,
          kontenId: kontenId,
          alasan: fullReason,
          reporterUid: getCurrentUid(),
          status: "baru",
          createdAt: Date.now()
        });
        global.closeModal();
        if (global.showToast) global.showToast("Laporan terkirim ke Guru BK");
      } catch (_) {
        if (global.showToast) global.showToast("Gagal mengirim laporan. Coba lagi.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Laporan";
      }
    });
  }

  function openDeleteStoryModal(storyId) {
    if (!global.openModal) return;

    global.openModal(`
      <div class="confirm-modal-body">
        <h3>Hapus Cerita?</h3>
        <p>Cerita ini akan dihapus secara permanen dari Safe Space.</p>
        <div class="confirm-modal-actions">
          <button type="button" class="btn-pill btn-outline-dark" onclick="closeModal()">Batal</button>
          <button type="button" class="btn-pill btn-danger" id="confirm-delete-story">Ya, Hapus</button>
        </div>
      </div>
    `);

    document.getElementById("confirm-delete-story").addEventListener("click", async function () {
      try {
        await global.RuangBKStorage.deleteStory(storyId);
        global.closeModal();
        if (selectedStoryId === storyId) {
          selectedStoryId = null;
        }
        if (global.showToast) global.showToast("Cerita berhasil dihapus.");
        renderSafeSpace();
      } catch (_) {
        if (global.showToast) global.showToast("Gagal menghapus cerita.");
      }
    });
  }

  function renderStoryCard(story, currentUid) {
    const empathyMap = global.RuangBKStorage.getEmpathyMap(story.id);
    const empathyCount = Object.keys(empathyMap).length;
    const likedByMe = Boolean(empathyMap[currentUid]);
    const comments = global.RuangBKStorage.getComments(story.id);
    const isOwner = story.authorUid && story.authorUid === currentUid;

    return `
      <article class="safespace-card">
        <div class="safespace-card-head">
          <div class="safespace-author-row">
            <span class="safespace-avatar">${iconSvg("shieldHeart", 18)}</span>
            <div>
              <strong class="safespace-alias">${escapeText(story.alias || "Anonim")}</strong>
              <span class="safespace-time">${escapeText(formatTimeLabel(story.createdAt))}</span>
            </div>
          </div>

          <div class="safespace-head-actions">
            ${isOwner
              ? `<button type="button" class="safespace-icon-btn danger" data-delete-story="${escapeText(story.id)}" aria-label="Hapus cerita">
                  ${iconSvg("trash", 15)}
                  <span>Hapus</span>
                </button>`
              : ""
            }
            <button type="button" class="safespace-icon-btn" data-report-story="${escapeText(story.id)}" aria-label="Laporkan cerita">
              ${iconSvg("flag", 15)}
              <span>Laporkan</span>
            </button>
          </div>
        </div>

        <p class="safespace-body-text">${escapeText(story.isi)}</p>

        ${story.kategori ? `<span class="ss-story-tag">${escapeText(story.kategori)}</span>` : ""}

        <div class="safespace-card-foot">
          <button type="button" class="safespace-action-pill ${likedByMe ? "liked" : ""}" data-toggle-empathy="${escapeText(story.id)}">
            ${likedByMe ? iconSvg("heartFill", 16) : iconSvg("heart", 16)}
            <span>${empathyCount} Empati</span>
          </button>

          <button type="button" class="safespace-action-pill" data-open-comments="${escapeText(story.id)}">
            ${iconSvg("comment", 16)}
            <span>${comments.length} Komentar</span>
          </button>
        </div>
      </article>
    `;
  }

  function bindStoryCardActions(currentUid) {
    document.querySelectorAll("[data-toggle-empathy]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        const storyId = btn.getAttribute("data-toggle-empathy");
        try {
          await global.RuangBKStorage.toggleEmpathy(storyId, currentUid);
          renderSafeSpace();
        } catch (_) {
          if (global.showToast) global.showToast("Gagal memperbarui empati.");
        }
      });
    });

    document.querySelectorAll("[data-open-comments]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedStoryId = btn.getAttribute("data-open-comments");
        renderSafeSpace();
      });
    });

    document.querySelectorAll("[data-report-story]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openReportModal("cerita", btn.getAttribute("data-report-story"));
      });
    });

    document.querySelectorAll("[data-delete-story]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDeleteStoryModal(btn.getAttribute("data-delete-story"));
      });
    });
  }

  function renderStoryDetailView(story, currentUid, myAlias) {
    const comments = global.RuangBKStorage.getComments(story.id).slice().sort(function (a, b) {
      return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
    });
    const empathyMap = global.RuangBKStorage.getEmpathyMap(story.id);
    const empathyCount = Object.keys(empathyMap).length;
    const likedByMe = Boolean(empathyMap[currentUid]);
    const isOwner = story.authorUid && story.authorUid === currentUid;

    const detailHtml = `
      <div class="subpage-wrap">
        <div class="subpage-topbar">
          <button type="button" class="subpage-back-btn" id="safespace-back-btn">
            ${iconSvg("back", 16)}
            <span>Kembali ke Safe Space</span>
          </button>
        </div>

        <article class="safespace-card safespace-detail-card">
          <div class="safespace-card-head">
            <div class="safespace-author-row">
              <span class="safespace-avatar">${iconSvg("shieldHeart", 18)}</span>
              <div>
                <strong class="safespace-alias">${escapeText(story.alias || "Anonim")}</strong>
                <span class="safespace-time">${escapeText(formatTimeLabel(story.createdAt))}</span>
              </div>
            </div>

            <div class="safespace-head-actions">
              ${isOwner
                ? `<button type="button" class="safespace-icon-btn danger" data-delete-story="${escapeText(story.id)}">
                    ${iconSvg("trash", 15)}
                    <span>Hapus</span>
                  </button>`
                : ""
              }
              <button type="button" class="safespace-icon-btn" data-report-story="${escapeText(story.id)}">
                ${iconSvg("flag", 15)}
                <span>Laporkan</span>
              </button>
            </div>
          </div>

          <p class="safespace-body-text safespace-detail-body">${escapeText(story.isi)}</p>
          ${story.kategori ? `<span class="ss-story-tag">${escapeText(story.kategori)}</span>` : ""}

          <div class="safespace-card-foot">
            <button type="button" class="safespace-action-pill ${likedByMe ? "liked" : ""}" data-toggle-empathy="${escapeText(story.id)}">
              ${likedByMe ? iconSvg("heartFill", 16) : iconSvg("heart", 16)}
              <span>${empathyCount} Empati</span>
            </button>
            <span class="safespace-comment-count-label">${comments.length} Komentar</span>
          </div>
        </article>

        <section class="safespace-comments-section">
          <h2 class="safespace-comments-title">Dukungan &amp; Komentar Anonim</h2>

          <form id="safespace-comment-form" class="safespace-comment-form">
            <div class="safespace-anon-chip">Berkomentar sebagai <strong>${escapeText(myAlias)}</strong></div>
            <textarea id="safespace-comment-input" class="input-box booking-textarea" rows="2" minlength="3" maxlength="300" required placeholder="Tulis kata-kata penguatan yang positif dan empatik..."></textarea>
            <div class="safespace-compose-actions">
              <button type="submit" id="btn-submit-comment" class="btn-pill btn-blue">Kirim Komentar</button>
            </div>
          </form>

          <div class="safespace-comment-list">
            ${comments.length > 0
              ? comments.map(function (cmt) {
                  return `
                    <div class="safespace-comment-item">
                      <div class="safespace-comment-head">
                        <div>
                          <strong>${escapeText(cmt.alias || "Anonim")}</strong>
                          <span>${escapeText(formatTimeLabel(cmt.createdAt))}</span>
                        </div>
                        <button type="button" class="safespace-icon-btn" data-report-comment="${escapeText(cmt.id)}" aria-label="Laporkan komentar">
                          ${iconSvg("flag", 15)}
                          <span>Laporkan</span>
                        </button>
                      </div>
                      <p>${escapeText(cmt.isi)}</p>
                    </div>
                  `;
                }).join("")
              : `<div class="subpage-empty-card"><p>Belum ada komentar. Jadilah yang pertama memberi dukungan positif.</p></div>`
            }
          </div>
        </section>
      </div>
    `;

    const appScreen = document.getElementById("app-screen");
    appScreen.innerHTML = global.renderStudentShell("student-safespace", detailHtml);

    document.getElementById("safespace-back-btn").addEventListener("click", function () {
      selectedStoryId = null;
      renderSafeSpace();
    });

    bindStoryCardActions(currentUid);

    document.querySelectorAll("[data-report-comment]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openReportModal("komentar", btn.getAttribute("data-report-comment"));
      });
    });

    document.getElementById("safespace-comment-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const input = document.getElementById("safespace-comment-input");
      const btn = document.getElementById("btn-submit-comment");
      const text = (input.value || "").trim();
      if (text.length < 3) {
        if (global.showToast) global.showToast("Komentar terlalu singkat.");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Mengirim...";

      try {
        await global.RuangBKStorage.addComment(story.id, {
          alias: myAlias,
          isi: text,
          authorUid: currentUid,
          createdAt: Date.now()
        });
        if (global.showToast) global.showToast("Komentar dukungan terkirim.");
        renderSafeSpace();
      } catch (_) {
        if (global.showToast) global.showToast("Gagal mengirim komentar.");
        btn.disabled = false;
        btn.textContent = "Kirim Komentar";
      }
    });
  }

  function getSortedStories(visibleStories) {
    const list = visibleStories.slice();
    if (activeFeedTab === "popular") {
      return list.sort(function (a, b) {
        const countA = Object.keys(global.RuangBKStorage.getEmpathyMap(a.id)).length;
        const countB = Object.keys(global.RuangBKStorage.getEmpathyMap(b.id)).length;
        if (countB !== countA) return countB - countA;
        return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      });
    }
    return list.sort(function (a, b) {
      return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
    });
  }

  function renderSafeSpace() {
    const appScreen = document.getElementById("app-screen");
    if (!appScreen) return;

    const session = (global.RuangBKStorage && global.RuangBKStorage.getSession()) || { name: "Siswa RuangBK" };
    const currentUid = getCurrentUid();
    const myAlias = getSessionAlias(currentUid);
    const initials = getInitials(session.name);
    const allStories = global.RuangBKStorage ? global.RuangBKStorage.getStories() : [];

    // F-06: Hanya tampilkan cerita dengan status === "tampil"
    const visibleStories = allStories.filter(function (story) {
      return story.status === "tampil";
    });

    if (selectedStoryId) {
      const target = visibleStories.find(function (s) { return s.id === selectedStoryId; });
      if (target) {
        renderStoryDetailView(target, currentUid, myAlias);
        return;
      }
      selectedStoryId = null;
    }

    const sortedStories = getSortedStories(visibleStories);

    const feedHtml = `
      <div class="ss-page">
        <header class="ss-header">
          <div class="ss-header-left">
            <span class="ss-title-icon">${iconSvg("shieldHeart", 22)}</span>
            <div>
              <h1>Safe Space Anonim</h1>
              <p>Ruang aman untuk berbagi cerita dan saling menguatkan tanpa dikenali identitas aslinya.</p>
            </div>
          </div>

          <div class="ss-header-right">
            <span class="safespace-privacy-pill"><i aria-hidden="true"></i>Identitas Terlindungi</span>
            <button type="button" class="student-bell" id="safespace-bell-btn" aria-label="Info Safe Space">
              ${iconSvg("bell", 19)}
              ${visibleStories.length > 0 ? '<span class="student-bell-dot"></span>' : ""}
            </button>
            <button type="button" class="student-avatar-btn" onclick="navigateTo('profile')" aria-label="Buka Profil Saya">
              <span class="student-avatar">${escapeText(initials)}</span>
            </button>
          </div>
        </header>

        <div class="ss-layout-grid">
          <div class="ss-main-col">
            <section class="ss-hero-banner">
              <div class="ss-hero-copy">
                <span class="ss-hero-badge">${iconSvg("shieldHeart", 15)} Ruang Aman &amp; Rahasia</span>
                <h2>Kamu tidak sendiri di sini &#9825;</h2>
                <p>Bagikan pikiran, keluh kesah, atau pertanyaanmu. Di sini, kamu akan selalu didengar.</p>
                <button type="button" class="ss-hero-btn" id="btn-open-ss-guide">
                  <span>Lihat Panduan Safe Space</span>
                  ${iconSvg("arrowRight", 15)}
                </button>
              </div>
              <div class="ss-hero-art" aria-hidden="true">
                <img src="./assets/images/hero-safespace.png" class="ss-hero-img" alt="" />
              </div>
            </section>

            <form id="safespace-compose-form" class="safespace-compose-card">
              <div class="safespace-compose-top">
                <h2 class="ss-compose-title">Tulis Cerita atau Pertanyaanmu</h2>
                <span class="safespace-anon-chip">Sebagai <strong>${escapeText(myAlias)}</strong></span>
              </div>

              <div class="ss-textarea-wrap">
                <textarea id="safespace-story-input" class="input-box booking-textarea ss-story-textarea" rows="3" minlength="10" maxlength="1000" required placeholder="Ceritakan perasaan atau masalahmu dengan nyaman..."></textarea>
                <span class="ss-char-counter" id="ss-char-counter">0/1000</span>
              </div>

              <div class="ss-compose-footer">
                <div class="ss-category-row" role="group" aria-label="Kategori opsional">
                  ${STORY_CATEGORIES.map(function (cat) {
                    return `<button type="button" class="ss-cat-chip ${selectedCategory === cat ? "active" : ""}" data-ss-cat="${escapeText(cat)}">${escapeText(cat)}</button>`;
                  }).join("")}
                </div>
                <button type="submit" id="btn-submit-story" class="btn-pill btn-blue ss-submit-btn">Kirim Postingan</button>
              </div>
            </form>

            <div class="ss-filter-row" role="tablist" aria-label="Urutkan Postingan">
              <button type="button" class="ss-filter-tab ${activeFeedTab === "all" ? "active" : ""}" data-ss-tab="all">Semua Postingan</button>
              <button type="button" class="ss-filter-tab ${activeFeedTab === "popular" ? "active" : ""}" data-ss-tab="popular">Paling Membantu</button>
              <button type="button" class="ss-filter-tab ${activeFeedTab === "latest" ? "active" : ""}" data-ss-tab="latest">Terbaru</button>
            </div>

            <div class="safespace-feed-list">
              ${sortedStories.length > 0
                ? sortedStories.map(function (story) { return renderStoryCard(story, currentUid); }).join("")
                : `<div class="subpage-empty-card"><p>Belum ada cerita di Safe Space. Mulailah berbagi cerita positif pertamamu.</p></div>`
              }
            </div>
          </div>

          <aside class="ss-side-col">
            <article class="ss-side-card ss-tips-card">
              <h3>Tips Berpartisipasi</h3>
              <ul class="ss-tips-list">
                <li><span class="ss-tip-check">${iconSvg("check", 14)}</span><span>Gunakan bahasa yang sopan</span></li>
                <li><span class="ss-tip-check">${iconSvg("check", 14)}</span><span>Jangan membagikan data pribadi</span></li>
                <li><span class="ss-tip-check">${iconSvg("check", 14)}</span><span>Saling mendukung &#127793;</span></li>
              </ul>
            </article>

            <article class="ss-side-card ss-help-card">
              <h3>Butuh Bantuan Lebih Lanjut?</h3>
              <p>Ingin berbicara langsung dengan Guru BK secara privat? Ajukan jadwal konseling sekarang.</p>
              <button type="button" class="btn-pill btn-blue ss-help-btn" onclick="navigateTo('student-booking')">
                <span>Ajukan Konseling</span>
                ${iconSvg("arrowRight", 15)}
              </button>
            </article>

            <article class="student-cheer ss-quote-card">
              <span class="student-cheer-icon">${iconSvg("heartFill", 16)}</span>
              <div class="student-cheer-copy">
                <b>"Setiap masalah pasti ada jalan keluarnya."</b>
                <p>— RuangBK</p>
              </div>
              <img src="./assets/images/motivation-hill.svg" class="cheer-hill-img" alt="" aria-hidden="true" />
            </article>
          </aside>
        </div>
      </div>
    `;

    appScreen.innerHTML = global.renderStudentShell("student-safespace", feedHtml);

    bindStoryCardActions(currentUid);

    const guideBtn = document.getElementById("btn-open-ss-guide");
    if (guideBtn) {
      guideBtn.addEventListener("click", openGuidelinesModal);
    }

    const bellBtn = document.getElementById("safespace-bell-btn");
    if (bellBtn && global.showToast) {
      bellBtn.addEventListener("click", function () {
        global.showToast(`Terdapat ${visibleStories.length} cerita aktif di Safe Space.`);
      });
    }

    const storyInput = document.getElementById("safespace-story-input");
    const charCounter = document.getElementById("ss-char-counter");
    if (storyInput && charCounter) {
      storyInput.addEventListener("input", function () {
        charCounter.textContent = storyInput.value.length + "/1000";
      });
    }

    document.querySelectorAll("[data-ss-cat]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const cat = chip.getAttribute("data-ss-cat") || "";
        selectedCategory = selectedCategory === cat ? "" : cat;
        document.querySelectorAll("[data-ss-cat]").forEach(function (c) {
          c.classList.toggle("active", c.getAttribute("data-ss-cat") === selectedCategory);
        });
      });
    });

    document.querySelectorAll("[data-ss-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeFeedTab = tab.getAttribute("data-ss-tab") || "all";
        renderSafeSpace();
      });
    });

    document.getElementById("safespace-compose-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const input = document.getElementById("safespace-story-input");
      const btn = document.getElementById("btn-submit-story");
      const text = (input.value || "").trim();

      if (text.length < 10) {
        if (global.showToast) global.showToast("Cerita minimal 10 karakter.");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Mengirim...";

      const payload = {
        alias: myAlias,
        isi: text,
        authorUid: currentUid,
        status: "tampil",
        createdAt: Date.now()
      };
      if (selectedCategory) {
        payload.kategori = selectedCategory;
      }

      try {
        await global.RuangBKStorage.createStory(payload);
        selectedCategory = "";
        if (global.showToast) global.showToast("Cerita anonim berhasil dibagikan.");
        renderSafeSpace();
      } catch (_) {
        if (global.showToast) global.showToast("Gagal membagikan cerita.");
        btn.disabled = false;
        btn.textContent = "Kirim Postingan";
      }
    });
  }

  global.renderSafeSpace = renderSafeSpace;
}(window));
