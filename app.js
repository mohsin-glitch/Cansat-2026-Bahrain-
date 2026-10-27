// CanSat 2026 Engine Logic

// Load initial posts from posts.js (or fallback)
let posts = typeof CANSAT_POSTS !== 'undefined' ? CANSAT_POSTS : [];

// Check local storage for quick in-browser preview edits
try {
  const cached = localStorage.getItem('cansat_2026_posts');
  if (cached) {
    posts = JSON.parse(cached);
  }
} catch (e) {
  console.log('Using default posts');
}

let currentFilter = 'all';

// DOM Elements
const timelineContainer = document.getElementById('timelineContainer');
const filterBtns = document.querySelectorAll('.filter-btn');
const logModal = document.getElementById('logModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalBody = document.getElementById('modalBody');

// Admin Elements
const authorModeBtn = document.getElementById('authorModeBtn');
const adminModal = document.getElementById('adminModal');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const authGate = document.getElementById('authGate');
const editorPanel = document.getElementById('editorPanel');
const adminPassInput = document.getElementById('adminPassInput');
const verifyPassBtn = document.getElementById('verifyPassBtn');
const authError = document.getElementById('authError');
const editWeekSelect = document.getElementById('editWeekSelect');
const editStatusSelect = document.getElementById('editStatusSelect');
const editTitleInput = document.getElementById('editTitleInput');
const editSummaryInput = document.getElementById('editSummaryInput');
const editMilestonesInput = document.getElementById('editMilestonesInput');
const editBodyInput = document.getElementById('editBodyInput');
const saveChangesBtn = document.getElementById('saveChangesBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');

// Countdown setup (T-minus to December 12, 2026)
function updateCountdown() {
  const targetDate = new Date('December 12, 2026 09:00:00').getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  } else {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Render Timeline Feed
function renderTimeline() {
  timelineContainer.innerHTML = '';

  const filtered = posts.filter(post => {
    if (currentFilter === 'all') return true;
    return post.status === currentFilter;
  });

  if (filtered.length === 0) {
    timelineContainer.innerHTML = `<p style="text-align:center; color: var(--text-dim); padding: 30px;">No logs found for this filter.</p>`;
    return;
  }

  filtered.forEach(post => {
    const card = document.createElement('article');
    card.className = `log-card ${post.status}`;
    card.setAttribute('data-id', post.id);

    const statusLabel = post.status === 'published' ? 'PUBLISHED' : (post.status === 'in-progress' ? 'IN PROGRESS' : 'UPCOMING');
    const statusClass = post.status;

    const milestonesHtml = post.milestones && post.milestones.length > 0
      ? `<ul class="card-milestones">${post.milestones.slice(0, 3).map(m => `<li>${m}</li>`).join('')}</ul>`
      : '';

    card.innerHTML = `
      <div class="card-top">
        <span class="week-tag">WEEK 0${post.weekNumber}</span>
        <span class="status-tag ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-date">${post.dateRange}</div>
      <h3 class="card-title">${post.title}</h3>
      <p class="card-summary">${post.summary}</p>
      ${milestonesHtml}
      <div class="card-footer">
        <span class="card-action">
          Read Log
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    `;

    card.addEventListener('click', () => openModal(post));
    timelineContainer.appendChild(card);
  });
}

// Modal View
function openModal(post) {
  modalBadge.textContent = `WEEK 0${post.weekNumber} • ${post.status.toUpperCase()}`;
  modalTitle.textContent = post.title;
  modalDate.textContent = post.dateRange;
  modalBody.innerHTML = post.fullReport || post.details || `<p>${post.summary}</p>`;
  logModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  logModal.classList.remove('active');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
logModal.addEventListener('click', (e) => {
  if (e.target === logModal) closeModal();
});

// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTimeline();
  });
});

// Admin Passcode & Author Mode
authorModeBtn.addEventListener('click', () => {
  adminModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeAdminBtn.addEventListener('click', () => {
  adminModal.classList.remove('active');
  document.body.style.overflow = '';
});

verifyPassBtn.addEventListener('click', () => {
  const entered = adminPassInput.value.trim();
  if (entered === 'cansat2026' || entered === 'admin') {
    authGate.style.display = 'none';
    editorPanel.style.display = 'block';
    populateWeekSelect();
  } else {
    authError.textContent = 'Invalid passcode. Default is: cansat2026';
  }
});

function populateWeekSelect() {
  editWeekSelect.innerHTML = '';
  posts.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `Week ${p.weekNumber}: ${p.title.slice(0, 32)}...`;
    editWeekSelect.appendChild(opt);
  });
  loadPostIntoForm(posts[0].id);
}

function loadPostIntoForm(id) {
  const post = posts.find(p => p.id === parseInt(id));
  if (!post) return;
  editStatusSelect.value = post.status;
  editTitleInput.value = post.title;
  editSummaryInput.value = post.summary;
  editMilestonesInput.value = (post.milestones || []).join('\n');
  editBodyInput.value = post.fullReport || post.details || '';
}

editWeekSelect.addEventListener('change', (e) => {
  loadPostIntoForm(e.target.value);
});

saveChangesBtn.addEventListener('click', () => {
  const selectedId = parseInt(editWeekSelect.value);
  const targetIndex = posts.findIndex(p => p.id === selectedId);
  if (targetIndex === -1) return;

  const milestonesArray = editMilestonesInput.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  posts[targetIndex].title = editTitleInput.value;
  posts[targetIndex].status = editStatusSelect.value;
  posts[targetIndex].summary = editSummaryInput.value;
  posts[targetIndex].milestones = milestonesArray;
  posts[targetIndex].fullReport = editBodyInput.value;

  try {
    localStorage.setItem('cansat_2026_posts', JSON.stringify(posts));
  } catch (err) {
    console.error('Storage error', err);
  }

  renderTimeline();
  alert('Week updated preview on your device! To save permanently for all visitors, update your posts.js file.');
});

exportJsonBtn.addEventListener('click', () => {
  const exportContent = "const CANSAT_POSTS = " + JSON.stringify(posts, null, 2) + ";";
  const blob = new Blob([exportContent], { type: 'text/javascript' });
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = URL.createObjectURL(blob);
  downloadAnchor.download = "posts.js";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// Initial render
renderTimeline();
