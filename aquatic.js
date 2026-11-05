/* Original aquatic life studies. Reference / habitat mapping: SITE-INSPIRATION.md.
   No source formulas, sprites, recordings, libraries, or remote requests are used. */
(() => {
  "use strict";
  const root = document.documentElement;
  const background = document.getElementById("creature-background");
  const pond = document.getElementById("pond-life");
  const button = document.querySelector(".life-toggle");
  if (!background || !pond || !button) return;
  const bg = background.getContext("2d"), water = pond.getContext("2d");
  if (!bg || !water) return;

  const TAU = Math.PI * 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const key = "jh-life-paused";
  let savedPause = false;
  try { savedPause = localStorage.getItem(key) === "true"; } catch { /* Private storage is optional. */ }
  // Reduced motion always wins, including a preference change during this visit.
  let paused = savedPause || reduced.matches;
  let light = root.dataset.theme === "light";
  let time = 0, last = 0, raf = 0, drawRequested = true, pondVisible = false;
  let viewport = { w: 1, h: 1 }, basin = { w: 1, h: 1 };
  let readingAreas = [], pondTop = Infinity, scrollQueued = false;
  let seed = 7621;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Distinct bodies, not the same particle with different scale. Names are our own.
  const abstract = [
    { id: "plankton", refs: ["T013"], length: 32, width: 10, ribs: 7, tail: 18, pace: 1.8, shape: "wing" },
    { id: "wisp", refs: ["T015"], length: 65, width: 13, ribs: 13, tail: 28, pace: 1.1, shape: "curl" },
    { id: "lattice-wide", refs: ["T016"], length: 54, width: 26, ribs: 12, tail: 8, pace: 1.0, shape: "lattice" },
    { id: "lattice-narrow", refs: ["T016"], length: 48, width: 10, ribs: 9, tail: 26, pace: 1.4, shape: "wing" },
    { id: "coil", refs: ["T021"], length: 75, width: 16, ribs: 20, tail: 12, pace: 1.0, shape: "curl" },
    { id: "skeletal", refs: ["T022"], length: 60, width: 13, ribs: 10, tail: 18, pace: 1.3, shape: "spine" },
    { id: "fin-wisp", refs: ["T023"], length: 68, width: 12, ribs: 15, tail: 15, pace: 1.4, shape: "fin" },
    { id: "long-filament", refs: ["T024"], length: 30, width: 13, ribs: 7, tail: 62, pace: 0.8, shape: "filament" },
    { id: "plume", refs: ["T025"], length: 45, width: 27, ribs: 16, tail: 20, pace: 0.8, shape: "plume" },
    { id: "ribbon", refs: ["T028"], length: 85, width: 13, ribs: 24, tail: 8, pace: 1.0, shape: "ribbon" },
    { id: "fan", refs: ["T030"], length: 34, width: 24, ribs: 14, tail: 52, pace: 0.9, shape: "fan" },
    { id: "ribbed", refs: ["T033"], length: 70, width: 21, ribs: 22, tail: 12, pace: 1.0, shape: "fin" },
    { id: "glyph-wisp", refs: ["T032", "T033"], length: 60, width: 16, ribs: 13, tail: 20, pace: 1.1, shape: "glyph" },
    { id: "segmented", refs: ["T003"], length: 56, width: 12, ribs: 9, tail: 10, pace: 1.5, shape: "segments" },
    { id: "colony", refs: ["T038"], length: 43, width: 20, ribs: 7, tail: 12, pace: 0.6, shape: "cells" }
  ];
  const aquatic = [
    { id: "koi", refs: ["T005", "T006", "T007", "T011"], type: "fish", size: 1.1, pace: 1.0 },
    { id: "shark", refs: ["T004", "T008"], type: "fish", size: 1.35, pace: 1.2 },
    { id: "shoal", refs: ["T004", "T008", "T009"], type: "fish", size: 0.55, pace: 1.6 },
    { id: "tropical", refs: ["T009"], type: "fish", size: 0.85, pace: 0.9 },
    { id: "turtle", refs: ["T009"], type: "fish", size: 0.9, pace: 0.5 },
    { id: "ascii-jelly", refs: ["T005", "T010", "T020"], type: "jelly", size: 1.0, pace: 0.6 },
    { id: "point-jelly", refs: ["T018"], type: "jelly", size: 1.1, pace: 0.5 },
    { id: "line-jelly", refs: ["T017"], type: "jelly", size: 0.9, pace: 0.7 },
    { id: "streamer", refs: ["T026"], type: "jelly", size: 0.65, pace: 0.7 },
    { id: "membrane", refs: ["T029"], type: "jelly", size: 1.0, pace: 0.5 }
  ];

  const pondPositions = [[0.2,0.25],[0.42,0.38],[0.72,0.23],[0.83,0.5],[0.24,0.63],[0.48,0.56],
    [0.64,0.76],[0.82,0.72],[0.18,0.8],[0.49,0.22],[0.62,0.43],[0.39,0.77]];
  function inhabitant(index, pondLife) {
    const list = pondLife ? aquatic : abstract;
    const angle = random() * TAU;
    return {
      species: index % list.length,
      x: pondLife ? pondPositions[index][0] : 0.08 + (index * 0.618034 % 1) * 0.84,
      y: pondLife ? pondPositions[index][1] : 0.1 + ((index * 0.414214 + 0.13) % 1) * 0.8,
      angle, speed: (pondLife ? 10 : 7) + random() * 8,
      phase: random() * TAU, scale: 0.8 + random() * 0.35,
      age: random() * 15, changeAt: 30 + index * 2.1,
      fading: 1, turn: 0, pondLife
    };
  }
  const wanderers = abstract.map((_, i) => inhabitant(i, false));
  const mobileWanderers = [0, 3, 5, 8, 10, 12, 14].map(i => wanderers[i]);
  const residents = aquatic.map((_, i) => inhabitant(i, true));
  // Small companions have individual state; schools never become a rigid sprite.
  for (const index of [10, 11]) {
    const companion = inhabitant(index, true);
    companion.species = 2;
    residents.push(companion);
  }

  function syncButton() {
    button.hidden = false;
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = reduced.matches ? "Aquatic life · still" : paused ? "Resume aquatic life" : "Pause aquatic life";
    button.title = reduced.matches ? "Your reduced-motion preference keeps the pond still" : "Controls both aquatic habitats";
    button.disabled = reduced.matches;
  }
  button.addEventListener("click", () => {
    paused = !paused;
    savedPause = paused;
    try { localStorage.setItem(key, String(paused)); } catch { /* Continue without persistence. */ }
    syncButton(); wake();
  });
  reduced.addEventListener("change", () => { paused = reduced.matches || savedPause; syncButton(); wake(); });

  function fit(canvas, size) {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    // Locations are normalized, so resizing keeps every creature's identity.
    size.w = w; size.h = h;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function measure() {
    readingAreas = [...document.querySelectorAll(".hero-name,.hero-sub,.hero-overline,.hero-cta,.section-head,.about-copy,.terminal,.card,.stack-group,.spiral-inner,.premium-banner")]
      .map(el => el.getBoundingClientRect()).filter(r => r.bottom > 0 && r.top < innerHeight);
    pondTop = document.querySelector(".pond-section").getBoundingClientRect().top;
    scrollQueued = false;
  }
  function resize() { fit(background, viewport); fit(pond, basin); measure(); wake(); }
  function wake() { drawRequested = true; if (!document.hidden && !raf) raf = requestAnimationFrame(frame); }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(() => { measure(); wake(); }); }
  }, { passive: true });
  const observer = new ResizeObserver(resize);
  observer.observe(background); observer.observe(pond);
  const visibility = new IntersectionObserver(entries => {
    pondVisible = entries[0].isIntersecting;
    wake();
  }, { rootMargin: "60px" });
  visibility.observe(pond);
  new MutationObserver(() => { light = root.dataset.theme === "light"; wake(); })
    .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    else wake();
  });
  window.addEventListener("pagehide", () => { cancelAnimationFrame(raf); raf = 0; last = 0; });
  window.addEventListener("pageshow", wake);
  document.fonts?.ready.then(() => { measure(); wake(); });

  function move(a, dt, bounds, list, neighbors) {
    const spec = list[a.species];
    a.age += dt;
    const p = time * 0.16 + a.phase;
    let dx = Math.cos(a.angle) + Math.sin(p * 1.3) * 0.26;
    let dy = Math.sin(a.angle) + Math.cos(p * 0.9) * 0.22;
    // Turn within a padded habitat; long tentacles have a larger safe margin.
    const marginX = a.pondLife ? Math.min(0.28, 82 / bounds.w) : 0.09;
    const marginY = a.pondLife ? Math.min(0.3, 110 / bounds.h) : 0.12;
    dx += Math.max(0, marginX - a.x) * 18 - Math.max(0, a.x - 1 + marginX) * 18;
    dy += Math.max(0, marginY - a.y) * 18 - Math.max(0, a.y - 1 + marginY) * 18;
    for (const other of neighbors) {
      if (other === a) continue;
      const sx = (a.x - other.x) * bounds.w, sy = (a.y - other.y) * bounds.h;
      const d2 = sx * sx + sy * sy;
      if (d2 > 0 && d2 < 85 * 85) { dx += sx / (d2 + 100) * 17; dy += sy / (d2 + 100) * 17; }
    }
    const target = Math.atan2(dy, dx);
    const diff = Math.atan2(Math.sin(target - a.angle), Math.cos(target - a.angle));
    a.turn = lerp(a.turn, clamp(diff, -1, 1), 1 - Math.exp(-dt * 2));
    a.angle += a.turn * dt * 0.75;
    const pulse = spec.type === "jelly" ? 0.4 + 0.9 * Math.pow(Math.max(0, Math.sin(time * 1.7 + a.phase)), 2) : 1;
    a.x = clamp(a.x + Math.cos(a.angle) * a.speed * spec.pace * pulse * dt / bounds.w, 0.02, 0.98);
    a.y = clamp(a.y + Math.sin(a.angle) * a.speed * spec.pace * pulse * dt / bounds.h, 0.04, 0.96);
    // Roster rotation on small screens, with a quiet fade rather than a jump.
    if (!a.pondLife && viewport.w < 700 && a.age > a.changeAt) {
      a.fading = Math.max(0, a.fading - dt * 0.45);
      if (a.fading === 0) { a.species = (a.species + 7) % list.length; a.age = 0; }
    } else a.fading = Math.min(1, a.fading + dt * 0.3);
  }

  function line(ctx, points) {
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
  }
  function ribbonCenter(u, spec, phase) {
    const curl = spec.shape === "curl" ? 13 : spec.shape === "ribbon" ? 9 : 4;
    return Math.sin(u * 5.2 - phase) * curl * (0.25 + u);
  }
  function drawAbstract(ctx, a) {
    const spec = abstract[a.species], p = time * spec.pace + a.phase;
    const points = [];
    ctx.lineWidth = 0.7;
    if (spec.shape === "cells") {
      for (let i = 0; i < 7; i++) {
        const angle = i * 2.4 + Math.sin(p * 0.3) * 0.2;
        const x = Math.cos(angle) * Math.sqrt(i) * 8, y = Math.sin(angle) * Math.sqrt(i) * 8;
        ctx.beginPath(); ctx.ellipse(x, y, 7 + Math.sin(p + i), 5, angle, 0, TAU); ctx.stroke();
        line(ctx, [[x - 5, y], [x - 15, y + Math.sin(p + i) * 4]]);
      }
      return;
    }
    for (let i = 0; i <= spec.ribs; i++) {
      const u = i / spec.ribs;
      const x = spec.length * (0.5 - u), y = ribbonCenter(u, spec, p);
      points.push([x, y]);
      let envelope = Math.pow(Math.sin(Math.PI * u), 0.8);
      if (spec.shape === "fan") envelope = Math.pow(1 - u, 1.4);
      if (spec.shape === "filament") envelope *= Math.exp(-u * 2);
      const fin = spec.width * envelope * (0.9 + 0.15 * Math.sin(p * 1.4 - u * 6));
      if (spec.shape === "segments") {
        ctx.beginPath(); ctx.ellipse(x, y, 3, 4 + fin * 0.25, 0, 0, TAU); ctx.stroke();
      }
      for (const side of [-1, 1]) {
        const tipX = x - (spec.shape === "plume" ? 22 : 9) - 5 * Math.sin(p - u * 4);
        const tipY = y + side * fin;
        if (spec.shape === "glyph") {
          ctx.font = "8px ui-monospace, monospace";
          ctx.fillText(i % 3 ? ":" : "+", tipX, tipY);
        } else {
          ctx.beginPath(); ctx.moveTo(x, y);
          ctx.quadraticCurveTo(x - 5, y + side * fin * 0.6, tipX, tipY);
          if (["lattice", "ribbon", "fin"].includes(spec.shape)) {
            ctx.quadraticCurveTo(tipX - 6, tipY + side * 2, x - spec.length / spec.ribs, y + side * fin * 0.45);
          }
          ctx.stroke();
        }
      }
    }
    line(ctx, points);
    const end = points[points.length - 1];
    for (let j = -1; j <= 1; j++) {
      const tail = [];
      for (let i = 0; i <= 14; i++) {
        const u = i / 14;
        tail.push([end[0] - u * spec.tail, end[1] + j * u * 4 + Math.sin(u * 5 - p) * u * 5]);
      }
      line(ctx, tail);
    }
  }

  function fishPath(ctx, id, p) {
    const wag = Math.sin(p * 2.2) * 6;
    ctx.beginPath();
    if (id === "turtle") {
      ctx.ellipse(-3, 0, 20, 15, 0, 0, TAU);
      ctx.ellipse(20, 0, 8, 5, 0, 0, TAU);
      for (const side of [-1, 1]) {
        ctx.ellipse(8, side * 16, 10, 4, side * (0.7 + Math.sin(p) * 0.2), 0, TAU);
        ctx.ellipse(-16, side * 12, 8, 3, -side * 0.6, 0, TAU);
      }
    } else {
      const width = id === "tropical" ? 18 : id === "shark" ? 10 : 12;
      ctx.moveTo(32, 0);
      ctx.bezierCurveTo(13, -width, -12, -width, -26, wag * 0.5);
      ctx.lineTo(-40, -13 + wag); ctx.lineTo(-36, wag); ctx.lineTo(-40, 13 + wag);
      ctx.lineTo(-25, wag * 0.5);
      ctx.bezierCurveTo(-10, width, 17, width, 32, 0);
      if (id === "shark") {
        ctx.moveTo(0, -7); ctx.lineTo(-10, -26); ctx.lineTo(-15, -7);
        ctx.moveTo(5, 5); ctx.lineTo(-10, 23); ctx.lineTo(-13, 7);
      } else {
        ctx.moveTo(7, -7); ctx.lineTo(-6, -22 + Math.sin(p) * 3); ctx.lineTo(-10, -8);
        ctx.moveTo(7, 7); ctx.lineTo(-6, 22 - Math.sin(p) * 3); ctx.lineTo(-10, 8);
      }
    }
  }
  function drawFish(ctx, a, spec) {
    const p = time * spec.pace + a.phase;
    // Turn the local body into the direction of travel; the lettering is texture.
    ctx.save();
    fishPath(ctx, spec.id, p);
    ctx.globalAlpha *= 0.14; ctx.fill(); ctx.globalAlpha /= 0.14;
    ctx.clip();
    ctx.font = "7px ui-monospace, monospace"; ctx.textAlign = "center";
    for (let y = -27; y < 28; y += 6) for (let x = -42; x < 34; x += 5) {
      const n = Math.abs((x * 13 + y * 7) % 17);
      ctx.fillText(".:+=*#"[n % 6], x, y);
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= 0.35; fishPath(ctx, spec.id, p); ctx.lineWidth = 0.6; ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.arc(spec.id === "turtle" ? 24 : 23, -2, 1.2, 0, TAU); ctx.fill();
    if (spec.id === "turtle") {
      ctx.save(); ctx.globalAlpha *= 0.4;
      ctx.beginPath(); ctx.ellipse(-3, 0, 13, 9, 0, 0, TAU); ctx.stroke();
      line(ctx, [[-15, 0], [10, 0]]); line(ctx, [[-3, -10], [-3, 10]]); ctx.restore();
    }
  }
  function drawJelly(ctx, a, spec) {
    const p = time * 1.7 * spec.pace + a.phase;
    const pulse = 0.85 + Math.sin(p) * 0.15;
    const r = spec.id === "streamer" ? 13 : 25 * pulse;
    const height = spec.id === "membrane" ? 24 + Math.sin(p) * 5 : 23 / pulse;
    const glyphs = spec.id === "ascii-jelly";
    const particles = spec.id === "point-jelly";
    ctx.lineWidth = 0.65;
    if (particles) { ctx.shadowColor = light ? "transparent" : "#f1cc7c"; ctx.shadowBlur = 5; }
    for (let ring = 0; ring < 7; ring++) {
      const v = ring / 6, rx = r * Math.sqrt(1 - v * v), y = -height * v;
      const points = [];
      for (let i = 0; i <= 36; i++) {
        const angle = i / 36 * TAU;
        const x = Math.cos(angle) * rx;
        const yy = y + Math.sin(angle) * rx * 0.24 + (spec.id === "membrane" ? Math.sin(angle * 3 + p) * 3 : 0);
        if (glyphs) {
          if (i % 3 === 0) { ctx.font = "7px ui-monospace, monospace"; ctx.fillText(ring % 2 ? ":" : "+", x, yy); }
        } else if (particles) { ctx.fillRect(x, yy, 1.1, 1.1); }
        else points.push([x, yy]);
      }
      if (points.length) line(ctx, points);
    }
    ctx.shadowBlur = 0;
    for (let j = -3; j <= 3; j++) {
      const points = [], length = spec.id === "streamer" ? 90 : 47 + Math.cos(j) * 14;
      for (let k = 0; k <= 24; k++) {
        const u = k / 24;
        const x = j * r * 0.23 * (1 - u * 0.5) + Math.sin(u * 5 - p - j * 0.3) * (2 + u * 9);
        const y = 4 + length * u;
        if (glyphs && k % 3 === 0) ctx.fillText(k % 2 ? "." : ":", x, y);
        else if (particles) ctx.fillRect(x, y, 1, 1);
        else if (!glyphs) points.push([x, y]);
      }
      if (points.length) line(ctx, points);
    }
  }

  function backgroundAlpha(x, y) {
    let opacity = 1;
    for (const r of readingAreas) {
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
      opacity = Math.min(opacity, 0.12 + clamp(Math.hypot(dx, dy) / 95, 0, 1) * 0.88);
    }
    return opacity * clamp((pondTop - y) / 150, 0, 1);
  }
  function drawBackground() {
    bg.clearRect(0, 0, viewport.w, viewport.h);
    const active = viewport.w < 700 ? mobileWanderers : wanderers;
    for (const a of active) {
      const x = a.x * viewport.w, y = a.y * viewport.h;
      bg.save(); bg.translate(x, y); bg.rotate(a.angle);
      const scale = a.scale * (viewport.w < 700 ? 0.65 : 0.95);
      bg.scale(scale, scale);
      bg.strokeStyle = bg.fillStyle = light ? "#886128" : "#d5b473";
      bg.globalAlpha = (light ? 0.38 : 0.44) * a.fading * backgroundAlpha(x, y);
      drawAbstract(bg, a); bg.restore();
    }
  }
  function drawPond() {
    water.clearRect(0, 0, basin.w, basin.h);
    // Wide, broken surface lines stay subtle and share the scene clock.
    water.strokeStyle = light ? "#fdf5d5" : "#d8c28c";
    water.lineWidth = 0.8;
    for (let i = 0; i < 7; i++) {
      water.globalAlpha = light ? 0.16 : 0.07;
      water.beginPath();
      water.ellipse(basin.w * (0.18 + i * 0.11), basin.h * (0.18 + i % 3 * 0.29), 35 + i * 9 + Math.sin(time * 0.3 + i) * 4, 7 + i, -0.2, 0.3, 2.6);
      water.stroke();
    }
    // Stable back-to-front ordering keeps translucent layers coherent.
    for (const a of [...residents].sort((a, b) => a.scale - b.scale)) {
      const spec = aquatic[a.species];
      water.save(); water.translate(a.x * basin.w, a.y * basin.h);
      // A jelly's bell leads its movement; tentacles trail in local +Y.
      water.rotate(a.angle + (spec.type === "jelly" ? Math.PI / 2 : 0));
      const scale = spec.size * a.scale * (basin.w < 500 ? 0.68 : 1);
      water.scale(scale, scale);
      water.strokeStyle = water.fillStyle = light ? "#505c3b" : "#dfc68d";
      water.globalAlpha = light ? 0.8 : 0.72 + (a.scale - 0.8) * 0.4;
      if (spec.type === "fish") drawFish(water, a, spec); else drawJelly(water, a, spec);
      water.restore();
    }
    water.globalAlpha = 1;
  }
  function frame(now) {
    raf = 0;
    if (document.hidden) { last = 0; return; }
    // One 30fps scheduler for both habitats, with bounded catch-up after suspension.
    if (last && now - last < 32 && !drawRequested) { raf = requestAnimationFrame(frame); return; }
    const dt = paused || !last ? 0 : Math.min((now - last) / 1000, 0.05);
    last = now;
    if (dt) {
      time += dt;
      const active = viewport.w < 700 ? mobileWanderers : wanderers;
      if (pondTop > 0) for (const a of active) move(a, dt, viewport, abstract, active);
      if (pondVisible) for (const a of residents) move(a, dt, basin, aquatic, residents);
    }
    drawBackground();
    if (pondVisible || drawRequested) drawPond();
    drawRequested = false;
    if (!paused) raf = requestAnimationFrame(frame); else last = 0;
  }
  syncButton(); resize();
})();
