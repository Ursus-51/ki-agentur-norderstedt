/* ============================================================
   KI Agentur Norderstedt — script.js
   Vanilla ES6 — kein Framework, keine Abhängigkeiten
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     1. NAVIGATION — Scroll State & Mobile
  ══════════════════════════════════════ */
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('hamburger');
  const navOverlay  = document.getElementById('nav-overlay');
  const overlayLinks = navOverlay ? navOverlay.querySelectorAll('a') : [];

  // Scroll → Nav-Hintergrund
  const updateNav = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger → Overlay öffnen / schließen
  const openMenu = () => {
    hamburger.classList.add('open');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  // Overlay-Links schließen das Menü
  overlayLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC-Taste schließt das Menü
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ══════════════════════════════════════
     2. HERO — Cursor Spotlight (ibelick style)
  ══════════════════════════════════════ */
  const heroSection        = document.getElementById('hero');
  const cursorSpotlight    = document.getElementById('hero-cursor-spotlight');

  if (heroSection && cursorSpotlight) {
    heroSection.addEventListener('mousemove', (e) => {
      const { left, top } = heroSection.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      cursorSpotlight.style.setProperty('--cx', `${x}px`);
      cursorSpotlight.style.setProperty('--cy', `${y}px`);
    });

    heroSection.addEventListener('mouseenter', () => {
      cursorSpotlight.style.setProperty('--spotlight-opacity', '1');
    });

    heroSection.addEventListener('mouseleave', () => {
      cursorSpotlight.style.setProperty('--spotlight-opacity', '0');
    });
  }


  /* ══════════════════════════════════════
     3. HERO — Word-Split Text Reveal
     Nur für Headlines OHNE Gradient-Klasse,
     da overflow:hidden den bg-clip bricht.
  ══════════════════════════════════════ */
  const heroHeadline = document.getElementById('hero-headline');

  if (heroHeadline && !heroHeadline.classList.contains('hero__headline--gradient')) {
    // Alle Text-Nodes verarbeiten, <br> und <em> erhalten
    const wrapWords = (el) => {
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(' ').filter(w => w.length > 0);
          const fragment = document.createDocumentFragment();
          words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.textContent = word;
            span.appendChild(inner);
            fragment.appendChild(span);
            if (i < words.length - 1) {
              fragment.appendChild(document.createTextNode(' '));
            }
          });
          node.replaceWith(fragment);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
          // Für <em> etc. ebenfalls wrappen
          const word = node.textContent.trim();
          if (word) {
            const outerSpan = document.createElement('span');
            outerSpan.className = 'word';
            const innerSpan = document.createElement('span');
            innerSpan.className = 'word-inner';
            // Klassen von Original übernehmen
            innerSpan.className = 'word-inner ' + (node.className || '');
            innerSpan.style.cssText = node.style.cssText;
            innerSpan.textContent = word;
            outerSpan.appendChild(innerSpan);
            node.replaceWith(outerSpan);
          }
        }
      });
    };

    wrapWords(heroHeadline);

    // Wörter mit gestaffeltem Delay einblenden
    const wordInners = heroHeadline.querySelectorAll('.word-inner');
    wordInners.forEach((inner, i) => {
      setTimeout(() => {
        inner.classList.add('revealed');
      }, 300 + i * 80);
    });
  }


  /* ══════════════════════════════════════
     4. SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  // Einzelne Elemente
  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Gestaffelte Kind-Elemente
  document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
    const children = parent.querySelectorAll('[data-reveal]');
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('revealed');
              }, i * 150);
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    staggerObserver.observe(parent);
  });


  /* ══════════════════════════════════════
     4. PROZESS — Timeline-Linie
  ══════════════════════════════════════ */
  const lineFill = document.getElementById('prozess-line-fill');
  const timelineSteps = document.querySelectorAll('.prozess__step');

  if (lineFill) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            lineFill.classList.add('revealed');
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    lineObserver.observe(document.getElementById('prozess-timeline') || lineFill.parentElement);
  }

  // Prozess-Schritte: Dot aktivieren beim Einblenden
  timelineSteps.forEach(step => {
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    stepObserver.observe(step);
  });


  /* ══════════════════════════════════════
     5. ABOUT — Differentiators Stagger
  ══════════════════════════════════════ */
  const diffItems = document.querySelectorAll('.about__diff-item');

  if (diffItems.length > 0) {
    const diffObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            diffItems.forEach((item, i) => {
              setTimeout(() => {
                item.classList.add('revealed');
              }, i * 120);
            });
            diffObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (diffItems[0]) diffObserver.observe(diffItems[0].parentElement);
  }


  /* ══════════════════════════════════════
     6. STATS — Zähler-Animation
  ══════════════════════════════════════ */
  const animateCounter = (el, target, duration = 1800) => {
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.innerHTML = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.innerHTML = prefix + target + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  const statValues = document.querySelectorAll('[data-count-target]');

  if (statValues.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.countTarget, 10);
            if (!isNaN(target)) {
              animateCounter(entry.target, target);
            }
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(el => counterObserver.observe(el));
  }


  /* ══════════════════════════════════════
     7. KONTAKT — Formular (mailto)
  ══════════════════════════════════════ */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    const validate = () => {
      let valid = true;

      // Name
      const nameInput  = document.getElementById('input-name');
      const nameGroup  = document.getElementById('group-name');
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('has-error');
        valid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Betrieb
      const betriebInput = document.getElementById('input-betrieb');
      const betriebGroup = document.getElementById('group-betrieb');
      if (!betriebInput.value.trim()) {
        betriebGroup.classList.add('has-error');
        valid = false;
      } else {
        betriebGroup.classList.remove('has-error');
      }

      // E-Mail
      const emailInput = document.getElementById('input-email');
      const emailGroup = document.getElementById('group-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        emailGroup.classList.add('has-error');
        valid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // DSGVO
      const dsgvoInput = document.getElementById('input-dsgvo');
      const dsgvoGroup = document.getElementById('group-dsgvo');
      if (!dsgvoInput.checked) {
        dsgvoGroup.classList.add('has-error');
        valid = false;
      } else {
        dsgvoGroup.classList.remove('has-error');
      }

      return valid;
    };

    // Echtzeit-Validierung bei Blur
    form.querySelectorAll('.form-input, .form-textarea, .form-checkbox').forEach(input => {
      input.addEventListener('blur', validate);
      input.addEventListener('change', validate);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validate()) return;

      const name      = document.getElementById('input-name').value.trim();
      const betrieb   = document.getElementById('input-betrieb').value.trim();
      const email     = document.getElementById('input-email').value.trim();
      const telefon   = document.getElementById('input-telefon').value.trim();
      const nachricht = document.getElementById('input-nachricht').value.trim();

      const subject = encodeURIComponent(`Gesprächsanfrage von ${name} (${betrieb})`);

      let body = `Name: ${name}\nBetrieb: ${betrieb}\nE-Mail: ${email}`;
      if (telefon) body += `\nTelefon: ${telefon}`;
      if (nachricht) body += `\n\nNachricht:\n${nachricht}`;

      const mailtoLink = `mailto:kontakt@ki-agentur-norderstedt.de?subject=${subject}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;

      // Erfolgsmeldung nach kurzem Delay anzeigen
      setTimeout(() => {
        form.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
        }
      }, 500);
    });
  }


  /* ══════════════════════════════════════
     8. SMOOTH SCROLL für Anker-Links
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

});
