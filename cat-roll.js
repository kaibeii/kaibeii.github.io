/* global CAT_API_KEY */

(() => {
  const BASE_SEARCH_URL = "https://api.thecatapi.com/v1/images/search";
  const BREEDS_URL = "https://api.thecatapi.com/v1/breeds";
  const MAX_HISTORY = 3;

  const rollBtn = document.getElementById("catRollBtn");
  const resetBtn = document.getElementById("catResetBtn");
  const catImg = document.getElementById("catImg");
  const overlay = document.getElementById("catOverlay");
  const loadingText = document.getElementById("catLoadingText");
  const historyStrip = document.getElementById("catHistoryStrip");
  const breedSelect = document.getElementById("breedSelect");

  // Stat elements
  const statBreed = document.getElementById("statBreed");
  const statOrigin = document.getElementById("statOrigin");
  const statTemperament = document.getElementById("statTemperament");
  const statRolls = document.getElementById("statRolls");

  // Confetti
  const confettiLayer = document.getElementById("catConfettiLayer");
  const zoneMsg = document.getElementById("catZoneMsg");

  if (!rollBtn || !resetBtn || !catImg || !overlay || !loadingText || !historyStrip || !breedSelect) return;

  const breedMap = {}; // id -> breed object
  let history = [];    // newest first: [{ id, url }]
  let rollCount = 0;

  function getHeaders() {
    const headers = {};
    if (typeof CAT_API_KEY === "string" && CAT_API_KEY.trim().length > 0) {
      headers["x-api-key"] = CAT_API_KEY.trim();
    }
    return headers;
  }

  function setLoading(isLoading, message = "Loading cat…") {
    loadingText.textContent = message;
    overlay.classList.toggle("is-visible", isLoading);
    rollBtn.disabled = isLoading;
    breedSelect.disabled = isLoading;
  }

  function showCat(url) {
    catImg.classList.remove("is-visible");

    catImg.onload = () => catImg.classList.add("is-visible");
    catImg.onerror = () => {
      setLoading(false);
      alert("That cat image failed to load. Try rolling again.");
    };

    catImg.src = url;
  }

  function renderHistory() {
    historyStrip.innerHTML = "";

    if (history.length === 0) {
      for (let i = 0; i < MAX_HISTORY; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "cat-thumb cat-thumb-empty";
        placeholder.innerHTML = `<div class="cat-badge">${i + 1}</div>`;
        historyStrip.appendChild(placeholder);
      }
      return;
    }

    const padded = [...history];
    while (padded.length < MAX_HISTORY) padded.push(null);

    padded.slice(0, MAX_HISTORY).forEach((item, idx) => {
      const thumb = document.createElement("div");
      thumb.className = "cat-thumb";
      thumb.setAttribute("role", "listitem");
      thumb.innerHTML = `<div class="cat-badge">${idx + 1}</div>`;

      if (!item) {
        thumb.classList.add("cat-thumb-empty");
        historyStrip.appendChild(thumb);
        return;
      }

      const img = document.createElement("img");
      img.src = item.url;
      img.alt = "Previously rolled cat";
      thumb.appendChild(img);

      thumb.addEventListener("click", () => showCat(item.url));
      historyStrip.appendChild(thumb);
    });
  }

  function buildSearchUrl() {
    const url = new URL(BASE_SEARCH_URL);
    url.searchParams.set("limit", "1");
    url.searchParams.set("size", "med");

    const breedId = breedSelect.value;
    if (breedId) url.searchParams.set("breed_ids", breedId);

    return url.toString();
  }

  function setStats({ breedName, origin, temperament }) {
    statBreed.textContent = breedName || "Unknown";
    statOrigin.textContent = origin || "—";
    statTemperament.textContent = temperament || "—";
    statRolls.textContent = String(rollCount);
  }

  function inferBreedStatsFromSelectionOrResponse(imageItem) {
    // Best-case: if user selected a breed, use breedMap (most reliable)
    const selectedBreedId = breedSelect.value;
    if (selectedBreedId && breedMap[selectedBreedId]) {
      const b = breedMap[selectedBreedId];
      return {
        breedName: b.name || "Unknown",
        origin: b.origin || "—",
        temperament: b.temperament || "—",
      };
    }

    // Otherwise: try the image response's embedded breeds array (sometimes present)
    const b2 = imageItem?.breeds?.[0];
    if (b2) {
      return {
        breedName: b2.name || "Unknown",
        origin: b2.origin || "—",
        temperament: b2.temperament || "—",
      };
    }

    // No info available
    return { breedName: "Unknown", origin: "—", temperament: "—" };
  }

  async function fetchRandomCat() {
    const searchUrl = buildSearchUrl();
    const res = await fetch(searchUrl, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : null;
    if (!item?.url) throw new Error("Unexpected API response.");

    return item;
  }

  async function loadBreedsIntoDropdown() {
    const defaultOption = breedSelect.querySelector('option[value=""]');
    if (defaultOption) defaultOption.textContent = "Loading breeds…";

    const res = await fetch(BREEDS_URL, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const breeds = await res.json();
    if (!Array.isArray(breeds)) throw new Error("Unexpected breeds response.");

    // cache map
    breeds.forEach(b => {
      if (b?.id) breedMap[b.id] = b;
    });

    // rebuild dropdown
    breedSelect.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "";
    allOpt.textContent = "All breeds (random)";
    breedSelect.appendChild(allOpt);

    breeds
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .forEach((b) => {
        if (!b?.id || !b?.name) return;
        const opt = document.createElement("option");
        opt.value = b.id; // e.g., "beng"
        opt.textContent = b.name;
        breedSelect.appendChild(opt);
      });
  }

  function fireConfetti(message) {
    if (!confettiLayer) return;

    // show layer + message
    if (zoneMsg) zoneMsg.textContent = message;
    confettiLayer.classList.add("is-on");

    // clear old confetti bits
    confettiLayer.querySelectorAll(".cat-confetti").forEach(n => n.remove());

    // make some bits
    const count = 42;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("div");
      bit.className = "cat-confetti";

      // random position at top
      bit.style.left = `${Math.random() * 100}%`;

      // random size variation
      const w = 6 + Math.random() * 10;
      const h = 8 + Math.random() * 14;
      bit.style.width = `${w}px`;
      bit.style.height = `${h}px`;

      // random animation duration + delay
      const dur = 650 + Math.random() * 700;
      const delay = Math.random() * 120;
      bit.style.animationDuration = `${dur}ms`;
      bit.style.animationDelay = `${delay}ms`;

      // random colors (no external libs)
      const palette = ["#111", "#fff", "#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#8338ec"];
      bit.style.background = palette[Math.floor(Math.random() * palette.length)];

      confettiLayer.appendChild(bit);
    }

    // hide after a beat
    window.setTimeout(() => {
      confettiLayer.classList.remove("is-on");
      confettiLayer.querySelectorAll(".cat-confetti").forEach(n => n.remove());
    }, 3000);
  }

  async function rollCat() {
    try {
      const label = breedSelect.value ? "Summoning a specific cat…" : "Summoning cat…";
      setLoading(true, label);

      const item = await fetchRandomCat();

      // update image
      showCat(item.url);

      // update history
      const cat = { id: item.id ?? String(Date.now()), url: item.url };
      history = [cat, ...history.filter(h => h.url !== cat.url)].slice(0, MAX_HISTORY);
      renderHistory();

      // update rolls + stats
      rollCount += 1;
      const stats = inferBreedStatsFromSelectionOrResponse(item);
      setStats(stats);

      setLoading(false);

      // confetti every 3 rolls
      if (rollCount % 3 === 0) {
        fireConfetti("you are deep in the cat zone buddy");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Could not fetch a cat right now. Try again.");
    }
  }

  function clearHistory() {
    history = [];
    renderHistory();
  }

  breedSelect.addEventListener("change", () => {
    clearHistory();
    rollCat();
  });

  rollBtn.addEventListener("click", rollCat);
  resetBtn.addEventListener("click", clearHistory);

  // init
  setLoading(true, "Warming up…");
  renderHistory();

  loadBreedsIntoDropdown()
    .catch((err) => {
      console.error(err);
      // Keep dropdown usable even if breeds fail
      breedSelect.innerHTML = `<option value="">All breeds (random)</option>`;
    })
    .finally(() => {
      setLoading(false);
      // initialize stats
      setStats({ breedName: "—", origin: "—", temperament: "—" });
      rollCat();
    });
})();