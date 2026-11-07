// Portafolio de Dayanara Guerrero
// Menú móvil, modo claro/oscuro y formulario de contacto (FormSubmit → correo).

(function () {
  'use strict';


  /* Menú móvil */
  var menu = document.getElementById('menu');
  var nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }

  /* Modo claro / oscuro */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function labelTheme() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
  if (themeBtn) {
    labelTheme();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('dg-theme', next); } catch (e) {}
      labelTheme();
    });
  }

  /* Formulario de contacto */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('f-status');
  var submit = document.getElementById('f-submit');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = [
    { id: 'f-name', err: 'e-name', check: function (v) { return v.length >= 2 ? '' : 'Escribe tu nombre.'; } },
    { id: 'f-email', err: 'e-email', check: function (v) { return EMAIL_RE.test(v) ? '' : 'Escribe un correo válido, por ejemplo nombre@empresa.com.'; } },
    { id: 'f-message', err: 'e-message', check: function (v) { return v.length >= 10 ? '' : 'El mensaje necesita al menos 10 caracteres.'; } }
  ];

  function validate() {
    var firstBad = null;
    rules.forEach(function (r) {
      var input = document.getElementById(r.id);
      var msg = r.check(input.value.trim());
      document.getElementById(r.err).textContent = msg;
      input.closest('.field').classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !firstBad) firstBad = input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Al volver de FormSubmit (?enviado=1) se confirma el envío.
  if (/[?&]enviado=1/.test(window.location.search)) {
    status.className = 'form-status ok';
    status.textContent = 'Mensaje enviado. Te responderé a tu correo pronto.';
    try { history.replaceState(null, '', window.location.pathname + '#contacto'); } catch (e) {}
  }

  // Envío normal del formulario (sin fetch), para que ningún bloqueador lo corte.
  form.addEventListener('submit', function (e) {
    status.className = 'form-status';
    status.textContent = '';
    if (!validate() || form.elements._honey.value) { e.preventDefault(); return; }
    form.elements._subject.value = 'Nuevo mensaje desde tu portafolio: ' + form.elements.name.value.trim();
    var replyTo = form.querySelector('input[name="_replyto"]');
    if (!replyTo) { replyTo = document.createElement('input'); replyTo.type = 'hidden'; replyTo.name = '_replyto'; form.appendChild(replyTo); }
    replyTo.value = form.elements.email.value.trim();
    submit.disabled = true;
    submit.textContent = 'Enviando…';
  });

  rules.forEach(function (r) {
    var input = document.getElementById(r.id);
    input.addEventListener('blur', function () {
      if (!input.value) return;
      var msg = r.check(input.value.trim());
      document.getElementById(r.err).textContent = msg;
      input.closest('.field').classList.toggle('invalid', !!msg);
    });
  });
})();
