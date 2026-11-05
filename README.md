# joshuahyde.github.io

Personal site — [joshuahyde.github.io](https://joshuahyde.github.io/)

Hand-built static site. No frameworks, no build step, no dependencies:
`index.html` + `styles.css` + `app.js` + `aquatic.js`, served straight by GitHub Pages.

Notable details:

- **Liquid gold nav** — floating glassmorphism toolbar with a rotating
  conic-gradient indicator ring (4-layer construction: glow, clip, spinning
  gradient, inner plate) that slides between sections with spring easing.
- Original abstract swimmers behind the full viewport and a separate gold-toned
  footer pond with character fish, a turtle, and line/particle jellyfish. A shared
  pause control remembers the visitor's choice; reduced motion shows still life.
- Film grain overlay, scroll-driven
  reveals, 3D tilt cards, magnetic buttons, custom cursor.
- Dark theme by default with a full light theme behind the toggle.
- Respects `prefers-reduced-motion`; no horizontal overflow down to 320px.
- Liquid metal (hero gem + contact banner) renders with WebGL2, adapted from
  [paper-design/shaders](https://github.com/paper-design/shaders) (Apache-2.0) —
  rose gold in dark mode, chrome in light mode.
- Spiral interlude — a 4,000-point parametric curve plotted on 2D canvas, read as
  spherical coordinates `(r, φ, θ)` viewed down the polar axis. Auto-fits and
  animates on `t`, and hands `t` over to the pointer on hover. Curve seen in a
  clip by [@Rainmaker1973](https://x.com/Rainmaker1973/status/2078547852322549868),
  credited there to fascinating.fractals.

## Aquatic life review

Run `python -m http.server 4173 --bind 127.0.0.1`, then visit
`http://127.0.0.1:4173/`. Abstract creatures roam behind the page; scroll below
Contact to find the pond. Check dark/light mode, the shared pause control,
and a narrow screen. Reduced-motion users receive a still composition.
The habitats are silent and do not intercept clicks or scrolling.

`aquatic.js` owns the species registry, original procedural drawing, steering,
and one capped animation scheduler. Desktop shows fifteen abstract variations;
mobile shows seven at a time and rotates through the roster. The pond contains
twelve residents across ten styles, including smaller fish. Offscreen
pond simulation pauses, hidden tabs cancel scheduling, and resize preserves
normalized positions. No third-party sketches or media are bundled. Provenance,
style grouping, and research limitations are in [SITE-INSPIRATION.md](SITE-INSPIRATION.md).

Run the dependency-free lifecycle checks with `node --test tests/aquatic.test.cjs`.
These verify pause, storage failure, hidden-tab recovery, reduced motion, and
finite drawing coordinates through roster changes. Browser review covers actual
swimming, keyboard controls, theme repaint, navigation, and 320/360/390px layouts.
Browser checks are local Chromium checks, not proof of all-device performance.

Review snapshots: [background](docs/aquatic-background.png),
[desktop pond](docs/aquatic-pond.png), and [mobile pond](docs/aquatic-mobile.png).
These are still captures of the original local implementation, not the reference videos.
