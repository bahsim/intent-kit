---
name: meta-plan
description: "Use when asked to create, write, draft, revise, or split a plan; turn a task, bug, feedback, or goal into an implementation plan; assign a project-wide Plan Order; or define scope, acceptance criteria, and verification before implementation. Produces one plan file under .meta/plans/ and stops for scope approval."
argument-hint: "Describe the change, goal, or source the plan should cover..."
---

# Create a Plan

Write one terse, evidence-based plan per discrete feature, fix, or change. A plan is the unit of
approval and verification; it never authorizes implementation by itself.

## When to Use
- A bounded change needs scope, target behavior, and verification agreed before any code changes.
- One goal of an epic is being extracted into its own plan (see the [epic skill](../meta-epic/SKILL.md)).
- An existing plan needs an addendum after post-implementation feedback.

Do not use for several independently shippable goals from one source (create an epic), for
deferred asks that are not ready to act on (log them per the
backlog guide `.meta/instructions/how-to-log-a-backlog-item.md`),
or for recording a completed validation run (use the [testing skill](../meta-testing/SKILL.md)).

## Procedure
1. **Establish context.** Read `.meta/project-context.md` and apply the
   [selected-project context contract](../meta-project-context/SKILL.md):
   project id/root, plan/archive destination, applicable checks, work-item label. Ask about
   missing or conflicting facts; do not guess.
2. **Read the code first.** Verify current behavior from the actual files, functions, and callers.
   Check existing staged, unstaged, and untracked changes and preserve unrelated work.
3. **Assign the Plan Order.** Use a verified project-local helper if the context defines one.
   Otherwise inspect `.meta/plans/` and its `_archive/` subfolders recursively, find the highest
   `Plan Order` header, and add one. Do not reset on a new date.
4. **Write the plan** from the [plan template](./assets/plan-template.md), following the rules below.
5. **Check completeness** against the checklist at the end.
6. **Stop for scope alignment.** Present scope, target behavior, acceptance criteria, exclusions,
   dependencies, and assumptions, and wait for explicit approval. Revise and repeat if changes are
   requested. This skill only creates the plan: to implement it, use the
   [deliver skill](../meta-deliver/SKILL.md) (`/meta-deliver execute plan NN`). When the user
   approves, record it as `Approved: YYYY-MM-DD by <role>`.

## File and Header
- Path: `.meta/plans/plan-YYYY-MM-DD-NN-<kebab-case-topic>.md`. The date is the day the plan is
  written; `NN` is the `Plan Order`.
- `NN` must exactly equal the `Plan Order:` header integer. Use at least two digits; from 100 up,
  use the full integer.
- Header fields: `Date`, `Project`, `Scope` (1-3 precise lines), `Plan Order`, `Status`; optional
  `Approved` (`YYYY-MM-DD by <role>`) once the user approves the scope, so the plan can later be
  executed without re-asking.
- `Status` starts with one of `PLANNED`, `IN PROGRESS`, `IMPLEMENTED`, `CLOSED`, `SUPERSEDED`,
  `POSTPONED`, `REJECTED`, optionally followed by ` — <note>` (for example
  `IMPLEMENTED — local only, not deployed`). Project-local reporting and archival tools may read
  it; a plan without a recognizable status shows up as unknown.

## Required Sections (in order)
1. **TL;DR** — 2-5 sentences for someone who will not read the rest.
2. **Current State** — verified facts citing real files/functions.
3. **Target State / Target Behavior** — precise enough to implement from.
4. **Implementation** — ordered steps naming exact files/functions. No filler.
5. **Verification** — actual selected-project commands and relevant manual checks, with
   measurable expected results, environment, and explicit gaps. Do not inherit another project's
   package manager.
6. **Explicitly Out of Scope** — adjacent work this plan deliberately does not do.
7. **Work Item(s)** — business-facing tickets using the selected context's label (see below).

Optional, only when needed: **High-Level Goals** (right after TL;DR), **Open Questions**,
**Dependency** (a prior plan this builds on), **Addendum** (dated section for revisions after
feedback; do not create a new file for a refinement of the same change).

### Behavior Changes
Check applicable equivalent execution, debug, or export paths defined by the project context and
verified code. Decide whether calculations or reported settings change, update affected paths in
**Implementation**, and verify parity in **Verification**. Record "checked and unaffected" only
with evidence. If the project has no equivalent path, state why instead of inventing a check.

### High-Level Goals
Add a short numbered list (one line each) when a plan bundles several distinct asks that do not
reduce to one TL;DR sentence. Skip it for single-goal plans. Put detail in Target State and
Implementation. If a goal is blocked on missing data or dependencies, say so in one line and
list it under Explicitly Out of Scope.

### Work Item(s)
- Default to one ticket for the whole plan. Use one ticket per High-Level Goal only when goals
  are independently shippable; keep goals that touch the same state together.
- Number tickets to match the High-Level Goals order (`### Ticket 1: ...`).
- Each ticket: `Title:` one line, `Description:` short paragraph, bullet acceptance criteria.
- Business/user-facing language only: no file, component, or function names. Write for a reader
  who has never seen the codebase.
- With no tracker, keep local drafts or state non-applicability. Never create remote tickets.

## Existing Plan
Open the plan, do not create a second file for the same change.
- **Refine:** append a dated **Addendum**; leave the original sections intact except for factual
  corrections.
- **Scope changed after approval:** clear the `Approved` line, present the change, and re-approve.
- **Finish:** set `Status` only when the acceptance criteria are verified, and record the evidence
  in **Verification**.
- **Stale Current State:** re-verify it against the code before any further work.

## Style
- Terse; no restating what the code makes obvious; no marketing language.
- Reference other plans by filename instead of repeating their content.
- Prefer several small plans over one large one.

## Where Plans Live
- Active plans stay flat in `.meta/plans/`; finished plans may be archived to
  `.meta/plans/_archive/YYYY-MM/` (month of the plan date) using a verified project-local tool.
  Preview before applying, preserve links, and never move plans without a `Status:` header.
- If the project generates an index of plans, never edit it by hand.
- Set a clear `Status:` header (for example `IMPLEMENTED`) when a plan is done, so it can be archived.

## Completion Checklist
- [ ] Filename number equals the `Plan Order` header, and it is the project-wide next integer.
- [ ] `Status` is set to one of the recognized values.
- [ ] All required sections are present, in order.
- [ ] Current State claims are verified against code, not assumed.
- [ ] Verification names real commands with measurable expected results and gaps.
- [ ] Behavior-change parity paths are addressed or justified as not applicable.
- [ ] Tickets contain no implementation detail.
- [ ] Scope-alignment stop reached; no implementation started before approval.
