// Skylink CanSat 2026 - Main Engine

// Load posts from posts.js or fallback to localStorage
let posts = typeof SKYLINK_POSTS !== 'undefined' ? SKYLINK_POSTS : [];

try {
  const cached = localStorage.getItem('skylink_posts');
  if (cached) {
    posts = JSON.parse(cached);
  }
} catch (e) {
  console.log('Using default Skylink posts');
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

// Countdown: Live T-Minus to December 12, 2026
function updateCountdown() {
  const targetDate = new Date('December 12, 2026 09:00:00').getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Render Timeline Feed
function renderTimeline() {
  if (!timelineContainer) return;
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

    // Image thumbnail if available
    const thumbHtml = post.image ? `
      <div class="card-thumb-wrap">
        <img src="${post.image}" alt="${escapeHtml(post.title)}" class="card-thumb-img" loading="lazy">
      </div>
    ` : '';

    const milestonesHtml = post.milestones && post.milestones.length > 0
      ? `<ul class="card-milestones">${post.milestones.slice(0, 3).map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>`
      : '';

    card.innerHTML = `
      <div class="card-top">
        <span class="week-tag">WEEK 0${post.weekNumber}</span>
        <span class="status-tag ${statusClass}">${statusLabel}</span>
      </div>
      <div class="card-date">${post.dateRange}</div>
      <h3 class="card-title">${escapeHtml(post.title)}</h3>
      ${thumbHtml}
      <p class="card-summary">${escapeHtml(post.summary)}</p>
      ${milestonesHtml}
      <div class="card-footer">
        <span class="card-action">
          Read Mission Log
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

// Open Detail Modal
function openModal(post) {
  modalBadge.textContent = `WEEK 0${post.weekNumber} • ${post.status.toUpperCase()}`;
  modalTitle.textContent = post.title;
  modalDate.textContent = post.dateRange;

  let modalHtml = '';

  // Image in modal
  if (post.image) {
    modalHtml += `<img src="${post.image}" alt="${escapeHtml(post.title)}" class="modal-full-img">`;
  }

  // Telemetry box if present
  if (post.telemetry && Object.keys(post.telemetry).length > 0) {
    modalHtml += `<div class="telemetry-box">`;
    for (const [key, val] of Object.entries(post.telemetry)) {
      modalHtml += `<div class="telemetry-item"><span>${key.toUpperCase()}</span><strong>${escapeHtml(val)}</strong></div>`;
    }
    modalHtml += `</div>`;
  }

  // Full report or summary
  modalHtml += post.fullReport || post.content || `<p>${escapeHtml(post.summary)}</p>`;

  modalBody.innerHTML = modalHtml;
  logModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  logModal.classList.remove('active');
  document.body.style.overflow = '';
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (logModal) {
  logModal.addEventListener('click', (e) => {
    if (e.target === logModal) closeModal();
  });
}

// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTimeline();
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial render
renderTimeline();
