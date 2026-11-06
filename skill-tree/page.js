/* Fluxora's original module is loaded unchanged, with an integrity pin.
 * This file supplies anonymous inventory aggregates and host-page navigation.
 * It does not implement or replace the renderer, tree geometry, shaders or card.
 */
const SOURCE = 'https://hermes-explainer.fluxora.build/grow.js';
const INTEGRITY = 'sha384-ewNt+0vUwRUYbgt4WHbSWcu0k+RpdyR3XJbW/KEOwCSOfhcCInKnG9OaGJo/sNUb';
const TITLE = 'Toni’s Hermes skill tree — Joshua Hyde';
const DESCRIPTION = 'Toni’s installed Hermes skills, rendered by Fluxora’s original animated WebGL tree. A private-data-free inventory snapshot, with the original stage previews.';

function recordsFor(data) {
  const positive = n => Number.isSafeInteger(n) && n >= 0 && n <= 5000;
  const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
    && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
  if (!data || data.schema_version !== 2 || data.agent !== 'Toni'
      || !positive(data.installed_skills) || data.installed_skills < 1
      || !positive(data.bundled_skills) || !positive(data.added_or_imported_skills)
      || !data.categories || !data.bundled_by_category || !isDate(data.snapshot_date)
      || (data.added_or_imported_skills > 0 && (!isDate(data.oldest_added_file_date)
          || data.oldest_added_file_date > data.snapshot_date))) {
    throw new Error('Invalid inventory summary');
  }
  const records = [];
  let bundledTotal = 0;
  for (const [category, count] of Object.entries(data.categories).sort(([a], [b]) => a.localeCompare(b))) {
    const bundled = data.bundled_by_category[category] ?? 0;
    if (!/^[A-Za-z0-9_.-]+$/.test(category) || !positive(count) || count < 1
        || !positive(bundled) || bundled > count) throw new Error('Invalid category totals');
    bundledTotal += bundled;
    for (let n = 0; n < count; n++) records.push({
      name: `playbook-${String(records.length + 1).padStart(3, '0')}`,
      category, tags: [], provenance: n < bundled ? 'bundled' : 'local',
      modified: n < bundled ? data.snapshot_date : data.oldest_added_file_date,
      depth: {references: 0, scripts: 0, templates: 0}, edited_bundled: false
    });
  }
  if (Object.keys(data.bundled_by_category).some(k => !Object.hasOwn(data.categories, k))
      || records.length !== data.installed_skills || bundledTotal !== data.bundled_skills
      || records.length - bundledTotal !== data.added_or_imported_skills) {
    throw new Error('Inventory totals disagree');
  }
  return records;
}

function originalModule() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = SOURCE;
    script.integrity = INTEGRITY;
    script.crossOrigin = 'anonymous';
    const timeout = setTimeout(() => reject(new Error('Original renderer timed out')), 30000);
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Original renderer unavailable or integrity check failed')); };
    document.head.append(script);
  });
}

window.__toniTree = {status: 'loading', recordsFor, source: SOURCE, integrity: INTEGRITY};
async function start() {
  const response = await fetch('/assets/toni-skills-summary.json');
  if (!response.ok) throw new Error('Inventory unavailable');
  const data = await response.json();
  const records = recordsFor(data);
  await originalModule();
  if (!window.__grow?.list || !window.__grow?.state) throw new Error('Original renderer API changed');
  const api = window.__grow;
  api.name('Toni');
  const state = await api.list(records, 'folder', true);
  if (!api.ready || !state || state.n !== data.installed_skills
      || state.grown !== data.added_or_imported_skills || state.areas !== Object.keys(data.categories).length) {
    throw new Error('Original renderer inventory does not match');
  }
  document.title = TITLE;
  document.querySelector('meta[name="description"]').content = DESCRIPTION;
  const home = document.querySelector('.gp-story');
  home.href = '/';
  home.textContent = '← Joshua Hyde';
  document.querySelector('.gp-out .gp-eye').textContent = 'Toni’s installed skill tree';
  document.querySelector('.gp-foot a[href="./"]').href = 'https://hermes-explainer.fluxora.build/';
  const note = document.createElement('p');
  note.className = 'toni-note';
  note.textContent = `Inventory snapshot: ${data.snapshot_date}. ${data.installed_skills} installed skills across ${Object.keys(data.categories).length} categories. Skill labels are anonymized; totals, category mix and bundled counts come from Toni’s inventory. “Grown here” includes imports, not proven authorship. The age uses the oldest added file date, not a verified learning timeline. No live VPS connection. `;
  const licenses = document.createElement('span');
  licenses.innerHTML = '<a href="/">← Joshua Hyde</a> · <a href="/assets/toni-skills-summary.json">Inventory totals</a> · Original renderer by <a href="https://fluxora.build/">Fluxora</a>, loaded unchanged from its public host. Fonts: <a href="https://hermes-explainer.fluxora.build/fonts/OFL-Oswald.txt">Oswald</a> and <a href="https://hermes-explainer.fluxora.build/fonts/OFL-IBM-Plex.txt">IBM Plex</a> (SIL OFL).';
  note.append(licenses);
  document.querySelector('.gp-foot').append(note);
  document.getElementById('tree-status').remove();
  document.documentElement.classList.add('toni-ready');
  window.__toniTree.status = 'ready';
  window.__toniTree.inventory = data;
  window.__toniTree.state = state;
}
start().catch(error => {
  document.documentElement.classList.add('toni-error');
  document.querySelectorAll('body > .gp:not(#tree-status)').forEach(element => { element.hidden = true; });
  const status = document.getElementById('load-status');
  if (status) status.textContent = 'The animated tree could not load. It needs WebGL 2 and access to Fluxora’s original renderer. The original-project and inventory links below still work.';
  document.title = TITLE;
  window.__toniTree.status = 'error';
  window.__toniTree.error = error.message;
  console.error('Skill tree:', error.message);
});
