// Skylink Admin Engine - Simple 7-Week Editor

const DEFAULT_PASS = 'cansat2026';

let skylinkData = typeof SKYLINK_POSTS !== 'undefined' ? SKYLINK_POSTS : [];

// Check localStorage for drafted edits
try {
  const cached = localStorage.getItem('skylink_posts');
  if (cached) skylinkData = JSON.parse(cached);
} catch (e) {
  console.log('Using default data');
}

const loginScreen = document.getElementById('loginScreen');
const dashboardApp = document.getElementById('dashboardApp');
const passcodeInput = document.getElementById('passcodeInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const editorContainer = document.getElementById('editorContainer');
const downloadTopBtn = document.getElementById('downloadTopBtn');
const downloadBottomBtn = document.getElementById('downloadBottomBtn');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const saveNotice = document.getElementById('saveNotice');

// Check Session
if (sessionStorage.getItem('skylink_admin_auth') === 'true') {
  showDashboard();
}

loginBtn.addEventListener('click', handleAuth);
passcodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAuth();
});

function handleAuth() {
  const entered = passcodeInput.value.trim();
  if (entered === DEFAULT_PASS || entered === 'admin') {
    sessionStorage.setItem('skylink_admin_auth', 'true');
    showDashboard();
  } else {
    loginError.textContent = 'Incorrect passcode. Try: cansat2026';
  }
}

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboardApp.style.display = 'block';
  renderEditorCards();
}

// Render the 7 Week Editor Cards
function renderEditorCards() {
  editorContainer.innerHTML = '';

  skylinkData.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'week-card';

    card.innerHTML = `
      <div class="card-header-bar">
        <div>
          <span class="card-week-title">WEEK 0${post.week}</span>
          <span class="card-dates-sub"> • ${post.dates}</span>
        </div>
        <select class="form-input" style="width: auto; margin-bottom: 0;" onchange="updateStatus(${index}, this.value)">
          <option value="published" ${post.status === 'published' ? 'selected' : ''}>🟢 Published (Live)</option>
          <option value="in-progress" ${post.status === 'in-progress' ? 'selected' : ''}>🟡 In Progress (Draft)</option>
          <option value="upcoming" ${post.status === 'upcoming' ? 'selected' : ''}>⚪ Upcoming (Locked)</option>
        </select>
      </div>

      <label class="field-label">Week Headline / Title</label>
      <input type="text" class="form-input" value="${escapeAttr(post.title)}" oninput="updateTitle(${index}, this.value)">

      <label class="field-label">Weekly Engineering Log (What you worked on)</label>
      <textarea class="textarea-input" oninput="updateContent(${index}, this.value)">${escapeText(post.content)}</textarea>
    `;

    editorContainer.appendChild(card);
  });
}

// Live update helpers
window.updateStatus = function(index, value) {
  skylinkData[index].status = value;
  persist();
};

window.updateTitle = function(index, value) {
  skylinkData[index].title = value;
  persist();
};

window.updateContent = function(index, value) {
  skylinkData[index].content = value;
  persist();
};

function persist() {
  try {
    localStorage.setItem('skylink_posts', JSON.stringify(skylinkData));
    showNotice('Auto-saved to device!');
  } catch (e) {
    console.error(e);
  }
}

function showNotice(msg) {
  saveNotice.textContent = msg;
  setTimeout(() => { saveNotice.textContent = ''; }, 2500);
}

// Download Updated posts.js
function triggerDownload() {
  const content = "// SKYLINK CanSat 2026 Weekly Blog Data\nconst SKYLINK_POSTS = " + JSON.stringify(skylinkData, null, 2) + ";\n";
  const blob = new Blob([content], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'posts.js';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showNotice('Downloaded posts.js! Drop it into GitHub to update.');
}

downloadTopBtn.addEventListener('click', triggerDownload);
downloadBottomBtn.addEventListener('click', triggerDownload);

// Copy Code to Clipboard
copyCodeBtn.addEventListener('click', () => {
  const content = "// SKYLINK CanSat 2026 Weekly Blog Data\nconst SKYLINK_POSTS = " + JSON.stringify(skylinkData, null, 2) + ";\n";
  navigator.clipboard.writeText(content).then(() => {
    showNotice('✓ Copied to clipboard! Ready to paste into GitHub.');
  }).catch(() => {
    alert('Could not auto-copy. Use Download button instead.');
  });
});

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;');
}

function escapeText(str) {
  return str || '';
}
