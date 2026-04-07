/* ===================================================
   PALLAVI SINGH — PORTFOLIO
   script.js — Interactions & Animations
   =================================================== */

"use strict";

/* ── DOM REFS ── */
const navbar   = document.getElementById("navbar");
const hamburger= document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

/* ═══════════════════════════════
   1. STICKY NAVBAR
═══════════════════════════════ */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Add 'scrolled' class for background blur
  navbar.classList.toggle("scrolled", scrollY > 60);

  lastScroll = scrollY;
});


/* ═══════════════════════════════
   2. HAMBURGER MENU
═══════════════════════════════ */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
  document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  }
});


/* ═══════════════════════════════
   3. SMOOTH SCROLLING (Fallback)
═══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});


/* ═══════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Once visible, stop observing (no re-trigger)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});


/* ═══════════════════════════════
   5. SKILL BAR ANIMATION
═══════════════════════════════ */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-fill");
        fills.forEach(fill => {
          const targetWidth = fill.getAttribute("data-width");
          // Small delay so card reveal plays first
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 350);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".skill-card").forEach(card => {
  skillObserver.observe(card);
});


/* ═══════════════════════════════
   6. ACTIVE NAV LINK ON SCROLL
═══════════════════════════════ */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach(link => {
          link.classList.toggle(
            "active-link",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach(sec => sectionObserver.observe(sec));


/* ═══════════════════════════════
   7. HERO PARALLAX TILT (subtle)
═══════════════════════════════ */
const hero = document.querySelector(".hero");
const orb1 = document.querySelector(".orb-1");
const orb2 = document.querySelector(".orb-2");

if (window.matchMedia("(pointer: fine)").matches) {
  // Only on devices with a mouse
  hero.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { innerWidth: w, innerHeight: h } = window;
    const xPct = (clientX / w - 0.5) * 2;   // -1 to 1
    const yPct = (clientY / h - 0.5) * 2;

    orb1.style.transform = `translate(${xPct * 20}px, ${yPct * 20}px) scale(1)`;
    orb2.style.transform = `translate(${xPct * -15}px, ${yPct * -15}px) scale(1)`;
  });

  hero.addEventListener("mouseleave", () => {
    orb1.style.transform = "";
    orb2.style.transform = "";
  });
}


/* ═══════════════════════════════
   8. PROJECT CARD TILT EFFECT
═══════════════════════════════ */
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* ═══════════════════════════════
   9. TYPING EFFECT — Hero Title
═══════════════════════════════ */
function typeEffect(element, text, speed = 80) {
  element.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Run after a brief delay so hero is visible
window.addEventListener("load", () => {
  const titleEl = document.querySelector(".hero-title");
  if (titleEl) {
    const originalText = titleEl.textContent.trim();
    setTimeout(() => typeEffect(titleEl, originalText, 70), 800);
  }
});


/* ═══════════════════════════════
   10. COUNTER ANIMATION (About Facts)
═══════════════════════════════ */
function animateCounter(el, target, suffix = "", duration = 1500) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = start + suffix;
    }
  }, 16);
}

const factsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each counter
        const counters = [
          { selector: ".fact:nth-child(1) .fact-num", target: 4, suffix: "+" },
          { selector: ".fact:nth-child(3) .fact-num", target: 5,  suffix: ""  },
        ];
        counters.forEach(({ selector, target, suffix }) => {
          const el = document.querySelector(selector);
          if (el) animateCounter(el, target, suffix);
        });
        factsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const factsSection = document.querySelector(".about-facts");
if (factsSection) factsObserver.observe(factsSection);