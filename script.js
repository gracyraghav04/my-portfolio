(function () {
  "use strict";

  const roles = ["Frontend Developer / Student","DSA enthusiasts","learner"];
  const THEME_KEY = "portfolio-theme";

  const typedEl = document.getElementById("typedText");
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const yearEl = document.getElementById("year");
  const html = document.documentElement;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggle?.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  function toggleTheme() {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  }

  function typeEffect() {
    const current = roles[roleIndex];
    const displayed = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    if (typedEl) typedEl.textContent = displayed;

    if (!isDeleting) charIndex++;
    else charIndex--;

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === current.length + 1) {
      isDeleting = true;
      delay = 1100;
      charIndex = current.length;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    typeTimeout = setTimeout(typeEffect, delay);
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }

    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const skillCards = document.querySelectorAll(".skill-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    skillCards.forEach((el) => observer.observe(el));
  }

  function closeMobileNav() {
    navLinks?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }

  setTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", toggleTheme);

  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const name = contactForm["contact-name"].value.trim();
    const email = contactForm["contact-email"].value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.classList.add("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.classList.add("error");
      return;
    }

    formStatus.textContent = "Thanks! Your message was sent successfully.";
    formStatus.classList.add("success");
    contactForm.reset();
  });

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  initReveal();
  typeEffect();
})();
