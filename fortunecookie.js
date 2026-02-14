// fortunecookie.js

const FORTUNE_BACKEND = "https://fortunecookie-backend.onrender.com";

const SYMBOL_ICONS = {
  Key: "🗝️",
  Mirror: "🪞",
  Lantern: "🏮",
  Coin: "🪙",
  Feather: "🪶",
  Compass: "🧭",
  Shell: "🐚",
  Seed: "🌱",
  Thread: "🧵",
  Candle: "🕯️",
  Door: "🚪",
  Bridge: "🌉",
  Cup: "☕",
  Stone: "🪨"
};

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("fortuneInput");
  const mood = document.getElementById("fortuneMood");
  const btn = document.getElementById("fortuneBtn");
  const err = document.getElementById("fortuneError");
  const result = document.getElementById("fortuneResult");
  const text = document.getElementById("fortuneText");
  const suggestion = document.getElementById("fortuneSuggestion");

  // NEW: these match your HTML
  const iconEl = document.getElementById("fortuneIcon");
  const metaTextEl = document.getElementById("fortuneMetaText");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    err.textContent = "";
    result.hidden = true;

    const question = input.value.trim();
    if (!question) {
      err.textContent = "type something first.";
      return;
    }

    btn.disabled = true;
    btn.textContent = "cracking…";

    try {
      const res = await fetch(`${FORTUNE_BACKEND}/api/fortune`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mood: mood.value || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        err.textContent = data.error || "something went wrong.";
        return;
      }

      text.textContent = data.fortune;
      suggestion.textContent = "→ " + data.suggestion;
const left = document.getElementById("fortuneMetaLeft");
const right = document.getElementById("fortuneMetaRight");

const icon = SYMBOL_ICONS[data.symbol] || "✨";
if (iconEl) iconEl.textContent = icon;

if (left) left.textContent = "Symbol:";
if (right) right.textContent = `Mood: ${data.mood}`;

    

      result.hidden = false;

    } catch (e) {
      // show the real error to debug fast
      console.error(e);
      err.textContent = "backend unreachable.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Crack cookie";
    }
  });
});