/* Independent, aggregate-only SVG renderer. No trackers, libraries or VPS connection. */
(() => {
  'use strict';
  const svg = document.querySelector('#tree');
  const shell = document.querySelector('.scene-shell');
  const ns = 'http://www.w3.org/2000/svg';
  const initial = { x: -600, y: -500, w: 1200, h: 1000 };
  let view = { ...initial }, selected = null, gesture = null;
  const pointers = new Map();
  const groups = new Map(), categoryButtons = new Map();
  const labels = {
    'autonomous-ai-agents': 'AI agents', creative: 'Creative',
    'data-science': 'Data science', general: 'General', github: 'GitHub',
    media: 'Media', mlops: 'ML / models', 'openclaw-imports': 'Imported playbooks',
    productivity: 'Productivity', research: 'Research', security: 'Security',
    'smart-home': 'Smart home', 'social-media': 'Social media',
    'software-development': 'Development'
  };
  const controls = [...document.querySelectorAll('.toolbar button')];
  document.querySelector('#snapshot').textContent = 'Loading the inventory snapshot…';
  controls.forEach(b => { b.disabled = true; });
  const el = (tag, attrs = {}, text) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const rnd = seed => {
    const v = Math.sin(seed * 91.345 + 3.14159) * 47453.5453;
    return v - Math.floor(v);
  };
  const zoom = () => initial.w / view.w;
  const paint = () => {
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    svg.dataset.zoom = zoom().toFixed(3);
    document.querySelector('#zoom-value').value = `${Math.round(zoom() * 100)}%`;
  };
  const point = (x, y, matrix = svg.getScreenCTM().inverse()) =>
    new DOMPoint(x, y).matrixTransform(matrix);
  function zoomAt(target, clientX, clientY) {
    const ratio = Math.max(0.7, Math.min(8, target));
    const r = svg.getBoundingClientRect();
    const p = point(clientX ?? r.x + r.width / 2, clientY ?? r.y + r.height / 2);
    const factor = zoom() / ratio;
    view = { x: p.x - (p.x - view.x) * factor, y: p.y - (p.y - view.y) * factor,
      w: view.w * factor, h: view.h * factor };
    paint();
  }
  function choose(key, categories) {
    selected = key;
    svg.dataset.selected = key || 'all';
    groups.forEach((g, k) => {
      g.classList.toggle('dim', Boolean(key && key !== k));
      g.classList.toggle('selected', key === k);
      g.setAttribute('aria-pressed', String(key === k));
    });
    categoryButtons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === key)));
    document.querySelector('#show-all').setAttribute('aria-pressed', String(key === null));
    document.querySelector('#branch-title').textContent = key ? labels[key] || key : 'All branches';
    document.querySelector('#branch-info').textContent = key
      ? `${categories[key]} installed playbooks on this branch. Each small glowing tip is one playbook. Private names and contents stay off this public view.`
      : 'Choose a category to highlight its branch and installed-skill count.';
  }
  function draw(categories) {
    const root = document.querySelector('#roots');
    const trunk = document.querySelector('#trunk');
    const branches = document.querySelector('#branches');
    for (let i = 0; i < 20; i++) {
      const side = i % 2 ? -1 : 1, n = Math.floor(i / 2);
      const endX = side * (45 + n * 27), endY = 365 + rnd(i) * 75;
      root.append(el('path', { d: `M 0 276 C ${side * 16} 338 ${endX * 0.6} ${endY - 10} ${endX} ${endY}`,
        fill: 'none', stroke: '#4778b8', 'stroke-width': 2.1 - n * 0.13, opacity: 0.65 - n * 0.045,
        'stroke-linecap': 'round' }));
    }
    trunk.append(el('path', { d: 'M 0 300 C -18 220 15 150 1 70 C -16 4 8 -100 -4 -253',
      fill: 'none', stroke: 'url(#wood)', 'stroke-width': 10, 'stroke-linecap': 'round' }));
    trunk.append(el('text', { x: 0, y: 453, fill: '#9ec6ff', 'text-anchor': 'middle',
      'font-family': 'system-ui,sans-serif', 'font-size': 18, 'letter-spacing': 10 }, 'TONI'));
    const entries = Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
    entries.forEach(([key, count], index) => {
      const angle = -Math.PI + (index + 0.5) / entries.length * Math.PI;
      const x = Math.cos(angle) * 425, y = Math.sin(angle) * 330 - 40;
      const startY = 210 + (y - 210) * 0.35;
      const path = `M 0 ${startY} C ${x * 0.19} ${startY - 45} ${x * 0.63} ${y + 60} ${x} ${y}`;
      const group = el('g', { class: 'branch', 'data-category': key, tabindex: 0,
        role: 'button', 'aria-pressed': 'false', 'aria-label': `${labels[key] || key}: ${count} installed playbooks` });
      group.append(el('title', {}, `${labels[key] || key} · ${count} installed playbooks`));
      group.append(el('path', { d: path, class: 'wood', stroke: `hsl(${211 + index % 6 * 4} 90% 70%)`,
        'stroke-width': 2.2 + Math.sqrt(count) * 0.6 }));
      group.append(el('path', { d: path, class: 'hit' }));
      for (let j = 0; j < count; j++) {
        const spread = (j - (count - 1) / 2) * 12;
        const reach = 28 + rnd(index * 43 + j + 1) * 45;
        const lx = x + Math.cos(angle) * reach - Math.sin(angle) * spread;
        const ly = y + Math.sin(angle) * reach + Math.cos(angle) * spread;
        group.append(el('path', { d: `M ${x} ${y} Q ${x + (lx-x)*0.3} ${ly + 12} ${lx} ${ly}`,
          class: 'wood', stroke: '#6b9fe1', 'stroke-width': 0.8, opacity: 0.85 }));
        group.append(el('circle', { cx: lx, cy: ly, r: 6.5, class: 'halo', 'aria-hidden': 'true' }));
        group.append(el('circle', { cx: lx, cy: ly, r: 3.4, class: 'leaf', 'data-tip': key }));
      }
      group.append(el('circle', { cx: x, cy: y, r: 13, class: 'hub' }));
      group.append(el('text', { x, y: y + 5, class: 'node-count' }, count));
      group.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopPropagation(); choose(selected === key ? null : key, categories);
        }
      });
      groups.set(key, group); branches.append(group);
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.category = key;
      button.setAttribute('aria-pressed', 'false');
      const name = document.createElement('span'), value = document.createElement('span');
      name.textContent = labels[key] || key; value.textContent = count;
      button.append(name, value);
      button.addEventListener('click', () => choose(selected === key ? null : key, categories));
      categoryButtons.set(key, button); document.querySelector('#categories').append(button);
    });
    document.querySelector('#show-all').addEventListener('click', () => choose(null, categories));
    return categories;
  }
  let categories;
  function rebase() {
    const values = [...pointers.values()];
    if (!values.length) { gesture = null; shell.classList.remove('dragging'); svg.classList.remove('dragging'); return; }
    const mid = values.length > 1
      ? { x: (values[0].x + values[1].x) / 2, y: (values[0].y + values[1].y) / 2 } : values[0];
    gesture = { view: { ...view }, matrix: svg.getScreenCTM().inverse(), mid,
      distance: values.length > 1 ? Math.hypot(values[1].x-values[0].x, values[1].y-values[0].y) : 0 };
  }
  let pressedBranch = null, moved = false;
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pressedBranch = e.target.closest('.branch')?.dataset.category || null;
    if (pointers.size === 1) moved = false; else moved = true;
    svg.setPointerCapture(e.pointerId); svg.classList.add('dragging'); rebase();
  });
  svg.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = [...pointers.values()], two = v.length > 1 && gesture.distance > 0;
    const mid = two ? { x: (v[0].x+v[1].x)/2, y: (v[0].y+v[1].y)/2 } : v[0];
    if (Math.hypot(mid.x-gesture.mid.x, mid.y-gesture.mid.y) > 4) moved = true;
    const a = point(gesture.mid.x, gesture.mid.y, gesture.matrix);
    const b = point(mid.x, mid.y, gesture.matrix);
    let factor = 1;
    if (two) {
      const distance = Math.hypot(v[1].x-v[0].x, v[1].y-v[0].y);
      const oldZoom = initial.w / gesture.view.w;
      const nextZoom = Math.max(0.7, Math.min(8, oldZoom * distance / gesture.distance));
      factor = oldZoom / nextZoom;
    }
    view = { x: a.x-(b.x-gesture.view.x)*factor, y: a.y-(b.y-gesture.view.y)*factor,
      w: gesture.view.w*factor, h: gesture.view.h*factor };
    paint();
  });
  const release = e => {
    if (e.type === 'pointerup' && pointers.size === 1 && !moved && pressedBranch)
      choose(selected === pressedBranch ? null : pressedBranch, categories);
    pointers.delete(e.pointerId); rebase();
  };
  svg.addEventListener('pointerup', release); svg.addEventListener('pointercancel', release);
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomAt(zoom()*Math.exp(-e.deltaY*0.0015), e.clientX, e.clientY); }, { passive: false });
  svg.addEventListener('keydown', e => {
    const amount = 65 / zoom();
    if (e.key === '+' || e.key === '=') zoomAt(zoom()*1.3);
    else if (e.key === '-') zoomAt(zoom()/1.3);
    else if (e.key === '0') { view = { ...initial }; paint(); }
    else if (e.key === 'ArrowLeft') { view.x -= amount; paint(); }
    else if (e.key === 'ArrowRight') { view.x += amount; paint(); }
    else if (e.key === 'ArrowUp') { view.y -= amount; paint(); }
    else if (e.key === 'ArrowDown') { view.y += amount; paint(); }
    else return;
    e.preventDefault();
  });
  document.querySelector('#zoom-in').addEventListener('click', () => zoomAt(zoom()*1.3));
  document.querySelector('#zoom-out').addEventListener('click', () => zoomAt(zoom()/1.3));
  document.querySelector('#fit').addEventListener('click', () => { view = { ...initial }; paint(); });
  document.querySelector('#fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (shell.requestFullscreen) await shell.requestFullscreen();
      else throw new Error('unavailable');
    } catch { document.querySelector('#snapshot').textContent = 'Fullscreen is unavailable in this browser. Zoom and pan still work.'; }
  });
  document.addEventListener('fullscreenchange', () => {
    document.querySelector('#fullscreen').textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
  fetch('assets/toni-skills-summary.json', { credentials: 'omit' }).then(r => {
    if (!r.ok) throw new Error('Snapshot unavailable');
    return r.json();
  }).then(data => {
    const entries = Object.entries(data.categories || {});
    const valid = entries.length > 0 && entries.every(([key, n]) => /^[a-z0-9-]+$/.test(key) && Number.isInteger(n) && n > 0)
      && entries.reduce((sum, [, n]) => sum+n, 0) === data.installed_skills && data.installed_skills <= 500;
    if (!valid) throw new Error('Snapshot does not reconcile');
    categories = draw(data.categories);
    choose(null, categories);
    document.querySelector('#snapshot').textContent = `${data.installed_skills} installed playbooks · ${entries.length} categories · snapshot ${data.snapshot_date}`;
    shell.classList.add('ready'); controls.forEach(b => { b.disabled = false; });
    document.querySelector('#show-all').disabled = false;
    paint();
  }).catch(() => {
    document.querySelector('#snapshot').textContent = 'The interactive snapshot could not load. The original image and inventory-data links remain available.';
  });
})();
