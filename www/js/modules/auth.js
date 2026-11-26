// Logo yang diunggah pengguna.
const APP_LOGO_SVG = '<img src="./assets/images/logo.png" class="app-logo-img" alt="Logo RuangBK">';

// Ikon SVG Mata (Tampil / Sembunyi Password)
const ICON_EYE_OFF = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
`;

const ICON_EYE_ON = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
`;

const DEMO_ACCOUNTS = {
  siswa: {
    email: "siswa@ruangbk.test",
    password: "RuangBK123!",
    profile: {
      nama: "Aditya Pratama",
      role: "siswa",
      jenjang: "SMA",
      sekolahKelas: "SMAN 1 • Kelas XI-2",
      nisn: "0012345678"
    }
  },
  guru_bk: {
    email: "guru@ruangbk.test",
    password: "RuangBK123!",
    profile: {
      nama: "Ibu Ratna Sari, S.Pd",
      role: "guru_bk",
      jenjang: "SMA",
      sekolahKelas: "Guru BK • SMAN 1",
      nisn: ""
    }
  }
};

function getFirebaseAuth() {
  if (!window.RuangBKFirebase || !window.RuangBKFirebase.auth) {
    throw new Error("Firebase Authentication belum terinisialisasi.");
  }
  return window.RuangBKFirebase.auth;
}

function formatFirebaseAuthError(error) {
  const code = error && error.code ? error.code : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan masuk dengan akun tersebut.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/weak-password":
      return "Password terlalu lemah (minimal 6 karakter).";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email atau password tidak sesuai.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba beberapa saat lagi.";
    case "auth/network-request-failed":
      return "Koneksi internet bermasalah. Periksa jaringan Anda.";
    default:
      return (error && error.message) || "Terjadi kesalahan autentikasi.";
  }
}

function buildSessionFromProfile(uid, email, profile) {
  const safeProfile = profile || {};
  const role = safeProfile.role === "guru_bk" ? "guru_bk" : "siswa";
  const nama = safeProfile.nama || email || "Pengguna";
  const jenjang = safeProfile.jenjang || "SMA";
  const sekolahKelas = safeProfile.sekolahKelas || (role === "guru_bk" ? "Guru BK" : "Siswa");

  return {
    uid: uid,
    email: email || "",
    nama: nama,
    name: nama,
    role: role,
    jenjang: jenjang,
    asalSekolah: safeProfile.asalSekolah || "",
    kelas: safeProfile.kelas || "",
    jurusan: safeProfile.jurusan || "",
    ruangDefault: safeProfile.ruangDefault || "",
    sekolahKelas: sekolahKelas,
    nisn: safeProfile.nisn || "",
    detail: role === "guru_bk" ? sekolahKelas : `${jenjang} • ${sekolahKelas}`
  };
}

// ==========================================
// SCREEN 01: LOGIN & SIMULASI PERAN
// ==========================================
function renderLoginScreen() {
  const appScreen = document.getElementById("app-screen");

  appScreen.innerHTML = `
    <div class="auth-screen">
      <header class="auth-hero">
        <div class="brand-center-row">
          ${APP_LOGO_SVG}
          <h1>RuangBK</h1>
        </div>
        <p>Layanan Bimbingan & Konseling<br />Digital Sekolah</p>
      </header>

      <section class="auth-body">
        <!-- Kartu Form Login -->
        <div class="card-box">
          <div class="card-header-center">
            <h2>Selamat datang kembali</h2>
            <p>Ruang aman untuk tumbuh bersama</p>
          </div>

          <form id="login-form" class="form-stack">
            <input
              type="email"
              id="login-identity"
              class="input-box"
              placeholder="Email"
              required
            />

            <div class="password-wrapper">
              <input
                type="password"
                id="login-password"
                class="input-box"
                placeholder="Password"
                required
              />
              <button type="button" class="btn-toggle-pass" id="toggle-login-pass" aria-label="Tampilkan password">
                ${ICON_EYE_OFF}
              </button>
            </div>

            <button type="submit" id="btn-login-submit" class="btn-pill btn-blue">Masuk</button>
          </form>

          <div class="auth-link-row">
            Belum punya akun? <a href="#" id="go-to-register">Daftar sebagai Siswa</a>
          </div>
        </div>

        <!-- Kartu Simulasi Masuk Cepat -->
        <div class="card-box">
          <div class="simulation-title">Simulasi Masuk Cepat:</div>
          <div class="simulation-actions">
            <button type="button" class="btn-pill btn-outline-dark" onclick="handleQuickLogin('siswa')">
              Masuk sebagai Siswa
            </button>
            <button type="button" class="btn-pill btn-navy" onclick="handleQuickLogin('guru_bk')">
              Masuk sebagai Guru BK
            </button>
          </div>
        </div>

        <footer class="auth-footer">
          Berceritalah selagi bisa.
        </footer>
      </section>
    </div>
  `;

  // Toggle Show/Hide Password
  const toggleBtn = document.getElementById("toggle-login-pass");
  const passInput = document.getElementById("login-password");
  toggleBtn.addEventListener("click", function () {
    const isPassword = passInput.type === "password";
    passInput.type = isPassword ? "text" : "password";
    toggleBtn.innerHTML = isPassword ? ICON_EYE_ON : ICON_EYE_OFF;
  });

  // Pindah ke Screen 01B (Register)
  document.getElementById("go-to-register").addEventListener("click", function (e) {
    e.preventDefault();
    renderRegisterScreen();
  });

  // Submit Login Firebase Auth
  document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("login-identity").value.trim().toLowerCase();
    const password = passInput.value;
    const submitBtn = document.getElementById("btn-login-submit");

    if (!email || !password) {
      showToast("Email dan password wajib diisi.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
      const auth = getFirebaseAuth();
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const profile = await RuangBKStorage.getUser(cred.user.uid);
      const session = buildSessionFromProfile(cred.user.uid, cred.user.email, profile);

      RuangBKStorage.setSession(session);
      showToast(`Selamat datang, ${session.nama}.`);
      navigateTo(session.role === "guru_bk" ? "counselor-dashboard" : "student-dashboard");
    } catch (error) {
      showToast(formatFirebaseAuthError(error));
    } finally {
      if (document.getElementById("btn-login-submit")) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Masuk";
      }
    }
  });
}

// ==========================================
// SCREEN 01B: DAFTAR AKUN SISWA (REGISTER)
// ==========================================
function renderRegisterScreen() {
  const appScreen = document.getElementById("app-screen");

  appScreen.innerHTML = `
    <div class="auth-screen">
      <header class="auth-hero register-hero">
        <div class="hero-top-bar">
          <button type="button" class="btn-back-circle" id="back-to-login" aria-label="Kembali">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
        <h1>Daftar Akun</h1>
        <p>Khusus siswa SMP, SMA, dan SMK</p>
      </header>

      <section class="auth-body">
        <div class="card-box register-card">
          <div class="card-header-center">
            <h2>Mulai langkah barumu</h2>
            <p>Ruang aman untuk tumbuh bersama</p>
          </div>

          <form id="register-form" class="form-stack">
            <input type="text" id="reg-name" class="input-box" placeholder="Nama Lengkap" required />
            <input type="text" id="reg-nisn" class="input-box" placeholder="NISN (10 digit)" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required />
            <select id="reg-jenjang" class="input-box" required>
              <option value="">Pilih Jenjang (SMP / SMA / SMK)</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
            <input type="email" id="reg-email" class="input-box" placeholder="Email" required />
            <input type="password" id="reg-password" class="input-box" placeholder="Password (min. 8 karakter)" minlength="8" required />

            <button type="submit" id="btn-register-submit" class="btn-pill btn-blue">Daftar Sekarang</button>
          </form>

          <p class="register-info-note">
            Akun Guru BK disediakan oleh pihak sekolah atau gunakan Simulasi Masuk Cepat di halaman Login
          </p>

          <div class="register-bottom-link">
            Sudah punya akun? <a href="#" id="link-to-login">Masuk</a>
          </div>
        </div>
      </section>
    </div>
  `;

  const goBack = function (e) {
    e.preventDefault();
    renderLoginScreen();
  };
  document.getElementById("back-to-login").addEventListener("click", goBack);
  document.getElementById("link-to-login").addEventListener("click", goBack);

  document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama = document.getElementById("reg-name").value.trim();
    const nisn = document.getElementById("reg-nisn").value.trim();
    const jenjang = document.getElementById("reg-jenjang").value;
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    const submitBtn = document.getElementById("btn-register-submit");

    if (!nama || !email) {
      showToast("Nama dan email wajib diisi.");
      return;
    }
    if (!["SMP", "SMA", "SMK"].includes(jenjang)) {
      showToast("Pilih jenjang pendidikan (SMP, SMA, atau SMK).");
      return;
    }
    if (!/^\d{10}$/.test(nisn)) {
      showToast("NISN harus terdiri dari 10 angka.");
      return;
    }
    if (password.length < 8) {
      showToast("Password minimal 8 karakter.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Mendaftarkan...";

    try {
      const auth = getFirebaseAuth();
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      const profile = await RuangBKStorage.saveUser(cred.user.uid, {
        nama: nama,
        role: "siswa",
        jenjang: jenjang,
        sekolahKelas: "",
        nisn: nisn,
        createdAt: Date.now()
      });

      const session = buildSessionFromProfile(cred.user.uid, cred.user.email, profile);
      RuangBKStorage.setSession(session);
      showToast("Akun berhasil dibuat. Selamat datang!");
      navigateTo("student-dashboard");
    } catch (error) {
      showToast(formatFirebaseAuthError(error));
    } finally {
      if (document.getElementById("btn-register-submit")) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Daftar Sekarang";
      }
    }
  });
}

// ==========================================
// SIMULASI MASUK CEPAT (FIREBASE DEMO AUTH)
// ==========================================
async function handleQuickLogin(roleInput) {
  const normalizedRole =
    roleInput === "counselor" || roleInput === "guru_bk"
      ? "guru_bk"
      : roleInput === "student" || roleInput === "siswa"
        ? "siswa"
        : null;

  if (!normalizedRole) {
    showToast("Peran masuk tidak dikenali.");
    return;
  }

  const demo = DEMO_ACCOUNTS[normalizedRole];
  showToast("Menghubungkan akun demo...");

  try {
    const auth = getFirebaseAuth();
    let cred;

    try {
      cred = await auth.signInWithEmailAndPassword(demo.email, demo.password);
    } catch (signInErr) {
      const code = signInErr && signInErr.code ? signInErr.code : "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        cred = await auth.createUserWithEmailAndPassword(demo.email, demo.password);
      } else {
        throw signInErr;
      }
    }

    let profile = await RuangBKStorage.getUser(cred.user.uid);
    if (!profile) {
      profile = await RuangBKStorage.saveUser(
        cred.user.uid,
        Object.assign({ createdAt: Date.now() }, demo.profile)
      );
    }

    const session = buildSessionFromProfile(cred.user.uid, cred.user.email, profile);
    RuangBKStorage.setSession(session);
    showToast(`Masuk sebagai ${session.nama}`);
    navigateTo(session.role === "guru_bk" ? "counselor-dashboard" : "student-dashboard");
  } catch (error) {
    showToast(formatFirebaseAuthError(error));
  }
}

window.buildSessionFromProfile = buildSessionFromProfile;
window.renderLoginScreen = renderLoginScreen;
window.renderRegisterScreen = renderRegisterScreen;
window.handleQuickLogin = handleQuickLogin;
