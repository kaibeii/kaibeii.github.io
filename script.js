/*Chatgpt created logic for how filtering and buttons work and gave me code along with the misc. logic*/
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // 1) PAGE REVEAL (hero -> about -> projects)
  // ----------------------------
  const heroBox = document.querySelector(".hero-box");
  const heroAbout = document.querySelector(".hero-about");
  const projectsHeader = document.querySelector(".projects-header");
  const filters = document.querySelector(".filters");
  const projectsGrid = document.querySelector(".projects");

  const steps = [
    { el: heroBox, delay: 0 },
    { el: heroAbout, delay: 450 },
    { el: projectsHeader, delay: 900 },
    { el: filters, delay: 1050 },
    { el: projectsGrid, delay: 1200 },
  ];

  steps.forEach(({ el, delay }) => {
    if (!el) return;
    el.classList.add("reveal");
    setTimeout(() => el.classList.add("is-visible"), delay);
  });

  // ----------------------------
  // 2) FILTERING (crossfade + reflow)
  //    + "miscellaneous" rule:
  //      - misc projects NEVER show under "all"
  //      - misc projects ONLY show when filter === "miscellaneous"
  // ----------------------------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  if (!filterButtons.length || !cards.length) return;

  const DURATION_MS = 220; // match your CSS transition duration
  let isTransitioning = false;

  const parseTags = (s) =>
    (s || "")
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);

  function setActiveButton(filter) {
    filterButtons.forEach((b) => b.classList.remove("active"));
    const match = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    (match || filterButtons[0]).classList.add("active");
  }

  function shouldShowCard(tags, filter) {
    const isMisc = tags.includes("miscellaneous");

    if (filter === "all") {
      // show everything EXCEPT miscellaneous
      return !isMisc;
    }

    if (filter === "miscellaneous") {
      // show ONLY miscellaneous
      return isMisc;
    }

    // normal tag behavior for all other filters
    return tags.includes(filter);
  }

function crossfadeTo(filterRaw) {
  const filter = (filterRaw || "all").toLowerCase();
  if (isTransitioning) return;
  isTransitioning = true;

  // Fade the whole grid uniformly
  if (projectsGrid) projectsGrid.classList.add("is-filtering");

  window.setTimeout(() => {
    // Apply visibility (with misc rule)
    cards.forEach((card) => {
      const tags = parseTags(card.dataset.tags);
      const matches = shouldShowCard(tags, filter);

      if (!matches) {
        card.classList.add("hidden");
      } else {
        card.classList.remove("hidden");
      }
    });

    // Next frame: bring grid back + optionally stagger in cards
    requestAnimationFrame(() => {
      if (projectsGrid) projectsGrid.classList.remove("is-filtering");
      isTransitioning = false;
    });
  }, DURATION_MS);
}

  // Top filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = (btn.dataset.filter || "all").toLowerCase();
      setActiveButton(filter);
      crossfadeTo(filter);
    });
  });

  // Clickable tags inside cards
  document.querySelectorAll(".tags span").forEach((tag) => {
    tag.style.cursor = "pointer";
    tag.addEventListener("click", () => {
      const value = (tag.innerText || "").toLowerCase().trim();
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${value}"]`);
      if (targetBtn) targetBtn.click();
      else {
        setActiveButton(value);
        crossfadeTo(value);
      }
    });
  });

  // Initial state
  const initialFilter = (document.querySelector(".filter-btn.active")?.dataset.filter || "all").toLowerCase();
  crossfadeTo(initialFilter);
});
