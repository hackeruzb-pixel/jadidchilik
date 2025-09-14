/* script.js — slaydlar, autoplay va musiqa boshqaruvi */

document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const thumbsContainer = document.getElementById('thumbs');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const autoplayBtn = document.getElementById('autoplay');
  const musicToggleBtn = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  let current = 0;
  let autoplay = false;
  let autoplayTimer = null;
  let musicPlaying = false; // starts off to prevent browser autoplay blocks
  const INTERVAL = 7000;

  // Build thumbnails dynamically from slides
  slides.forEach((slide, i) => {
    const titleEl = slide.querySelector('h1, h2')?.innerText || `Slide ${i+1}`;
    const thumb = document.createElement('button');
    thumb.className = 'thumb' + (i === 0 ? ' active' : '');
    thumb.type = 'button';
    thumb.dataset.index = i;
    thumb.innerText = `${i + 1}. ${titleEl}`;
    thumb.addEventListener('click', () => {
      showSlide(i);
      resetAutoplay();
    });
    thumbsContainer.appendChild(thumb);
  });

  const thumbs = Array.from(document.querySelectorAll('.thumb'));

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    thumbs.forEach(t => t.classList.remove('active'));
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    thumbs[current].classList.add('active');
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplay = true;
    autoplayBtn.innerText = '⏸ AutoPlay';
    autoplayTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAutoplay() {
    autoplay = false;
    autoplayBtn.innerText = '▶ AutoPlay';
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function toggleAutoplay() {
    autoplay ? stopAutoplay() : startAutoplay();
  }

  function resetAutoplay() {
    if (autoplay) {
      stopAutoplay();
      startAutoplay();
    }
  }

  // Music toggle with icon/text swap
  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicToggleBtn.innerText = '🎵 Musiqa';
      musicToggleBtn.setAttribute('aria-pressed', 'false');
    } else {
      // Attempt to play; catch errors silently (browsers may block autoplay)
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicToggleBtn.innerText = '🔇 O\'chirish';
        musicToggleBtn.setAttribute('aria-pressed', 'true');
      }).catch(() => {
        // If autoplay blocked, inform user (console) — user can click again
        console.warn('Brauzer audio autoplayni blokladi — musiqani boshlash uchun yana bosing.');
      });
    }
  }

  // Event listeners
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  autoplayBtn.addEventListener('click', toggleAutoplay);
  musicToggleBtn.addEventListener('click', toggleMusic);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
    if (e.key === ' ') { e.preventDefault(); toggleAutoplay(); }
    if (e.key.toLowerCase() === 'm') { toggleMusic(); }
  });

  // Pause autoplay while user hovers over slides area
  const slidesPanel = document.querySelector('.slides');
  slidesPanel.addEventListener('mouseenter', () => { if (autoplay) stopAutoplay(); });
  slidesPanel.addEventListener('mouseleave', () => { if (autoplay && !autoplayTimer) startAutoplay(); });

  // Initialize
  showSlide(0);
  // Note: we intentionally do NOT auto-play music at load to avoid browser autoplay blocking.
});
