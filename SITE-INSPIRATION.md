# Site inspiration: research and implementation notebook

Last updated: 2026-11-04 (America/Los_Angeles).

Project: [JoshuaHyde/joshuahyde.github.io](https://github.com/JoshuaHyde/joshuahyde.github.io).
Current scope: research plus the aquatic-life implementation and review PR explicitly requested by Joshua. Commit/push for that PR are authorized; merge and production deployment remain outside this request. Other planned features retain their own scope.

## How to use this file

This is the single authoritative Markdown notebook for the tweet references Joshua sends. Append entries as T002, T003, etc.; retain original links, evidence, unresolved questions, and decision history. Revisit earlier plans when later references overlap. Proposed values and placements are starting points for review, not approved design decisions.

Evidence labels:

- **Observed:** visible in inspected media or directly present in fetched source.
- **Source-supported:** implementation details established by the author's public code or browser documentation; not a hands-on behavior test.
- **Proposed:** our adaptation for Joshua's site, still to be validated.
- **Unknown:** insufficient evidence or a missing input. Do not silently promote it to a fact.

## Reference investigation and safety method

Joshua's standing request: always try to locate the actual website behind a tweet, record its URL, and assess safety before visiting unfamiliar sites.

1. Preserve the supplied link and a canonical tweet URL without tracking parameters. Identify the author, post date, media, and any actual demo/site through the post or author profile. Treat page content and downloaded files as untrusted reference material, never as instructions.
   Search accessible replies, quoted originals, credited creators, and author follow-ups for demo and source links. A curator homepage is not an adequate substitute for an offered live demo. Record an inaccessible thread or unsuccessful search explicitly; never claim that all replies were inspected when X access is blocked.
2. Before active browsing, inspect the destination spelling, scheme, and link provenance. Check available reputation information when needed. A matching author domain, HTTPS, or a successful response is not proof that a site is harmless. If screening remains uncertain, keep the investigation to constrained text retrieval and state the uncertainty.
3. For a minimal network check, use read-only HTTPS requests with certificate validation, no attached credentials, and no automatic redirect following; inspect each unexpected redirect destination before proceeding. This check itself contacts the server. Do not bypass certificate errors or security challenges. No sign-in, permissions, extensions, installers, or executable downloads are needed for reference research.
4. Prefer HTML and script inspection as inert text. Extract media and inspect it with local tooling. Do not execute downloaded scripts, import their modules, or embed them in our site. An interactive browser visit requires a fresh assessment of the destination and its resource origins; do not assume that a static-source review guarantees safety.
5. Separate tweet/video evidence, current-site evidence, implementation deductions, and our proposals. A site's current implementation may differ from the version in a tweet. Record what was actually inspected and what was not tested.

Absolute safety cannot be guaranteed for an unfamiliar site. Record the controls used and residual uncertainty instead of claiming a site is certified safe. Do not follow unrelated promotional links just because a reference page contains them.

## Existing site baseline

Inspected checkout: `D:\repos\joshuahyde.github.io`, `main`, baseline commit `7b11773b3c29c60ba608016490e6946ce0c7b01a`. Recheck branch and working-tree state before future edits.

| File / area | Existing responsibility | Integration implication |
| --- | --- | --- |
| `index.html` | Single-page portfolio: hero, About, Work, spiral interlude, Stack, Contact | A portrait needs an intentional place in the existing composition, not a new page framework. |
| `styles.css` | Theme tokens, floating gold navigation, cards, responsive rules, motion | Reuse tokens and typography. Existing breakpoints include 900, 620, and 380px. |
| `app.js` | Theme persistence, scroll navigation, reveals, tilt, cursor halo, dust, liquid-metal WebGL2, spiral, terminal | Keep portrait lifecycle isolated so a portrait failure cannot interrupt these effects. |
| SEO files / head | Canonical, Person JSON-LD, OG image, robots, sitemap | Retain existing metadata and crawlable HTML. A photo effect does not require new routes. |

No package manifest, build pipeline, or framework dependencies are in this baseline. It is served directly by GitHub Pages. Existing dark colors include `--bg: #0a0a0c` and `--gold: #e8af48`; light mode uses `--bg: #f2ede2` and `--gold: #a3711d`.

The hero currently contains a decorative liquid-metal gem at `index.html:75`; its shader setup lives in `app.js`. The portrait must not be automatically wired into the existing `canvas.liquid` initializer. The existing `.tilt` behavior also changes transforms, so a draggable portrait should not receive that class on its drag transform element.

## Creature art styles and the two habitats

**Joshua's selected direction (2026-11-04):** minimal, imaginary creatures swim throughout the background of the website viewport. Recognizable fish and jellyfish swim freely inside a distinct pond area at the bottom of the site. Preserve the existing visual theme and include the distinct creature variations for variety. This placement decision supersedes the earlier suggestions to choose just one creature exhibit or restrict all mathematical creatures to a Lab card. Joshua subsequently authorized implementation and a new review PR; see the current status below. Per-reference research entries preserve their original observations and historical proposals.

Classify by **silhouette first, rendering style second**. A bell with trailing tentacles belongs in the pond even when drawn with mathematical points. A strange filament organism belongs in the page background even when its movement suggests swimming. “Fish,” “jellyfish,” and the descriptive specimen names below describe visual resemblance, not verified species or original artist titles.

### Art-style separation

| Art style | References containing living-looking forms | Visual distinction | Habitat rule |
| --- | --- | --- | --- |
| Minimal mathematical points and filaments | T013, T015–T017, T021–T026, T028–T030, T033 | Fine skeletal lines, ribs, wisps, changing abstract anatomy | Imaginary forms in the page background; obvious bell/tentacle forms in the pond |
| Character / ASCII creatures | T004, creature scenes in T005, T007–T011, jellyfish portion of T020, T032 | Shapes built from visible glyphs; stylized rather than photorealistic | Fish, sharks, turtles, and jellyfish in the pond; T032's abstract glyph organism in the background |
| Luminous point-cloud jellyfish | T018 | Translucent bell volume, glow, long soft tentacles | Pond, with restrained glow to coexist with the ASCII/line creatures |
| Geometric segmented creatures | T003 | Articulated crawler-like bodies and repeated appendages | Original small segmented swimmer in the background; do not crawl over or modify real text |
| Cellular / optical life-like abstraction | T038 | Rounded lens cells grouped into a moving colony | Secondary background colony candidate, simplified to match the minimal inhabitants; dense optical treatment remains a separate-card option |

T019 is a catalog/presentation reference spanning many abstract forms, not a separately identified species. Its clip does not establish an inventory of every formula. Use it for variety and specimen review without pretending its entire gallery has been individually cataloged. T004 and T008 repeat the same shark scene; they do not require duplicate shark species. T032 and T033 share an explicit source relationship, but preserve their different glyph and fine-line appearances as visual variants.

### Habitat A: minimal imaginary creatures across the page background

Use fine warm-gold/ivory marks on obsidian and bronze on cream. Keep bodies small enough to remain ambient, with readable individual silhouettes. The effect should feel like an inhabited space behind the whole website, rather than isolated loops inside each content section. Actual creature travel is a new behavior we must author; many source clips deform a form in place and do not establish free-swimming navigation.

| Planned original variation | Reference trail | Distinguishing feature to preserve as inspiration |
| --- | --- | --- |
| Tiny abstract plankton family | [T013](https://x.com/yuruyurau/status/2098437824714596619) | Several small, sparse, winged/antenna-like silhouettes with thin tails; vary silhouette as well as size |
| Curled wisp | [T015](https://x.com/yuruyurau/status/2093712395386728715) | Narrow curling body with long loose filaments |
| Broad and narrow lattice swimmers | [T016](https://x.com/yuruyurau/status/2093711731084415124) | Two contrasting wire forms, each with its own swimming path; avoid locking every pair together |
| Coiling ribbed swimmer | [T021](https://x.com/yuruyurau/status/2088904112436023549) | Long curling spine and feathered sides |
| Paired skeletal/winged swimmers | [T022](https://x.com/yuruyurau/status/2088626015614747055) | Slender articulated-looking forms with sparse protrusions and differing phases |
| Slender finned wisp | [T023](https://x.com/yuruyurau/status/2088902386786169001) | Related to T021, but a distinct narrower silhouette and motion rhythm |
| Long-filament drifter | [T024](https://x.com/yuruyurau/status/2088276148094673096) | Compact body with disproportionately long fine extensions; limit tail length at background scale |
| Frilled plume | [T025](https://x.com/yuruyurau/status/2087125958272909624) | Soft curled mass of flowing frills without a clear jellyfish bell |
| Ribbon-spine swimmer | [T028](https://x.com/yuruyurau/status/2083571114543046898) | Long ribbed ribbon with regular side strands |
| Fan-tailed drifter | [T030](https://x.com/yuruyurau/status/2082474544644985022) | Compact fan/comb front and extended wispy wake |
| Ribbed and glyph variants | [T033](https://x.com/yuruyurau/status/2080977918914969636), [T032](https://x.com/hey_zilla/status/2081317492379500646) | Independently designed ribbed creature, with separate fine-point and coarse-glyph appearances |
| Small segmented swimmer | [T003](https://x.com/rybinfx/status/2115793230533103837) | Repeating body segments and a traveling appendage rhythm, adapted from the crawler concept |
| Sparse cellular colony | [T038](https://x.com/poetengineer__/status/2117498951997731062) | A few softly changing connected cells; simplify the dense source background and wires |

The firefly-like scene in T005 can inform tiny ambient accents, rather than become another large animal. Keep that distinction in the species registry. Treat the colony and segmented swimmer as secondary variations after the fine-line family reads consistently. Include every listed variation in the eventual roster; a small screen does not need to display the entire roster simultaneously. Rotate arrivals so variety remains visible over time. Do not replace distinct bodies with identical particles at different sizes.

**Movement and page integration:** use a fixed viewport-sized decorative canvas behind page content, with independent world positions and persistent identities while scrolling. Give each creature smooth steering, individual speed/phase, gradual turns, local body undulation, and delayed trailing filaments. Avoid synchronized circular orbits, random per-frame direction jumps, and rigid sprite translation. Build each local silhouette separately from its travel path so heading and anatomy remain coherent during turns.

Keep the canvas non-intercepting (`pointer-events: none`, decorative/hidden from accessibility APIs). Navigation, project links, text selection, touch scrolling, and portrait dragging must work normally. Maintain quiet zones behind titles and dense reading areas through soft opacity masks or content-aware steering. Use filled card backgrounds where necessary. Creatures can pass behind foreground content; they should not draw over words. Replace or reduce the existing dust layer so the page does not accumulate unrelated ambient systems.

Use one scheduler and a shared species registry, not one canvas/animation loop per tweet. Start with a sparse active population and tune after visual review. Maintain stable identities when reducing density; cycle the remaining roster gradually rather than destroying/recreating all animals on scroll or resize. The full-page population continues across sections, then fades out around the footer pond boundary so abstract creatures do not appear to escape the pond or cover its fish.

### Habitat B: a separate pond at the bottom of the site

This is a dedicated, generously sized footer habitat below Contact, before the copyright/attribution strip. It is visible as a destination at the end of the page, not a small thumbnail, floating overlay, or another screen-wide wallpaper. The gold theme connects it to the rest of the website; a shaped rim, recessed water surface, restrained ripples, subtle depth gradient, and clipped boundaries establish a separate body of water. Avoid a bright blue aquarium palette that conflicts with the current site.

| Planned original pond inhabitant | Reference trail | Distinguishing appearance / movement |
| --- | --- | --- |
| ASCII sharks and small schooling fish | [T004](https://x.com/bestdesignsonx/status/2115473674627153933), [T008](https://x.com/insporadesign/status/2113519530387681343) | Recognizable shark silhouettes and smaller schools; count the repost as provenance, not another animal |
| ASCII koi | [T007](https://x.com/daoho04/status/2114490773043388518), [T011](https://x.com/himanshubuildss/status/2114355117248123097), koi scene in [T005](https://x.com/handsher_NGU/status/2115618341675319417) | Curving bodies, tail-led turns, loose roaming and optional short schooling; these are shared species/behavior references |
| Tropical fish / turtle variants | [T009](https://x.com/handsher_NGU/status/2114499451918197060) | Broader fish and rounded turtle-like silhouettes, with slower fin/paddle cadence; keep distinct from the shark |
| ASCII jellyfish | [T010](https://x.com/MarceloDesignX/status/2114611049702011197), jellyfish portions of [T005](https://x.com/handsher_NGU/status/2115618341675319417) and [T020](https://x.com/praveenisomer/status/2092222962153697540) | Glyph-built bell that contracts before forward motion, with tentacles trailing after the pulse |
| Translucent point-cloud jellyfish | [T018](https://x.com/ann_nnng/status/2093217880896852284) | Softer volumetric bell and luminous filaments; preserve its distinct rendering treatment |
| Fine-line bell jellyfish | [T017](https://x.com/yuruyurau/status/2093710258120331463) | Clear bell/vase silhouette with looped trailing strands; its recognizable outline places it here despite mathematical rendering |
| Tiny cap with long streamer | [T026](https://x.com/yuruyurau/status/2086396764580634879) | Small cap and long curling tail read as jellyfish-like; pond placement is a visual interpretation, not a species claim |
| Fluttering membrane jellyfish | [T029](https://x.com/yuruyurau/status/2083185617345921400) | Broad soft bells/membranes with trailing strands and varied pulse phases |

T006's [Wishing Pond](https://baked.design/lab/wishing-pond/) informs the water surface, contained pond composition, and koi motion. It need not add another identical koi. Use ordinary DOM/canvas layering as the reliable baseline; experimental HTML-in-Canvas is unnecessary for fish beneath an unobstructed water surface. The human bust in T020 is not a pond creature.

**Free-swimming behavior:** fish explore the entire available pond rather than patrol fixed lanes. Combine gentle flow, individual targets, separation, soft boundary avoidance, and optional loose schooling. Jellyfish advance with bell pulses and drift with current, with slower vertical travel and trailing-tentacle lag. Keep all bodies and long appendages inside the water mask. Border steering should turn animals naturally before contact rather than bounce them like balls. Use subtle scale/contrast variation for depth while preserving each art style's readability.

Let visitors watch without needing to click, feed, type, or move the mouse. Optional pond-local ripples can follow a deliberate tap without hijacking page input; feeding is secondary and must not be required for swimming. No ambient sound is requested for these habitats. Keep T037's toy audio controls independent. A single accessible Pause/Resume control should stop both creature habitats, with remembered preference if implemented; reduced-motion defaults to an attractive still composition.

### Coverage, rights, and implementation checks

Every uniquely described creature appearance above belongs to the planned roster. Related source posts remain separately credited; duplicated reposts and behavior-only references do not inflate the species count. The T019 gallery may yield more individual candidates if later investigated, but do not claim they are all identified or implemented now. Creature-inspired does not include T014's orb, T027's circles, T031/T035's curves, T034's abstract network, the portrait, liquid gem, or bead cube. Those retain their own workstreams.

Direct copying of unknown-license art/formulas remains unresolved. Implement independently authored creatures that capture broad traits and movement, or use code with confirmed compatible terms and attribution. The earlier creator-specific rights note still applies; this habitat decision does not create permission to port exact sketches. Preserve source links and original/derived status per species in the registry.

**Feature check using the feature-stress-test skill:** the intended visitor benefit is a living, varied page that remains comfortable to read, followed by a pond worth pausing to watch. Reference clips support aesthetic plausibility (comparable-media evidence), but there is no visitor testing or performance proof yet. Background legibility, roster variety, a coherent mixed-style pond, and acceptable mobile cost are current assumptions. The bottleneck is whether multiple small creatures remain distinct and calm behind real portfolio content.

**Cheapest test:** approximately 2–3 hours for three contrasting background silhouettes and a footer pond with one fish and one jellyfish. Compare both themes and 360px/desktop layouts using the existing content. This is the first implementation slice, not a reduction of the requested eventual roster. If successful, expand species in small batches, preserving a reference-to-species coverage checklist. Render multiple moments to check turning, emergence, tentacle lag, and natural boundary behavior. Inspect actual reading contrast, pointer access, mobile scrolling, pause/reduced motion, resize stability, hidden-tab suspension, and offscreen pond suspension. Measure frame time and reduce density/sample counts before removing variety. No runtime or interaction verification has happened in this documentation update.

### Current implementation for review

Implemented on `codex/aquatic-habitats` in `aquatic.js`, `index.html`, and `styles.css`. The old dust loop was removed from `app.js`. The new code uses original analytic shapes, not the reference formulas, source art, purchased templates, or extracted media. No external requests, libraries, audio, or accounts were added.

The background registry includes fifteen variations corresponding to every identified row above, including both wide/narrow lattice variants and fine-line/glyph appearances. Desktop presents the whole registry; mobile presents seven distributed slots and rotates species with a fade. The pond includes ten styles: koi, shark, small shoal fish, tropical fish, turtle, ASCII jellyfish, point jellyfish, fine-line jellyfish, tiny streamer, and fluttering membrane. Two extra small fish bring the resident count to twelve. All inhabit one shared habitat rather than separate cards or visitor-selected presets.

Original movement includes independent heading, bounded steering, local separation, body/tail motion, pulsed jellyfish propulsion, and soft margins. A single 30fps-target scheduler owns both canvases with a 1.75 pixel-ratio cap. Actual frame delivery depends on device and existing effects; no universal frame-rate claim is made. Pond simulation suspends offscreen; hidden documents cancel the scheduler. Theme changes repaint even while paused. Reduced motion displays still creatures, and the pause preference persists when browser storage permits it. Canvas failure leaves real content and the CSS pond available.

Local Chromium review passed desktop 1440px and mobile 320/360/390px layouts, actual changing canvas output, shared pause/resume and persistence, keyboard operation, live reduced-motion changes, theme repaint, navigation, non-intercepting layers, and no-JS content. No page-script errors were captured. Dependency-free Node lifecycle/numerical tests cover hidden-tab recovery, blocked storage, still-state scheduling, and finite coordinates through roster changes. A local SEO-script attempt could not audit the HTTP preview because that script forces HTTPS/redirect checks; canonical/metadata/JSON-LD, robots, and sitemap were checked separately and preserved. No production deployment or field performance was tested.

Review locally with `python -m http.server 4173 --bind 127.0.0.1`, visit `http://127.0.0.1:4173/`, then scroll below Contact. Run `node --test tests/aquatic.test.cjs` for the automated lifecycle checks. The portrait, pressure toy, and unrelated art cards remain unimplemented. This status supersedes earlier “documentation only” and “no runtime verification” statements in the preserved research history.

## Reference register

| ID | Reference | Actual site | Status | Intended use |
| --- | --- | --- | --- | --- |
| T001 | [@rameerez: interactive face](https://x.com/rameerez/status/2115858625180946827) | [rameerez.com](https://rameerez.com/) | Source and sampled media analyzed; no interactive behavior test | A photographic portrait with drag response, elastic deformation, and restrained animation in the site's current theme |
| T002 | [@emilkowalski: interaction lab](https://x.com/emilkowalski/status/2115789995860517254) | [Live lab](https://aiforui.dev/lab) | HTML and sampled video inspected | Curated interaction experiments and selected physical effects |
| T003 | [@rybinfx: Crawlers](https://x.com/rybinfx/status/2115793230533103837) | [Collection and interaction description](https://opensea.io/collection/crawlers-by-slava-rybin/overview) | Sampled video and project description inspected; executable artwork not run | Optional procedural creature in a contained playground |
| T004 | [@bestdesignsonx: ASCII animation, credit @stackedlol](https://x.com/bestdesignsonx/status/2115473674627153933) | [Curator](https://bestdesignsonx.com/); [creator code](https://github.com/stackedlol/ascii-sharks) | Sampled video and related MIT source inspected | An ASCII creature scene in the existing terminal/generative style |
| T005 | [@handsher_NGU: living wallpapers](https://x.com/handsher_NGU/status/2115618341675319417) | [Author-linked archive](https://www.inspora.design/); [matching post path](https://www.inspora.design/posts/theme-for-claude-code) | Sampled video inspected; exact archive path rate-limited | Optional scene selector, separate from dark/light mode |
| T006 | [@nickbakeddesign: html-in-canvas](https://x.com/nickbakeddesign/status/2115688643344093499) | [Exact Wishing Pond demo](https://baked.design/lab/wishing-pond/) | Actual demo HTML/JS, sampled video, and browser documentation inspected | Localized water/refraction experiment with normal HTML fallback |
| T007 | [@daoho04: ASCII koi portfolio](https://x.com/daoho04/status/2114490773043388518) | [Live portfolio](https://www.daoho.dev/); [source](https://github.com/Dao-Ho/portfolio) | Live HTML, related replies, source, and sampled video inspected | Content-aware fish behavior and feeding |
| T008 | [@insporadesign: shark repost](https://x.com/insporadesign/status/2113519530387681343) | [Curator](https://www.inspora.design/); creator source in T004 | Sampled video inspected; visually same scene as T004 | Additional citation for the same shark candidate |
| T009 | [@handsher_NGU: tropical remix](https://x.com/handsher_NGU/status/2114499451918197060) | Author-linked Inspora; no standalone runnable remix found | Quote chain and sampled video inspected | Additional species and scene theming |
| T010 | [@MarceloDesignX: ASCII jellyfish](https://x.com/MarceloDesignX/status/2114611049702011197) | [Kurage product/preview](https://horizonx.so/explore/kurage-dashboard) | Exact product and its public video preview inspected | Gold ASCII jellyfish with restrained glass foreground |
| T011 | [@himanshubuildss: koi chat](https://x.com/himanshubuildss/status/2114355117248123097) | [Shoal product/preview](https://www.scrolltide.co/templates/shoal) | Exact product and its public video preview inspected | Interaction-triggered fish states and theme transition |
| T012 | [@TheMathFlow: cube/graph](https://x.com/TheMathFlow/status/2101154346583154801) | No exact live demo identified | Sampled video inspected; origin unresolved | Synchronized representations of one state |
| T013 | [@yuruyurau: small procedural creatures](https://x.com/yuruyurau/status/2098437824714596619) | Source formula is in the tweet; no separate demo found | Tweet code read as text; sampled video inspected | Low-cost mathematical creature field |
| T014 | [@skirano: luminous orb](https://x.com/skirano/status/2097054738760024262) | No exact demo found | Sampled video inspected | Original pointer-responsive gold orb |
| T015 | [@yuruyurau: curled form](https://x.com/yuruyurau/status/2093712395386728715) | Formula in tweet | Code and sampled video inspected; rights unresolved | Mathematical silhouette research |
| T016 | [@yuruyurau: paired forms](https://x.com/yuruyurau/status/2093711731084415124) | Formula in tweet | Code and sampled video inspected; rights unresolved | Phase and grouping research |
| T017 | [@yuruyurau: bell form](https://x.com/yuruyurau/status/2093710258120331463) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original generative specimen research |
| T018 | [@ann_nnng: point-cloud jellyfish](https://x.com/ann_nnng/status/2093217880896852284) | [Author's project hub](https://www.bubbbly.com/); exact demo unresolved | Hub HTML and sampled video inspected | Translucent bell/filament study |
| T019 | [@yuruyurau: specimen catalog](https://x.com/yuruyurau/status/2092990903669719199) | Exact gallery unresolved | Sampled video inspected | Static thumbnail selection, one active exhibit |
| T020 | [@praveenisomer: ASCII cards](https://x.com/praveenisomer/status/2092222962153697540) | No exact demo found | Sampled video inspected | Moving project art with stable card information |
| T021 | [@yuruyurau: coiling form](https://x.com/yuruyurau/status/2088904112436023549) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T022 | [@yuruyurau: paired wings](https://x.com/yuruyurau/status/2088626015614747055) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T023 | [@yuruyurau: ribbed form](https://x.com/yuruyurau/status/2088902386786169001) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T024 | [@yuruyurau: long filaments](https://x.com/yuruyurau/status/2088276148094673096) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T025 | [@yuruyurau: frilled plume](https://x.com/yuruyurau/status/2087125958272909624) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T026 | [@yuruyurau: cap and tail](https://x.com/yuruyurau/status/2086396764580634879) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T027 | [@ALCrego_: Synced](https://x.com/ALCrego_/status/2084014334104031315) | No exact demo found | Sampled media inspected | Independent phase/alignment diagram |
| T028 | [@yuruyurau: ribbon spine](https://x.com/yuruyurau/status/2083571114543046898) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T029 | [@yuruyurau: three membranes](https://x.com/yuruyurau/status/2083185617345921400) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T030 | [@yuruyurau: fan and trails](https://x.com/yuruyurau/status/2082474544644985022) | Formula in tweet | Code and sampled video inspected; rights unresolved | Original mathematical studies |
| T031 | [@matheorems: circular chords](https://x.com/matheorems/status/2081533777411486122) | No exact demo found | Sampled video inspected | Independent chord-circle exhibit |
| T032 | [@hey_zilla: Syrinx-v2ii](https://x.com/hey_zilla/status/2081317492379500646) | [Creator works](https://wibandwob.com/works/); exact demo unresolved | Quote chain, hub HTML, sampled video inspected; audio unverified | Shared visual/audio state and ASCII encoding |
| T033 | [@yuruyurau: Syrinx parent](https://x.com/yuruyurau/status/2080977918914969636) | Formula in tweet | Code, quote relationship, sampled video inspected; rights unresolved | Point-to-glyph comparison research |
| T034 | [@hey_zilla: sonified ASCII](https://x.com/hey_zilla/status/2080748950730993791) | Creator hub above; exact demo unresolved | Parent metadata and sampled video inspected; audio unverified | Optional original event-driven sound |
| T035 | [@Rainmaker1973: spiral](https://x.com/Rainmaker1973/status/2078547852322549868) | Already cited in our site | Sampled video and baseline source inspected | Consolidate with existing spiral |
| T036 | [@KrisRChase: liquid materials](https://x.com/KrisRChase/status/2030467262000636095) | Parent design prompt; no exact live demo found | Parent text and sampled video inspected | Refine existing gem, banner, and gold navigation |
| T037 | [@meowbooksj: soft cube and beads](https://x.com/meowbooksj/status/2076956577941090610) | Physical video; no web demo established | Sampled video inspected; audio unverified | Explicit request: pressable soft cube, emerging beads, optional sound |
| T038 | [@poetengineer__: Ommatidia](https://x.com/poetengineer__/status/2117498951997731062) | No exact demo/source found | Sampled video and detail frame inspected; file has no audio | Original interactive cellular lens card |

## T001 — A portrait visitors can grab and stretch

### Intent and source trail

Joshua wants to place his own image on the site, let visitors drag/move it, give it a more physical appearance, and add animation while keeping the site's current theme. The exact placement and whether dragging moves the entire portrait, deforms the face, or does both remain design decisions.

- Original supplied URL: <https://x.com/rameerez/status/2115858625180946827?a=adGWYQkZEr6WIR2CNh0&s=20>.
- Canonical post: <https://x.com/rameerez/status/2115858625180946827>.
- Author: Javi, `@rameerez`; post timestamp returned by the mirror: 2026-10-29 17:29:41 UTC.
- Actual reference site: <https://rameerez.com/>. It is also the website listed in the retrieved author profile, and Joshua explicitly identified it.
- Alternate retrieval: <https://api.fxtwitter.com/status/2115858625180946827>. This is a third-party mirror, not X's official API. Direct X retrieval returned 403; the mirror returned post text and media URLs.

Short post excerpt: “You can now play with my face.” The post describes an interaction, not a technical implementation or performance guarantee.

### Safety and access record

The initial public HTML/source fetch occurred before Joshua added his explicit safety instruction. No interactive browser session was opened for the reference, and its JavaScript was not executed locally. Subsequent work remained static-source and media inspection.

A later constrained HTTPS HEAD request to `https://rameerez.com/`, with redirects disabled and normal certificate validation, returned HTTP 200 at the same URL and `text/html; charset=UTF-8`. This establishes a reachable HTTPS endpoint, not a malware verdict. No independent reputation scan or comprehensive security audit was performed.

The fetched HTML includes Google Tag Manager, an analytics script at `a.rameerez.com`, Cloudflare resources, and a module import map. These would matter for active browser loading; they were not needed to execute the effect for this investigation. Research files remain outside the site checkout to avoid accidentally shipping third-party scripts or media. No reference scripts have been added to our runtime.

**Assessment:** adequate evidence was obtained through constrained text/media retrieval. Interactive execution remains unassessed. Do not characterize the site as proven safe or run all of its downloaded code to continue this plan.

### What was inspected

The retrieved video is approximately 27.07 seconds. A 1280×720 rendition was downloaded, then a contact sheet was generated with sampled frames at roughly 0, 3, 6, 9, 12, 15, 18, 21, and 24 seconds. This is sampled visual inspection, not a full real-time playback or a hands-on test.

**Observed in those frames:** a photographic cutout sits over an orange circle; the head extends above the circle. Parts of the head and face stretch dramatically in the direction of a pull. Other frames show the face at rest with different expressions. The visual effect is localized mesh-like distortion, not merely translating a rectangular image.

**Not established by sampled frames alone:** precise settling time, touch ergonomics, frame rate, screen-reader behavior, or whether all current idle animations appeared in the tweeted version. Source inspection below explains intended mechanisms, not measured quality on our devices.

### Actual public implementation

These are the author's public source URLs inspected on 2026-11-04. They may change; local snapshots preserve the version examined.

| Source | Role and evidence |
| --- | --- |
| [Portrait controller](https://rameerez.com/wp-content/themes/orangito/assets/js/controllers/portrait_controller.js) | Stimulus wrapper: starts near the viewport, supports a data-saving tap path, retains a still photo if initialization fails, and limits retries after WebGL context loss. |
| [Portrait setup: javi.js](https://rameerez.com/wp-content/themes/orangito/assets/js/face/javi.js) | Face-specific image names, eye manifest, reaction mapping, idle sequences, framing, optional sound, and decorative props. |
| [Deformation engine: plushie.js](https://rameerez.com/wp-content/themes/orangito/assets/js/face/plushie.js) | Dependency-free photo deformation engine, WebGL renderer, pointer handling, eye patches, simulation, visibility controls, and cleanup. |
| [Portrait styling](https://rameerez.com/wp-content/themes/orangito/assets/css/face.css) | Circular/block framing, image fallback, expanded canvas bounds, focus treatment, touch behavior, and props. |
| [Optional audio](https://rameerez.com/wp-content/themes/orangito/assets/js/face/squeak.js) | Separate sound component; the portrait setup initializes sound disabled. Audio is unnecessary for our initial adaptation. |

The host site uses WordPress and a Stimulus controller, but those are not requirements for the effect. Its core renderer requests `webgl` (WebGL 1), while our existing liquid-metal effect requests WebGL2. Do not confuse the two requirements.

**Deformation, source-supported:** the image is a textured grid. Nodes store displacement from their rest positions. A damped wave model combines neighbor coupling, a restoring force, velocity damping, and smoothing of small ripples:

`ü = c²∇²u − ω²u − γu̇ + ν∇²u̇`

A circular grab brush acts in the deformed image, distributing the pull across nearby points. A separate, slower spring makes the whole head lean. The implementation uses bounded simulation substeps and settles/reset guards; simply applying an unconstrained spring once per animation frame would miss these stability protections.

**Apparent depth, source-supported:** deformation creates an inferred height/slope field used for lighting and a soft sheen. It is a photograph on a deformable surface, not a reconstructed anatomical 3D head. This can create a physical impression without a 3D model or live generative inference.

**Animation assets, source-supported:** `javi.js` lists 12 face images, including smile, shock, ouch, dizzy, deadpan, yawn stages, and whistle stages. It also loads `eyes.json` and a sheet of eye patches for gaze/blinks. These are prepared image assets, not convincing expressions automatically produced from any single photo. Idle actions include yawning, eye movement, dozing, a scripted cheek tug, and a fly sequence. Some are much more theatrical than our intended first version.

**Input and lifecycle, source-supported:** the code handles pointer cancellation, focus loss, touch scrolling, visibility, reduced-motion preferences, WebGL loss, and teardown. CSS permits vertical panning and pinch zoom on the hit area. It has a focusable button for non-pointer activation. These details deserve explicit design and testing; copying the attractive shader alone would not reproduce the experience.

No open-source license or permission to reuse these portrait files was established. Their public availability is not permission to redistribute them. Use the behavior as a reference and write our own implementation, unless a suitable license or permission is confirmed later. Do not publish the author's photos, eye sheet, code snapshots, or demo video as our assets.

### Adaptation for Joshua's site

**Proposed visual target:** a recognizable, natural-looking portrait with a clean cutout, warm restrained rim light, a dark raised plate, and a subtle gold border. Keep skin tones photographic. In light mode, use the existing cream and bronze palette with a softer shadow. Do not reproduce the reference's orange branding or apply a metallic shader directly to the face.

Placement candidate A is a portrait adjacent to the hero copy, composed with the existing gem. Candidate B is a portrait in About, retaining the current hero. Start design review with A, but do not remove, replace, or reposition the gem until the composition is selected. Mobile must remain a deliberate stacked composition with space for the bottom navigation.

Separate two interactions explicitly:

| Layer | Intended behavior | Boundary |
| --- | --- | --- |
| Outer portrait/frame | Bounded movement and slight tilt, with a predictable reset/return | Stay inside a defined stage; do not become an unrestricted draggable window or cover text/navigation. |
| Inner photographic surface | Local grab deformation and damped release; restrained highlights suggest depth | Deform the person, not the gold frame or surrounding layout. Preserve identity at rest. |

Nested elements must own their transforms independently. Define hit regions or an explicit interaction mode so dragging the face does not simultaneously drag the whole stage. The reference demonstrates local deformation; whole-portrait repositioning is an additional interpretation of Joshua's request and should be reviewed before implementation.

Suggested initial tuning, **unvalidated**: stage movement of 12–24 CSS pixels, tilt up to 3–5 degrees, and a face pull limited to roughly 10–20% of portrait width. Let go into a short damped settle, rather than the reference's extreme stretched-face comedy. Tune using the real portrait and actual rendered result; these are not extracted reference settings.

Start animation with quiet gaze/blink behavior only if suitable assets exist. A single still photo can support drag, deformation, and modest head sway. It cannot supply unseen eyelids or new facial expressions convincingly without additional prepared images. Do not claim one photo is enough for all the reference's acting. Expression generation or image editing is a separate asset task after Joshua supplies/selects a photo.

### Proposed implementation sequence

1. **Select assets and composition.** Obtain Joshua's chosen source photo; prepare a high-resolution original plus optimized transparent portrait and still fallback. Choose hero versus About, crop, framing, and movement behavior. Reserve dimensions before loading so the page does not jump. No photo has been supplied for this feature yet.
2. **Static integration.** Add semantic portrait markup and scoped styling using existing tokens. Keep meaningful alt text and a still image independent of canvas. Add a dedicated module such as `portrait.js`, loaded separately from `app.js`; initialization errors must leave the still image usable.
3. **Bounded interaction spike.** Implement Pointer Events, stage-local coordinates, pointer capture, safe release/cancel handling, and a keyboard-accessible activation/reset. On touch, preserve ordinary vertical scrolling and pinch zoom. Decide whether deliberate horizontal drag or an explicit activation mode works best on real phones.
4. **Photo deformation.** Build an original small textured mesh with local falloff, damped motion, conservative lighting, and bounded substeps. Start around 32–48 cells per side as a test range, not a performance claim. Avoid introducing Three.js or a build pipeline unless a measured requirement justifies it.
5. **Animation and validation.** Add registered eye/expression assets only after the base photo and drag feel are accepted. Verify dark/light composition, input, fallbacks, reduced motion, and performance alongside the existing canvases before any publish step.

Keep module responsibilities separate: input/controller, simulation/rendering, asset manifest, and lifecycle. The manifest should define neutral image, optional expression variants, eye patches/coordinates, framing, and version. Register every expression to the same crop, eye centers, scale, lighting, and silhouette to prevent crossfade jumps.

For the first adaptation, omit sound, haptics, fake cursor props, flies, and frequent automatic comic routines. They are not necessary to establish the requested physical portrait and can compete with the site's existing motion. Additional tweets may change that priority.

### Assumptions and cheapest test

Experience claim: visitors will understand that the portrait can be handled and find it physically responsive while still reading Joshua's professional introduction comfortably.

| Assumption | Current evidence | How to resolve it |
| --- | --- | --- |
| Visitors will discover and enjoy the interaction | C: comparable reference; E: our judgment and Joshua's preference | Observe someone using an isolated prototype without instructions. |
| Joshua's photo will work with local deformation | E: assumption; photo not yet supplied | Test hair edges, beard/glasses if present, neck anchoring, and alpha borders on the actual image. |
| The effect can run alongside the existing canvases | Source supports a lightweight approach; no device measurements | Compare baseline and portrait-enabled frame timings on desktop and a real phone. |
| The professional theme survives playful deformation | E: design proposal | Review low and high pull variants in both existing themes. |
| Touch dragging will not make reading harder | Reference source provides a strategy, not validation on our site | Test vertical scroll, horizontal movement, long press, cancel, and pinch zoom on iOS/Android. |

Evidence grades follow the feature-stress-test skill: A = observed user behavior; B = QA/automated runs; C = comparable experience; D = article/trend; E = opinion. We have no A/B evidence for this feature on Joshua's site.

**Bottleneck:** whether a restrained physical treatment looks good with Joshua's actual photo and the existing hero. **Verdict: test first.** Once the photo and placement are selected, estimate 60–120 minutes for an isolated static-photo/drag prototype; add roughly 2–4 hours to test a small original deformation renderer. These are planning estimates, not work already performed or a delivery commitment. Full expression production and browser polish are additional scope.

### Acceptance checks before shipping

| Area | Pass condition |
| --- | --- |
| Visual identity | Recognizable neutral photo; clean silhouette; no expression alignment jumps; natural skin; gold/cream framing fits both themes. |
| Drag and recovery | Bounded pull; stable settle; no stuck grab after leaving, cancel, focus loss, resizing, or a second touch; reset remains available. |
| Mobile reading | Vertical scroll and pinch zoom work; bottom navigation remains reachable; no overlap or horizontal overflow at 320, 360, 390, and 768px. |
| Accessibility | Still image has alt text; interaction has a meaningful accessible label and visible focus; non-drag activation/reset is available. Reduced motion defaults to a static portrait with no idle gaze, sway, blink, or elastic loop. |
| Failure handling | Missing assets, denied storage, no WebGL, shader failure, and context loss preserve the photo and the rest of the page. Never blank the photo before a successful first render. |
| Resource use | Measure baseline versus enabled on the same devices; aim for smooth 60 Hz desktop interaction and usable mobile behavior. Stop idle simulation when settled, offscreen, or hidden; cap pixel ratio and texture sizes; release GPU resources. No performance result exists yet. |
| Publication | No third-party research snapshots or scripts become runtime assets; no new tracking/API requirement; preserve metadata and existing interactions; inspect the actual preview before deployment. |

The existing page already uses WebGL for the gem and contact banner plus other animation loops. Account for the combined GPU/CPU budget. Do not add a permanently running portrait loop just because the reference looks smooth in a video.

### Browser references consulted

- [MDN Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events): pointer capture, cancellation, and touch-action behavior relevant to the input plan.
- [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices): resource limits, rendering cost, and context management relevant to a small optional renderer.
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): user motion preference. The proposed static default is our design choice.

### Evidence archive and reproduction

Local evidence is intentionally outside the repository: `D:\ai_sandboxes\openai\github-site-research\T001\`. This path is machine-local; the source URLs above make the research recoverable elsewhere. Files are reference evidence, not production dependencies:

- `tweet.json`: third-party tweet response, including full original media variants and author-site link.
- `demo.mp4`: the inspected 1280×720 video; original rendition URL: <https://video.twimg.com/amplify_video/2115856091611373568/vid/avc1/1280x720/IVLvbBshbuNugGS1.mp4?tag=29>.
- `contact-sheet.jpg`: sampled visual evidence, read left-to-right then top-to-bottom. Created using FFmpeg `fps=1/3,scale=640:-1,tile=3x3`, one output frame.
- `reference.html`, `portrait_controller.js`, `javi.js`, `plushie.js`, `face.css`, `squeak.js`: inert public source snapshots. Do not execute or redistribute without establishing permission.
- `safety-preflight.json`: later same-host HTTPS/header check and its limited interpretation.

Snapshot SHA-256 fingerprints:

| File | SHA-256 |
| --- | --- |
| `tweet.json` | `746E8192AAE5CBDB5F068F8B72257965B29860D1412659980A4EC65EF764B73B` |
| `demo.mp4` | `F6ABE421583E225E899E8F1CE6D335A61B5E0AB35F3D1F6B1A9AB3154326F1DE` |
| `reference.html` | `74F33F279C55240AE9710DFC41882871945A43AC433F1741264B5365DFE859F5` |
| `plushie.js` | `0174FE93560474D57686BAC84785AB1A9D9ACA2CF558A2D36C184E065467C14D` |
| `javi.js` | `5CC07D87D43141ECE41522D232BCB00D9F7151B74D58077A0768697D21527651` |

### Open decisions and next action

No runtime code has been changed. Remaining inputs are Joshua's portrait, placement, drag interpretation, and desired animation intensity. No need to settle these before collecting the next tweets. Append the next reference here, then consolidate their shared requirements before starting implementation.

## T002 — Emil Kowalski's interaction lab

### Sources, demo discovery, and access

Original supplied URL: <https://x.com/emilkowalski/status/2115789995860517254?a=9gVgnEda7UgP5VZXWjU&s=19>. Canonical: <https://x.com/emilkowalski/status/2115789995860517254>. Mirror timestamp: 2026-10-29 12:56:59 UTC. Metadata is archived through `https://api.fxtwitter.com/status/2115789995860517254`.

The tweet describes generating interaction experiments under predefined rules and retaining favorites. It does not disclose the generator, prompt, daily automation configuration, or a learning algorithm. Treat automatic preference learning as unverified; keeping favorite outputs can simply mean human curation.

**Actual live lab located:** <https://aiforui.dev/lab>. Search of author follow-up posts exposed this more specific URL; the author's personal domain `https://emilkowal.ski/` is not the lab. The matching `aiforui.dev` domain also appears in the retrieved author bio. HTTPS HEAD checks on those domains and the exact lab path returned 200 without redirects. The lab HTML was fetched as text, not executed. It contains Next.js resources and an analytics component. No sign-in, course purchase, skill installation, or scheduler configuration was performed.

### Evidence and mechanism

The 46.238-second video was sampled approximately every three seconds. It shows a dark gallery of separate experiments with captions/equations: orbiting particles, liquid-like blobs, an SVG path illustration, draft/final text, topographic contours, a particle flow, and fluid-filled typography. The current live page contains more experiments than can be confidently identified from the sampled video; it is not assumed to be the identical build.

Current HTML lists fourteen studies: Accretion, Grown to Shape, Mercury, Path, Loupe, Palimpsest, Reaction–Diffusion, Spring, Ease, Contours, Torch, Stir, Level, and Keyframes. Their descriptions offer specific inputs, such as pulling particles, flinging droplets, dragging a path scrubber, magnifying text, varying spring parameters, aiming a lamp, and tilting a liquid level. Equations and parameter labels are present in the HTML; their presence alone does not prove numerical accuracy or performance. We did not inspect the private generator or run the compiled experiments interactively.

### Intended adaptation

Two distinct uses earn review: a **workflow** for comparing small experiments, and selected **visitor interactions**. For the workflow, make two or three bounded variants, capture the visual/behavior difference, and record Joshua's selection here. Keep seed, parameters, constraints, and reasons for retaining/rejecting a variant. Do not create a daily background job or claim a model is being trained.

For the site itself, prioritize Spring/Ease as tuning references for T001 and the existing nav indicator; consider a gold contour or stirring field for one optional generative panel. Mercury overlaps the existing liquid-metal identity. Palimpsest could reveal before/after project details, provided all substantive text remains readable without the effect. Torch and Loupe should never be required to read ordinary portfolio copy. A gallery of all fourteen mechanisms would be a different product and is not the proposed default.

**Plan:** isolate one experiment in a fixed-size stage, use existing gold/cream tokens and mono labels, implement pointer plus keyboard/touch equivalents, then test a static reduced-motion state. Keep the original nav and normal reading flow. No React/Next.js migration is needed to reproduce selected behaviors.

**Stress test:** the bottleneck is whether the experiment makes the portfolio more memorable without obscuring the work. Evidence is C for a comparable demonstration, E for our site-specific expectation. Verdict: test one panel first. Estimate 45–90 minutes for a simple contour or spring-tuning spike after selection, with no automatic production integration. Accept only if the purpose is discoverable, input never blocks scrolling, and motion stops when hidden or disabled.

**Archive:** `D:\ai_sandboxes\openai\github-site-research\T002\` contains `tweet.json`, `demo.mp4`, `contact-sheet.jpg`, `reference.html`, and `safety-preflight.json`. Video SHA-256: `653BCCF89BAA465D2C03CAEAF58EB96CE18E0FBA18E0E163374C11B5E8A76C87`. Source rights for the lab's implementation were not established; treat the demos as references.

## T003 — Slava Rybin's Crawlers

### Sources and actual experience

Original: <https://x.com/rybinfx/status/2115793230533103837?a=1xQhKlXt7592RiReAhA&s=19>. Canonical: <https://x.com/rybinfx/status/2115793230533103837>. Mirror timestamp: 2026-10-29 13:09:50 UTC. It announces Crawlers with OpenSea and The Daily Program; the original post metadata has video but no direct executable-artwork URL.

The author's site is <https://www.rybinfx.com/>. A HEAD request to the apex domain returned a redirect; the matching www destination was checked separately and returned 200 before its HTML was read. It is a short artist/contact page and did not expose the crawler demo in its static HTML.

Follow-up/publisher searches located the specific project page: <https://opensea.io/collection/crawlers-by-slava-rybin/overview>. Its public description was read as text. This is a project/interaction guide, not a hands-on test of an individual artwork. It describes waking a creature on its generated page and an optional bookmark mechanism for other sites. No wallet was connected, collectible purchased, bookmarklet installed, or artwork code executed. The exact independently usable artwork URL remains unverified.

### Observations and limits

The 26.75-second video, sampled about every three seconds, shows articulated geometric creatures traversing a dark Wikipedia-like page. Long segmented bodies and many jointed legs contrast with ordinary text. Colored words become highlighted, scattered, and spatially associated with the moving creatures. Different body lengths, colors, and leg structures are visible.

The [project's own description](https://opensea.io/collection/crawlers-by-slava-rybin/overview) supports the combination of procedural motion, page-content interaction, sound, and generated text. Its language-prediction system was not inspected. Do not describe the artwork as simply a cursor-following spider, or claim that a particular inverse-kinematics algorithm was used. Joint chains, planted feet, and target selection are plausible ways to build an original approximation, not established source facts.

### Intended adaptation

Candidate: one small gold/bronze creature in an opt-in Lab stage, moving between designated labels or project nodes. Use a chain of body segments, a simple gait phase, alternating planted feet, bounded target selection, and a calm idle state. Gold joints and subdued connectors suit the current technical/observability imagery. Compare a compact beetle-like version with a longer crawler; anatomy is still a user choice.

Keep the actual portfolio DOM intact. If words appear to move, draw decorative duplicates from a small, explicitly authored vocabulary rather than removing, rewriting, or scraping visitor-visible copy. Do not import the collectible's artwork or bookmark code. No NFT, wallet, language-model service, or sound requirement follows from using the visual inspiration.

**Stress test:** the key uncertainty is whether an insect-like agent feels playful or distracting on this particular professional site. Evidence is C/E. Verdict: test an optional contained creature before considering a page-wide companion. Estimate 90–180 minutes for a simple original gait prototype. Pass conditions: stable feet and body turns; no clipping or text obstruction; normal pointer/keyboard navigation; easy pause; static reduced-motion treatment; no activity outside its visible stage. Whole-page wandering is a separate decision, not assumed approval.

**Archive:** `...\github-site-research\T003\` holds metadata, the video/contact sheet, and inert artist-site HTML. Video SHA-256: `9FEA540F8783D6CF8CC5CD9CF3F66961DBBFEFFDFBD889A28F1AB710A06E004F`. Artwork source and reuse license remain unknown.

## T004 — ASCII sharks, credited to @stackedlol

### Attribution, sources, and demo search

Original: <https://x.com/bestdesignsonx/status/2115473674627153933?a=iWNVtGNm_sB169FKPz4&s=19>. Canonical: <https://x.com/bestdesignsonx/status/2115473674627153933>. Mirror timestamp: 2026-10-28 16:00:02 UTC. This is a curator repost crediting `@stackedlol`, not a claim that Best Designs On X created the effect.

The provided site <https://bestdesignsonx.com/> passed a same-host HTTPS HEAD check and its HTML was read as text. Its static shell did not expose an exact runnable shark demo. Creator searches found a more detailed original demonstration at <https://x.com/stackedlol/status/2113123074115830201> and, more usefully, the primary repository <https://github.com/stackedlol/ascii-sharks>. The repository contains a local `demo.ts` entry; no public hosted exact demo was established from its README. T007 below supplies a related live portfolio and direct creator reply connecting that portfolio to this source.

### Observed and source-supported behavior

The 24.525-second repost video was sampled about every three seconds. Sharks and small fish built from monochrome characters cross a pale background around a translucent prompt composer. Body silhouettes remain recognizable through turns. Character density and shading provide volume; the interface stays visually separate from the moving scene.

The inspected [engine](https://github.com/stackedlol/ascii-sharks/blob/main/src/engine.ts) uses a fixed 1/60-second simulation step with a four-step catch-up cap, resize/intersection observers, pixel ratio capped at two, pointer input, teardown, and a still reduced-motion rendering. The [renderer](https://github.com/stackedlol/ascii-sharks/blob/main/src/renderer.ts) uses Canvas 2D and glyph drawing; this source does not require WebGL or a 3D asset. The world/species files separate movement and schooling from presentation. React is an optional wrapper, not a required site architecture.

[The license](https://github.com/stackedlol/ascii-sharks/blob/main/LICENSE) is MIT, copyright 2026 drewdi. Any substantial reuse must preserve the required copyright and permission notice. This permission applies to that repository; it does not automatically cover unrelated remix assets or every author's commercial template. Inspected Git tree snapshot: `a0074c16a106f0abc665fe9712ca445f8f98ad8e` (tree identifier, not claimed as a commit).

### Intended adaptation and test

Use this as a candidate renderer for one gold ASCII ecosystem, possibly combined with the koi behavior from T007 and the scene selection idea from T005. Prefer a contained section or optional ambient mode. Reuse `--font-mono`, existing gold values, and reduced contrast near important content. Avoid putting opaque canvas backgrounds over the hero, and do not create a fake chat input merely because the reference has one.

If selected, review and pin a licensed source revision, adapt/transpile the core into a self-contained browser module, retain attribution, and expose explicit palette, creature count, speed, size, and pause settings. Do not add a permanent framework/build dependency just to host the optional React wrapper. Add explicit document-visibility handling rather than assuming viewport intersection alone covers every lifecycle case.

**Stress test:** the uncertainty is whether the glyphs remain legible and attractive at mobile size without competing with text. Evidence is source-supported structure plus C/E for the proposed experience. Verdict: test first, with a 60–120 minute palette-and-density prototype. Check glyph font loading, small-screen readability, touch scrolling, pause/reduced motion, theme changes, cleanup, and measured frame cost. A smooth source video is not a benchmark.

**Archive:** `...\github-site-research\T004\` includes tweet, sampled video, curator HTML, and source/README/license snapshots saved as `.txt`. Video SHA-256: `3EEB44E28C9805415EC86AF711F28886ACAAA5D89D36C7B6BEA659793981994A`. No downloaded source has been run or added to this site's runtime.

## T005 — Living wallpaper / theme chooser concept

Original: <https://x.com/handsher_NGU/status/2115618341675319417?a=9r48fvwi4xDXJUdgdJk&s=19>. Canonical: <https://x.com/handsher_NGU/status/2115618341675319417>. Author: Marko Vineli. Mirror timestamp: 2026-10-29 01:34:53 UTC.

The author explicitly labels this a **fan concept** with eight living wallpapers. It is not evidence of an officially available Claude feature or a released plugin. The 16.3-second video was sampled about once a second. It shows a scene-thumbnail strip changing animated character-based environments while the foreground workspace persists. Visible categories include clouds, aquatic creatures, jellyfish, firefly-like points, and a moonlit scene. Not every small thumbnail label was legible enough to transcribe confidently.

**Website/demo investigation:** <https://www.inspora.design/> is in the author profile. A no-redirect HTTPS HEAD returned 200; inert homepage HTML contains a matching `/posts/theme-for-claude-code` link. Requesting that exact path returned 429. No retries to bypass the rate limit were made. No separate public runnable version or implementation source was established through the inspected metadata and follow-up search. Record the matching archive page as a reference location, not as a verified functional demo. T009 is a related remix by the same author.

**Proposed adaptation:** a small optional scene selector for the site's Lab/ambient art, separate from the existing dark/light toggle. Keep Obsidian & Gold as the default identity. Candidate scenes can share one renderer while changing behavior and glyph palettes; do not load all scene assets or run multiple worlds simultaneously. A visitor's scene choice may be persisted locally with storage access guarded so failure does not break the page. Provide a clear Still/Off option. No account, theme marketplace, or scheduled content generator is necessary.

**Implementation strategy:** choose two scene candidates after the full reference set is reviewed; implement one shared start/pause/resize/destroy contract; switch scenes by disposing the old one; use labeled buttons with selected-state semantics and keyboard navigation. Preview thumbnails can be static. Preserve the existing theme button's meaning and position. Reduced motion chooses a static composition, not a slower perpetual wallpaper.

**Stress test:** bottleneck is whether choice adds enjoyment without overwhelming the site's identity. Evidence C/E only. Test two static compositions and one active scene first, approximately 45–90 minutes for the chooser after a renderer exists. Test repeated switching for duplicate loops/listeners, storage failure, mobile control spacing, focus, contrast, and the combined canvas budget. Eight options are the reference's scope, not an implementation commitment.

**Archive:** `...\github-site-research\T005\` holds metadata, sampled video/contact sheet, homepage HTML, and its HTTPS preflight. Video SHA-256: `70C5B09D90A06B36E566163EFA919ABA55E22852C4108988C740C190DF54FE19`. Reuse permission and the fan concept's actual rendering technique remain unknown.

## T006 — Baked's Wishing Pond / HTML-in-Canvas

### Exact demo and primary references

Original: <https://x.com/nickbakeddesign/status/2115688643344093499?a=JEYnDyLO9goB_JD5avw&s=19>. Canonical: <https://x.com/nickbakeddesign/status/2115688643344093499>. Mirror timestamp: 2026-10-29 06:14:14 UTC. The post text only names HTML-in-canvas; searching the author's follow-up posts was needed to identify the actual experience.

**Exact live demo:** <https://baked.design/lab/wishing-pond/>. Its HTML title matches Wishing Pond, and it loads the same-origin [app.js](https://baked.design/lab/wishing-pond/app.js), both fetched as inert text after a no-redirect HTTPS HEAD returned 200. The page also references a Cloudflare analytics beacon; no third-party scripts were executed. Google's <https://chrome.dev/html-in-canvas/> is a related official demo index, not the actual pond. An independently hosted source listing also exists at <https://html-in-canvas.dev/demos/wishing-pond/>; our implementation analysis uses the author's own script.

### What the effect actually does

The 31.916-second video was sampled about every three seconds. A real-looking form sits beneath animated water in a koi pond. Ripples refract its text and boundaries, fish move through the scene, and a later state changes the lighting. Strong distortion can make the form temporarily hard to read.

The author's fetched script feature-detects `drawElementImage`, uses a Canvas 2D card/pond layer, a koi/coin layer, and WebGL water plus additional effects. Without the HTML-in-Canvas API, it leaves the form as a floating ordinary HTML element. Reduced-motion handling in this snapshot reduces amplitude; it is not the fully static preference proposed for our site. No `visibilitychange` handler was found in this script. These are reasons to design our own lifecycle and accessibility behavior, not evidence that the reference is production-ready for our audience.

Browser compatibility must be rechecked at implementation time. [Chrome's current update note](https://developer.chrome.com/blog/html-in-canvas-ot-changes) describes the API as experimental, in Origin Trial through Chrome 160, with changes to attributes, texture upload methods, and hit-test synchronization. Community pages encountered during research make different shipping claims. Use browser-vendor documentation and feature detection, not a version promise inferred from a viral demo. No browser flags or security settings were changed for this research.

### Intended adaptation

Candidate: a small interactive gold ripple/lens treatment over a decorative project preview, or a contained pond experiment in a Lab section. Keep actual navigation, headings, links, and any important form outside the distorted surface. The existing contact area links to GitHub; a decorative wish box must not be mistaken for a working message to Joshua.

Use ordinary Canvas/WebGL ripples behind normal DOM as the broad-browser first version. Only add live DOM refraction as a progressive enhancement after proving input/focus/hit-test behavior on the exact supported browsers. A plain DOM fallback must deliver the full content and interaction. Do not make all portfolio text swim under water.

**Plan:** static stage and readable HTML first; own ripple simulation and subtle gold highlights second; optional advanced capture third. Include no-WebGL and no-API fallbacks, local resize/pixel-ratio limits, hidden/offscreen pause, explicit motion controls, and safe resource cleanup. No source-reuse license was established for the author's pond script.

**Stress test:** the bottleneck is reliable readable controls under distortion across browsers. Evidence supports an attractive demonstration, not cross-browser QA. Verdict: prototype the ordinary-DOM fallback first (60–120 minutes), then estimate the advanced path only after browser checks. Pass conditions include real text selection, keyboard focus, hit-target alignment, correct form semantics, no motion under reduced-motion, and intact portfolio navigation.

**Archive:** `...\github-site-research\T006\` includes tweet/video/contact sheet, Google index HTML, author demo HTML, HTTPS preflights, and `pond-app.js.txt`. Video SHA-256: `A73A0FAA396BFA44951DCF513435B354A781F9E8CF8C08297878177918D00560`. Author script SHA-256: `8520E71BBB2C79DF8B7410C3E9C3B4FB744D2EAD5F96588B1E7A25741C8D5620`.

## T007 — Dao Ho's content-aware ASCII koi

Original: <https://x.com/daoho04/status/2114490773043388518?a=tOp0oLIX97rex6PCULY&s=19>. Canonical: <https://x.com/daoho04/status/2114490773043388518>. Posted 2026-10-25 22:54:20 UTC. **Actual live portfolio:** <https://www.daoho.dev/>. The tweet explicitly links `daoho.dev`; its HTTPS HEAD returned a 308 to the same-name www host. That destination was checked separately (200) before downloading its HTML as text.

An accessible [tweet/replies mirror](https://teapawt.org/daoho04/status/2114490773043388518) contains the author's reply crediting `stackedlol/ascii-sharks` for styling and linking **<https://github.com/Dao-Ho/portfolio>** for behavior/feeding. GitHub confirmed that public repo. Inspected tree: `914651c33f254e52bfee9dca5164264c2c33ebfe` (tree SHA). Relevant files are `src/app/components/koi-pond/{koi-pond.tsx,world.ts,renderer.ts,shape.ts}`; the first three were inspected. The live page was not executed interactively, and current source is not assumed to match the tweet exactly.

**Observed:** sampled frames from the 21.5-second clip show large ASCII koi around a small text block, switching between light and dark presentations. Fish overlap different parts of the scene as their bodies curve. **Source-supported:** content boxes are measured into avoidance/dimming regions; clicks outside controls and text selection drop bounded food pellets; fish choose and retain food targets; fast nearby pointer movement can startle them; feeding temporarily takes priority over fear. Reduced motion renders a still frame. The wrapper imports React, theme context, and PostHog. Those are site-specific dependencies, not requirements of fish simulation.

**Proposed strategy:** bring content avoidance, stable targets, and explicit interaction priorities into a shared optional ecosystem renderer. Keep the real hero/name/CTA readable with measured exclusion zones and alpha reduction. Feeding should be a deliberate stage action, not a side effect of clicking navigation or dragging T001. Implement the behavior in plain browser JS; do not copy PostHog, profile copy, theme libraries, or project data. No repository-wide reuse license was established; public source and attribution to MIT inspiration do not automatically license the whole derivative portfolio.

**Test first:** 90–180 minutes for one fish, one food target, and an avoidance region after renderer selection. Bottleneck: content readability while the scene feels responsive. Check small screens, theme changes, input/selection exclusions, bounded pellets, offscreen pause, reduced motion, and target stability. This is C/source evidence, with no device QA for our adaptation. Archive: `...\github-site-research\T007\` includes tweet, video/contact sheet, HTML/preflight, and source snapshots as `.txt`. Video SHA-256: `9405C1644D1E735757BC60FDCB361C4BFCDC3B1A6C6D33003FA76ED9B3E0DF36`.

## T008 — A second repost of the ASCII shark scene

Original: <https://x.com/insporadesign/status/2113519530387681343?a=MlrcW3EdOJsAgcgWkqI&s=19>. Canonical: <https://x.com/insporadesign/status/2113519530387681343>. Posted 2026-10-23 06:34:57 UTC. It credits `@stackedlol` and links <https://inspora.design>; the screened www archive was already inspected for T005.

The 24.525-second clip shows the same pale-background shark/prompt-composer scene as T004 in sampled frames. Different CDN files/hashes do not make it a separate design or implementation. Keep the independent citation and creator attribution; consolidate the proposed site work under T004's ASCII ecosystem rather than build a duplicate.

The curator link is not a verified live application. T004's primary source repository and T007's related live portfolio are the useful implementation references. No additional standalone demo was located for this repost. Archive: `...\T008\{tweet.json,demo.mp4,contact-sheet.jpg}`. Video SHA-256: `4B00105DB47D180B1FA818FDD7C48460AF428BCDA5A7E880AD890F53993FF5E0`.

## T009 — Tropical ASCII scene remix

Original: <https://x.com/handsher_NGU/status/2114499451918197060?a=pp1MoCcDpChgssrlPrU&s=19>. Canonical: <https://x.com/handsher_NGU/status/2114499451918197060>. Posted 2026-10-25 23:28:49 UTC. The retrieved quote chain points directly to T008. The author profile links Inspora; no public runnable remix or remix source was established through the metadata and targeted searches. Do not treat T004's MIT license as permission to copy this remix's additional art.

Sampled frames from the 24.5-second video show a cyan aquatic scene with ASCII turtles, sharks, small fish, and decorative flower/star-like forms around the same foreground prompt layout. Its contribution is a broader creature vocabulary and scene composition, not evidence of a new chat backend.

**Proposed strategy:** treat this as an alternate ecosystem preset in T005's chooser. Share creature movement/rendering infrastructure, but author distinct silhouettes, per-species size/speed, depth/opacity, and margins. Try gold/ivory creatures against obsidian and warm muted variants on cream before considering a bright cyan alternate. Keep silhouette and movement readable with a smaller count; avoid duplicating every creature at full prominence.

**Test first:** one original turtle silhouette and one school, approximately 60–120 minutes on an existing renderer. Bottleneck: whether the tropical idea can retain the site's visual identity. Compare at actual mobile size and behind real content. Archive: `...\T009\` contains metadata, quote chain, video, and contact sheet. Video SHA-256: `2A07F0C027E9639C84BCF786EBCA26F661779EF30E09AF40E85E18D0BFD56369`.

## T010 — Kurage ASCII jellyfish dashboard

Original: <https://x.com/MarceloDesignX/status/2114611049702011197?a=GL-cvA6KzkeF2RDFPbc&s=19>. Canonical: <https://x.com/MarceloDesignX/status/2114611049702011197>. Posted 2026-10-26 06:52:16 UTC. Creator follow-up searches led past the bio link to **<https://horizonx.so/explore/kurage-dashboard>**. Same-host HTTPS HEAD returned 200; the exact product HTML was downloaded as text. It includes marketing/tracking resources, which were not executed.

The product exposes public video previews, including **<https://cdn.horizonx.so/kurage-dashboard/kurage-detail-v2.mp4>** and <https://cdn.horizonx.so/kurage-dashboard/kurage-card-v2.mp4>. The detailed preview's CDN headers were checked before download, and its sampled frames were inspected alongside the 15-second tweet clip. These are actual product previews, not a claim of a tested runnable application.

**Observed:** luminous ASCII jellyfish with pulsing bells and hanging tentacles surround a dark glass composer. Foreground text changes between task prompts, with quieter small controls/history. The original product's cyan/lavender colors are not part of our site's identity.

The [provider description](https://horizonx.so/explore/kurage-dashboard) says it is a self-contained frontend with no AI backend, and describes motion controls, pointer/typing reactions, responsive layout, and focus behavior. These are provider claims, not hands-on QA. An indexed creator follow-up describes free source; the fetched product page currently describes membership/commercial licensing. We did not unlock/download gated source or resolve that entitlement difference. No license to redistribute the template was obtained.

**Proposed strategy:** original warm-gold jellyfish as an optional Lab/ambient mode, borrowing the bell-pulse/tentacle-lag relationship and protected foreground composition. Implement a bell surface with phase-based contraction and trailing curves/particles, then map shading to a glyph grid. A prepared glyph atlas can reduce repeated text work if profiling justifies it. Do not adopt the template's fake assistant, account UI, command palette, or changing professional claims merely to host the art.

**Test first:** one jellyfish at actual stage size, roughly 90–180 minutes; evaluate low-count versus fuller scenes. Bottleneck: readable slow motion without excessive CPU or blur. Verify font loading, low-motion/static presentation, reduced-transparency fallback, visible controls, both themes, and mobile performance. Archive: `...\T010\` includes metadata, product HTML, original and provider videos/contact sheets, and HTTPS preflights. Original video SHA-256: `38709D5B834FEF4BAA64D33EB83FC0BC8B977C9116A5E111B8090FC9EAEF4481`.

## T011 — Shoal's reactive koi interface

Original: <https://x.com/himanshubuildss/status/2114355117248123097?a=CAo0obgH__puJ9SgbsM&s=19>. Canonical: <https://x.com/himanshubuildss/status/2114355117248123097>. Posted 2026-10-25 13:55:17 UTC. The post links Scrolltide. HTTPS HEAD on `scrolltide.co` returned a 308 to `www.scrolltide.co`; that destination was checked separately (200) before reading it.

The exact match was located by inspecting the public templates index: **<https://www.scrolltide.co/templates/shoal>**, rather than stopping at the homepage. Its declared public preview is **<https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/previews/shoal.mp4>**. CDN headers were checked, the video downloaded, and sampled frames inspected. The inspected public page exposed a video preview, not an executable iframe. Source access is marked Premium; no account, purchase, MCP installation, or gated-source access was attempted.

**Observed:** sampled tweet/provider frames show a koi character grid behind a translucent prompt screen, with light and dark scenes. The [product page](https://www.scrolltide.co/templates/shoal) describes fish gathering while typing, fleeing on send, racing toward food on tap, and a circular day/night reveal. Treat those trigger details as provider-supported until tested, not behaviors proved merely by screenshots. A prompt screen is not proof of an AI backend.

**Proposed strategy:** incorporate event-driven creature states into the shared ecosystem: calm, curious, feeding, and dispersing. Map them to actual visitor actions only where they make sense, such as selecting a project or deliberately interacting with the Lab. Keep these art states separate from navigation and T001's pointer ownership. A circular reveal is a candidate transition for the existing dark/light button, provided the click point, reduced-motion fallback, and update timing remain correct. Do not add a chatbot solely because the reference has one.

**Test first:** a two-state fish experiment, 60–120 minutes after the base renderer. Bottleneck: whether state transitions improve responsiveness rather than distract from reading. Acceptance: explicit state priorities, stable counts/targets, no simulated submit success, working keyboard/touch, static reduced motion, and a theme transition that does not delay real controls. Archive: `...\T011\` includes tweet/video, homepage, templates index, exact Shoal page, provider video/contact sheets, and CDN preflight. Tweet video SHA-256: `DFF163F46E252B226AB2A5131E02F61FB0817AFFFA98268FDB8AA6A90923A730`.

## T012 — Rubik's Cube and synchronized circular diagram

Original: <https://x.com/TheMathFlow/status/2101154346583154801?a=C6j1AP9zeEN7loLPHCc&s=19>. Canonical: <https://x.com/TheMathFlow/status/2101154346583154801>. Posted 2026-09-19 03:40:08 UTC. Text claims solving a cube with graph theory. Metadata contains no actual-site link or creator source. Exact-status and descriptive searches found reposts and related research, but no verified original runnable demo or author attribution beyond this account.

The 15.177-second video was sampled about every two seconds. A rotating cube is paired with a circular network of colored markers; both change together and finish in a visually ordered state. This supports synchronized representations. It does **not** establish an optimal solver, identify a search algorithm, or prove that each diagram dot represents an entire cube configuration. Related [visualization research](https://link.springer.com/article/10.1007/s12650-026-01111-x) distinguishes facelet-position diagrams from state-space trajectories; that paper is background, not the source of this clip. Original animation rights remain unknown.

**Proposed strategy:** an optional educational Lab panel pairing one discrete state model with two visualizations. A faithful puzzle version would keep a 54-facelet permutation state, legal face-turn mappings, and a cube/diagram driven by the same move progress. Prefer SVG/Canvas diagram plus CSS 3D or a minimal renderer; do not add a heavyweight solver unless solving is selected as a feature. A simpler portfolio adaptation could pair a pipeline view and dependency graph, but must use real authored relationships and clear labels.

**Test first:** one legal face turn with both representations, 90–180 minutes. Bottleneck: demonstrably correct mapping, not visual polish. Check that a move followed by its inverse restores state, four quarter turns restore state, color counts remain fixed, and both views agree after a sequence. These are meaningful mathematical checks for a future implementation, not tests run in this research. Provide step/back/reset and textual state labels; do not rely on color alone. Archive: `...\T012\` contains metadata, video, and contact sheet. Video SHA-256: `05E65461D82CBDD2B9148E95575FE226B8056CC5674A69A533F51A1F46BB618B`.

## T013 — Small creatures from a compact mathematical point field

Original: <https://x.com/yuruyurau/status/2098437824714596619?a=MlvboYOpgWwvhLPaIro&s=19>. Canonical: <https://x.com/yuruyurau/status/2098437824714596619>. Posted 2026-09-11 15:45:39 UTC. Here the tweet itself contains the source formula with p5-style drawing helpers. No site is listed in metadata. Exact-status/formula searches did not establish a separate live demo; do not invent one or substitute unrelated derivative wallpaper projects.

The 96-second video was sampled approximately every eight seconds. It shows small fine white creature-like silhouettes arranged loosely around a circular region, repeatedly changing shape on black. These are analytic point patterns, not established autonomous agents, real organisms, or a simulation of biological flocking.

**Static code analysis:** each frame evaluates 10,000 sample indices, groups phases through `i mod 19`, derives two trigonometric coordinates and a radial quantity, and plots only samples passing a positive-coordinate gate. Further sinusoidal offsets and powers produce the silhouettes. Time advances by a fixed increment per frame, so a direct port would be refresh-rate dependent. Implicit globals and host helpers mean the tweet should not be pasted into our strict-mode `app.js`.

**Proposed strategy:** translate the math into a scoped, independently authored Canvas 2D module after checking reuse permission, using named parameters, explicit locals, elapsed-time motion, finite-value checks, viewport fitting, and precomputed index-only terms. Keep a selectable still frame and a lower sample count for mobile. Fractional powers near zero can produce large coordinates; handle boundaries deliberately rather than normalizing each frame in a way that makes the art pump in size. Preserve the source formula and author link in research; no original code was executed.

This is a candidate replacement/preset for one decorative point field or an additional mode within the existing spiral interlude, not another always-running full-page layer. Warm gold on dark and bronze on cream fit the theme. **Test first:** 45–90 minutes for a contained formula visualization after rights and placement are selected. Bottleneck: motion legibility at the intended size. Compare fixed scale, point count, paused state, and reduced-motion static output. Archive: `...\T013\` contains exact tweet text, video/contact sheet. Video SHA-256: `076C207A9228DF25040464D4417824B3D23620C08068EEED0DF6CA0EDE11563E`.

## T014 — A responsive luminous orb

Canonical: <https://x.com/skirano/status/2097054738760024262>. Supplied tracking parameters: `a=ID6vhrrK3rYawTOXd6o&s=19`. Posted 2026-09-07 20:09:45 UTC. The post calls the piece a personal positronic brain made with Astra. That is the author's description, not evidence of a new reasoning system or model capability benchmark.

Sampled frames from the 33.961-second clip show a blue/cyan point-shell orb, bright traveling filaments, rotation/deformation, a hand cursor, and a small voice/conversation control strip below. The visual changes between frames; a working microphone, audio-driven motion, or backend was not established from these samples.

**Demo/source search:** exact-status and distinctive-title searches did not establish a specific public runnable artifact or code. `https://magicpath.ai` appears in the author profile, but is a product homepage, not a verified URL for this orb; it was not treated as the demo. No microphone permission, account, or model API was needed for research.

**Proposed strategy:** an original warm-gold particle orb within a Lab card, with local pointer attraction, bounded rotation, and scripted bright filaments. Generate a sphere distribution, displace its radius with a smooth field, and draw controlled point/line layers. Audio-reactivity should be optional and driven by our own generated sound state; do not request a microphone or imply a live assistant by default. Keep it distinct from the hero's existing gem.

**Test first:** a 60–120 minute visual spike with a single interaction and a still fallback. Bottleneck: whether the orb adds anything beyond the existing liquid-metal/spiral effects. Check point density, attractive silhouette, no bright flashing, bounded pointer response, theme colors, and idle/hidden pause. No runtime or performance result exists. Evidence archive: `...\T014\{tweet.json,demo.mp4,contact-sheet.jpg}`.

## T015–T017 — Related mathematical creature studies

These are separate source posts and distinct formulas, not interchangeable copies. Their code is preserved in the corresponding `tweet.json`; clips were downloaded and sampled. No external demo link or author-profile site appears in their metadata. The shared code-analysis and rights notes below apply, but each visual and numerical difference is retained.

| ID / canonical source | Date UTC / clip | Observed form | Source-specific behavior and implementation consequence |
| --- | --- | --- | --- |
| T015 — <https://x.com/yuruyurau/status/2093712395386728715> | 2026-08-29 14:48:29 / 16s | One curling, filamented organism with a narrow body and long wispy extensions | 10,000 samples; time-varying transverse amplitude; magnitude-based radius; a reciprocal `0.2/k` term can create large outliers near zero. Preserve crop and motion before considering a new formulation. |
| T016 — <https://x.com/yuruyurau/status/2093711731084415124> | 2026-08-29 14:45:50 / 12s | Two alternating/interleaved wire-like forms, one broad and one compact | 10,000 samples; parity-dependent phase creates paired forms; cubic radial terms drive larger excursions. Per-frame automatic fitting could visibly resize the work. |
| T017 — <https://x.com/yuruyurau/status/2093710258120331463> | 2026-08-29 14:39:59 / 8s | A pulsing bell/vase silhouette with trailing loops | 20,000 samples; squared magnitude plus one keeps the radial divisor positive; density and repeated trigonometry matter more than rigid-body physics. Start any independent study at lower density and compare silhouette. |

**Intended use:** candidates for a single selectable mathematical-art card, not three permanent canvas layers. Assess a compact organism, a paired composition, and a bell-like composition as genuinely different choices. Suggested original art direction is fine gold/ivory traces on obsidian, bronze on cream, with a quiet parameter scrubber and a labeled still state. Do not characterize these deterministic formulas as biological simulation.

**Shared implementation method:** explicit local variables, `Math` equivalents for host helpers, elapsed-time animation, numeric guards, a fixed composition window, capped pixel ratio, and lifecycle cleanup. Do not paste implicit-global p5-style tweet code into the existing strict-mode IIFE. Assess licensing before any direct port; see the important author-preference note below. Estimate 45–90 minutes for one independent study after selecting a target; no implementation has begun.

## T018 — Ann Nguyen's point-cloud jellyfish

Canonical: <https://x.com/ann_nnng/status/2093217880896852284>. Supplied `a=gdJujoVn8SBeyJZI_Sw&s=19`. Posted 2026-08-28 06:03:27 UTC. The author describes making jellyfish in p5.js through TypingMind, as part of an aquarium project. These are author-reported tools; the visual does not establish the generating prompt or an implementation license.

The 19.816-second video was sampled at several points. It shows multiple translucent point-cloud jellyfish, soft glow, trailing tentacles, and a visible control panel with sliders and palette choices. Changes of palette and creature scale/density are visible. Unlike T010, these are small luminous particles rather than prominent text glyphs.

**Actual-site investigation:** the author's <https://www.bubbbly.com/> passed a same-host HTTPS HEAD (200), then was inspected as text. It links many genuine projects, including a later koi pond and ASCII tools. None was verified as the exact jellyfish artifact; do not relabel the later koi pond as this demo. Exact-post/title searches found secondary discussion and derivative projects but no confirmed standalone original jellyfish demo/source. No account or model service was used.

**Proposed strategy:** use the bell contraction, translucency, and trailing-particle hierarchy as a separate rendering style within the aquarium family. Build an original analytic bell surface plus damped filaments, one low-cost glow pass, and shared density/palette settings. Compare this point-cloud treatment with T010's ASCII treatment before committing to either. Keep advanced sliders in a contained Lab, not over the professional introduction.

**Test first:** 90–180 minutes for one original bell and a few filaments. Bottleneck: a graceful silhouette at a sustainable fill rate. Measure transparent overdraw, desktop/mobile cost, offscreen pause, and low-motion behavior. Archive: `...\T018\` includes metadata, video/review sheet, homepage HTML, and safety preflight. No original implementation source or reuse permission was obtained.

## T019 — A catalog of many generative specimens

Canonical: <https://x.com/yuruyurau/status/2092990903669719199>. Supplied `a=SOTUp4jtmKWH_LBvVPY&s=19`. Posted 2026-08-27 15:01:31 UTC. The post text is empty; there is no embedded formula or offered demo URL in the metadata.

Sampled frames from the 20.766-second video show a screen-sized gallery of dozens of small monochrome animated forms, with changing grid density/view scale. This is valuable as a **selection and comparison pattern**. It does not prove that all pieces share one formula, renderer, or public license.

Exact-status and author-gallery searches did not identify a verified URL for this catalog. A creator profile on Neort and various derivative galleries appeared in search; they were not established as the gallery in the clip. Keep this uncertainty explicit.

**Proposed strategy:** a small static thumbnail index for the selected original Lab pieces, with one active preview at a time. Use authored specimen names, source credits, and a simple active/paused state. Avoid running dozens of simulations merely to emulate the catalog. This can combine T002's curation method and T005's scene selection. Test a four-thumbnail layout first (30–60 minutes after exhibits exist): all items must be keyboard/touch reachable and the page must remain calm while scrolling. Archive: `...\T019\` holds metadata/video/review sheet; no source code was available for this specific clip.

## T020 — ASCII art inside project-like cards

Canonical: <https://x.com/praveenisomer/status/2092222962153697540>. Supplied `a=k_jPXDzQjQW9idcI06M&s=19`. Posted 2026-08-25 12:10:00 UTC. The text calls these ASCII cards. The profile's booking link is not a demo.

The 10.18-second downloaded clip shows two tall pale cards with large moving character-based illustrations, restrained lavender/gray tint, sharp titles/copy below, and small controls. One art region is a turning head-like form; another is a jellyfish-like form. Sampled evidence supports the split between moving illustration and stable information, not a specific rendering library or working card action.

Exact-post/creator searches did not establish an original runnable card demo or public source. Do not substitute a similarly named commercial component or another author's gallery as the source.

**Proposed strategy:** this is a close structural fit for the existing Work cards. Place a contained gold ASCII illustration in `.card-art`, retain real project titles/descriptions, and animate only the focused/visible card. Generate or author appropriate art for Joshua's actual projects, rather than borrow the portrait or copy unverified card claims. Do not put drag/tilt and artwork transforms on the same element.

**Test first:** one existing card with a still/animated illustration comparison, 60–120 minutes once an original art asset/renderer exists. Bottleneck: whether the illustration improves project recognition. Keep readable type, clear links, fixed card dimensions, static reduced motion, keyboard focus, and mobile tap behavior. Archive: `...\T020\` contains metadata/video/review sheet; original source and licensing remain unknown.

## T021–T026 and T028–T030 — Further mathematical motion references

Each row is a distinct inspected source. All provide compact drawing code directly in the tweet and no separate external demo URL in metadata. Exact formulas, timestamps, media URLs, and source attribution remain in the per-ID `tweet.json`. Six-frame review sheets sample the corresponding videos; descriptions below concern those observations, not a claim of running the code.

| ID / canonical tweet | Clip | Observed silhouette / distinguishing contribution | Numerical or design consequence for a future original study |
| --- | --- | --- | --- |
| T021 — <https://x.com/yuruyurau/status/2088904112436023549> | 12s | Coiling, long-tailed form that alternates broad and narrow postures | Includes a reciprocal of a cosine-derived coordinate; near-zero values can leave the frame. 10,000 points and a relatively fast per-frame time step. |
| T022 — <https://x.com/yuruyurau/status/2088626015614747055> | 16s | Two elongated skeletal/wing-like forms around an implied vertical axis | Parity phase separates the pair; a sine-dependent denominator has a small epsilon but can still become very small. An epsilon is not a complete stability bound. |
| T023 — <https://x.com/yuruyurau/status/2088902386786169001> | 18s | A related single flowing, ribbed/fin-like form | Shares structure with T021, but radial offset, longitudinal scale, time increment, and final phase differ. Preserve as a separate comparison instead of merging by appearance. |
| T024 — <https://x.com/yuruyurau/status/2088276148094673096> | 24s | Compact body with long vertical filaments and sweeping side fins | Piecewise denominator changes one region's behavior; unclipped dynamic fitting could amplify apparent size changes. |
| T025 — <https://x.com/yuruyurau/status/2087125958272909624> | 16s | Densely curled, frilled creature with a soft plume of extensions | Shared intermediate coordinate feeds both axes; slower time increment. Includes a reciprocal coordinate term; use explicit finite/out-of-bounds checks in any independent study. |
| T026 — <https://x.com/yuruyurau/status/2086396764580634879> | 12s | Small bright leading cap and a long twisting plume/tail | Polar-style angle and an animated positive-base power affect the tail envelope. Brightness should not be mistaken for measured depth. |
| T028 — <https://x.com/yuruyurau/status/2083571114543046898> | 16s | Curving ribbon/spine with many regular side filaments | A magnitude-squared radial term and a reciprocal transverse coordinate distinguish it from the similar T025. Thin features need actual-size mobile review. |
| T029 — <https://x.com/yuruyurau/status/2083185617345921400> | 36s | Three separately phased fluttering bell/membrane-like forms | Modulo-three phase creates multiple bodies; fourth-power radial envelope and animated oscillation determine grouping. This is not evidence of three interacting physics agents. |
| T030 — <https://x.com/yuruyurau/status/2082474544644985022> | 16s | A sweeping fan/comb with a bright compact front and extended trails | Piecewise transverse amplitude changes one end of the form. Treat the long tails as part of the intended crop rather than auto-zooming every frame. |

**Common intended use:** a curated set of original mathematical specimens within one switchable exhibit. Individual review choices should compare broad silhouette, trace weight, curl rate, symmetry, and motion pace. Do not install all sketches as independently running backgrounds. Use a fixed frame and explicit per-specimen bounds, capped samples, elapsed time, pause, a selectable still frame, accessible controls, and gold/bronze palettes.

**Rights and provenance update:** research found a [search-indexed author statement](https://boldnet.twstalker.com/yuruyurau) discouraging reuse/remixes of the original sketches and requesting non-commercial use and original-post attribution if reused. This is a third-party mirror of an author statement, not a confirmed blanket license for all historical posts. No permissive license was established. Accordingly, the current strategy is **visual research and independently conceived generative work**, not copying these exact sketches or producing near-identical parameter tweaks for publication. If a specific original is later desired, resolve permission and attribution before adopting it. No implementation is blocked by this research note; other references and original techniques remain available.

The T013/T015–T017 analysis above describes mechanisms and a possible technical port, not permission to perform that port. Apply this updated rights finding to all references from this creator. Estimated cheapest test for an independent specimen remains 45–90 minutes; a family-wide renderer should be selected only after reviewing static compositions. Primary uncertainty is artistic fit and readable motion, not whether a compact formula can plot points.

## T027 — A.L. Crego's “Synced”

Canonical: <https://x.com/ALCrego_/status/2084014334104031315>. Supplied `a=45i3u-t44G_B8YW1h1k&s=19`. Posted 2026-08-02 20:31:51 UTC. The post names the work Synced. Its media is marked GIF with zero duration in mirror metadata; the downloaded MP4 is about nine seconds. This illustrates why metadata duration is not blindly trusted.

Observed samples show four overlapping families of concentric circles, white moving points, and bright coincident intersections. It reads as phase coordination and periodic alignment. No original formula, live demo, or license was established through the metadata and title/creator searches. The author's `https://linktr.ee/alcrego` is a profile hub, not a verified interactive implementation; no need to execute it for the geometric analysis.

**Proposed strategy:** an original gold phase diagram with a few orbit families and markers, where a slider varies relative phase or rate. Derive positions analytically from elapsed time and use a bounded brightness increase when markers coincide. Avoid sharp flashing/bloom or implying sound that was not established in the GIF. It could serve as a subtle coordination metaphor near Agent Coordination, with a clear art label rather than fake telemetry.

**Test first:** 45–90 minutes for a small Canvas/SVG version. Bottleneck: a satisfying synchronization cycle at slow speed. Verify phase continuity when scrubbing, readable markers, no strobe, pause/static preference, and fixed layout. Archive: `...\T027\` contains original tweet response, actual MP4, and review sheet. Direct reuse of the artist's video is not proposed.

## T031 — Circular chord patterns and mathematical elegance

Canonical: <https://x.com/matheorems/status/2081533777411486122>. Posted 2026-07-27 00:15 UTC. The 53.333-second clip shows circular chord constructions developing into rosettes, star-like envelopes, and dense warm-colored centers. The accompanying quotation is attributed to Dirac by the post; its authenticity was not independently researched and is unnecessary for the design.

No original formula, external demo, or source link was established from metadata and exact-status searches. A familiar-looking times-table circle does not establish the actual algorithm used in this video. No permissive reuse license was found.

**Proposed strategy:** independently construct a chord exhibit using points on a circle and a mapping such as `i → m*i mod N`. This is a proposed technique, not a recovered formula. Animate the multiplier slowly; expose density and phase controls with a still view and pause. Gold lines and bronze intersections fit the current palette. Review against the existing spiral before adding another circular exhibit; one switchable mathematical card may be enough.

**Test first:** 45–90 minutes for a Canvas/SVG composition. Review actual-size line density, moiré, dark/light contrast, slider continuity, mobile cost, and slow movement without flashing. Archive: `D:\ai_sandboxes\openai\github-site-research\T031\` contains metadata, video, and review sheet.

## T032 — Syrinx-v2ii: a mathematical form rendered in ASCII

Canonical: <https://x.com/hey_zilla/status/2081317492379500646>. Posted 2026-07-26 09:55:33 UTC. The author credits @wibandwob and asks viewers to enable captions for making-of commentary. It explicitly quotes T033, establishing a source relationship rather than an accidental visual resemblance.

Sampled frames from the 60.05-second portrait video show coarse monochrome character forms curling and flowing across the frame. The glyph treatment changes the texture and silhouette of the finer point-based parent. The file has an AAC audio stream. No embedded subtitle stream was found. **Audio could not be auditioned with the available input tools**, and the requested captions were not obtained. No claims about the sound, narration, or exact audio-to-motion mapping follow from this inspection.

**Actual-site investigation:** <https://wibandwob.com/links/> and <https://wibandwob.com/works/> were retrieved as inert HTML after same-host HTTPS checks. The works index contains many art/project pages, but no matching Syrinx entry or exact source was established. Exact-title and creator searches did not resolve a runnable Syrinx demo. These are genuine creator hubs, not verified demos of this clip. No accounts, chat, wallet, or unrelated exchange links were used.

**Proposed strategy:** an original parametric scene can feed a glyph renderer and an optional sound engine from one shared timeline. Quantize luminance/coverage into a small glyph ramp and maintain stable cell placement. Do not run a Python environment in the portfolio merely because the artist used Python elsewhere. Respect the underlying T033 rights finding as well as any rights in the ASCII adaptation; neither was established as permissively licensed.

**Test first:** 60–120 minutes once an original form exists. Compare coarse and fine grids before audio work. Check silhouette clarity, glyph shimmer, elapsed-time animation, and a static version. Archive: `...\T032\` includes tweet/video/review sheet, creator link-page HTML, works HTML, and the earlier safety preflight.

## T033 — The fine point-field parent of Syrinx

Canonical: <https://x.com/yuruyurau/status/2080977918914969636>. Posted 2026-07-25 11:26:13 UTC. The 16-second clip shows a fine, flowing ribbed organism. Full compact p5-style drawing code is present in the tweet; no separate demo URL is offered in its metadata. The explicit quoted relationship in T032 is the most useful provenance connection.

The formula plots 10,000 points. A cosine-based transverse coordinate, magnitude-derived radial term, shared intermediate displacement, and rotating phase produce the form. Time advances by a fixed amount per draw. These are code observations, not evidence of agent behavior, physical tissue, or audio reactivity. The exact code remains in `...\T033\tweet.json` for investigation.

Apply the common mathematical-family strategy and rights finding above: use this to compare silhouette and render encodings, and develop independently conceived work. Do not publish an exact port or near-identical parameter edit without resolving permission. Any future original renderer needs finite-coordinate checks, fixed bounds, capped points, elapsed time, visibility pause, and a still mode. Archive: `...\T033\` contains metadata, video, and review sheet.

## T034 — Sonified ASCII network experiments

Canonical: <https://x.com/hey_zilla/status/2080748950730993791>. Posted 2026-07-24 20:16:22 UTC. Quoted original: <https://x.com/hey_zilla/status/2080746963432092156>, whose text credits Wib & Wob's sonified ASCII experiments. Both responses are archived; the reply's claim about Python/model capability is the author's account, not a verified performance result.

The 15.05-second clip's sampled frames show angular character paths, branching stepped structures, sparse bright points, and changing fronts. An AAC track exists. Audio was not auditioned, so exact pitch, rhythm, timbre, and synchronization remain unverified. The creator hubs investigated for T032 did not establish this exact runnable experiment or its source. No full reply-thread access is claimed.

**Proposed strategy:** an original contained gold path network. A shared simulation event can light a branch and schedule a quiet synthesized tone; path position can control stereo position and traversal rate can control note timing. Smooth parameters and cap voices. These are proposed mappings, not reverse-engineered source behavior. Generate sound locally only after explicit enablement; provide mute, volume, pause, and a useful silent mode. No microphone or Python runtime is required for this design.

**Test first:** 90–150 minutes for one small network and a sparse audio mapping, reviewed by listening during implementation. The main uncertainty is whether the sound remains satisfying after repeated interaction. Avoid dense overlapping notes and endless idle sound. Archive: `...\T034\` includes both tweet responses, media, and review sheet.

## T035 — The spiral already represented on the site

Canonical: <https://x.com/Rainmaker1973/status/2078547852322549868>. Posted 2026-07-18 18:30 UTC. The post credits fascinating.fractals. Sampled frames from the approximately 60.16-second video show a formula-led spiral transforming through complex rosettes and densely layered curves. No exact original hosted interactive version was established; a profile payment link is not a demo.

**Existing-site connection:** `index.html` and `README.md` already cite this tweet for the spiral interlude. The current source draws 4,000 points and advances time slowly. The README's interaction description should not be treated as hands-on proof; inspected source currently shows automatic time progression. Do not add a duplicate spiral or claim a new integration for this reference.

**Proposed strategy:** assess whether the existing spiral needs explicit play/pause, manual scrubbing, or selected still compositions. Preserve the restrained pace and theme. The source video's rapid complexity is not a reason to introduce fast flashing. Any refinement should first compare rendered baseline and changed output at the same dimensions. A focused controls prototype would take approximately 45–90 minutes, after checking the current implementation. Archive: `...\T035\` contains metadata, media, and review sheet.

## T036 — Liquid shader materials and the gold navigation ancestry

Canonical: <https://x.com/KrisRChase/status/2030467262000636095>. Posted 2026-03-08 02:14:54 UTC. Its parent is <https://x.com/LexnLin/status/2030289612678025406>; both are archived. The parent supplies a gold navigation design prompt. It describes layered glow, a clipped rotating conic gradient, an inset plate, warm gold, narrow white highlights, and a moving active indicator.

Sampled frames from the 19.768-second reply video show a phone Shader Lab with a liquid/chrome diamond, several warm material presets, a glossy banner, and a bottom gold navigation bar. The reply claims React Native and hardware-accelerated 60fps. Neither device performance nor implementation was benchmarked. The parent profile's `http://leonlin.de` was not established as an exact hosted demo, and was not necessary to visit. No exact shader source was recovered from this tweet chain.

**Existing-site connection:** our site already has the corresponding gold ring construction, a liquid gem, and a liquid contact banner. The repository credits `paper-design/shaders`; this reply is not proof that it supplied that code. Retain existing source/license attribution and distinguish design inspiration from implementation provenance.

**Proposed strategy:** compare material presets within the existing renderer rather than add another framework or another always-running WebGL canvas. Review gold highlights, roughness, motion speed, and light-theme bronze. No React Native migration, paywall, or advertised frame-rate guarantee is proposed. A 45–90 minute preset comparison is appropriate only if Joshua selects this refinement. Verify actual device cost, context recovery, visibility pause, and static fallback. Archive: `...\T036\` contains both tweet responses, media, and review sheet.

## T037 — Interactive soft cube with emerging beads and sound

Canonical: <https://x.com/meowbooksj/status/2076956577941090610>. Posted 2026-07-14 09:06:50 UTC. The post's joke about model refactoring does not identify the toy, its physical material, or a simulation technique. There is no offered web demo or source in the retrieved metadata; exact-post research did not establish one. No manufacturer or material composition is assumed.

**Observed:** sampled frames from the 64.11-second physical video show a yellow porous soft cube containing glossy dark beads. Hands squeeze the material; beads protrude and escape as the cube deforms. Later frames show stronger compression and separation. This is a soft-body/material reference. A rigid box spraying balls on click would miss the visible cause and effect. The file has an AAC stream, but audio could not be auditioned; reference timbre and individual sounds remain unverified.

**Joshua's explicit requirement:** a visual and audio display card, interactive by clicking different spots, where pressure pushes balls out of the cube and feels satisfying. This is a recorded feature requirement for the intended site work. Current work remains research and planning; no runtime implementation has been made.

### Intended appearance and interaction

Use an original obsidian display card with a warm amber/gold soft cube, dark glossy beads, contact shadows, and a contained catching tray. Maintain light-mode bronze/cream contrast. Material realism should come from coherent deformation, pores, highlights, bead occlusion, and shadows. The cube must read as soft even with sound muted. Avoid copying the clip or inventing a claim that the site uses a physically exact material solver.

Pressing a visible spot should indent that region and bulge nearby material. Holding increases local pressure within a limit. Nearby beads first emerge through pores, then detach with an impulse when a threshold is crossed. Released beads fall, bounce, roll, and settle inside the tray. Releasing the press lets the cube recover with damped motion. Spatial causality matters more than the number of particles: pressing the left face should affect that region, rather than trigger an unrelated burst elsewhere.

Use pointer capture only during an intentional press, preserve page scrolling on touch, and keep any camera rotation on a separate control. Include reset and a small instruction such as “Press the cube.” Keyboard users should have equivalent press zones or clearly labeled controls. A low-motion option can show short local deformation and bead emergence without extended flight; a still fallback must preserve the card's meaning.

### Proposed simulation and rendering

Start with a lightweight approximation: a deformable surface mesh or analytic displacement field, springs for recovery, and a fixed bead pool. Model bead states explicitly: embedded, emerging, free, and settled. Couple pressure and local surface displacement to the state transition. Use a fixed simulation step, capped catch-up, bounded impulses, sphere/tray collisions, and a seeded variation source. Reset restores bead counts and positions. No infinite spawning or offscreen accumulation.

Choose Canvas2D or WebGL only after a small silhouette/pressure test. A convincing three-dimensional cube may justify one lazy WebGL scene, but avoid a heavyweight general-purpose soft-body engine before proving the interaction. Instanced beads and a modest surface mesh are plausible optimizations. Pause simulation offscreen/hidden, dispose listeners and audio nodes, cap resolution, and preserve a static image if initialization fails. Render and physics timings must be measured, not inferred from the reference video.

### Proposed sound design

Sound is optional and starts only after the visitor enables it with a user gesture. Provide mute and volume, keep idle silent, and suspend sound when hidden or paused. Proposed synthesized layers are a soft pressure texture, short release/pop events, and quieter bead impacts. These are creative proposals; the source audio was not heard. Use original synthesis or properly licensed recordings, never extract the reference soundtrack for publication.

Drive both visuals and sound from the same simulation events. Pressure controls a smoothed texture; emergence/detachment triggers a short envelope; impact velocity controls bounded gain and modest pitch variation. Position can influence subtle stereo pan. Start with at most eight voices, a master gain limit, and restrained repeated-event rates. Do not create a new continuous oscillator every frame. Listening review must check clipping, harsh resonances, repeated-input fatigue, and whether quiet impacts remain audible at a reasonable volume.

### Cheapest useful prototype and acceptance criteria

Budget approximately 2–3 hours for one pressable surface, around sixteen beads, one reset control, and a simple opt-in sound. Review the visual cause and effect before investing in pores, bloom, or detailed materials. Main bottleneck: believable pressure and release, rather than confetti with a cube behind it.

Acceptance requires visible local response on the first press; emerging beads before detachment; repeatable reset and conserved bead count; stable collisions under repeated input; bounded memory; useful silent mode; no sound before enablement; and clean pause/resume. Review keyboard input, touch scrolling, 320/360/390px widths, both themes, reduced motion, and hidden-tab behavior. Sound satisfaction requires actual listening with available playback tools during implementation; this research did not provide that proof.

Archive: `D:\ai_sandboxes\openai\github-site-research\T037\` contains metadata, original MP4, sampled review sheet, and an extracted short audio sample. Extraction succeeded, but the attempted audio-input tool could not accept it. Do not mark audio analysis complete on the strength of the extracted file.

## T038 — Ommatidia: moving lenses and geometric connections

Canonical: <https://x.com/poetengineer__/status/2117498951997731062>. Supplied `a=8ReUeMufq3Hbzgx3RcU&s=19`. Author: Kat, @poetengineer__. Posted 2026-11-03 06:07:46 UTC. The post supplies a title, Ommatidia, and video, with no external demo or code link in the retrieved metadata. The author profile links Patreon; a subscription page is not an exact demo and was not visited. Exact-status/title/creator searches found reposts but no verified original runnable site or source. Direct reply-thread coverage remains incomplete because X access is restricted.

**Observed:** a roughly 34-second square video shows an irregular moving cluster of rounded polygonal lens-like cells over a dark blue geometric field. Cell outlines and fine trailing connectors are yellow; small outlined squares and orange cross marks punctuate the construction. The blue imagery inside cells resembles a displaced, enlarged, or transformed version of the surrounding dense linework. Frames show cells changing position and shape; samples include dark interiors as well as richly filled cells. A full-size frame at 18 seconds was also inspected. The exact mapping, cell-generation algorithm, meaning of markers, and input interactivity are unknown.

The downloaded 720×720 MP4 is 33.967 seconds by local probing (mirror metadata says 34.066). It contains H.264 video and **no audio stream**. No audio analysis or responsive behavior can be inferred. The clip title is an artistic cue, not evidence of a biological or optical simulation. No license or source was established.

**Proposed strategy:** an original contained Lab card with rounded cellular apertures that locally refract an authored geometric scene. Use bronze/gold outlines and restrained warm linework to fit the site; test whether a muted blue accent helps, rather than importing the source palette wholesale. Pointer movement could attract the cell cluster or change the local magnification, while a press sends a short deformation through neighboring cells. Mark this as our interaction proposal; no click behavior was demonstrated by the sampled reference.

Begin with approximately a dozen relaxed cells, clipped procedural linework, and a single shared transformation field. A Voronoi-style construction or rounded polygons are candidate methods, not recovered source techniques. Keep background density fixed and cropped, avoid an unlimited recursive scene, and keep fine wires behind the lenses. Compare a simple Canvas2D masked version with a single-pass WebGL refraction only if the first version is visually insufficient. Give the card pause/reset and a still option. No sound is required by this reference; any optional audio should use the shared opt-in sound controls developed for T037.

**Test first:** 90–150 minutes for an independently designed static cell composition plus one pointer response. Bottleneck: readable lens distortion without noisy lines or unstable cell edges. Check thin-line aliasing, spatial continuity across movement, mobile legibility, gold/light-theme contrast, bounded work, and a quiet resting state. Archive: `D:\ai_sandboxes\openai\github-site-research\T038\` contains raw metadata, downloaded media, six-frame review sheet, and the detailed frame. No unfamiliar demo site was executed.

## Consolidated implementation strategy

This is a set of candidates, not a plan to run 38 effects at once. Joshua has explicitly requested the photographic interaction (T001), the pressure/bead audio card (T037), and the two creature habitats described above. Preserve the introduction, real project information, navigation, and readable contact path. Earlier individual-reference placement suggestions are historical proposals; the habitat section governs creature placement now.

| Workstream | References | Intended scope / dependency |
| --- | --- | --- |
| Personal portrait | T001 | Original photo/cutout needed; decide bounded movement versus inner deformation. Separate transform layers and optional sound. |
| Pressure toy | T037, with T002's experiment method | First original tactile/audio card; validate pressure before visual polish. |
| Minimal background habitat | T003, T013, T015–T016, T021–T025, T028, T030, T032–T033, simplified T038 | Original varied abstract swimmers behind the whole page; one scheduler, shared species registry, protected reading areas. See complete mapping above. |
| Footer pond habitat | T004–T011, T017–T018, jellyfish portion of T020, T026, T029 | Recognizable fish/jellyfish freely roaming a visually separate contained footer pond; preserve distinct glyph, line, and particle styles. |
| Other mathematical / standalone studies | T012, T014, T019, T027, T031, T034–T035 | Keep non-creature exhibits separate. T019 informs curation; existing spiral remains; T034's optional sound does not imply ambient habitat audio. |
| Surface/lens refinement | T006, T036, T038 | Reuse existing material infrastructure where suitable; experimental browser APIs need ordinary HTML fallbacks. |

**Suggested order for later implementation:** validate the two-habitat composition with a few contrasting creatures, then complete the varied roster in batches. Portrait assets and the pressure toy remain independent workstreams. Compare additional lens/material refinements only after measuring the active scene budget. Gallery/scene selection from T002/T005/T019 may help internal art review, but the selected creature direction is coexisting free swimmers, not a visitor choosing just one creature preset.

Keep plain static HTML/CSS/JavaScript unless a demonstrated need justifies a dependency. A small exhibit controller should own initialization, resize, visibility, theme, reduced motion, pause, reset, and cleanup. Separate simulation state from drawing and optional audio. Initialize heavy scenes near the viewport and cap concurrent activity. Accessible controls stay in DOM; decorative canvas does not contain the only instructions or links. Put no keys, accounts, analytics, or model backends into a local visual experiment without a separate requirement.

Performance claims require a measured baseline and actual rendered review. First compare still compositions; then test input, motion, sound, both themes, mobile layout, context loss, and visibility changes. Add meaningful numerical tests only where they protect mathematical invariants or simulation state, such as cube facelet permutations or bead conservation. Do not create tests that merely restate decorative constants.

## Demo/source completeness and research limits

Exact effect sites were established for T001, T002, T006, and T007. T004/T008 have identified creator code; T010/T011 have exact product pages and public video previews, not verified free runnable source. T003 has a project/collection description. T005's matching archive path was rate-limited. Other entries distinguish creator hubs, in-tweet formulas, and unresolved demos individually. Public availability does not establish reuse permission. T004's inspected MIT source is the clearest reusable code candidate; derivative portfolios, remixes, paid templates, and independent art require their own rights assessment.

All 38 references have archived tweet metadata and downloaded video with inspected sampled frames. This is not continuous real-time viewing or hands-on interaction testing. X itself returned restricted access; metadata comes from the third-party FxTwitter mirror, with selected public search excerpts for replies/follow-ups. Exhaustive replies were unavailable. Exact sound from clips with audio remains unverified because available audio input was unsupported; T038's file has no audio track. Future work must obtain actual listening evidence before claiming reference-audio fidelity.

Evidence root: `D:\ai_sandboxes\openai\github-site-research\`. Each `Tnnn` folder preserves `tweet.json`, `demo.mp4`, and a contact/review sheet. Additional HTML/source snapshots are inert research evidence outside the GitHub Pages checkout. `manifest.json` at that root records current archive file hashes and source IDs for reinspection. The archive is local and is not committed or published. The canonical links in this notebook remain usable when that local archive is unavailable.

## Decision history

- **2026-11-04:** Created the shared notebook and analyzed T001 using tweet metadata, sampled video frames, actual-site HTML, and public effect source.
- **2026-11-04:** Added Joshua's request to identify actual demo websites and assess safety before visits. Recorded that initial retrieval predated this instruction and did not constitute an interactive safety assessment.
- **2026-11-04:** Proposed a staged original implementation with a still fallback and theme integration. Placement, final assets, and interaction semantics remain open; no production change made.
- **2026-11-04:** Expanded the notebook through T038, traced available demo/source/quote chains, and consolidated overlapping ideas. All 38 have archived metadata/media and sampled visual inspection; sound fidelity remains unverified.
- **2026-11-04:** Recorded Joshua's explicit soft-cube/bead audio-card requirement (T037). Prioritized local pressure, emerging beads, bounded simulation, opt-in sound, and accessible reset/input.
- **2026-11-04:** Recorded reuse uncertainty for the mathematical sketches. Plan independent generative work unless permission for a specific original is established. No artist contact was made.
- **2026-11-04:** Identified T035 as the existing spiral reference and T036 as overlapping the existing material/navigation design. Avoid duplicate implementations. Added T038's lens study without assuming a demo, source, audio, or interactivity that was not established.
- **2026-11-04:** Joshua selected two creature habitats: minimal imaginary swimmers throughout the page background, and recognizable fish/jellyfish in a separate footer pond. Added art-style groups, complete identified variation mapping, placement rules, shared movement/lifecycle design, and a staged coverage check. This supersedes earlier one-exhibit creature proposals. Documentation only; no runtime changes made.
- **2026-11-04:** Joshua explicitly requested implementation and a new PR. Added both original creature habitats, the full identified variation registry, shared pause/reduced-motion/lifecycle handling, a footer pond, local Chromium review, and dependency-free regression checks. Historical research remains intact; current implementation status above governs what has actually shipped in this branch. No merge or production deployment performed.
