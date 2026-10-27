// Skylink CanSat 2026 - Main Reader Script

// Load posts from posts.js (with localStorage fallback if edited in browser)
let posts = typeof SKYLINK_POSTS !== 'undefined' ? SKYLINK_POSTS : [];

try {
  const cached = localStorage.getItem('skylink_posts');
  if (cached) {
    posts = JSON.parse(cached);
  }
} catch (e) {
  console.log('Using default Skylink posts');
}

const weeksList = document.getElementById('weeksList');
const readModal = document.getElementById('readModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTag = document.getElementById('modalTag');
const modalHeading = document.getElementById('modalHeading');
const modalDates = document.getElementById('modalDates');
const modalContent = document.getElementById('modalContent');

// Render the 7 Week Buttons
function renderWeeks() {
  weeksList.innerHTML = '';

  posts.forEach(post => {
    const btn = document.createElement('button');
    btn.className = 'week-btn';
    btn.type = 'button';

    const statusClass = post.status || 'upcoming';
    const statusLabel = statusClass === 'published' ? 'Live' : (statusClass === 'in-progress' ? 'Draft' : 'Locked');

    btn.innerHTML = `
      <div class="btn-left">
        <span class="week-num-badge">WEEK 0${post.week}</span>
        <div class="btn-info">
          <span class="btn-title">${post.title}</span>
          <span class="btn-dates">${post.dates}</span>
        </div>
      </div>
      <div class="btn-right">
        <span class="status-indicator ${statusClass}">${statusLabel}</span>
        <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    `;

    btn.addEventListener('click', () => openModal(post));
    weeksList.appendChild(btn);
  });
}

// Open & Close Reader Modal
function openModal(post) {
  modalTag.textContent = `WEEK 0${post.week} • ${post.status.toUpperCase()}`;
  modalHeading.textContent = post.title;
  modalDates.textContent = post.dates;
  modalContent.textContent = post.content || 'No log written yet for this week.';

  readModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  readModal.classList.remove('active');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
readModal.addEventListener('click', (e) => {
  if (e.target === readModal) closeModal();
});

// Initial Render
renderWeeks();
