// ```js
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeButtons = document.querySelectorAll(".mode-toggle");

  /* =====================================================
     1. THEME
  ===================================================== */

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";

    body.classList.toggle("dark-mode", isDark);
    body.classList.toggle("light-mode", !isDark);

    themeButtons.forEach((button) => {
      const icon = button.querySelector("span");

      if (icon) {
        icon.textContent = isDark ? "☀️" : "🌙";
      } else {
        button.textContent = isDark ? "☀️" : "🌙";
      }

      button.setAttribute(
        "aria-label",
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      );
    });
  };

  applyTheme(getPreferredTheme());

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = body.classList.contains("dark-mode")
        ? "light"
        : "dark";

      localStorage.setItem("portfolio-theme", nextTheme);
      applyTheme(nextTheme);
    });
  });

  /* =====================================================
     2. REVEAL ANIMATION
  ===================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =====================================================
     3. MODALS
  ===================================================== */

  const modalButtons = document.querySelectorAll(".modal-btn");
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal .close");

  let lastFocusedElement = null;

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    lastFocusedElement = document.activeElement;

    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".close");

    if (closeButton) {
      closeButton.focus();
    }
  };

  const closeModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    body.style.overflow = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.modal;
      const modal = document.getElementById(modalId);

      openModal(modal);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const openModalElement = Array.from(modals).find(
      (modal) => modal.style.display === "block"
    );

    closeModal(openModalElement);
  });

  /* =====================================================
     4. READING PROGRESS
  ===================================================== */

  const readingProgressBar = document.getElementById(
    "reading-progress-bar"
  );

  const updateReadingProgress = () => {
    if (!readingProgressBar) {
      return;
    }

    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      documentHeight > 0
        ? Math.min(
            Math.max(scrollTop / documentHeight, 0),
            1
          )
        : 0;

    readingProgressBar.style.width = `${progress * 100}%`;
  };

  window.addEventListener(
    "scroll",
    updateReadingProgress,
    { passive: true }
  );

  updateReadingProgress();

  /* =====================================================
     5. ACTIVE CASE STUDY NAVIGATION
  ===================================================== */

  const caseSections = document.querySelectorAll(
    "[data-case-section]"
  );

  const caseNavigationLinks = document.querySelectorAll(
    ".case-nav-link"
  );

  if (
    caseSections.length > 0 &&
    caseNavigationLinks.length > 0 &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio -
              first.intersectionRatio
          );

        if (visibleEntries.length === 0) {
          return;
        }

        const activeSectionId =
          visibleEntries[0].target.id;

        caseNavigationLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") ===
            `#${activeSectionId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "true");

            link.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center"
            });
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.05, 0.2, 0.5]
      }
    );

    caseSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =====================================================
     6. CURRENT YEAR
  ===================================================== */

  document
    .querySelectorAll("[data-current-year]")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
});
// ```
