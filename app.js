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

  /* ---------- liquid metal ----------
     Adapted from paper-design/shaders "liquid metal" (Apache-2.0)
     https://github.com/paper-design/shaders */

  const LIQ_VERT = `#version 300 es
precision mediump float;
in vec2 aPos;
uniform vec2 u_resolution;
uniform float u_scale;
out vec2 v_objectUV;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_imageUV;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
  vec2 uvc = aPos * 0.5;
  v_responsiveUV = uvc;
  v_responsiveBoxGivenSize = u_resolution;
  v_imageUV = uvc + 0.5;
  float ar = u_resolution.x / u_resolution.y;
  vec2 o = uvc;
  if (ar > 1.0) { o.x *= ar; } else { o.y /= ar; }
  v_objectUV = o / u_scale;
}`;
  const LIQ_FRAG = `#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;
uniform float u_vignettePx;
uniform vec3 u_colorMult;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;


#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846


vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}


vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(u_vignettePx / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  
  color *= u_colorMult;
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);


  fragColor = vec4(color, opacity);
}`;

  const LIQ_PRESETS = {
    /* paper-design "Default" preset, diamond shape */
    gem:    { shape: 3, scale: 0.6, repetition: 2.0, softness: 0.1, shiftRed: 0.3, shiftBlue: 0.3,
              distortion: 0.07, contour: 0.4, angle: 70, alpha: true, res: 2, vignette: 250 },
    /* paper-design "Backdrop" preset, full-canvas fill */
    banner: { shape: 0, scale: 1.0, repetition: 1.5, softness: 0.05, shiftRed: 0.3, shiftBlue: 0.3,
              distortion: 0.1, contour: 0.4, angle: 90, alpha: false, res: 1, vignette: 70 }
  };

  /* [colorBack, colorTint] per theme; back alpha 0 = transparent around the gem */
  const LIQ_COLORS = {
    dark: {
      gem:    [[0, 0, 0, 0],               [0.94, 0.82, 0.72, 1], [0.93, 0.72, 0.54]],
      banner: [[0.04, 0.039, 0.047, 1],    [0.94, 0.82, 0.72, 1], [0.93, 0.72, 0.54]]
    },
    light: {
      gem:    [[0, 0, 0, 0],               [1, 1, 1, 1],          [1, 1, 1]],
      banner: [[0.949, 0.929, 0.886, 1],   [1, 1, 1, 1],          [1, 1, 1]]
    }
  };

  const liquids = [];
  document.querySelectorAll("canvas.liquid").forEach(cv => {
    const P = LIQ_PRESETS[cv.dataset.liq];
    if (!P) return;
    const gl = cv.getContext("webgl2", { alpha: P.alpha, antialias: false, preserveDrawingBuffer: true });
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

    /* 1x1 transparent stand-in for the unused image mask */
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

    const U = name => gl.getUniformLocation(prog, name);
    gl.uniform1i(U("u_image"), 0);
    gl.uniform1i(U("u_isImage"), 0);
    gl.uniform1f(U("u_imageAspectRatio"), 1);
    gl.uniform1f(U("u_shape"), P.shape);
    gl.uniform1f(U("u_scale"), P.scale);
    gl.uniform1f(U("u_repetition"), P.repetition);
    gl.uniform1f(U("u_softness"), P.softness);
    gl.uniform1f(U("u_shiftRed"), P.shiftRed);
    gl.uniform1f(U("u_shiftBlue"), P.shiftBlue);
    gl.uniform1f(U("u_distortion"), P.distortion);
    gl.uniform1f(U("u_contour"), P.contour);
    gl.uniform1f(U("u_angle"), P.angle);
    gl.uniform1f(U("u_vignettePx"), P.vignette);

    liquids.push({ cv, gl, P, kind: cv.dataset.liq,
      uTime: U("u_time"), uRes: U("u_resolution"),
      uBack: U("u_colorBack"), uTint: U("u_colorTint"), uMult: U("u_colorMult"), visible: true });
    cv.closest(".hero-gem-shape")?.classList.add("is-live");
  });

  if (liquids.length) {
    function applyLiquidTheme(L) {
      const c = LIQ_COLORS[root.dataset.theme === "light" ? "light" : "dark"][L.kind];
      L.gl.uniform4fv(L.uBack, c[0]);
      L.gl.uniform4fv(L.uTint, c[1]);
      L.gl.uniform3fv(L.uMult, c[2]);
    }

    function sizeLiquid(L) {
      const w = Math.max(64, Math.round(L.cv.clientWidth * L.P.res));
      const h = Math.max(64, Math.round(L.cv.clientHeight * L.P.res));
      if (L.cv.width !== w || L.cv.height !== h) {
        L.cv.width = w;
        L.cv.height = h;
        L.gl.viewport(0, 0, w, h);
        L.gl.uniform2f(L.uRes, w, h);
      }
    }

    function drawLiquid(L, sec) {
      L.gl.uniform1f(L.uTime, sec);
      L.gl.drawArrays(L.gl.TRIANGLES, 0, 3);
    }

    liquids.forEach(L => { sizeLiquid(L); applyLiquidTheme(L); });
    window.addEventListener("resize", () => liquids.forEach(sizeLiquid));
    new MutationObserver(() => {
      liquids.forEach(L => { applyLiquidTheme(L); if (prefersReduced) drawLiquid(L, 4.0); });
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    if (prefersReduced) {
      liquids.forEach(L => drawLiquid(L, 4.0));
    } else {
      const lio = new IntersectionObserver(entries => {
        for (const e of entries) {
          const L = liquids.find(l => l.cv === e.target);
          if (L) L.visible = e.isIntersecting;
        }
      }, { rootMargin: "100px" });
      liquids.forEach(L => lio.observe(L.cv));

      (function liquidFrame(ms) {
        const sec = ms / 1000;
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
