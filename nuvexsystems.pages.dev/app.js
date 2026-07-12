/* =====================================================
   NUVEX SYSTEMS — Main App JavaScript
   ===================================================== */

'use strict';

// =====================================================
// LOADER
// =====================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  }, 1600);
});

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// =====================================================
// HAMBURGER MENU
// =====================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close mobile menu when link clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// =====================================================
// SMOOTH SCROLL for nav links
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =====================================================
// INTERSECTION OBSERVER — Reveal animations
// =====================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// =====================================================
// COUNTER ANIMATION (Hero stats)
// =====================================================
function animateCounter(el, target, duration = 2000) {
  const startTime = performance.now();
  const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : '+';

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.dataset.count, 10);
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  if (el.dataset.suffix === undefined) el.dataset.suffix = '+';
  counterObserver.observe(el);
});

// =====================================================
// PARTICLES CANVAS
// =====================================================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '108, 99, 255' : '0, 212, 255'
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animFrame = requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// =====================================================
// PORTFOLIO — Load from localStorage
// =====================================================
const STORAGE_KEY = 'nuvex_projects';

// =====================================================
// DEMO DATA — Cargado solo si no hay proyectos
// =====================================================
function initDemoData() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const demo = [
        {
          id: 'demo1',
          title: 'BoutiqueOnline — Tienda de Moda',
          category: 'ecommerce',
          description: 'Plataforma de e-commerce completa para una boutique de moda con catálogo, carrito, pagos online y panel de gestión.',
          image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
          url: '#',
          tags: ['Next.js', 'Stripe', 'Tailwind', 'Vercel'],
          createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
        },
        {
          id: 'demo2',
          title: 'StartupTech — Landing Page',
          category: 'landing',
          description: 'Landing page de alta conversión para startup tecnológica. Diseño minimalista, animaciones y formulario de captura de leads.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
          url: '#',
          tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
          createdAt: new Date(Date.now() - 14*24*60*60*1000).toISOString()
        },
        {
          id: 'demo3',
          title: 'ConsultoraMG — Sitio Corporativo',
          category: 'web',
          description: 'Sitio web corporativo para firma de consultoría. Diseño elegante, blog integrado, formulario de contacto y área de clientes.',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
          url: '#',
          tags: ['WordPress', 'PHP', 'MySQL', 'SEO'],
          createdAt: new Date(Date.now() - 21*24*60*60*1000).toISOString()
        },
        {
          id: 'demo4',
          title: 'RestaurantePH — App de Reservas',
          category: 'app',
          description: 'Aplicación web para gestión de reservas de restaurante con calendario interactivo, notificaciones y panel admin.',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
          url: '#',
          tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
          createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString()
        },
        {
          id: 'demo5',
          title: 'FitLife — Plataforma Fitness',
          category: 'web',
          description: 'Plataforma web para entrenadores personales con rutinas, seguimiento de progreso, videollamadas y pagos de suscripción.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
          url: '#',
          tags: ['Vue.js', 'Firebase', 'Stripe', 'Tailwind'],
          createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString()
        },
        {
          id: 'demo6',
          title: 'RealState — Portal Inmobiliario',
          category: 'web',
          description: 'Portal inmobiliario con búsqueda avanzada, mapas interactivos, galería de propiedades y gestión de agentes.',
          image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
          url: '#',
          tags: ['Next.js', 'PostgreSQL', 'Google Maps', 'AWS'],
          createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }
  } catch(e) {
    console.warn('Could not init demo data:', e);
  }
}

initDemoData();


function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  const projects = getProjects();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="portfolio-empty reveal">
        <div class="portfolio-empty-icon">🚀</div>
        <h3>Proyectos próximamente</h3>
        <p>Estamos trabajando en grandes proyectos. ¡Muy pronto!</p>
      </div>
    `;
    // Re-observe for animation
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    return;
  }

  grid.innerHTML = filtered.map((project, i) => `
    <div class="portfolio-card reveal delay-${(i % 6) + 1}">
      <div class="portfolio-img-wrapper">
        <img
          class="portfolio-img"
          src="${escapeHtml(project.image || '')}"
          alt="${escapeHtml(project.title)}"
          onerror="this.src='https://placehold.co/600x340/0d0d28/6C63FF?text=${encodeURIComponent(project.title)}'"
          loading="lazy"
        />
        <div class="portfolio-overlay">
          ${project.url ? `<a href="${escapeHtml(project.url)}" target="_blank" rel="noopener" class="portfolio-view-btn">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            Ver sitio
          </a>` : ''}
        </div>
      </div>
      <div class="portfolio-body">
        <div class="portfolio-tags">
          ${(project.tags || []).map(tag => `<span class="portfolio-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <h3 class="portfolio-title">${escapeHtml(project.title)}</h3>
        <p class="portfolio-desc">${escapeHtml(project.description || '')}</p>
      </div>
    </div>
  `).join('');

  // Re-observe new elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// Portfolio filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderPortfolio();
  });
});

// Initial render
renderPortfolio();

// Listen for updates from admin panel
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    renderPortfolio();
  }
});

// =====================================================
// CONTACT FORM
// =====================================================
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    showToast('Por favor completa todos los campos requeridos.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showToast('Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  // Simulate form submission
  const btn = document.getElementById('contact-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
    contactForm.reset();
    showToast('¡Mensaje enviado! Te contactaremos pronto. 🚀', 'success');
  }, 1800);
});

// =====================================================
// HELPERS
// =====================================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const icons = {
    success: '✅',
    error: '❌',
    info: '💡'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${icons[type]} ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// =====================================================
// ACTIVE NAV LINK on scroll
// =====================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--color-primary)';
    }
  });
});

// =====================================================
// CURSOR GLOW EFFECT (desktop only)
// =====================================================
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

console.log('%c🚀 Nuvex Systems', 'color: #6C63FF; font-size: 24px; font-weight: bold;');
console.log('%cHecho con ❤️ por Nuvex Systems', 'color: #00D4FF; font-size: 14px;');
