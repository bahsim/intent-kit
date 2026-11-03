import base64
import hashlib
import importlib.util
from io import BytesIO, StringIO
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from contextlib import redirect_stderr, redirect_stdout

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

from extract_word_document import extract_document


RESOURCE = Path(__file__).resolve().parent
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII="
)


class ExtractionTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="word extraction ")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = self.root / "source with spaces.docx"
        self.output = self.root / "new output"

    def save(self, document=None):
        if document is None:
            document = Document()
            document.add_paragraph("Source text")
        document.save(self.source)
        return document

    def report(self):
        before = hashlib.sha256(self.source.read_bytes()).digest()
        result = extract_document(self.source, self.output)
        self.assertEqual(before, hashlib.sha256(self.source.read_bytes()).digest())
        self.assertEqual(result, self.output / "content.md")
        return result.read_text(encoding="utf-8")

    def cli(self, source=None, output=None, script=None, cwd=None, isolated=False):
        args = [sys.executable]
        if isolated:
            args.append("-S")
        args.extend([
            str(script or RESOURCE / "extract_word_document.py"),
            str(source or self.source),
            "--output", str(output or self.output),
        ])
        return subprocess.run(args, cwd=cwd or self.root, text=True, capture_output=True)

    def test_order_nested_tables_styles_and_unicode(self):
        document = Document()
        document.add_paragraph("First caf\u00e9", style="Heading 1")
        table = document.add_table(rows=1, cols=1)
        table.cell(0, 0).text = "Cell text"
        nested = table.cell(0, 0).add_table(rows=1, cols=1)
        nested.cell(0, 0).text = "Nested text"
        document.add_paragraph("Last")
        self.save(document)
        report = self.report()
        positions = [report.index(text) for text in ("First caf\u00e9", "Cell text", "Nested text", "Last")]
        self.assertEqual(positions, sorted(positions))
        self.assertIn("Style: Heading 1", report)
        self.assertIn("Cell Body.2.Row1.Cell1", report)
        self.assertIn("Table Body.2.Row1.Cell1.2", report)
        self.assertFalse((self.output / "images").exists())

    def test_image_anchors_bytes_and_deduplication(self):
        document = Document()
        paragraph = document.add_paragraph("Before")
        paragraph.add_run().add_picture(BytesIO(PNG))
        paragraph.add_run("After")
        document.add_table(rows=1, cols=1).cell(0, 0).paragraphs[0].add_run().add_picture(BytesIO(PNG))
        self.save(document)
        report = self.report()
        self.assertEqual((self.output / "images" / "image-001.png").read_bytes(), PNG)
        self.assertEqual(report.count("(images/image-001.png)"), 2)
        self.assertIn("Unique embedded images saved: 1", report)
        self.assertLess(report.index("Before"), report.index("(images/image-001.png)"))
        self.assertLess(report.index("(images/image-001.png)"), report.index("After"))
        self.assertIn("visual inspection required", report)

    def test_merged_cells_warning(self):
        document = Document()
        table = document.add_table(rows=1, cols=2)
        table.cell(0, 0).merge(table.cell(0, 1)).text = "Merged"
        self.save(document)
        self.assertIn("Merged table cells", self.report())

    def test_headers_and_tracked_changes_warn(self):
        document = Document()
        document.add_paragraph("Body")
        document.sections[0].header.paragraphs[0].text = "Header omitted"
        document.element.body.append(OxmlElement("w:ins"))
        self.save(document)
        report = self.report()
        self.assertIn("Tracked changes", report)
        self.assertIn("Headers, footers", report)
        self.assertNotIn("Header omitted", report)

    def test_external_and_missing_images_warn_without_download(self):
        document = Document()
        paragraph = document.add_paragraph("Linked")
        relationship = document.part.relate_to("https://example.invalid/image.png", RT.IMAGE, is_external=True)
        linked = OxmlElement("a:blip")
        linked.set(qn("r:link"), relationship)
        paragraph._p.append(linked)
        paragraph._p.append(OxmlElement("a:blip"))
        self.save(document)
        report = self.report()
        self.assertIn("missing or externally linked image", report)
        self.assertIn("missing relationship ID", report)
        self.assertFalse((self.output / "images").exists())

    def test_hyperlink_text_is_retained_but_not_followed(self):
        document = Document()
        paragraph = document.add_paragraph("Before ")
        link = OxmlElement("w:hyperlink")
        link.set(qn("r:id"), document.part.relate_to("https://example.invalid", RT.HYPERLINK, is_external=True))
        run = OxmlElement("w:r")
        text = OxmlElement("w:t")
        text.text = "Display text"
        run.append(text)
        link.append(run)
        paragraph._p.append(link)
        self.save(document)
        report = self.report()
        self.assertIn("Display text", report)
        self.assertIn("link targets aren't extracted or followed", report)

    def test_existing_directory_and_files_are_unchanged(self):
        self.save()
        self.output.mkdir()
        sentinel = self.output / "keep.txt"
        sentinel.write_text("Keep")
        before = self.source.read_bytes()
        with self.assertRaisesRegex(ValueError, "already exists"):
            extract_document(self.source, self.output)
        self.assertEqual(sentinel.read_text(), "Keep")
        self.assertEqual(self.source.read_bytes(), before)
        self.assertEqual(list(self.output.iterdir()), [sentinel])

    def test_existing_output_file_is_refused(self):
        self.save()
        self.output.write_text("Keep")
        with self.assertRaisesRegex(ValueError, "already exists"):
            extract_document(self.source, self.output)
        self.assertEqual(self.output.read_text(), "Keep")

    def test_legacy_format_is_refused(self):
        with self.assertRaisesRegex(ValueError, "Only .docx"):
            extract_document(self.root / "source.doc", self.output)
        self.assertFalse(self.output.exists())

    def test_missing_source_is_refused(self):
        with self.assertRaisesRegex(ValueError, "Source file not found"):
            extract_document(self.source, self.output)
        self.assertFalse(self.output.exists())

    def test_cli_paths_with_spaces_and_unrelated_cwd(self):
        self.save()
        result = self.cli()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Extracted:", result.stdout)
        self.assertIn("Source text", (self.output / "content.md").read_text())

    def test_cli_missing_source_fails_visibly(self):
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Extraction failed:", result.stderr)
        self.assertNotIn("Extracted:", result.stdout)

    def test_cli_malformed_input_fails_visibly(self):
        self.source.write_bytes(b"Not a DOCX")
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("partial output isn't a completed extraction", result.stderr)
        self.assertEqual(self.source.read_bytes(), b"Not a DOCX")

    def test_cli_missing_dependency_fails_visibly(self):
        self.save()
        result = self.cli(isolated=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Install the dependency:", result.stderr)
        self.assertNotIn("Extracted:", result.stdout)
        self.assertFalse(self.output.exists())

    def test_cli_requires_output_and_has_help(self):
        script = RESOURCE / "extract_word_document.py"
        help_result = subprocess.run([sys.executable, str(script), "--help"], text=True, capture_output=True)
        self.assertEqual(help_result.returncode, 0, help_result.stderr)
        self.assertIn("--output", help_result.stdout)
        result = subprocess.run([sys.executable, str(script), str(self.source)], text=True, capture_output=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("--output", result.stderr)

    def test_standalone_copied_resource_has_no_sibling_dependency(self):
        self.save()
        copied = self.root / "standalone resource"
        shutil.copytree(RESOURCE, copied, ignore=shutil.ignore_patterns("__pycache__"))
        result = self.cli(script=copied / "extract_word_document.py")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.output / "content.md").is_file())
        for required in ("requirements.txt", "README.md", "test_extract_word_document.py"):
            self.assertTrue((copied / required).is_file())

    def test_partial_failure_is_not_reported_as_success(self):
        spec = importlib.util.spec_from_file_location("extractor_failure_case", RESOURCE / "extract_word_document.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        def fail(source, output):
            output.mkdir()
            (output / "partial.txt").write_text("Incomplete")
            raise OSError("Synthetic write failure")

        stderr, stdout = StringIO(), StringIO()
        with patch.object(sys, "argv", ["extractor", str(self.source), "--output", str(self.output)]):
            with patch.object(module, "extract_document", side_effect=fail):
                with redirect_stderr(stderr), redirect_stdout(stdout):
                    self.assertEqual(module.main(), 1)
        self.assertIn("Synthetic write failure", stderr.getvalue())
        self.assertIn("partial output", stderr.getvalue())
        self.assertNotIn("Extracted:", stdout.getvalue())


if __name__ == "__main__":
    unittest.main()
