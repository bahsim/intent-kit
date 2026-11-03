# Changelog

## 3.0.0

- Changed: install automatically overwrites differing selected kit files, including local edits.
  Every selected file is copied.
- Removed: `--dry-run`; installation now has only one copy-and-overwrite execution path.
- Removed: install records, hashes, `keep`, `unkeep`, `status`, `doctor`, conflict sidecars,
  and legacy migration machinery. Existing project records and sidecars are left alone.
- Changed: bundles and skill destinations are no longer remembered. Repeat `--with` and
  `--skills-dir` when updating; unselected bundles and unrelated files are not deleted.
- Removed: content comparisons, action classifications, temporary-file transactions,
  Git-ignore inspection, and runtime kit audits. Bundle consistency is checked in tests.
- Removed: README "Update and check"; reinstalling simply replaces the selected kit files.

## 2.0.0

Breaking layout change; existing 1.x installations migrate automatically on `install`.

- Added: `intent-kit` command with `install`, `status`, and `doctor`; one-command install from a
  project root; the project defaults to the repository containing the current directory.
- Added: optional bundles (`e2e`, `docs`, `word`) selected with `--with`; core is always installed.
- Added: `--skills-dir` for assistants that read a different skills directory.
- Added: on conflict, the kit's version is written beside the project's file as `<file>.kit-new`.
- Added: `keep` and `unkeep` so a project can deliberately keep its own version of a file; a kept
  file is never overwritten and later kit changes arrive beside it as `<file>.kit-new`.
- Fixed: a write failure part-way no longer leaves the install record out of step with the files.
- Added: `meta-init` proposes follow-up work from gaps it actually discovered.
- Changed: the install record moved to `.github/intent-kit.json` and now records bundles and the
  skills directory. Hashes are line-ending stable. Files are written atomically.
- Changed: nothing is installed under `.meta/intent-kit/` any more; the instructions template lives
  with `meta-init`.
- Changed: core skills no longer link to optional skills; optional guides no longer hard-code the
  skills directory.
- Removed: `ONBOARDING_SOURCE.md` (a generic goal list) and `manifest.json`.

## 1.1.0

- Upgrade support with an install record, junk-file exclusion, and an ignored-path warning.

## 1.0.0

- Initial curated skill bundle and conflict-safe installer.
