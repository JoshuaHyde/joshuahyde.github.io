#!/usr/bin/env python3
"""Export skill metadata for Fluxora; never read skill bodies or credentials.

The private --output is for the renderer only. --summary-output contains only
aggregate counts and is safe to publish after review. This is a manual snapshot.
"""
from __future__ import annotations
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re

SKIP = {'.git', 'node_modules', '__pycache__', '.cache'}
SAFE = re.compile(r'^[A-Za-z0-9_.-]+$')

def inventory(roots: list[Path]):
    bundled: set[str] = set()
    for root in roots:
        manifest = root / '.bundled_manifest'
        if manifest.is_file():
            bundled.update(line.split(':', 1)[0].strip().lower()
                           for line in manifest.read_text().splitlines() if ':' in line)
    seen_files: set[Path] = set()
    by_name = {}
    duplicates = 0
    for root in roots:
        if not root.is_dir():
            raise ValueError(f'Skills root does not exist: {root}')
        visited: set[Path] = set()
        for base, dirs, names in os.walk(root, followlinks=True):
            folder = Path(base)
            resolved = folder.resolve()
            if resolved in visited:
                dirs[:] = []
                continue
            visited.add(resolved)
            dirs[:] = sorted(d for d in dirs if d not in SKIP and not d.startswith('.'))
            if 'SKILL.md' not in names:
                continue
            path = folder / 'SKILL.md'
            real = path.resolve()
            if real in seen_files:
                duplicates += 1
                continue
            seen_files.add(real)
            rel = folder.relative_to(root)
            name = folder.name
            category = rel.parts[0] if len(rel.parts) > 1 else 'general'
            if not SAFE.fullmatch(name) or not SAFE.fullmatch(category):
                raise ValueError('Unexpected skill identifier; review the metadata export locally')
            key = name.lower()
            if key in by_name:
                raise ValueError(f'Distinct skills share a name; resolve before visualizing: {name}')
            stat = path.stat()
            by_name[key] = {'name': name, 'category': category,
                            'mtime': int(stat.st_mtime * 1000), 'bundled': key in bundled}
    entries = sorted(by_name.values(), key=lambda r: (r['category'], r['name']))
    if not entries:
        raise ValueError('No SKILL.md files found')
    return entries, bundled, duplicates

def export(roots: list[Path], output: Path, summary_output: Path | None):
    entries, bundled, duplicates = inventory(roots)
    files = [{'path': 'skills/.bundled_manifest',
              'text': '\n'.join(f'{name}:bundled' for name in sorted(bundled)),
              'mtime': min(e['mtime'] for e in entries)}]
    for e in entries:
        # Synthetic frontmatter only. The original SKILL.md is never opened.
        files.append({'path': f"skills/{e['category']}/{e['name']}/SKILL.md",
                      'text': f"---\nname: {e['name']}\ncategory: {e['category']}\n---\n",
                      'mtime': e['mtime']})
    output.parent.mkdir(parents=True, exist_ok=True)
    normalized = [{'name': e['name'], 'category': e['category'], 'tags': [],
                   'provenance': 'bundled' if e['bundled'] else 'local',
                   'modified': datetime.fromtimestamp(e['mtime']/1000, timezone.utc).date().isoformat(),
                   'depth': {'references': 0, 'scripts': 0, 'templates': 0},
                   'edited_bundled': False} for e in entries]
    # The hosted parser has a hardcoded bundled catalog that can misclassify
    # older/renamed skills. Use its normalized-list API with our actual manifest.
    payload = {'renderer_skills': normalized, 'synthetic_files': files}
    output.write_text(json.dumps(payload, indent=2) + '\n')
    output.chmod(0o600)
    local_dates = [row['modified'] for row in normalized if row['provenance'] == 'local']
    summary = {'schema_version': 2, 'agent': 'Toni',
               'snapshot_date': datetime.now(timezone.utc).date().isoformat(),
               'installed_skills': len(entries),
               'bundled_skills': sum(e['bundled'] for e in entries),
               'added_or_imported_skills': sum(not e['bundled'] for e in entries),
               'categories': dict(sorted(Counter(e['category'] for e in entries).items())),
               'bundled_by_category': dict(sorted(Counter(e['category'] for e in entries if e['bundled']).items())),
               'oldest_added_file_date': min(local_dates) if local_dates else None,
               'scope': 'Installed SKILL.md inventory, including disabled skills; linked files deduplicated.',
               'caveat': 'Added/imported does not prove agent authorship. File modification dates are not learning dates.',
               'renderer': 'https://hermes-explainer.fluxora.build/?grow=1'}
    if summary_output:
        summary_output.parent.mkdir(parents=True, exist_ok=True)
        summary_output.write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps({'summary': summary, 'duplicate_links_skipped': duplicates,
                      'private_renderer_input': str(output)}, indent=2))
    return summary

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skills-root', type=Path, action='append', help='Repeat for external skill roots')
    parser.add_argument('--output', type=Path, required=True, help='Private renderer input; do not publish')
    parser.add_argument('--summary-output', type=Path, help='Aggregate-only public snapshot')
    args = parser.parse_args()
    roots = args.skills_root or [Path(os.environ.get('HERMES_HOME', Path.home()/'.hermes'))/'skills']
    export([p.expanduser().resolve() for p in roots], args.output, args.summary_output)
