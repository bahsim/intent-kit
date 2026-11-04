---
name: meta-e2e
description: "Use when asked to verify browser UI behavior, create reusable Playwright checks, or map UI test coverage. Also use automatically for user-visible feature changes that need UI scenario maintenance when the selected project uses Playwright."
argument-hint: "Describe the user journey or UI behavior to verify, or ask to map the current browser-check coverage..."
---

# Build and Run UI Checks

Use this workflow only when the selected project has a browser UI and Playwright is an
appropriate runner. If the project uses another runner, follow its testing conventions instead.
Installing this skill does not install a browser or establish that a runner is available.

## When to Use

- A user-visible feature, fix, refactor, or removal needs UI scenario maintenance in a Playwright
  project.
- Verify UI behavior or collect browser evidence for an approved plan or testing record.
- Turn a verified browser interaction into a small reusable check.
- Map, prioritize, or improve the project's UI scenario coverage.

Not for API, SQL, unit, or non-UI validation. For a standalone evidence report, use the
[testing skill](../meta-testing/SKILL.md).

## Project Conventions

1. Read `.meta/project-context.md` and the selected-project context contract
   (`../meta-project-context/SKILL.md`). Confirm the app target, runner, command, fixture/data
   boundary, and whether checks are offline or against an explicitly authorized non-production
   environment.
2. Use commands and prerequisites verified for that project. Do not assume a package manager,
   server port, fixture source, CI provider, browser installation command, or test layout.
3. Prefer offline/synthetic data and read-only actions. Live targets, credentials, publishing,
   and external uploads require separate authorization.
4. This workspace uses `e2e/` scenarios and reusable bricks, `e2e/COVERAGE.md`, and a generated
   `e2e/bricks/INDEX.md`. Follow the existing scenario IDs, fixture conventions, and `@brick`
   headers. When affected results have normal and debug paths, assert their parity.

## Recommended Playwright Layout

Adapt this structure to the project's existing conventions; do not reorganize a project to match
the example.

```text
e2e/playwright.config.ts       runner configuration; safe target defaults
e2e/bricks/<area>.ts           small reusable actions
e2e/bricks/INDEX.md            generated catalog, if useful for the project
e2e/scenarios/<topic>.e2e.ts   user-flow compositions
```

## Procedure

1. **Scope the check.** Identify the changed behavior and its directly affected scenarios. For a
   broad coverage request, list important user journeys, existing evidence, and gaps before adding
   checks. Do not claim complete coverage from a smoke suite or route inventory alone.
2. **Reuse first.** Read the relevant coverage rows and scenario catalog; compose from existing
   bricks or helpers wherever they fit.
3. **Explore new behavior.** Use approved browser tooling to find stable locators and observe the
   interaction. Freeze inputs for reproducibility; do not use restricted data in code, traces, or
   screenshots.
4. **Add only missing checks.** Keep scenarios focused on observable behavior and use independently
   specified fixture expectations. For changing live data, assert verified relationships rather
   than copied sample values.
5. **Keep coverage records aligned.** Update `e2e/COVERAGE.md` when UI behavior changes. Keep
   affected IDs, scenarios, latest evidence, and remaining gaps aligned. Distinguish passing,
   failing, blocked, skipped, and unrun checks.
6. **Verify the changed area.**
   - By default, run only the affected UI scenario(s), using the command verified in project
     context.
   - Run additional type, lint, or unit checks only when relevant to the changed code. In this
     workspace, regenerate the brick catalog when its headers change; run pure-brick Vitest checks
     when helper logic changes.
   - Do not run the full UI suite by default. Broaden checks only when explicitly requested or when
     the change or focused results indicate clear cross-cutting risk. Ask before an otherwise
     costly broader run.
   - If a browser fallback is used, report its method and limitations; it is not a runner pass.
7. **Retain deliberately.** Offer incidental reusable checks as a batch unless an approved plan
   already includes them. Link retained checks from the plan or testing record and register
   reusable resources where project conventions require it.

## Maintaining with Feature Work

Tests that follow from a delivered change belong to its scope; no separate approval or
keep/discard question is needed for checks included in an approved plan.

| Change | Action |
| --- | --- |
| New behavior | Add focused scenarios with new IDs and independently derived expectations |
| Intentional change | Update assertions to the approved requirement, not to current output |
| Refactor or locator change | Keep assertions; fix the shared brick |
| Bug fix | Add a focused case that fails without the fix |
| Removal | Delete obsolete scenarios, unused bricks, and coverage rows; regenerate the catalog |

An `agentStop` hook (`../../hooks/pvm-waterfall-e2e-gate.json`,
`../../../scripts/e2e-maintenance-gate.mjs`) reminds once per edit set when UI source changes without an
`e2e/` change. It does not run tests. Never weaken assertions, skip, retry, or lengthen timeouts to
get green.

## Brick Rules

- One responsibility; parameterize inputs; return useful data.
- In this workspace, exported bricks use the existing `@brick`, `@does`, `@params`, `@returns`,
  and `@verified` headers. Update the generated catalog when headers change.
- Prefer role, label, and test-id locators; avoid sleeps and rely on runner auto-waiting.
- Assert relationships (for example, labels following selections or parts adding up) rather than
  copied live-data values.
- Restore temporary filters or settings when using a shared browser session.
- Keep fixtures synthetic and local where possible. Do not include secrets, cookies, or restricted
  identifiers.
- Test boundary, error, keyboard, and responsive states where they matter to the changed behavior.
- Pure helpers get a unit test beside them. Fix a shared helper when its behavior is wrong; do not
  duplicate actions to hide the defect.
- Do not add retries to turn intermittent failures into success-shaped evidence. Live targets,
  hosted execution, and external uploads require separate authorization.

## Completion Checklist

- [ ] Existing checks for the changed area were inventoried and reused where applicable.
- [ ] New scenarios have explicit, measurable expected behavior.
- [ ] Focused checks ran successfully, or runner limitations are stated accurately.
- [ ] Coverage status reflects what ran; gaps and blocked areas remain visible.
- [ ] No live access, upload, or publication occurred without separate authorization.
