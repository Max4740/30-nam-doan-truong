// ============================================
// CẤU HÌNH FIREBASE - THAY THẾ CÁC GIÁ TRỊ BÊN DƯỚI
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyCERnJ8ErW7hZfrC2VJ_LWT_paEFHYBZKE",
  authDomain: "diemdanh30namhcmus.firebaseapp.com",
  databaseURL: "https://diemdanh30namhcmus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "diemdanh30namhcmus",
  storageBucket: "diemdanh30namhcmus.firebasestorage.app",
  messagingSenderId: "55417819795",
  appId: "1:55417819795:web:afa7dc662d309ac1237366"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ============================================
// AUTH HELPERS
// ============================================
function initAuth(onReady) {
  const loginSection = document.getElementById('login-section');
  const mainSection = document.getElementById('main-section');
  const loginBtn = document.getElementById('btn-login');
  const loginError = document.getElementById('login-error');

  auth.onAuthStateChanged(user => {
    if (user) {
      loginSection.style.display = 'none';
      mainSection.style.display = 'block';
      if (onReady) onReady(user);
    } else {
      loginSection.style.display = 'flex';
      mainSection.style.display = 'none';
    }
  });

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      loginError.textContent = '';
      auth.signInWithEmailAndPassword(email, pass)
        .catch(err => {
          loginError.textContent = 'Sai email hoặc mật khẩu!';
        });
    });

    document.getElementById('login-password').addEventListener('keydown', e => {
      if (e.key === 'Enter') loginBtn.click();
    });
  }
}

function doLogout() {
  auth.signOut();
}

// ============================================
// LOGIN FORM HTML (inject vào #login-section)
// ============================================
function injectLoginForm(title) {
  const loginSection = document.getElementById('login-section');
  loginSection.innerHTML = `
    <div class="login-card">
      <div class="login-logo">30</div>
      <h2>${title || 'Đăng nhập BTC'}</h2>
      <input type="email" id="login-email" placeholder="Email BTC" autocomplete="email">
      <input type="password" id="login-password" placeholder="Mật khẩu" autocomplete="current-password">
      <button id="btn-login">Đăng nhập</button>
      <p id="login-error" class="error-text"></p>
    </div>
  `;
}
