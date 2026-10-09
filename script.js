// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (remembers choice)
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
document.getElementById("theme").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Typing effect
const lines = [
  "git commit -m \"learning every day\"",
  "npm run build-my-future",
  "echo \"open for internships\"",
];
const typed = document.getElementById("typed");
let li = 0, ci = 0, del = false;
function type() {
  const text = lines[li];
  typed.textContent = text.slice(0, ci);
  if (!del && ci < text.length) { ci++; setTimeout(type, 70); }
  else if (!del) { del = true; setTimeout(type, 1400); }
  else if (ci > 0) { ci--; setTimeout(type, 30); }
  else { del = false; li = (li + 1) % lines.length; setTimeout(type, 300); }
}
type();

// Scroll reveal + counters
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = setInterval(() => {
    n++;
    el.textContent = n;
    if (n >= target) clearInterval(step);
  }, 120);
}

// Project filters
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.f;
    document.querySelectorAll(".project").forEach((p) => {
      p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f);
    });
  });
});

// Card tilt + spotlight
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// Cursor glow
const glow = document.querySelector(".cursor");
window.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Particle network background
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H, pts = [];
function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  pts = Array.from({ length: Math.min(70, Math.floor(W / 20)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
  }));
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = "rgba(124,92,255,.8)";
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(0,224,184,${0.18 * (1 - d / 120)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
addEventListener("resize", resize);
resize();
draw();
