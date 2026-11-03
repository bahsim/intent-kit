---
name: meta-testing
description: "Use when asked to write, record, or document a validation or test run, test evidence, a verification report, or a behavior check that spans layers (SQL, API, UI, calculations) or needs a standalone record; when a plan's Verification needs a separate evidence document; or when reporting PASS/FAIL/INCONCLUSIVE scenarios and remaining validation gaps. Produces one testing record under .meta/testing/. Does not run tests or change code."
argument-hint: "Describe the behavior or change that was validated and link the related plan or issue..."
---

# Record a Testing Run

Document a completed verification run as evidence another person can audit and repeat. The
document type is **Testing**; never call it a plan.

## When to Use
Write a Testing record when validation is cross-layer or data-dependent (source data vs
calculation vs UI), uses several scenarios, needs frozen inputs to be reproducible, or the user
asks for a report.

Do not write one for ordinary verification of a plan: record the commands and results in that
plan's **Verification** section instead (see the [plan skill](../meta-plan/SKILL.md)). Writing a
Testing record implies no code change or deployment.

## Procedure
1. **Establish context.** Read `.meta/project-context.md` and apply the
   [selected-project context contract](../meta-project-context/SKILL.md): project id/root, record
   destination, applicable verification methods. Select only methods that apply; a non-UI or
   file-only change needs neither SQL nor a browser.
2. **Define the claim.** State the behavior checked and what evidence would establish it, before
   recording results.
3. **Freeze the inputs** needed to reproduce the result: environment and data refresh, fixture or
   identifiers, time period, filters, grain, enabled rules, thresholds with units.
4. **Run or collect the evidence** with the smallest relevant checks. Record exact commands,
   queries, and outputs as they happened; do not reconstruct them afterwards.
5. **Write the record** from the [testing template](./assets/testing-template.md), following the
   rules below.
6. **Link and reconcile.** Link the record from the related plan's **Verification** section and
   set plan/epic status to match the evidence (see Completion).
7. **Check completeness** against the checklist at the end.

## File and Header
- Path: `.meta/testing/YYYY-MM-DD-<kebab-case-topic>.md`; the date is the day validation was
  performed.
- One record per coherent validation run or change. Group related SQL, automated, API, and UI
  scenarios that verify the same behavior; do not create a separate report per tool.
- Header fields: `Date`, `Project`, `Status` (`COMPLETED`, `PARTIALLY COMPLETED`, or
  `INCONCLUSIVE`), `Scope` (1-2 lines), `Related plan` (link; if validation is exploratory with no
  plan, link the source issue or feedback).

## Required Sections (in order)
1. **Validation Goal** — the claim and the evidence that will establish it.
2. **Environment and Setup** — app/source environment, version or refresh, periods, filters,
   fixtures, settings. Never include credentials, tokens, or secrets.
3. **Scenarios and Results** — table `ID | Scenario | Expected | Observed | Status`, status one of
   `PASS`, `FAIL`, `INCONCLUSIVE`, `NOT RUN`. Cover relevant branches, boundaries, precedence,
   missing data, and regression behavior. One scenario can suffice for a small isolated change;
   shared or cross-layer behavior needs several.
4. **Automated Verification** — exact commands and results (focused tests, full tests, typecheck,
   lint, build, diff checks). Separate errors from warnings; note pre-existing warnings when known.
5. **Remaining Validation Gaps** — untested scenarios, external dependencies, unresolved business
   decisions, and limits on generalizing from samples. Write `None` only when none remain.
6. **Reproduction Notes** — brief repeatable steps for important manual cases; link long details
   or logs instead of duplicating them.

## Scenario and Result Rules
- Record expected and observed values precisely enough to tell pass from fail; do not rely on
  rounded chart labels when raw values exist.
- Separate source expectation, application calculation, and UI presentation when all three apply.
- Use `INCONCLUSIVE` when the scenario did not reach the rule under test, a prerequisite failed,
  data was missing, or an earlier exclusion took precedence.
- A passing sample does not prove a complete source contract: state the sample size and the cases
  not exercised.
- Never invent formulas or expected outcomes from observed behavior. Record unanswered semantics
  as gaps and ask the owner to decide.

## Data, SQL, and UI Evidence
- For repeatable UI checks, use the `meta-e2e` skill when it is installed and its runner applies: link the scenario and the selected project's verified command from the scenario table and record its result under Automated Verification.
- Validate external data with read-only queries against the actual source of truth. Record the
  query or link it, with execution status, row count, and relevant result fields. Follow the
  selected project's connection and security rules.
- When comparing source data to the UI, use the same environment, refresh, scope, periods, and
  effective settings, and explain differences between raw condition amounts and rolled or
  filtered application values.
- For UI checks, record active filters and settings, wait for loading to finish, and inspect the
  specific detail, table, or chart that proves the claim. Restore temporary filters and settings
  before leaving a shared browser session.
- Redact restricted identifiers per the selected project's privacy rules before sharing beyond
  the authorized audience.

## Existing Testing Record
A record is dated evidence: do not rewrite results.
- **Re-run or changed conclusion:** write a new record and add `Supersedes: <earlier record>` to its
  header; leave the old record unchanged except a one-line `Superseded by` note at the top.
- **Corrections:** typos and broken links may be fixed in place; never change an observed value,
  status, or date.
- **Completing a `PARTIALLY COMPLETED` run:** a new record for the remaining scenarios that links
  the original, rather than editing its status.

## Completion
- Implementation, sample verification, and full validation are different states; set the plan or
  epic status to what the evidence supports.
- Do not mark a goal fully validated while material gaps remain.
- Records older than the selected project's retention window and not linked from an active plan or
  epic may be moved to `.meta/testing/_archive/YYYY-MM/` using a verified project-local process.
  If the project generates an index of testing records, never edit it by hand.

## Completion Checklist
- [ ] Claim, environment, and frozen inputs are recorded; no secrets included.
- [ ] Every scenario has a measurable expected value, an observed value, and a status.
- [ ] Commands and queries are exact; errors are separated from warnings.
- [ ] Gaps are listed (or `None` is justified); sample limits are stated.
- [ ] Record is linked from the plan's Verification section; plan/epic status matches evidence.
