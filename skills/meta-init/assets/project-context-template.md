# <Project Name> Project Context

Date: YYYY-MM-DD
Project: <project-id>
Project root: `..`, relative to this file.
Evidence basis: <what was inspected and when, e.g. package.json scripts, CI workflows, folder layout>. Commands and live or deployed behavior are not certified by this inventory.

Use this adapter only after explicitly selecting this project. It supplies facts to the shared context contract (the `meta-project-context` skill); it grants no installation, authentication, query, publication, deployment, or deletion permission.

## Artifact and Documentation Destinations

All paths are relative to the selected project root.

| Record | Destination / convention |
| --- | --- |
| Plans | `.meta/plans/plan-YYYY-MM-DD-NN-topic.md`; highest `Plan Order` across the folder and `_archive/**`, no date resets |
| Epics | `.meta/epics/epic-YYYY-MM-DD-topic.md` |
| Testing | `.meta/testing/YYYY-MM-DD-topic.md` |
| Backlog | `.meta/backlog/YYYY-MM-DD-topic.md` |
| Business logic | <path and index convention, or "Not used"> |
| Tooling | <project scripts folder, portable resource folder, non-app query folder; defaults `scripts/`, `.meta/scripts/<name>/`, `.meta/queries/`> |

Work-item presentation: <tracker label, or "none: keep local Title/Description/acceptance-criteria drafts">. Remote ticket creation needs separate authorization.

## Delivery Defaults

Used only after scope approval; a default never skips the approval stop or authorizes commit, push, or deploy. A user's request overrides these. `ask` means ask at the approval stop.

| Setting | Value | Allowed values |
| --- | --- | --- |
| Epic cadence | ask | `ask`, `stop-after-each-plan`, `continuous` |
| Testing record | when cross-layer or requested | `when cross-layer or requested`, `always` |
| Reusable artifacts | ask | `ask`, `never` |

## Resource Registry (optional)

Reusable scripts, resources, and queries kept in this project; add a row whenever one is kept.

| Resource | Path | Purpose | Last verified |
| --- | --- | --- | --- |
| <name> | `<path>` | <what it does> | <date it was last actually run, or "not run"> |

## Validation Commands

Run from the selected root. Definitions are read from the named file; none is certified as passing.

| Command | Defined check | Status |
| --- | --- | --- |
| `<command>` | <what it runs, from <file>> | Defined in <file>; not run |

Documentation-only changes need no application checks unless documentation tests exist.

## Privacy and Evidence Limits

- <Restricted identifiers, data classes, and redaction rules; or "Unknown — ask owner">

## Stack and Skill Baselines (optional)

- <Framework skills in `.github/skills/` that apply to this project, or "None">

## Connection Requirements (optional)

- <Services and environments in plain words, who authorizes access, where secrets live. No secrets here.>

## Domain Gates (optional)

- <Checks required for behavior changes in this project, with the source of each rule>

## Adapters (optional)

- <Source formats that need a project-specific adapter (transcripts, Word documents) and their rules>
