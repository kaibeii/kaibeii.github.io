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



function getGridItemFromCard(card) {
  // If the card is wrapped in a link, the grid item is the <a>.
  // Otherwise, the card itself is the grid item.
  return card.closest(".project-link") || card;
}

function crossfadeTo(filterRaw) {
  const filter = (filterRaw || "all").toLowerCase();
  if (isTransitioning) return;
  isTransitioning = true;

  if (projectsGrid) projectsGrid.classList.add("is-filtering");

  window.setTimeout(() => {
    const matches = [];
    const nonMatches = [];

    cards.forEach((card) => {
      const tags = parseTags(card.dataset.tags);
      const show = shouldShowCard(tags, filter);

      const item = getGridItemFromCard(card);
      item.classList.remove("hidden"); // reset

      if (show) matches.push(item);
      else nonMatches.push(item);
    });

    // Reorder DOM: matching items first (anchors + bare divs)
    // Also hide the non-matching ITEMS (so empty anchors don't take grid slots)
    const ordered = [...matches, ...nonMatches];
    ordered.forEach((item) => projectsGrid.appendChild(item));
    nonMatches.forEach((item) => item.classList.add("hidden"));

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



    document.querySelector(".back-btn")?.addEventListener("click", () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "index.html";
    });

    document.addEventListener("DOMContentLoaded", () => {
    const revealEls = document.querySelectorAll(".reveal");

    revealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 120 + i * 180);
    });
  });