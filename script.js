const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
const yearEl = document.querySelector('#year');
const form = document.querySelector('#contact-form');
const note = document.querySelector('#form-note');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const revealEls = document.querySelectorAll(
  '.hero-grid, .steps, .revenue-grid, .card, .faq-list, .about-layout, #contact-form, .pill-list'
);

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    });
  });
}

if (sections.length && navLinks.length) {
  const setActiveNav = () => {
    let activeId = sections[0]?.id ?? '';
    const offset = 150;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const bottom = top + section.offsetHeight;
      const currentScroll = window.scrollY + offset;

      if (currentScroll >= top && currentScroll < bottom) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', id === activeId);
    });
  };

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
}

if ('IntersectionObserver' in window && revealEls.length) {
  revealEls.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -12% 0px'
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const organization = String(formData.get('organization') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !organization || !message) {
      note.textContent = 'Please complete all fields before sending.';
      return;
    }

    const subject = encodeURIComponent(`Fundraiser Inquiry from ${organization}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nOrganization: ${organization}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:ltmullaney24@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Your email app should open now. If it does not, please call 480-630-7558.';
  });
}
