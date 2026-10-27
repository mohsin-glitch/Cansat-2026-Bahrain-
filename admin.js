// Skylink Mission Control Engine

// SECURE AUTHOR PASSCODE (Strictly confidential - no hints in UI)
const AUTHOR_HASH = 'Maf2211';

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

// DOM Elements
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

// Image upload DOM
const imageFileInput = document.getElementById('imageFileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const dropPrompt = document.getElementById('dropPrompt');

const saveAndDownloadBtn = document.getElementById('saveAndDownloadBtn');

// Check Session Authentication
if (sessionStorage.getItem('skylink_admin_authenticated') === 'true') {
  unlockDashboard();
}

loginBtn.addEventListener('click', attemptLogin);
passcodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') attemptLogin();
});

function attemptLogin() {
  const entered = passcodeInput.value.trim();
  if (entered === AUTHOR_HASH) {
    sessionStorage.setItem('skylink_admin_authenticated', 'true');
    unlockDashboard();
  } else {
    // Strictly generic error message without any hints
    loginError.textContent = 'Access Denied: Invalid passcode.';
    passcodeInput.value = '';
    passcodeInput.focus();
  }
}

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

    // Thumbnail
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
  editModalHeading.textContent = `Edit Week 0${post.weekNumber} Log`;

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

  editorModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close Modal
function closeEditor() {
  editorModal.classList.remove('active');
  document.body.style.overflow = '';
}
closeEditorBtn.addEventListener('click', closeEditor);

// Image File Upload & Web-Optimized Compression via Canvas
imageFileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawUrl = evt.target.result;
    
    // Compress image to ensure lightweight storage
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
