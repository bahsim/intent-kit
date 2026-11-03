---
name: meta-e2e
description: "Use when asked to check, test, or verify browser UI behavior; write or extend reusable Playwright checks; or establish a project-specific UI coverage baseline. Reuses existing checks first, verifies each new scenario, and reports uncovered areas."
argument-hint: "Describe the user journey or UI behavior to verify, or ask to map the current browser-check coverage..."
---

# Build and Run Playwright UI Checks

Use this workflow only when the selected project has a browser UI and Playwright is an appropriate
runner. If it uses another runner, follow that project's testing conventions instead of imposing
Playwright. Installing this skill does not install a browser or establish that a runner is
available.

## When to Use

- Verify UI behavior or collect browser evidence for an approved plan or testing record.
- Turn a verified browser interaction into a small reusable check.
- Map, prioritize, or improve the project's UI scenario coverage.

Not for API, SQL, unit, or non-UI validation. For a standalone evidence report, use the
[testing skill](../meta-testing/SKILL.md).

## Project Conventions

1. Read `.meta/project-context.md` and the selected-project context contract
   (`../meta-project-context/SKILL.md`). Confirm the app target, runner, command, fixture/data
   boundary, and whether the check is offline or against an explicitly authorized non-production
   environment.
2. Use commands and prerequisites verified for that project. Do not assume a package manager,
   server port, fixture source, CI provider, or browser installation command.
3. Prefer offline/synthetic data and read-only actions. Live targets, credentials, publishing,
   and external uploads require separate authorization.

## Recommended Playwright Layout

Adapt this structure to the selected project's existing conventions; do not reorganize a project
just to match the example.

```
e2e/playwright.config.ts       runner configuration; safe target defaults
e2e/bricks/<area>.ts           small reusable actions
e2e/bricks/INDEX.md            generated catalog, if useful for the project
e2e/scenarios/<topic>.e2e.ts   user-flow compositions
```

## Procedure

1. **Map current coverage.** Read the project's existing test and scenario catalogs. For a request
   for broad coverage, list the important user journeys, existing evidence, and gaps before adding
   checks. Do not claim complete coverage from a smoke suite or a route inventory alone.
2. **Reuse first.** Compose from existing bricks/helpers where applicable.
3. **Explore new behavior.** Use the approved browser tooling to find stable locators and observe
   the real interaction. Keep inputs frozen for reproducibility; do not use restricted data in
   code, traces, or screenshots.
4. **Add only missing checks.** Each reusable action should have one responsibility. Keep scenarios
   focused on observable behavior and use independently specified fixture expectations. For
   changing live data, assert verified relationships rather than copied sample values.
5. **Keep coverage records aligned.** Update a maintained coverage matrix or equivalent when the
   project's process requires it. Distinguish passing, failing, blocked, skipped, and unrun checks.
6. **Prove it.** Run the focused scenario using the command verified in project context, then the
   smallest relevant type, lint, or unit checks that the project actually defines. A browser
   fallback is not a runner pass; report the method and limitations honestly.
7. **Retain deliberately.** Offer incidental reusable checks as a batch unless an approved plan
   already includes them. Link retained checks from the plan or testing record and register any
   reusable resource where the project context requires it.

## Check Rules

- Prefer role, label, and test-id locators; avoid sleeps and rely on runner auto-waiting.
- Restore temporary filters or settings when a shared browser session is used.
- Keep fixtures synthetic and local where possible. Do not include secrets, cookies, or restricted
  identifiers.
- Test boundary, error, keyboard, and responsive states where they matter to the user's flow.
- Fix a shared helper when its behavior is wrong; do not duplicate an action across scenarios to
  hide the defect.
- Do not add retries to turn intermittent failures into success-shaped evidence.

## Completion Checklist

- [ ] Existing checks were inventoried and reused where applicable.
- [ ] New scenarios have explicit, measurable expected behavior.
- [ ] Focused checks ran successfully, or the runner limitation is stated accurately.
- [ ] Coverage status reflects what ran; gaps and blocked areas remain visible.
- [ ] No live access, upload, or publication occurred without separate authorization.
