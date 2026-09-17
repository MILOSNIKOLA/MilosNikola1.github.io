// Navigation mobile
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Active la classe 'active' sur le lien de navigation correspondant à la section visible
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function highlightNavigation() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightNavigation);

// Animations au scroll avec délais progressifs
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -80px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Délai progressif pour un effet en cascade
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 100);
    }
  });
}, observerOptions);

// Ajouter la classe fade-in aux éléments à animer
document.addEventListener("DOMContentLoaded", () => {
  // Animer les cartes de service avec délais
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, index) => {
    card.classList.add("fade-in");
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Animer les items de portfolio
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  portfolioItems.forEach((item) => {
    item.classList.add("fade-in");
    observer.observe(item);
  });

  // Animer les stats
  const statItems = document.querySelectorAll(".stat-item");
  statItems.forEach((item) => {
    item.classList.add("fade-in");
    observer.observe(item);
  });

  // Animer les autres sections
  const aboutText = document.querySelector(".about-text");
  const contactInfo = document.querySelector(".contact-info");
  const contactForm = document.querySelector(".contact-form");

  [aboutText, contactInfo, contactForm].forEach((el) => {
    if (el) {
      el.classList.add("fade-in");
      observer.observe(el);
    }
  });

  // Animation du badge hero au chargement
  const heroBadge = document.querySelector(".hero-badge");
  if (heroBadge) {
    heroBadge.style.animation = "fadeInDown 0.8s ease 0.2s both";
  }

  // Initialize Hero typing animation
  initCodeTyping();

  // Initialize About section animations
  initAboutAnimations();
});

// Animation des statistiques (compteur) avec effet d'accélération
function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2500; // 2.5 secondes
  let startTime = null;
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const updateCounter = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.floor(target * easedProgress);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  requestAnimationFrame(updateCounter);
}

// Observer pour déclencher l'animation des compteurs
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector(".stat-number");
        if (statNumber && !statNumber.classList.contains("animated")) {
          statNumber.classList.add("animated");
          animateCounter(statNumber);
        }
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".stat-item").forEach((stat) => {
  statsObserver.observe(stat);
});

// Gestion du formulaire de contact
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // Animation du bouton
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Envoi en cours...</span>";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    // Simulate send (in a real app you would call an API)
    setTimeout(() => {
      // Show confirmation message
      alert(
        `Thanks ${formData.name}! Your message was sent successfully.\n\nWe will reply to ${formData.email} shortly.`,
      );

      // Reset form
      contactForm.reset();

      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }, 1000);

    // Ici, vous pouvez ajouter du code pour envoyer les données à un serveur
    // Par exemple avec fetch() :
    /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Message envoyé avec succès !');
            contactForm.reset();
        })
        .catch(error => {
            alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
        });
        */
  });
}

// Smooth scroll pour tous les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Compenser la hauteur de la navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Portfolio Categories Dropdown - Gestion du clic
const categoriesList = document.querySelector(".portfolio-categories");

document.querySelectorAll(".portfolio-item").forEach((item) => {
  // Clic sur l'item portfolio
  item.addEventListener("click", (e) => {
    // Vérifier que ce n'est pas un clic sur le lien "View project"
    if (e.target.closest(".portfolio-link")) {
      return; // Laisser le lien fonctionner normalement
    }

    // Basculer le menu des catégories
    categoriesList.classList.toggle("hidden");
    e.stopPropagation();
  });
});

// Gestion du clic sur un élément de catégorie
categoriesList.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", (e) => {
    const selectedType = li.getAttribute("data-type");
    console.log("Catégorie sélectionnée:", selectedType);
    e.stopPropagation();
  });
});

// Fermer les menus au clic en dehors
document.addEventListener("click", () => {
  document.querySelectorAll(".portfolio-categories").forEach((list) => {
    list.classList.add("hidden");
  });
});

// Effet parallaxe et gestion de la navbar au scroll
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  // Ajouter une classe quand on scroll
  if (scrolled > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Parallaxe léger sur les formes flottantes
  const shapes = document.querySelectorAll(".shape");
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.3;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Hero Code Window - Typing Effect Animation
function initCodeTyping() {
  const codeContent = document.getElementById("codeContent");

  if (!codeContent) return;

  // Check prefers-reduced-motion inside the function
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Define code line structure with tokens
  const codeLineStructure = [
    [
      { text: "&lt;div", class: "code-tag" },
      { text: " ", class: "" },
      { text: "class", class: "code-attr" },
      { text: "=", class: "" },
      { text: '"website"', class: "code-string" },
      { text: "&gt;", class: "code-tag" },
    ],
    [
      { text: "&nbsp;&nbsp;", class: "" },
      { text: "&lt;h1&gt;", class: "code-tag" },
      { text: "Your Business", class: "code-text" },
      { text: "&lt;/h1&gt;", class: "code-tag" },
    ],
    [
      { text: "&nbsp;&nbsp;", class: "" },
      { text: "&lt;p&gt;", class: "code-tag" },
      { text: "Modern digital...", class: "code-text" },
      { text: "&lt;/p&gt;", class: "code-tag" },
    ],
    [
      { text: "&nbsp;&nbsp;", class: "" },
      { text: "&lt;button&gt;", class: "code-tag" },
      { text: "Discover", class: "code-text" },
      { text: "&lt;/button&gt;", class: "code-tag" },
    ],
    [{ text: "&lt;/div&gt;", class: "code-tag" }],
  ];

  // If prefers-reduced-motion, display all at once
  if (prefersReducedMotion) {
    codeLineStructure.forEach((lineTokens) => {
      const lineEl = document.createElement("div");
      lineEl.className = "hero-code-line";

      lineTokens.forEach((token) => {
        if (token.class) {
          const span = document.createElement("span");
          span.className = token.class;
          span.innerHTML = token.text;
          lineEl.appendChild(span);
        } else {
          lineEl.innerHTML += token.text;
        }
      });

      codeContent.appendChild(lineEl);
    });
    return;
  }

  // Typing animation with token-based rendering
  let lineIndex = 0;
  let tokenIndex = 0;
  let charIndex = 0;
  const typingSpeed = 30; // ms between characters

  function typeNextCharacter() {
    if (lineIndex >= codeLineStructure.length) {
      return; // Typing finished
    }

    const lineTokens = codeLineStructure[lineIndex];

    // Get or create line element
    let lineEl = codeContent.querySelector(
      `.hero-code-line:nth-child(${lineIndex + 1})`,
    );
    if (!lineEl) {
      lineEl = document.createElement("div");
      lineEl.className = "hero-code-line";
      codeContent.appendChild(lineEl);
    }

    // Get current token
    if (tokenIndex >= lineTokens.length) {
      // Line complete, move to next
      lineIndex++;
      tokenIndex = 0;
      charIndex = 0;
      setTimeout(() => {
        typeNextCharacter();
      }, typingSpeed * 3); // Pause between lines
      return;
    }

    const currentToken = lineTokens[tokenIndex];
    let tokenSpan = lineEl.querySelector(`.token-${tokenIndex}`);

    // Create token span if needed
    if (!tokenSpan) {
      tokenSpan = document.createElement("span");
      tokenSpan.className = `token-${tokenIndex} ${currentToken.class}`;
      tokenSpan.setAttribute("data-token-index", tokenIndex);
      lineEl.appendChild(tokenSpan);
    }

    // Add character to token
    if (charIndex < currentToken.text.length) {
      const displayedText = currentToken.text.substring(0, charIndex + 1);
      tokenSpan.innerHTML = displayedText;
      charIndex++;

      setTimeout(() => {
        typeNextCharacter();
      }, typingSpeed);
    } else {
      // Token complete, move to next
      tokenIndex++;
      charIndex = 0;
      setTimeout(() => {
        typeNextCharacter();
      }, typingSpeed);
    }
  }

  // Start typing after a short delay
  setTimeout(() => {
    typeNextCharacter();
  }, 600);
}

// ========================================
// ABOUT SECTION - SCROLL TRIGGERED ANIMATIONS
// ========================================

// Initialize About section animations with Intersection Observer
function initAboutAnimations() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Observer for main About fade-in sections
  const observerOptions = {
    threshold: 0.01,
    rootMargin: "0px 0px 0px 0px",
  };

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation with delay
        const delay = prefersReducedMotion ? 0 : index * 100;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);

        // Only observe once
        aboutObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all main About fade-in sections
  const aboutFadeInSections = document.querySelectorAll(".about-fade-in");
  aboutFadeInSections.forEach((section) => {
    aboutObserver.observe(section);
  });

  // Observer for tech cards (staggered animation)
  const techCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const techCards = document.querySelectorAll(".about-tech-fade-in");
          techCards.forEach((card, index) => {
            const delay = prefersReducedMotion ? 0 : index * 80;
            setTimeout(() => {
              card.classList.add("visible");
            }, delay);
          });

          // Only observe once
          techCardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 0px 0px" },
  );

  const techSection = document.querySelector(".about-technologies");
  if (techSection) {
    techCardObserver.observe(techSection);
  }

  // Observer for Timeline animation
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate timeline line
          const timelineLine = document.querySelector(".timeline-line");
          if (timelineLine) {
            timelineLine.classList.add("visible");
          }

          // Animate timeline items with stagger
          const timelineItems = document.querySelectorAll(
            ".about-timeline-item",
          );
          timelineItems.forEach((item, index) => {
            const delay = prefersReducedMotion ? 0 : index * 150;
            setTimeout(() => {
              item.classList.add("visible");
            }, delay);
          });

          // Only observe once
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 0px 0px" },
  );

  const timelineContainer = document.querySelector(".timeline-container");
  if (timelineContainer) {
    timelineObserver.observe(timelineContainer);
  }

  // Observer for Approach cards
  const approachCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const approachCards = document.querySelectorAll(
            ".about-approach-card-fade",
          );
          approachCards.forEach((card, index) => {
            const delay = prefersReducedMotion ? 0 : index * 120;
            setTimeout(() => {
              card.classList.add("visible");
            }, delay);
          });

          // Only observe once
          approachCardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px 0px 0px" },
  );

  const approachSection = document.querySelector(".about-methodology");
  if (approachSection) {
    approachCardObserver.observe(approachSection);
  }

  // Fallback: if elements are not visible after 2 seconds, show them anyway
  setTimeout(() => {
    const unfadedElements = document.querySelectorAll(
      ".about-fade-in:not(.visible), .about-tech-fade-in:not(.visible), .about-approach-card-fade:not(.visible), .about-timeline-item:not(.visible)",
    );
    if (unfadedElements.length > 0) {
      // Show all unfaded elements immediately
      document
        .querySelectorAll(
          ".about-fade-in, .about-tech-fade-in, .about-approach-card-fade, .about-timeline-item, .timeline-line",
        )
        .forEach((el) => {
          el.classList.add("visible");
        });
    }
  }, 2000);
}
