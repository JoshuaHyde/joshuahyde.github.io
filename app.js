/* Joshua Hyde — portfolio interactions */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;

  /* ---------- theme ---------- */

  const toggle = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("jh-theme");
  if (stored === "light" || stored === "dark") root.dataset.theme = stored;

  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("jh-theme", next);
    document.querySelector('meta[name="theme-color"]')
      .setAttribute("content", next === "dark" ? "#0a0a0c" : "#f2ede2");
    toggle.classList.remove("bouncing");
    void toggle.offsetWidth; /* restart the animation */
    toggle.classList.add("bouncing");
  });

  /* ---------- liquid gold nav indicator ---------- */

  const nav = document.getElementById("lg-nav");
  const indicator = nav.querySelector(".lg-indicator");
  const navBtns = [...nav.querySelectorAll(".lg-btn[data-section]")];
  const sectionIds = navBtns.map(b => b.dataset.section);
  let activeBtn = nav.querySelector(".lg-btn.is-active");
  let suppressSpyUntil = 0;

  function moveIndicator(btn, instant = false) {
    if (!btn) return;
    if (instant) indicator.style.transition = "none";
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    if (instant) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
    if (activeBtn !== btn) {
      activeBtn?.classList.remove("is-active");
      btn.classList.add("is-active");
      activeBtn = btn;
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      /* let the smooth scroll play out without the spy fighting the ring */
      suppressSpyUntil = performance.now() + 900;
      moveIndicator(btn);
    });
  });

  function spy() {
    if (performance.now() < suppressSpyUntil) return;
    const marker = window.innerHeight * 0.38;
    let current = sectionIds[0];
    for (const id of sectionIds) {
      const el = id === "top" ? document.getElementById("top") : document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= marker) current = id;
    }
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 60) {
      current = sectionIds[sectionIds.length - 1];
    }
    const btn = navBtns.find(b => b.dataset.section === current);
    if (btn && btn !== activeBtn) moveIndicator(btn);
  }

  window.addEventListener("scroll", spy, { passive: true });
  window.addEventListener("resize", () => moveIndicator(activeBtn, true));
  window.addEventListener("load", () => moveIndicator(activeBtn, true));
  moveIndicator(activeBtn, true);

  /* ---------- reveals ---------- */

  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- tilt cards ---------- */

  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".tilt").forEach(card => {
      let raf = null;
      card.addEventListener("mousemove", e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          const rx = ((0.5 - py) * 5).toFixed(2);
          const ry = ((px - 0.5) * 5).toFixed(2);
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ---------- magnetic buttons ---------- */

  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.14}px, ${dy * 0.22}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- custom cursor ---------- */

  if (finePointer && !prefersReduced) {
    const cursor = document.querySelector(".cursor");
    const dot = cursor.querySelector(".cursor-dot");
    const ring = cursor.querySelector(".cursor-ring");
    let mx = -100, my = -100, rx = -100, ry = -100, seen = false;

    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; rx = mx; ry = my; document.body.classList.add("has-cursor"); }
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    }, { passive: true });

    document.addEventListener("mouseover", e => {
      cursor.classList.toggle("is-hover", !!e.target.closest("a, button"));
    });

    (function followRing() {
      rx += (mx - rx) * 0.38;
      ry += (my - ry) * 0.38;
      const size = cursor.classList.contains("is-hover") ? 26 : 17;
      ring.style.transform = `translate3d(${rx - size}px, ${ry - size}px, 0)`;
      requestAnimationFrame(followRing);
    })();
  }

  /* ---------- golden dust canvas ---------- */

  const canvas = document.getElementById("dust");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];
    let pmx = 0.5, pmy = 0.5;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const target = Math.min(150, Math.round((W * H) / 14000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: 0.25 + Math.random() * 0.75,          /* depth: parallax + size */
        r: 0.5 + Math.random() * 1.3,
        a: 0.15 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,          /* twinkle phase */
        ts: 0.4 + Math.random() * 1.2,            /* twinkle speed */
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.03 - Math.random() * 0.12
      }));
    }

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", e => {
      pmx = e.clientX / W;
      pmy = e.clientY / H;
    }, { passive: true });

    resize();

    let last = performance.now();
    (function frame(now) {
      const dt = Math.min(40, now - last) / 16.7;
      last = now;
      ctx.clearRect(0, 0, W, H);
      const light = root.dataset.theme === "light";
      const [cr, cg, cb] = light ? [138, 95, 24] : [232, 175, 72];

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt * p.z;
        p.tw += 0.02 * p.ts * dt;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;

        const ox = (pmx - 0.5) * 26 * p.z;
        const oy = (pmy - 0.5) * 26 * p.z;
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw)) * (light ? 0.55 : 1);

        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    })(last);
  }

  /* ---------- terminal vignette ---------- */

  const termBody = document.getElementById("term-body");
  if (termBody) {
    const PROMPT = '<span class="t-prompt">josh@lab:~$</span> ';
    const script = [
      { cmd: "systemctl --user list-units --state=running", out:
        '  <span class="t-dim">UNIT              LOAD    ACTIVE  SUB      DESCRIPTION</span>\n' +
        '  agents.service    loaded  <span class="t-ok">active  running</span>  AI agent platform\n' +
        '  trainer.service   loaded  <span class="t-ok">active  running</span>  procedural monster game\n' +
        '  voice.service     loaded  <span class="t-ok">active  running</span>  TTS voice pipeline\n' +
        '  avatar.service    loaded  <span class="t-ok">active  running</span>  VRM lip-sync avatar' },
      { cmd: "uptime", out: '  19:04:17 up 231 days,  2 users,  load average: 0.31, 0.24, 0.19' }
    ];

    let html = "";
    const caret = '<span class="term-caret"></span>';
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function runTerm() {
      if (prefersReduced) {
        termBody.innerHTML = script.map(s => PROMPT + s.cmd + "\n" + s.out).join("\n") + "\n" + PROMPT + caret;
        return;
      }
      for (const step of script) {
        html += PROMPT;
        for (const ch of step.cmd) {
          html += ch;
          termBody.innerHTML = html + caret;
          await sleep(24 + Math.random() * 40);
        }
        await sleep(260);
        html += "\n" + step.out + "\n";
        termBody.innerHTML = html + caret;
        await sleep(520);
      }
      html += PROMPT;
      termBody.innerHTML = html + caret;
    }

    const termIO = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        termIO.disconnect();
        runTerm();
      }
    }, { threshold: 0.3 });
    termIO.observe(termBody);
  }

  /* ---------- footer year ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();
})();
