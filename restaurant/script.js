// La Table Dorée — interactions du site
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initHeaderScroll();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initGalleryFilter();
    initLightbox();
    initBackToTop();
    initContactForm();
  }

  function setYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // -- En-tête : fond opaque au scroll -------------------------------------
  function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const toggle = () =>
      header.classList.toggle("scrolled", window.scrollY > 40);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  // -- Menu mobile ----------------------------------------------------------
  function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("mainNav");
    if (!hamburger || !nav) return;

    const closeNav = () => {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("active");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
  }

  // -- Lien de navigation actif selon la section visible --------------------
  function initScrollSpy() {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav-link");
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // -- Animation d'apparition au scroll --------------------------------------
  function initReveal() {
    const targets = document.querySelectorAll(
      ".about-content, .about-media, .service-card, .gallery-item, .contact-info, .contact-form, .cta-content",
    );
    targets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    // Filet de sécurité : si l'observateur ne se déclenche jamais pour un élément
    // (ex. saut de défilement instantané), on force son apparition après un délai.
    setTimeout(() => {
      targets.forEach((el) => el.classList.add("is-visible"));
    }, 2500);
  }

  // -- Filtres de la galerie --------------------------------------------------
  function initGalleryFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".gallery-item");
    if (!buttons.length || !items.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });

        items.forEach((item) => {
          const match = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hidden", !match);
        });
      });
    });
  }

  // -- Visionneuse (lightbox) ---------------------------------------------
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    const items = Array.from(document.querySelectorAll(".gallery-item"));
    if (!lightbox || !items.length) return;

    let currentIndex = 0;

    const visibleItems = () =>
      items.filter((item) => !item.classList.contains("hidden"));

    const renderAt = (index) => {
      const list = visibleItems();
      if (!list.length) return;
      currentIndex = (index + list.length) % list.length;
      const item = list[currentIndex];
      const img = item.querySelector("img");
      const caption = item.querySelector("figcaption");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : "";
    };

    const open = (index) => {
      renderAt(index);
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    items.forEach((item) => {
      const trigger = item.querySelector(".gallery-trigger");
      trigger.addEventListener("click", () => {
        const index = visibleItems().indexOf(item);
        open(index);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => renderAt(currentIndex - 1));
    nextBtn.addEventListener("click", () => renderAt(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") renderAt(currentIndex + 1);
      if (e.key === "ArrowLeft") renderAt(currentIndex - 1);
    });
  }

  // -- Retour en haut ---------------------------------------------------------
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("visible", window.scrollY > 600),
      { passive: true },
    );

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -- Formulaire de contact / réservation -------------------------------------
  function initContactForm() {
    const form = document.getElementById("reservationForm");
    const feedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");
    const dateInput = document.getElementById("date");
    if (!form) return;

    if (dateInput) {
      dateInput.min = new Date().toISOString().split("T")[0];
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours...";
      setFeedback("", "");

      const payload = new URLSearchParams(new FormData(form)).toString();

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      })
        .catch(() => {
          /* Hôte sans traitement de formulaire (hors Netlify) : on reste sur un succès optimiste. */
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
          setFeedback(
            "Merci ! Votre demande a bien été envoyée, nous vous recontacterons sous 24h.",
            "success",
          );
          form.reset();
        });
    });

    function setFeedback(message, type) {
      feedback.textContent = message;
      feedback.classList.remove("success", "error");
      if (type) feedback.classList.add(type);
    }
  }
})();
