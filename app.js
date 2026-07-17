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

  /* ---------- liquid metal (rose gold dark / chrome light) ---------- */

  const LIQ_VERT = "attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";
  const LIQ_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPal;
uniform float uZoom;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.55;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 1.9 + vec2(13.7, 7.1);
    a *= 0.45;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y) * uZoom;
  uv.x *= 0.58;
  float t = uTime * 0.05;

  vec2 q = vec2(fbm(uv * 0.7 + vec2(t * 0.9, t * 0.4)),
                fbm(uv * 0.7 + vec2(4.7, 2.3) - t * 0.6));
  float n = fbm(uv * 0.8 + q * 2.8 + vec2(t * 0.3, 0.0));

  float x = fract(n * 1.5 - t * 0.7);

  vec3 base, mid, hi, fa, fb;
  if (uPal < 0.5) {
    base = vec3(0.09, 0.095, 0.11);
    mid  = vec3(0.62, 0.65, 0.70);
    hi   = vec3(1.0, 1.0, 1.0);
    fa   = vec3(0.42, 0.52, 1.0);
    fb   = vec3(1.0, 0.62, 0.24);
  } else {
    base = vec3(0.11, 0.05, 0.04);
    mid  = vec3(0.62, 0.36, 0.28);
    hi   = vec3(1.0, 0.92, 0.82);
    fa   = vec3(1.0, 0.45, 0.55);
    fb   = vec3(1.0, 0.76, 0.34);
  }

  float mMid = smoothstep(0.26, 0.44, x) * (1.0 - smoothstep(0.56, 0.74, x));
  float w    = smoothstep(0.44, 0.49, x) * (1.0 - smoothstep(0.51, 0.56, x));
  float mA   = smoothstep(0.405, 0.43, x) * (1.0 - smoothstep(0.43, 0.455, x));
  float mB   = smoothstep(0.545, 0.57, x) * (1.0 - smoothstep(0.57, 0.595, x));

  vec3 col = base;
  col = mix(col, mid, mMid);
  col += fa * mA * 0.9 + fb * mB * 0.9;
  col = mix(col, hi, w);

  gl_FragColor = vec4(col, 1.0);
}
`;

  const liquids = [];
  document.querySelectorAll("canvas.liquid").forEach(cv => {
    const gl = cv.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return; /* CSS gradient fallback stays visible */
    const prog = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, LIQ_VERT], [gl.FRAGMENT_SHADER, LIQ_FRAG]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      gl.attachShader(prog, s);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    liquids.push({
      cv, gl,
      uRes: gl.getUniformLocation(prog, "uRes"),
      uTime: gl.getUniformLocation(prog, "uTime"),
      uPal: gl.getUniformLocation(prog, "uPal"),
      uZoom: gl.getUniformLocation(prog, "uZoom"),
      zoom: parseFloat(cv.dataset.zoom || "1"),
      visible: true
    });
  });

  if (liquids.length) {
    const palette = () => (root.dataset.theme === "light" ? 0 : 1);

    function sizeLiquid(L) {
      /* soft effect upscales cleanly — render at reduced resolution */
      const w = Math.max(64, Math.round(L.cv.clientWidth * 0.5));
      const h = Math.max(64, Math.round(L.cv.clientHeight * 0.5));
      if (L.cv.width !== w || L.cv.height !== h) {
        L.cv.width = w;
        L.cv.height = h;
        L.gl.viewport(0, 0, w, h);
        L.gl.uniform2f(L.uRes, w, h);
      }
    }

    function drawLiquid(L, sec) {
      L.gl.uniform1f(L.uTime, sec);
      L.gl.uniform1f(L.uPal, palette());
      L.gl.uniform1f(L.uZoom, L.zoom);
      L.gl.drawArrays(L.gl.TRIANGLES, 0, 3);
    }

    liquids.forEach(sizeLiquid);
    window.addEventListener("resize", () => liquids.forEach(sizeLiquid));

    if (prefersReduced) {
      liquids.forEach(L => drawLiquid(L, 47.0));
      new MutationObserver(() => liquids.forEach(L => drawLiquid(L, 47.0)))
        .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    } else {
      const lio = new IntersectionObserver(entries => {
        for (const e of entries) {
          const L = liquids.find(l => l.cv === e.target);
          if (L) L.visible = e.isIntersecting;
        }
      }, { rootMargin: "100px" });
      liquids.forEach(L => lio.observe(L.cv));

      (function liquidFrame(ms) {
        const sec = ms / 1000 + 30;
        for (const L of liquids) if (L.visible) drawLiquid(L, sec);
        requestAnimationFrame(liquidFrame);
      })(0);
    }
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
