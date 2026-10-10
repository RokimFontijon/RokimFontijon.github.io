// Footer year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (remembers your choice)
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme");
  if (!btn) return;

  function apply(mode) {
    root.setAttribute("data-theme", mode);
    btn.textContent = mode === "dark" ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(saved || (prefersDark ? "dark" : "light"));

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// ID card follows the mouse like it is hanging on a lanyard
(function () {
  var card = document.querySelector(".card-tilt");
  if (!card || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  var target = 0, angle = 0, velocity = 0, running = false;

  function tick() {
    velocity += (target - angle) * 0.04; // spring pull
    velocity *= 0.9;                      // friction
    angle += velocity;
    card.style.transform = "rotate(" + angle.toFixed(2) + "deg)";
    if (Math.abs(velocity) < 0.002 && Math.abs(target - angle) < 0.02) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("pointermove", function (e) {
    target = (e.clientX / window.innerWidth - 0.5) * 12;
    if (!running) { running = true; requestAnimationFrame(tick); }
  });
})();
