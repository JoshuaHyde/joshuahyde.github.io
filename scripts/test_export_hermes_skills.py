"""Run: python -m unittest discover -s scripts -p 'test_*.py' -v"""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('exporter', Path(__file__).with_name('export-hermes-skills.py'))
assert spec is not None and spec.loader is not None
exporter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exporter)

class ExportTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name)
        self.root = self.base / 'skills'
        self.root.mkdir()
    def tearDown(self):
        self.tmp.cleanup()
    def skill(self, path):
        p = self.root / path / 'SKILL.md'
        p.parent.mkdir(parents=True, exist_ok=True)
        # Invalid UTF-8 proves export never attempts to read the original body.
        p.write_bytes(b'\xffPRIVATE_SENTINEL_DO_NOT_PUBLISH')
        return p
    def test_manifest_and_categories(self):
        self.skill('research/reader')
        self.skill('creative/painter')
        (self.root/'.bundled_manifest').write_text('reader:original-hash\n')
        items, bundled, duplicates = exporter.inventory([self.root])
        self.assertEqual(len(items), 2)
        self.assertEqual(sum(x['bundled'] for x in items), 1)
        self.assertEqual({x['category'] for x in items}, {'research', 'creative'})
        self.assertEqual(duplicates, 0)
    def test_duplicate_external_symlink_and_cycle(self):
        self.skill('research/reader')
        external = self.base/'external'
        external.mkdir()
        (external/'reader').symlink_to(self.root/'research/reader', target_is_directory=True)
        (self.root/'cycle').symlink_to(self.root, target_is_directory=True)
        items, _, duplicates = exporter.inventory([self.root, external])
        self.assertEqual(len(items), 1)
        self.assertEqual(duplicates, 1)
    def test_conflicting_names_fail(self):
        self.skill('research/reader')
        self.skill('creative/reader')
        with self.assertRaises(ValueError):
            exporter.inventory([self.root])
    def test_hidden_archives_excluded(self):
        self.skill('research/reader')
        self.skill('.archive/retired')
        items, _, _ = exporter.inventory([self.root])
        self.assertEqual([i['name'] for i in items], ['reader'])
    def test_missing_and_empty_roots_fail(self):
        for root in [self.base/'missing', self.root]:
            with self.assertRaises(ValueError):
                exporter.inventory([root])
    def test_private_export_and_public_summary(self):
        self.skill('research/reader')
        out, summary = self.base/'renderer-input.json', self.base/'summary.json'
        result = exporter.export([self.root], out, summary)
        self.assertEqual(result['installed_skills'], 1)
        self.assertEqual(out.stat().st_mode & 0o777, 0o600)
        private = json.loads(out.read_text())
        self.assertEqual(len(private['renderer_skills']), 1)
        self.assertEqual(private['renderer_skills'][0]['provenance'], 'local')
        self.assertNotIn('PRIVATE_SENTINEL', out.read_text())
        self.assertNotIn('reader', summary.read_text())
        self.assertNotIn(str(self.root), summary.read_text())
        self.assertEqual(sum(result['categories'].values()), result['installed_skills'])
    def test_invalid_skill_identifier_fails(self):
        self.skill('research/not a skill')
        with self.assertRaises(ValueError):
            exporter.inventory([self.root])

if __name__ == '__main__':
    unittest.main()
