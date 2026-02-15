const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Tabs */
const tabButtons = $$(".tabBtn");
const panels = $$(".tabPanel");
const indicator = $("#tabIndicator");

function setIndicatorTo(btn){
  const bar = btn.parentElement;
  const buttons = tabButtons;
  const idx = buttons.indexOf(btn);
  const total = buttons.length;

  // indicator width is precomputed in CSS for 3 tabs; we just translate it
  const barInnerWidth = bar.clientWidth;
  const pad = 6; // matches CSS
  const usable = barInnerWidth - pad*2;
  const w = usable / total;
  indicator.style.width = `${w}px`;
  indicator.style.transform = `translateX(${w * idx}px)`;
}

function activateTab(key){
  tabButtons.forEach(b => {
    const on = b.dataset.tab === key;
    b.classList.toggle("isActive", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });

  panels.forEach(p => p.classList.toggle("isActive", p.id === `tab-${key}`));

  const btn = tabButtons.find(b => b.dataset.tab === key);
  if (btn) setIndicatorTo(btn);
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

window.addEventListener("resize", () => {
  const active = $(".tabBtn.isActive");
  if (active) setIndicatorTo(active);
});

/** Reveal on scroll */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.14 });

revealEls.forEach(el => io.observe(el));

/** Copy pitch */
const copyBtn = $("#copyBtn");
const pitchText = $("#pitchText");
copyBtn?.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(pitchText.textContent.trim());
    copyBtn.textContent = "Скопировано ✓";
    setTimeout(() => (copyBtn.textContent = "Скопировать"), 1200);
  }catch{
    copyBtn.textContent = "Не удалось";
    setTimeout(() => (copyBtn.textContent = "Скопировать"), 1200);
  }
});

/** Theme toggle (saved) */
const themeBtn = $("#themeBtn");
const saved = localStorage.getItem("theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);

themeBtn?.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = (cur === "light") ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");

  localStorage.setItem("theme", next || "");
});

/** Year */
$("#year").textContent = String(new Date().getFullYear());

/** Init */
activateTab("fin");
requestAnimationFrame(() => setIndicatorTo($("#tabBtn-fin")));
