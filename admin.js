// Skylink Mission Control Engine

// SECURE SHA-256 HASH OF AUTHOR PASSCODE (Zero plaintext in codebase)
const SECURE_AUTH_HASH = 'b3e2ac5f49001e7d9b2e654a83f393e0e13b277b9eb13aa31601d99afa166196';

// Load initial posts
let adminPosts = [];
try {
  const cached = localStorage.getItem('skylink_posts');
  adminPosts = cached ? JSON.parse(cached) : (typeof SKYLINK_POSTS !== 'undefined' ? SKYLINK_POSTS : []);
} catch (e) {
  adminPosts = typeof SKYLINK_POSTS !== 'undefined' ? SKYLINK_POSTS : [];
}

let activeEditIndex = null;
let currentImageData = '';
let failedAttempts = parseInt(sessionStorage.getItem('skylink_fail_count') || '0', 10);
let lockoutUntil = parseInt(sessionStorage.getItem('skylink_lockout_until') || '0', 10);

// DOM Elements
const authForm = document.getElementById('authForm');
const loginScreen = document.getElementById('loginScreen');
const dashboardApp = document.getElementById('dashboardApp');
const passcodeInput = document.getElementById('passcodeInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Dashboard Elements
const totalWeeksNum = document.getElementById('totalWeeksNum');
const pubNum = document.getElementById('pubNum');
const progNum = document.getElementById('progNum');
const upNum = document.getElementById('upNum');
const postsTable = document.getElementById('postsTable');
const globalStatus = document.getElementById('globalStatus');

const downloadTopBtn = document.getElementById('downloadTopBtn');
const downloadBannerBtn = document.getElementById('downloadBannerBtn');
const copyCodeBtn = document.getElementById('copyCodeBtn');

// Modal Elements
const editorModal = document.getElementById('editorModal');
const closeEditorBtn = document.getElementById('closeEditorBtn');
const editModalBadge = document.getElementById('editModalBadge');
const editModalHeading = document.getElementById('editModalHeading');
const editorForm = document.getElementById('editorForm');

const fWeekNum = document.getElementById('fWeekNum');
const fDates = document.getElementById('fDates');
const fStatus = document.getElementById('fStatus');
const fTitle = document.getElementById('fTitle');
const fSummary = document.getElementById('fSummary');
const fMilestones = document.getElementById('fMilestones');
const fTelemMcu = document.getElementById('fTelemMcu');
const fTelemMass = document.getElementById('fTelemMass');
const fTelemSensor = document.getElementById('fTelemSensor');
const fTelemBattery = document.getElementById('fTelemBattery');
const fFullReport = document.getElementById('fFullReport');

// Writing Tools DOM
const tabWriteBtn = document.getElementById('tabWriteBtn');
const tabPreviewBtn = document.getElementById('tabPreviewBtn');
const writePane = document.getElementById('writePane');
const previewPane = document.getElementById('previewPane');
const writingToolbar = document.getElementById('writingToolbar');
const insertTemplateBtn = document.getElementById('insertTemplateBtn');

// Image upload DOM
const imageFileInput = document.getElementById('imageFileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const dropPrompt = document.getElementById('dropPrompt');

const saveAndDownloadBtn = document.getElementById('saveAndDownloadBtn');

// Launch Countdown in Dashboard
function updateDashCountdown() {
  const targetDate = new Date('December 12, 2026 09:00:00').getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const d = document.getElementById('dDays');
    const h = document.getElementById('dHours');
    const m = document.getElementById('dMinutes');
    const s = document.getElementById('dSeconds');

    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(minutes).padStart(2, '0');
    if (s) s.textContent = String(seconds).padStart(2, '0');
  }
}
setInterval(updateDashCountdown, 1000);
updateDashCountdown();

// Check Session Authentication
if (sessionStorage.getItem('skylink_admin_authenticated') === 'true') {
  unlockDashboard();
}

// SHA-256 Password Hash Computation
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (now < lockoutUntil) {
    const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
    loginError.textContent = `Security Lockout: Try again in ${remainingSecs}s.`;
    return;
  }

  const entered = passcodeInput.value.trim();
  const enteredHash = await sha256(entered);

  if (enteredHash === SECURE_AUTH_HASH) {
    sessionStorage.setItem('skylink_admin_authenticated', 'true');
    sessionStorage.removeItem('skylink_fail_count');
    sessionStorage.removeItem('skylink_lockout_until');
    unlockDashboard();
  } else {
    failedAttempts++;
    sessionStorage.setItem('skylink_fail_count', failedAttempts.toString());

    if (failedAttempts >= 5) {
      lockoutUntil = Date.now() + 300000; // 5 min lockout
      sessionStorage.setItem('skylink_lockout_until', lockoutUntil.toString());
      loginError.textContent = 'Too many failed attempts. Security lockout active (5 min).';
    } else {
      loginError.textContent = 'Access Denied: Invalid credentials.';
    }
    passcodeInput.value = '';
    passcodeInput.focus();
  }
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('skylink_admin_authenticated');
  dashboardApp.style.display = 'none';
  loginScreen.style.display = 'flex';
  passcodeInput.value = '';
  loginError.textContent = '';
});

function unlockDashboard() {
  loginScreen.style.display = 'none';
  dashboardApp.style.display = 'block';
  renderDashboard();
}

// Render Dashboard
function renderDashboard() {
  totalWeeksNum.textContent = adminPosts.length;
  pubNum.textContent = adminPosts.filter(p => p.status === 'published').length;
  progNum.textContent = adminPosts.filter(p => p.status === 'in-progress').length;
  upNum.textContent = adminPosts.filter(p => p.status === 'upcoming').length;

  postsTable.innerHTML = '';

  adminPosts.forEach((post, index) => {
    const row = document.createElement('div');
    row.className = 'admin-week-row';

    const statusBadgeClass = post.status;
    const statusLabel = post.status === 'published' ? 'PUBLISHED' : (post.status === 'in-progress' ? 'IN PROGRESS' : 'UPCOMING');

    const thumbHtml = post.image 
      ? `<img src="${post.image}" alt="Thumb" class="row-thumb">`
      : '';

    row.innerHTML = `
      <div class="row-left">
        <span class="row-week-tag">WEEK 0${post.weekNumber}</span>
        ${thumbHtml}
        <div class="row-details">
          <h4>${escapeHtml(post.title)}</h4>
          <div class="row-meta">
            <span>📅 ${post.dateRange}</span>
            <span class="status-tag ${statusBadgeClass}">${statusLabel}</span>
          </div>
        </div>
      </div>
      <div class="row-right">
        <button class="btn-edit" onclick="openWeekEditor(${index})">✏️ Edit Log</button>
      </div>
    `;

    postsTable.appendChild(row);
  });
}

// Open Week Editor
window.openWeekEditor = function(index) {
  activeEditIndex = index;
  const post = adminPosts[index];
  if (!post) return;

  editModalBadge.textContent = `WEEK 0${post.weekNumber}`;
  editModalHeading.textContent = `Edit Week 0${post.weekNumber} Mission Log`;

  fWeekNum.value = post.weekNumber;
  fDates.value = post.dateRange;
  fStatus.value = post.status;
  fTitle.value = post.title;
  fSummary.value = post.summary || '';
  fMilestones.value = (post.milestones || []).join('\n');
  fFullReport.value = post.fullReport || '';

  // Telemetry
  const telem = post.telemetry || {};
  fTelemMcu.value = telem.mcu || telem.chassis || '';
  fTelemMass.value = telem.targetMass || telem.finalMass || '';
  fTelemSensor.value = telem.altimeter || telem.sensor || '';
  fTelemBattery.value = telem.battery || telem.radio || '';

  // Image
  currentImageData = post.image || '';
  if (currentImageData) {
    imagePreview.src = currentImageData;
    imagePreviewContainer.style.display = 'block';
    dropPrompt.style.display = 'none';
  } else {
    imagePreview.src = '';
    imagePreviewContainer.style.display = 'none';
    dropPrompt.style.display = 'block';
  }

  // Reset writing tab to write mode
  switchWritingTab('write');

  editorModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close Modal
function closeEditor() {
  editorModal.classList.remove('active');
  document.body.style.overflow = '';
}
closeEditorBtn.addEventListener('click', closeEditor);

// Writing Tools: Insert Formatting into Textarea
function insertFormatting(startTag, endTag) {
  const textarea = fFullReport;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || 'text';

  const replacement = startTag + selectedText + endTag;
  textarea.value = text.substring(0, start) + replacement + text.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
}

// Toolbar Click Handlers
writingToolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tool-btn');
  if (!btn) return;
  const tool = btn.getAttribute('data-tool');

  switch (tool) {
    case 'bold':
      insertFormatting('<b>', '</b>');
      break;
    case 'italic':
      insertFormatting('<i>', '</i>');
      break;
    case 'h3':
      insertFormatting('<h3>', '</h3>\n');
      break;
    case 'h4':
      insertFormatting('<h4>', '</h4>\n');
      break;
    case 'bullet':
      insertFormatting('<ul>\n  <li>', '</li>\n</ul>\n');
      break;
    case 'number':
      insertFormatting('<ol>\n  <li>', '</li>\n</ol>\n');
      break;
    case 'callout':
      insertFormatting('<div class="callout-box">💬 ', '</div>\n');
      break;
    case 'code':
      insertFormatting('<code>', '</code>');
      break;
  }
});

// Insert CanSat Weekly Template
insertTemplateBtn.addEventListener('click', () => {
  const template = `<h4>🚀 Weekly Objective</h4>
<p>Our primary focus this week was...</p>

<h4>⚙️ Hardware & Electronics Work</h4>
<p>We integrated and bench-tested the following modules...</p>

<div class="callout-box">
  💬 Key Engineering Finding: Sensor calibration reduced reading variance by 40%.
</div>

<h4>📡 Telemetry & Flight Software</h4>
<p>Software development status and communication packets...</p>

<h4>⚠️ Challenges & Solutions</h4>
<p>We encountered an issue with... and resolved it by...</p>

<h4>🎯 Next Week's Milestones</h4>
<p>Upcoming target for the next testing sprint...</p>`;

  if (fFullReport.value.trim().length > 0) {
    if (confirm('Append the CanSat weekly template to your current text?')) {
      fFullReport.value += '\n\n' + template;
    }
  } else {
    fFullReport.value = template;
  }
});

// Tabs: Write Mode vs Live Preview
tabWriteBtn.addEventListener('click', () => switchWritingTab('write'));
tabPreviewBtn.addEventListener('click', () => switchWritingTab('preview'));

function switchWritingTab(tab) {
  if (tab === 'write') {
    tabWriteBtn.classList.add('active');
    tabPreviewBtn.classList.remove('active');
    writePane.style.display = 'block';
    previewPane.style.display = 'none';
  } else {
    tabWriteBtn.classList.remove('active');
    tabPreviewBtn.classList.add('active');
    writePane.style.display = 'none';
    previewPane.style.display = 'block';
    renderLivePreview();
  }
}

function renderLivePreview() {
  const raw = fFullReport.value;
  previewPane.innerHTML = raw.trim() ? raw : '<p style="color:var(--text-dim);font-style:italic;">Nothing written yet. Switch to Write Mode to add content.</p>';
}

// Image File Upload & Web-Optimized Canvas Compression
imageFileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawUrl = evt.target.result;
    
    // Scale & compress image to max 1000px
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1000;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      currentImageData = canvas.toDataURL('image/jpeg', 0.82);
      imagePreview.src = currentImageData;
      imagePreviewContainer.style.display = 'block';
      dropPrompt.style.display = 'none';
    };
    img.src = rawUrl;
  };
  reader.readAsDataURL(file);
});

// Remove Image
removeImageBtn.addEventListener('click', () => {
  currentImageData = '';
  imagePreview.src = '';
  imagePreviewContainer.style.display = 'none';
  dropPrompt.style.display = 'block';
  imageFileInput.value = '';
});

// Save Changes
editorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveCurrentFormData();
  closeEditor();
  showGlobalStatus('✓ Week updated successfully!');
});

saveAndDownloadBtn.addEventListener('click', () => {
  saveCurrentFormData();
  closeEditor();
  downloadPostsJs();
});

function saveCurrentFormData() {
  if (activeEditIndex === null) return;

  const milestones = fMilestones.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const telem = {};
  if (fTelemMcu.value.trim()) telem.mcu = fTelemMcu.value.trim();
  if (fTelemMass.value.trim()) telem.targetMass = fTelemMass.value.trim();
  if (fTelemSensor.value.trim()) telem.altimeter = fTelemSensor.value.trim();
  if (fTelemBattery.value.trim()) telem.battery = fTelemBattery.value.trim();

  adminPosts[activeEditIndex].dateRange = fDates.value;
  adminPosts[activeEditIndex].status = fStatus.value;
  adminPosts[activeEditIndex].title = fTitle.value;
  adminPosts[activeEditIndex].summary = fSummary.value;
  adminPosts[activeEditIndex].image = currentImageData;
  adminPosts[activeEditIndex].milestones = milestones;
  adminPosts[activeEditIndex].telemetry = telem;
  adminPosts[activeEditIndex].fullReport = fFullReport.value;

  try {
    localStorage.setItem('skylink_posts', JSON.stringify(adminPosts));
  } catch (err) {
    console.error('Storage error', err);
  }

  renderDashboard();
}

function showGlobalStatus(msg) {
  globalStatus.textContent = msg;
  setTimeout(() => { globalStatus.textContent = ''; }, 3000);
}

// Download File
function downloadPostsJs() {
  const content = "// SKYLINK - CanSat 2026 Official Mission Data\nconst SKYLINK_POSTS = " + JSON.stringify(adminPosts, null, 2) + ";\n";
  const blob = new Blob([content], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'posts.js';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showGlobalStatus('📥 Downloaded posts.js! Replace this file on GitHub.');
}

downloadTopBtn.addEventListener('click', downloadPostsJs);
downloadBannerBtn.addEventListener('click', downloadPostsJs);

// Copy Code
copyCodeBtn.addEventListener('click', () => {
  const content = "// SKYLINK - CanSat 2026 Official Mission Data\nconst SKYLINK_POSTS = " + JSON.stringify(adminPosts, null, 2) + ";\n";
  navigator.clipboard.writeText(content).then(() => {
    showGlobalStatus('📋 Copied posts.js code to clipboard!');
  }).catch(() => {
    alert('Copy failed. Use the Download button instead.');
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
