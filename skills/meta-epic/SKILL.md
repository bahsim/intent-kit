---
name: meta-epic
description: "Use when asked to create or update an epic; decompose a meeting, backlog thread, feedback session, or large intent into several independently shippable goals; build an epic index with linked plans; track goal status; or choose how to execute multiple plans. Produces one epic file under .meta/epics/, then one plan per goal, and stops for scope and cadence approval."
argument-hint: "Describe the shared source (meeting, backlog thread, feedback) or the large intent to decompose..."
---

# Create an Epic

An epic is a lean index over one shared source. It ties independently shippable goals to their
own plan files and never holds plan-level detail itself.

## When to Use
- Several items share one source (a single meeting, backlog thread, or feedback session) and are
  independently shippable: each is implemented, reviewed, and released on its own.
- An existing epic needs goals split into plans, status updates, or completion marking.

Do not use for a single discrete change (write one plan with the [plan skill](../meta-plan/SKILL.md)),
for unrelated sources (one epic per source), or for deferred asks (log them per the
backlog guide `.meta/instructions/how-to-log-a-backlog-item.md`). Never bundle an epic's goals into one giant plan.

## Procedure
1. **Establish context.** Read `.meta/project-context.md` and apply the
   [selected-project context contract](../meta-project-context/SKILL.md): project id/root, dated
   source, epic and plan destinations, work-item label. Ask about missing or conflicting facts.
2. **Read the source in full.** Identify the distinct goals, their dependencies, and which are
   independently shippable. Keep goals that only make sense together in one goal.
3. **Write the epic** from the [epic template](./assets/epic-template.md), following the rules below.
4. **Decompose one goal at a time** into its own plan with the [plan skill](../meta-plan/SKILL.md)
   (see Decomposition Order). Link each plan in the Goals table as soon as it exists.
5. **Check completeness** against the checklist at the end.
6. **Stop for scope alignment.** Present the epic, goal plans, dependencies, exclusions, and
   assumptions. Ask the user to choose an execution cadence unless the request or the project
   context's Delivery Defaults already set it:
   - **Stop after each plan:** implement and verify one plan, report, then wait for the user.
   - **Execute all plans sequentially:** implement ready plans in dependency order, verifying and
     recording each before starting the next.

   Wait for explicit approval of scope (and cadence, when it was not already set). This skill only
   creates the epic and its plans: to implement them, use the
   [deliver skill](../meta-deliver/SKILL.md) (`/meta-deliver execute epic <name>`). Record the
   approval as `Approved: YYYY-MM-DD by <role>`.

## File and Header
- Path: `.meta/epics/epic-YYYY-MM-DD-<kebab-case-topic>.md`. The date is the day the source
  meeting/backlog/thread happened, not necessarily the day the file is written.
- One epic per source; do not merge unrelated sources.
- Header fields: `Date`, `Project`, `Status` (`IN PROGRESS` until every goal is implemented, not
  merely planned), `Source` (link(s) to the transcript, backlog file, or thread); optional
  `Execution cadence` (`stop-after-each-plan` or `continuous`) and `Approved`
  (`YYYY-MM-DD by <role>`) once resolved, so the epic can later be executed without re-asking.

## Required Sections (in order)
1. **Purpose** — 2-4 sentences: why this is an epic (one shared source, independently shippable
   goals) rather than one plan or several unrelated plans, plus a one-line reminder that all
   technical detail lives in each goal's own plan file.
2. **Goals** — table `# | Goal | Backlog item | Plan file | Status`, one row per goal. Link
   `Plan file` to the real `.meta/plans/plan-*.md` once it exists; before that use
   `*not yet split into its own file*`.
3. **High-Level Goals** — numbered, one line of technical summary each. Under each item add a
   `> **In plain terms:** ...` blockquote in non-technical language (no file or function names).
4. **Notes** — cross-goal dependencies, Plan Order bookkeeping, and any goal flagged as largest,
   riskiest, or a candidate for further sub-splitting. Plan Order is assigned per file when a goal
   is split out (next integer after the highest `Plan Order` across `.meta/plans/`), never
   reserved in advance.
5. **Work Item(s)** — business-facing local ticket drafts covering the epic's entire scope and
   every goal, whether or not it has a plan yet. Default to one ticket for the whole epic;
   individual plans carry their own tickets. Each ticket: `Title:` one line, `Description:` short
   paragraph, bullet acceptance criteria. Business/user-facing language only. Use the selected
   context's label; with no tracker keep local drafts or state non-applicability. Never create
   remote tickets.

## Decomposition Order
Extract goals into plan files **one at a time**. Do not delete, trim, or summarize a goal's
content out of the epic until its own plan file has been created and verified. Trim the epic to
the lean index (Purpose, Goals table, High-Level Goals, Notes, scope-level Work Items) only as a
final separate step, once every goal has a plan, ideally after confirming with the user.

## Existing Epic
Open the epic, do not create a second one for the same source.
- **Split the next goal:** create its plan with the [plan skill](../meta-plan/SKILL.md), then link
  it in the **Goals** row (Decomposition Order still applies).
- **Add a goal:** add a Goals row and a High-Level Goals entry with its plain-terms note, update
  the epic-level ticket, then re-approve the scope (clear `Approved` until then).
- **Update progress:** set row and header status only by the Completion Marking rules.

## Style
- Terse, same as plans; do not restate context obvious from the source.
- Reference plan files by filename instead of repeating their content.
- The plain-English blockquotes are the one place epics differ in tone: write them for a
  non-technical stakeholder.

## Completion Marking
- When a goal ships, set its **Goals** row `Status` to `IMPLEMENTED`; optionally strike through
  the goal text there and in **High-Level Goals**.
- Keep the header status `IN PROGRESS` until every goal row is `IMPLEMENTED` and the final E2E
  gate in the [delivery workflow](../meta-deliver/SKILL.md) passes or is not applicable. Do not run
  that gate after individual plans.
- Distinguish local implementation from deployment, release, or business acceptance.
- Once the epic and every linked plan are finished, use the selected project's verified archival
  process if one is defined to move it to `.meta/epics/_archive/YYYY-MM/`. If the project generates an index of
  epics, never edit it by hand.

## Completion Checklist
- [ ] One epic for one source; every goal is independently shippable.
- [ ] Header and all five sections present, in order; every goal has a Goals row and a plain-terms note.
- [ ] No Current State, Implementation, or Verification detail in the epic.
- [ ] Each extracted goal has a verified plan file linked in the table.
- [ ] Epic-level tickets cover every goal and contain no implementation detail.
- [ ] Scope approval obtained, and execution cadence resolved (request, context default, or asked), before implementation.
- [ ] Final E2E gate passed or was recorded as not applicable before marking the epic complete.
