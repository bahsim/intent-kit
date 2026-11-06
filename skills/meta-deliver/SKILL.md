---
name: meta-deliver
description: "Use when asked to implement, build, fix, or deliver a feature, bug fix, or enhancement end to end in the selected project, to execute, run, or continue an existing plan or epic (for example 'execute plan 189' or 'run the next ready plan'), or to resume interrupted delivery work. Prepares and gets approval for a plan or epic, then implements, verifies, reviews, and records each plan with evidence. Explicit invocation only."
argument-hint: "Describe the task, or name an existing plan or epic to execute (for example 'execute plan 189')..."
disable-model-invocation: true
---

# Deliver a Change End to End

Turn a task, or an existing approved plan, into a verified implementation. This skill owns the
chain and its stop points; the other `meta-*` skills own each artifact's format, so do not
duplicate their formats here.

## When to Use
- Implement a described feature, fix, or enhancement, including from feedback.
- Execute an existing plan or epic, continue with the next ready plan, or resume paused work.

Not for only creating a plan or epic (invoke the [plan skill](../meta-plan/SKILL.md) or
[epic skill](../meta-epic/SKILL.md): they stop at approval), for recording a validation run on its
own (use the [testing skill](../meta-testing/SKILL.md)), or for planless direct edits.

## Constraints
- **No planless edits:** never modify implementation files without an approved plan or epic.
- **Approval first:** present the plan or epic and get explicit approval before the first edit.
- **No speculative discovery:** implement only known requirements; if critical requirements are
  ambiguous or missing, stop and ask.

These are procedure rules, not deterministic enforcement.

## Phase A: Prepare and Approve (once)
1. **Context.** Select the project and root from the task. Read `.meta/project-context.md` (if it
   is missing, offer the [init skill](../meta-init/SKILL.md) first) and apply the
   [context contract](../meta-project-context/SKILL.md). Inspect the relevant implementation and
   source material, report inaccessible input, uncertainty, and contradictions, check git status,
   and preserve existing staged, unstaged, and untracked work.
2. **Choose the path.**

   | Input | Path |
   | --- | --- |
   | Names an existing plan or epic, or "next ready plan" (find it with `pnpm open:meta`) | Skip drafting; go to Phase B |
   | One cohesive goal | Draft a plan with the [plan skill](../meta-plan/SKILL.md) |
   | Several independently shippable goals | Draft an epic and a plan per goal with the [epic skill](../meta-epic/SKILL.md) |

   Use an exploring subagent to verify Current State in parallel when the codebase is large.
3. **Approval stop (mandatory).** Present scope, modified files, acceptance criteria, exclusions,
   dependencies, and assumptions, then halt. Use the ask-questions tool when available, with
   options to approve, revise, or change the cadence. On changes, revise and repeat.

   | Decision | Resolved from (in order) | Recorded as |
   | --- | --- | --- |
   | Approval | Explicit user answer; a default never replaces it | `Approved: YYYY-MM-DD by <role>` on the plan or epic |
   | Epic cadence (`stop-after-each-plan` or `continuous`) | The request, then the context's **Delivery Defaults** if not `ask`, then ask | `Execution cadence:` on the epic |

   Do not ask the cadence question for a single plan. Ask even when a default exists if the scope
   is large or ambiguous, touches shared or production behavior, or a failed check needs a
   decision. A default never authorizes commit, push, or deploy.

## Phase B: Execute Each Plan (loop)
For a plan, run once; for an epic, repeat for each ready plan in dependency order.
1. **Ready?** The plan is not finished, every `Dependency` plan is done, and it has an `Approved`
   line (if not, return to the approval stop). Set `Status: IN PROGRESS` when work starts.
2. **Re-verify.** Compare Current State with the code today. If stale or changed since approval,
   stop, propose an addendum, and re-approve.
3. **Implement** surgically, following existing project patterns.
   When the change affects user-visible behavior, E2E maintenance is part of the implementation:
   map affected `e2e/COVERAGE.md` IDs, then add, update or delete scenarios, bricks and fixtures
   with the `meta-e2e` skill, without a separate approval or keep/discard
   question. List these test changes in the plan's scope when drafting it.
4. **Verify.** Run the narrowest project checks that cover the changed area (never assume a package
   manager or test suite), including calculation, debug, and equivalent processing paths when
   behavior changes. Map every acceptance criterion to recorded evidence in the plan's
   **Verification** section: exact commands, outputs, and gaps. When user-visible behavior changed,
   run the affected `pnpm e2e --grep` cases by default; do not run the full `pnpm e2e` unless
   explicitly requested or the change or focused results indicate clear cross-cutting risk. Ask
   before an otherwise costly full run. A failing related E2E case blocks completion. Add a testing record with the
   [testing skill](../meta-testing/SKILL.md) when the context's testing policy or a cross-layer
   validation calls for one.
5. **Review.** Before marking done, have an independent review (a code-review subagent or a
   fresh pass of your own) check the diff, untracked files, and any scope creep.
6. **Capture reusable artifacts.** List new files this run created beyond the plan's deliverable
   (compare with `git status`) plus scratch scripts, queries, fixtures, or templates it used.
   Skip this step when there are none or the context's **Reusable artifacts** setting is `never`.
   Otherwise follow *Reusable Artifacts* below.
7. **Complete.** Set `Status:` (for example `IMPLEMENTED`) and the epic goal row only when every
   criterion is verified. Distinguish local implementation from deployment, business acceptance,
   release, or commit.
8. **Continue or stop.** With `stop-after-each-plan` (or a single plan), report and wait. With
   `continuous`, start the next ready plan only after this one is verified and recorded.

After every plan in an epic is implemented and recorded, but before marking the epic complete,
run the project's existing scripted E2E check(s) once, using commands verified in project context.
Do not invoke the separate UI-testing skill or substitute manual browser testing for this gate. If
the project has no browser UI, record the gate as not applicable. If it has a browser UI but no
applicable E2E script exists, or a script fails, leave the epic incomplete and report the gap or
failure.

## Reusable Artifacts
Never add files to the repo silently. Classify each candidate, propose a home, and ask the user
once in one batched question (ask-questions tool when available) to keep or discard each.

| Candidate | Proposed home |
| --- | --- |
| Project tooling (checker, report, or archive script) | `scripts/` with a `package.json` entry and tests |
| UI check (Playwright snippet or flow) | `e2e/bricks/` and `e2e/scenarios/`, via the `meta-e2e` skill: reuse existing bricks, add only new small ones. Tests that follow from the delivered feature are part of its scope: keep them without asking; ask only about incidental extras |
| Portable resource (Excel or Word extractor, converter) | `.meta/scripts/<name>/` with README, requirements, and synthetic tests |
| Reusable query | `config/queries/` if the app uses it; otherwise `.meta/queries/<topic>.sql` with purpose and source in a header comment, read-only |
| A repeatable procedure | A new or updated `meta-*` skill |
| Test fixture | Synthetic data only, beside its tests; never customer data |
| Throwaway (one-off backfill, temporary conversion) | Delete it, and record the command and result in the plan's **Verification** |

Worth keeping only if it is likely to recur, has clear inputs and outputs, is deterministic, and
can be tested. A kept artifact needs: a README (purpose, usage, prerequisites; see the
[resource README template](./assets/resource-readme-template.md)), synthetic tests, no secrets,
customer data, or machine-specific paths, a link from the plan, and a row in the context's
**Resource registry**.

## Failures
- Investigate a failed relevant check and retry only with a concrete new approach. If attempts
  repeat without new evidence, or the fix needs a decision, permission, or an unavailable resource,
  stop and report the blocker with evidence.
- A failed relevant check blocks completion and dependent plans. Separate pre-existing baseline
  failures from regressions; never count either as a pass.

## Pause and Resume
Before a pause or handoff, record on the plan or epic: work completed, remaining steps, blockers,
decisions, and the next ready plan. On resume, compare that record with the actual worktree and
current checks; do not trust a stale completion label.

## Delegation
Delegate bounded, independent work when it helps: an explorer to verify Current State, a runner
for long test suites, a reviewer after implementation. Give each delegate a clear objective and
expected evidence; integrate and verify the results yourself and keep ownership of the plan.

## Boundaries
- Commit, push, deploy, installation, and other external actions need separate authorization.
- Feedback may arrive in any format. Use a verified project-local adapter when available, report
  its limits, and do not send sensitive content externally.

## Completion Checklist
- [ ] Every acceptance criterion maps to recorded evidence; gaps are stated.
- [ ] `Approved`, `Status`, and epic rows match the evidence; deployment and release not implied.
- [ ] Baseline failures separated from regressions; blockers reported, not hidden.
- [ ] Reusable artifacts were offered to the user (or none existed); nothing was kept silently.
- [ ] Pause record written if work stopped before completion.
- [ ] No commit, push, or deploy happened without separate authorization.
