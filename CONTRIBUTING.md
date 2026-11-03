# Contributing

## Layout

| Folder | Purpose |
| --- | --- |
| `bin/` | Command-line entry point |
| `src/` | File copier, bundle definitions, and path helpers |
| `skills/` | Copilot skills |
| `instructions/` | Workflow guides |
| `resources/` | Word extractor |
| `test/` | Installer tests |

## Making changes

- Keep skills reusable: take project-specific facts from the target repository.
- Register new skills, guides, or resources in `src/kit.mjs`.
- Reference optional skills by name so core-only installations have no broken links.
- Update `CHANGELOG.md` and the package version when releasing changes.

## Tests

```sh
npm test

# Word extractor only; requires Python 3.10+ and python-docx
PYTHONDONTWRITEBYTECODE=1 npm run test:word
```
