/* =========================================================
   PORTFOLIO – Dayanara Guerrero
   main.js – Interactividad Principal
   ========================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. DATOS DE PROYECTOS
   ───────────────────────────────────────────────────────── */
const projects = [
  {
    id: 1,
    title: 'Sistema de Asistencia Biométrica',
    category: 'Desarrollo',
    description:
      'Arquitectura híbrida para control de asistencia con geolocalización e inteligencia artificial para detección de anomalías y patrones de comportamiento. Tesis de grado en curso.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800',
    tags: ['Python', 'Django', 'IA/ML', 'Geolocalización', 'SQL Server'],
    year: '2024',
  },
  {
    id: 2,
    title: 'Automatización IoT Industrial',
    category: 'Hardware/IoT',
    description:
      'Sistema de llenado automatizado de líquidos integrando Arduino Nano, bombas DC de 12V y módulos relé para el control preciso de fluidos en entornos industriales.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
    tags: ['Arduino', 'C++', 'IoT', 'Electrónica', 'Automatización'],
    year: '2023',
  },
  {
    id: 3,
    title: 'Gestión Corporativa TI',
    category: 'Infraestructura',
    description:
      'Administración de Directorio Activo, implementación de políticas de grupo (GPO) y soporte L1/L2 en Cooperativa Riobamba Ltda. Gestión de redes LAN/WAN corporativas.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
    tags: ['Active Directory', 'GPO', 'Redes LAN/WAN', 'Soporte L1/L2', 'Wireshark'],
    year: '2023',
  },
];

/* ─────────────────────────────────────────────────────────
   2. UTILIDADES
   ───────────────────────────────────────────────────────── */

/**
 * Crea un elemento HTML con atributos opcionales y contenido.
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {string} [innerHTML]
 * @returns {HTMLElement}
 */
function createElement(tag, attrs = {}, innerHTML = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') {
      el.className = val;
    } else {
      el.setAttribute(key, val);
    }
  });
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

/* ─────────────────────────────────────────────────────────
   3. MENÚ RESPONSIVE (TOGGLE MÓVIL)
   ───────────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Cerrar al hacer clic en un enlace */
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Cerrar al hacer clic fuera */
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      toggle.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ─────────────────────────────────────────────────────────
   4. RENDERIZADO Y FILTRO DE PROYECTOS
   ───────────────────────────────────────────────────────── */

/**
 * Genera el HTML de una tarjeta de proyecto.
 * @param {Object} project
 * @returns {HTMLElement}
 */
function buildProjectCard(project) {
  const article = createElement('article', { className: 'project-card' });

  const figure = createElement('figure', { className: 'project-card-figure' });
  const img = createElement('img', {
    src: project.image,
    alt: project.title,
    loading: 'lazy',
    decoding: 'async',
  });
  const figcaption = createElement('figcaption', {}, project.category);
  figure.appendChild(img);
  figure.appendChild(figcaption);

  const body = createElement('div', { className: 'project-card-body' });
  const titleEl = createElement('h3', { className: 'project-card-title' }, project.title);
  const desc = createElement('p', { className: 'project-card-desc' }, project.description);
  body.appendChild(titleEl);
  body.appendChild(desc);

  const footer = createElement('div', { className: 'project-card-footer' });
  project.tags.forEach((tag) => {
    const tagEl = createElement('span', { className: 'project-card-tag' }, tag);
    footer.appendChild(tagEl);
  });

  article.appendChild(figure);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}

/**
 * Renderiza los proyectos filtrados en el contenedor #projects-grid.
 * @param {string} activeFilter - 'Todos' o una categoría específica.
 */
function renderProjects(activeFilter = 'Todos') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  /* Limpiar el grid */
  grid.innerHTML = '';

  if (filtered.length === 0) {
    const empty = createElement(
      'p',
      { style: 'color:var(--text-muted);font-size:var(--text-sm);grid-column:1/-1;' },
      'No hay proyectos en esta categoría.'
    );
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((project) => {
    const card = buildProjectCard(project);
    grid.appendChild(card);
  });
}

/**
 * Inicializa los botones de filtro y el renderizado inicial.
 */
function initProjectFilters() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      /* Quitar is-active de todos */
      buttons.forEach((b) => b.classList.remove('is-active'));
      /* Activar el clicado */
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      renderProjects(filter);
    });
  });

  /* Render inicial: mostrar todos */
  renderProjects('Todos');
}

/* ─────────────────────────────────────────────────────────
   5. VALIDACIÓN DE FORMULARIO
   ───────────────────────────────────────────────────────── */
const REGEX = {
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  name:  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,}$/,
};

/**
 * Aplica o quita el estado de error a un input y su mensaje de error asociado.
 * @param {HTMLElement} input
 * @param {HTMLElement|null} errorEl
 * @param {boolean} hasError
 * @param {string} [msg]
 */
function setFieldError(input, errorEl, hasError, msg = '') {
  if (hasError) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('is-visible');
    }
  } else {
    input.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }
}

/**
 * Muestra un banner de feedback en el formulario.
 * @param {HTMLElement} form
 * @param {'success'|'error'} type
 * @param {string} message
 */
function showFormFeedback(form, type, message) {
  /* Eliminar feedbacks anteriores */
  const prev = form.querySelectorAll('.form-feedback');
  prev.forEach((el) => el.remove());

  const icon = type === 'success' ? '✓' : '✗';
  const feedback = createElement(
    'div',
    { className: `form-feedback form-feedback--${type} is-visible`, role: 'alert' },
    `<span>${icon}</span><span>${message}</span>`
  );
  form.appendChild(feedback);

  if (type === 'success') {
    setTimeout(() => {
      feedback.classList.remove('is-visible');
    }, 6000);
  }
}

/**
 * Valida y procesa el envío del formulario de contacto.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput    = form.querySelector('#field-name');
  const emailInput   = form.querySelector('#field-email');
  const subjectInput = form.querySelector('#field-subject');
  const messageInput = form.querySelector('#field-message');

  const nameError    = form.querySelector('#error-name');
  const emailError   = form.querySelector('#error-email');
  const subjectError = form.querySelector('#error-subject');
  const messageError = form.querySelector('#error-message');

  /* Limpiar errores en tiempo real al escribir */
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    /* Validar nombre */
    const nameVal = (nameInput ? nameInput.value : '').trim();
    if (!nameVal || !REGEX.name.test(nameVal)) {
      setFieldError(nameInput, nameError, true, 'Por favor ingresa un nombre válido (mín. 2 caracteres).');
      isValid = false;
    } else {
      setFieldError(nameInput, nameError, false);
    }

    /* Validar email */
    const emailVal = (emailInput ? emailInput.value : '').trim();
    if (!emailVal || !REGEX.email.test(emailVal)) {
      setFieldError(emailInput, emailError, true, 'Ingresa un correo electrónico válido (ej: tu@email.com).');
      isValid = false;
    } else {
      setFieldError(emailInput, emailError, false);
    }

    /* Validar asunto */
    const subjectVal = (subjectInput ? subjectInput.value : '').trim();
    if (!subjectVal || subjectVal.length < 3) {
      setFieldError(subjectInput, subjectError, true, 'El asunto debe tener al menos 3 caracteres.');
      isValid = false;
    } else {
      setFieldError(subjectInput, subjectError, false);
    }

    /* Validar mensaje */
    const messageVal = (messageInput ? messageInput.value : '').trim();
    if (!messageVal || messageVal.length < 10) {
      setFieldError(messageInput, messageError, true, 'El mensaje debe tener al menos 10 caracteres.');
      isValid = false;
    } else {
      setFieldError(messageInput, messageError, false);
    }

    if (!isValid) {
      showFormFeedback(form, 'error', 'Por favor corrige los campos marcados antes de enviar.');
      /* Enfocar el primer campo con error */
      const firstError = form.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      return;
    }

    /* ── Simulación de envío exitoso ── */
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
    }

    setTimeout(() => {
      showFormFeedback(
        form,
        'success',
        `¡Gracias ${nameVal}! Tu mensaje fue enviado. Te responderé pronto.`
      );
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    }, 1200);
  });
}

/* ─────────────────────────────────────────────────────────
   6. SMOOTH SCROLL PARA ANCLAJES
   ───────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
   7. INTERSECTION OBSERVER – Animación de entrada
   ───────────────────────────────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.is-revealed { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.bento-cell, .skill-category, .section-header');
  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────
   8. MODO OSCURO / CLARO – Persistencia en localStorage
   ───────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const STORAGE_KEY = 'dg-portfolio-theme';
  const html = document.documentElement;

  /**
   * Aplica el tema al <html> y actualiza el icono del botón.
   * @param {'dark'|'light'} theme
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Cambiar a tema claro');
    } else {
      html.removeAttribute('data-theme');
      btn.textContent = '🌓';
      btn.setAttribute('aria-label', 'Cambiar a tema oscuro');
    }
  }

  /* Leer preferencia guardada; si no hay, respetar preferencia del SO */
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  /* Toggle al hacer clic */
  btn.addEventListener('click', () => {
    const isDark = html.hasAttribute('data-theme');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* ─────────────────────────────────────────────────────────
   9. INICIALIZACIÓN
   ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();   /* ← primero para evitar flash de tema incorrecto */
  initMobileMenu();
  initProjectFilters();
  initContactForm();
  initSmoothScroll();
  initScrollReveal();
});
