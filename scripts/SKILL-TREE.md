# Toni’s original Fluxora-rendered skill tree

The public page is `/skill-tree/` (GitHub Pages redirects `/skill-tree` to the
trailing-slash directory). The homepage’s former image card and independent
SVG explorer have been removed. A small footer link opens the tree. The obsolete
`/skill-tree.html` file is removed: GitHub Pages otherwise resolves `/skill-tree`
to that HTML alias ahead of the directory, preventing the proper HTTP redirect.

## What actually renders it

`skill-tree/page.js` loads the genuine, unmodified module from:
https://hermes-explainer.fluxora.build/grow.js

The page uses that module’s own WebGL shaders, geometry, blue lighting, portrait
card, animation, stage previews, replay and image export. There is no independent
SVG reconstruction or screenshot fallback. Native browser page zoom remains
available. Do not claim the original renderer has arbitrary 3D orbit/pan controls.

The upstream module is pinned with SHA-384 subresource integrity:
`sha384-ewNt+0vUwRUYbgt4WHbSWcu0k+RpdyR3XJbW/KEOwCSOfhcCInKnG9OaGJo/sNUb`.

The original module is served by Fluxora, not copied into this repository. A
public reuse license for this Hermes renderer was not located; Fluxora’s MIT
`waterfall` repository is a different project. Do not describe this renderer as
MIT-licensed or vendor it on that assumption. Credits and font-license links are
retained. The fonts are also loaded from the original host under the SIL OFL.
The page therefore needs that host and WebGL 2. If either fails, it shows an
honest error and links to the original project and public inventory, not a fake
replacement tree. A changed upstream module fails the integrity check closed.

## Public data and privacy

`assets/toni-skills-summary.json` contains aggregate inventory counts, category
counts, bundled counts per category and the oldest added file date. The browser
expands them into anonymous `playbook-001` records for `window.__grow.list`.
No private skill names, bodies, paths, individual modification dates, memories,
conversations or credentials enter the public site. Anonymous labels affect tip
assignment; this is the original renderer with sanitized inputs, not a claim of
pixel-identical geometry to an export made with private skill labels.

Category/provenance totals are real. All anonymous added records use the oldest
added file date because the original stage calculation needs that aggregate.
Imported file dates are not learning dates; "grown here" includes imports and
is not proof of agent authorship. The public page states these limitations.
This is a manual inventory snapshot, not a live VPS feed or telemetry service.

The host CSP limits data connections to the site itself. The audited upstream
module has no fetch, XHR, beacon, WebSocket or storage calls. Re-audit new bytes
before updating the integrity pin. The site has no private API or credentials.

## Manual refresh

Use Python 3 and explicitly supply every configured skill root:

```sh
python scripts/export-hermes-skills.py \
  --skills-root "$HERMES_HOME/skills" \
  --skills-root /path/to/external/skills \
  --output "$HERMES_HOME/cache/scratch/toni-tree-renderer-input.json" \
  --summary-output assets/toni-skills-summary.json
python -m unittest discover -s scripts -p 'test_*.py' -v
node --check skill-tree/page.js
```

The full renderer input is private, mode 0600, and must stay OUTSIDE this public
repository. The exporter reads manifest identifiers and filesystem metadata,
never skill bodies. It deduplicates linked files and includes installed normal
folders, including disabled skills, while excluding hidden archives.

Preview `/skill-tree/`. Require `window.__toniTree.status === 'ready'`, verify
`window.__grow.state()` totals against the summary, inspect the screenshot and
exercise stage preview/back/replay/export plus narrow/mobile and desktop views.
Test unavailable module, missing inventory and WebGL-off fallbacks. Check the
homepage is restored, its footer link works, and `/skill-tree` redirects once to
`/skill-tree/`. The obsolete `.html` URL should return 404. Run the
SEO check, `git diff --check`, and review all staged files for private inputs.
Publish through a normal PR and verify the exact live files and browser behavior.

## Upstream refresh

Download and review the new module locally. Confirm publisher, API, network and
storage behavior and required fonts. Recompute SHA-384 over its exact bytes,
change the integrity constant, and repeat the browser and negative-path tests.
Never remove integrity or broaden the CSP merely to silence a loading error.
A truly self-contained vendored port requires confirmed redistribution rights
for the exact Hermes renderer, not another Fluxora project’s license.
