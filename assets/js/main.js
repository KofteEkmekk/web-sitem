const progress = document.getElementById('progress');
const nav = document.getElementById('navWrap');

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  nav.classList.toggle('scrolled', scrollY > 30);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const menu = document.getElementById('menuBtn');
const links = document.getElementById('navLinks');

menu.addEventListener('click', () => {
  links.classList.toggle('open');
  menu.textContent = links.classList.contains('open') ? '×' : '☰';
});

links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  links.classList.remove('open');
  menu.textContent = '☰';
}));

const memoryTrack = document.getElementById('memoryTrack');
const memoryCards = Array.from(document.querySelectorAll('.memory-card'));

if (memoryTrack) {
  const memoryObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { root: memoryTrack, threshold: .45 });
  memoryCards.forEach(card => memoryObserver.observe(card));

  function updateMemoryFocus() {
    const trackRect = memoryTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let nearestCard = memoryCards[0];
    let nearestDistance = Infinity;

    memoryCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      const normalized = Math.min(distance / (cardRect.width * 1.35), 1);
      const scale = 1 - normalized * .28;

      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(1 - normalized * .55);
      card.classList.toggle('is-active', normalized < .14);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCard = card;
      }
    });

    nearestCard.classList.add('is-active');
  }

  memoryTrack.addEventListener('scroll', updateMemoryFocus, { passive: true });
  window.addEventListener('resize', updateMemoryFocus);
  updateMemoryFocus();

  document.getElementById('memoryPrev').addEventListener('click', () => {
    memoryTrack.scrollBy({ left: -(memoryCards[0].getBoundingClientRect().width + 16), behavior: 'smooth' });
  });
  document.getElementById('memoryNext').addEventListener('click', () => {
    memoryTrack.scrollBy({ left: memoryCards[0].getBoundingClientRect().width + 16, behavior: 'smooth' });
  });
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', event => {
  event.preventDefault();

  const formValues = new FormData(contactForm);
  const name = String(formValues.get('name') || '').trim();
  const email = String(formValues.get('email') || '').trim();
  const subject = String(formValues.get('subject') || '').trim() || 'Web sitesi iletişim formu';
  const message = String(formValues.get('message') || '').trim();
  const body = `Ad: ${name}\nE-posta: ${email}\n\n${message}`;
  const mailtoUrl = `mailto:inanaydgn001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = document.getElementById('contactStatus');
  const submitButton = contactForm.querySelector('.contact-submit');

  status.textContent = 'E-posta uygulaması açılıyor...';
  submitButton.disabled = true;

  const mailLink = document.createElement('a');
  mailLink.href = mailtoUrl;
  mailLink.click();

  window.setTimeout(() => {
    submitButton.disabled = false;
    status.textContent = 'E-posta uygulaması açılmadıysa adresi kopyalayıp e-posta gönderebilirsin.';
  }, 1200);
});

document.getElementById('copyEmail').addEventListener('click', async () => {
  const status = document.getElementById('contactStatus');

  try {
    await navigator.clipboard.writeText('inanaydgn001@gmail.com');
    status.textContent = 'E-posta adresi kopyalandı.';
  } catch {
    const addressField = document.createElement('textarea');
    addressField.value = 'inanaydgn001@gmail.com';
    addressField.style.position = 'fixed';
    addressField.style.opacity = '0';
    document.body.appendChild(addressField);
    addressField.select();
    document.execCommand('copy');
    addressField.remove();
    status.textContent = 'E-posta adresi kopyalandı.';
  }
});

const preloader = document.getElementById('preloader');
const preloaderStartedAt = performance.now();
let preloaderDismissed = false;

function dismissPreloader() {
  if (preloaderDismissed) return;
  preloaderDismissed = true;

  const minimumVisibleTime = 650;
  const elapsed = performance.now() - preloaderStartedAt;
  window.setTimeout(() => {
    preloader.classList.add('is-hidden');
    preloader.setAttribute('aria-hidden', 'true');
  }, Math.max(0, minimumVisibleTime - elapsed));
}

if (document.readyState === 'complete') {
  dismissPreloader();
} else {
  window.addEventListener('load', dismissPreloader, { once: true });
}

window.setTimeout(dismissPreloader, 4500);
