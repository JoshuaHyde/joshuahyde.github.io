# Refreshing Toni's skill snapshot

The portfolio serves two static WebP images and an aggregate-only JSON summary.
It does not embed Fluxora, run a plugin, call a model, expose Hermes, or poll a server.
The image is a decorative inventory snapshot, not proof of proficiency or authorship.
Fluxora's attribution stays on the exported image and next to it on the page.

## Export metadata locally

Use Python 3 (standard library only). Supply the profile skills root and every
configured external skills directory explicitly. The exporter follows links,
deduplicates real skill files, rejects conflicting names, and skips hidden archives.
It reads only manifest identifiers and filesystem metadata; never SKILL.md bodies.

```sh
python scripts/export-hermes-skills.py \
  --skills-root "$HERMES_HOME/skills" \
  --skills-root /path/to/external/skills \
  --output "$HERMES_HOME/cache/scratch/toni-tree-renderer-input.json" \
  --summary-output assets/toni-skills-summary.json
python -m unittest discover -s scripts -p 'test_*.py' -v
```

The renderer input is private, mode 0600, and must stay OUTSIDE the public repo.
The summary includes counts, categories and a snapshot date, but no skill names,
local paths, messages, memories, credentials, or full skill contents.
The inventory includes installed-but-disabled normal folders, not hidden archives.

## Render and check

Ask Hermes to render the exported metadata at:
https://hermes-explainer.fluxora.build/?grow=1

The site's normal folder/list workflows classify bundled skills against a hardcoded
catalog, which can disagree with an older profile's actual `.bundled_manifest`.
Our export therefore also provides `renderer_skills` in the renderer's normalized
schema, with provenance determined from the REAL local manifest. In an automated
browser, use `window.__grow.list(payload.renderer_skills, 'folder', true)`, then
`window.__grow.name('Toni')`, `window.__grow.skip()` and `window.__grow.png(true)`.
Read the resulting `window.__grow.state()` back and require its total, grown and
area counts to match the exported summary before saving the image. This browser
API is unofficial and may change; stop and inspect if it does. The current tested
renderer is the Fluxora `/grow.js` served on November 6, 2026.

Only sanitized metadata enters the browser. Do not grant the site a real whole
folder or supply any memory/config/credential files. The script was reviewed for
network sends before first use; recheck if the hosted renderer changes.

The site's card says "grown here"; that includes imports and does NOT establish
who wrote a skill. Its age/maturity is based on file modification dates, not a
verified learning timeline. Keep the adjacent caveat on the portfolio.

## Optimize and publish

Convert the exported 1080×1350 PNG to WebP (Pillow is an optional LOCAL render-time
tool, not a website dependency):

```python
from PIL import Image
image = Image.open('assets/toni-skill-tree.png').convert('RGB')
for width, suffix in [(1080, ''), (640, '-640')]:
    variant = image.copy()
    variant.thumbnail((width, 9999))
    variant.save(f'assets/toni-skill-tree{suffix}.webp', 'WEBP', quality=82, method=6)
```

Update counts/date/alt text in the `#toni-skill-tree` block of `index.html` from the
summary. Check narrow mobile, desktop, both themes, keyboard focus, full-size and
attribution links, and `git diff --check`. Commit ONLY the static images, aggregate
summary and intended source changes. The full PNG and renderer input are ignored.
Publish through the repo's normal GitHub Pages workflow and read the live image,
summary and page back before calling it done. Close the renderer afterward.

There is deliberately no refresh schedule. Regenerate after meaningful skill
changes rather than creating an always-running service for a decorative image.
