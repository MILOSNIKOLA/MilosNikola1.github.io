const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ========================================
// NAVIGATION
// ========================================

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".navbar");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Lien actif : la section qui traverse la bande centrale de l'écran
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => navObserver.observe(s));

// Un seul écouteur de scroll, limité à une exécution par frame
const shapes = document.querySelectorAll(".shape");
let scrollTicking = false;

function onScroll() {
  const scrolled = window.scrollY;
  navbar.classList.toggle("scrolled", scrolled > 100);

  if (!prefersReducedMotion) {
    shapes.forEach((shape, index) => {
      shape.style.transform = `translateY(${scrolled * (index + 1) * 0.3}px)`;
    });
  }
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  },
  { passive: true },
);
onScroll();

// ========================================
// ANIMATIONS D'APPARITION AU SCROLL
// ========================================

function createRevealObserver(options) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, options);
  return observer;
}

const revealObserver = createRevealObserver({
  threshold: 0.1,
  rootMargin: "0px 0px -80px 0px",
});

document.querySelectorAll(".service-card").forEach((card, index) => {
  card.classList.add("fade-in");
  card.style.transitionDelay = `${index * 0.1}s`;
});

[".contact-info", ".contact-form"].forEach((selector) => {
  document.querySelector(selector)?.classList.add("fade-in");
});

document
  .querySelectorAll(".fade-in:not(.visible)")
  .forEach((el) => revealObserver.observe(el));

// Révèle les éléments ciblés avec un décalage, une fois que `trigger` est visible
function revealOnce(trigger, selector, step) {
  if (!trigger) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      document.querySelectorAll(selector).forEach((el, index) => {
        setTimeout(
          () => el.classList.add("visible"),
          prefersReducedMotion ? 0 : index * step,
        );
      });
    },
    { threshold: 0.01 },
  );
  observer.observe(trigger);
}

const aboutObserver = createRevealObserver({ threshold: 0.01 });
document
  .querySelectorAll(".about-fade-in")
  .forEach((section) => aboutObserver.observe(section));

const timeline = document.querySelector(".timeline-container");
revealOnce(
  document.querySelector(".about-technologies"),
  ".about-tech-fade-in",
  80,
);
revealOnce(timeline, ".timeline-line", 0);
revealOnce(timeline, ".about-timeline-item", 150);
revealOnce(
  document.querySelector(".about-methodology"),
  ".about-approach-card-fade",
  120,
);

// ========================================
// HERO - EFFET DE FRAPPE DU CODE
// ========================================

function initCodeTyping() {
  const codeContent = document.getElementById("codeContent");
  if (!codeContent) return;

  const indent = "\u00a0\u00a0";
  const lines = [
    [
      ["<div", "code-tag"],
      [" ", ""],
      ["class", "code-attr"],
      ["=", ""],
      ['"website"', "code-string"],
      [">", "code-tag"],
    ],
    [
      [indent, ""],
      ["<h1>", "code-tag"],
      ["Your Business", "code-text"],
      ["</h1>", "code-tag"],
    ],
    [
      [indent, ""],
      ["<p>", "code-tag"],
      ["Modern digital...", "code-text"],
      ["</p>", "code-tag"],
    ],
    [
      [indent, ""],
      ["<button>", "code-tag"],
      ["Discover", "code-text"],
      ["</button>", "code-tag"],
    ],
    [["</div>", "code-tag"]],
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const typingSpeed = 30;

  async function render() {
    if (!prefersReducedMotion) await sleep(600);

    for (const tokens of lines) {
      const lineEl = document.createElement("div");
      lineEl.className = "hero-code-line";
      codeContent.appendChild(lineEl);

      for (const [text, className] of tokens) {
        const span = document.createElement("span");
        if (className) span.className = className;
        lineEl.appendChild(span);

        if (prefersReducedMotion) {
          span.textContent = text;
          continue;
        }
        for (const char of text) {
          span.textContent += char;
          await sleep(typingSpeed);
        }
      }
      if (!prefersReducedMotion) await sleep(typingSpeed * 3);
    }
  }

  render();
}

initCodeTyping();

// ========================================
// FORMULAIRE DE CONTACT
// ========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const { name, email } = Object.fromEntries(new FormData(contactForm));
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = "<span>Envoi en cours...</span>";
    submitBtn.disabled = true;

    // Envoi simulé : remplacer par un fetch() vers votre API
    setTimeout(() => {
      alert(
        `Thanks ${name}! Your message was sent successfully.\n\nWe will reply to ${email} shortly.`,
      );
      contactForm.reset();
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }, 1000);
  });
}

// ========================================
// PORTFOLIO - DÉFILEMENT AUTOMATIQUE
// ========================================

function initPortfolioAutoScroll() {
  const portfolioGrid = document.querySelector(".portfolio-grid");
  if (!portfolioGrid) return;

  // Duplique les cartes pour une boucle continue
  const fragment = document.createDocumentFragment();
  portfolioGrid.querySelectorAll(".portfolio-item").forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone
      .querySelectorAll("a")
      .forEach((a) => a.setAttribute("tabindex", "-1"));
    fragment.appendChild(clone);
  });
  portfolioGrid.appendChild(fragment);

  portfolioGrid.addEventListener("mouseenter", () =>
    portfolioGrid.classList.add("paused"),
  );
  portfolioGrid.addEventListener("mouseleave", () =>
    portfolioGrid.classList.remove("paused"),
  );

  portfolioGrid.addEventListener(
    "scroll",
    () => {
      if (portfolioGrid.scrollLeft > portfolioGrid.scrollWidth / 2) {
        portfolioGrid.scrollLeft = 0;
      }
    },
    { passive: true },
  );
}

initPortfolioAutoScroll();
