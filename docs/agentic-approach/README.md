# User Guide: Working with Intent Kit

Intent Kit packages procedures as Copilot skills. You describe the work; Copilot uses the relevant
skill, repository files, and project records to carry it out. There is no separate orchestration
engine, and installing the kit does not start work.

Choose a skill for the task, not a mandatory sequence. Planning alone, reviewing a Word document,
and explaining a calculation are different requests; none automatically means implementing code.

## Choose a skill

Invoke a user-facing skill in Copilot Chat with `/` followed by its name and your request.
The links below open the actual procedures, including their templates and limits.

| Skill | When to use it | Result |
| --- | --- | --- |
| [meta-init](../../skills/meta-init/SKILL.md) | Initialize a project or refresh outdated context | An approved project fact sheet; optional scaffolding only with your agreement |
| [meta-plan](../../skills/meta-plan/SKILL.md) | Plan one cohesive change without implementing it | One plan, then a stop for scope approval |
| [meta-epic](../../skills/meta-epic/SKILL.md) | Split a shared request into independently shippable goals | An epic linking a plan per goal, then scope and cadence alignment |
| [meta-deliver](../../skills/meta-deliver/SKILL.md) | Implement a change or execute an existing plan/epic | Approved work implemented, checked, reviewed, and recorded, or a reported blocker |
| [meta-testing](../../skills/meta-testing/SKILL.md) | Record a validation run or cross-layer evidence | A testing report with results and gaps; not an implementation request |
| [meta-e2e](../../skills/meta-e2e/SKILL.md) (`e2e` bundle) | Check browser behavior or improve UI scenario coverage | Reused or new browser checks, execution evidence, and coverage gaps |
| [meta-business-documentation](../../skills/meta-business-documentation/SKILL.md) (`docs` bundle) | Explain business rules, formulas, or shared processing flows | Documentation checked against the actual implementation |
| [meta-word-extract](../../skills/meta-word-extract/SKILL.md) (`word` bundle) | Understand a Word specification, including tables and images | Extraction and a source-located review, with inaccessible content identified |

[meta-project-context](../../skills/meta-project-context/SKILL.md) is a supporting skill, not a
user command. Other skills use it to identify the project, destinations, commands, and evidence
boundaries before writing project records.

## Initialize the project

After [installation](../../README.md#install), invoke:

```text
/meta-init
```

In a monorepo, include the project name and folder. Copilot inspects repository facts, asks about
what it cannot establish, and proposes `.meta/project-context.md` for approval. Listed commands
are not treated as passing checks unless they were actually run.

The context is a fact sheet, not another instruction engine or permission grant. Refresh it
when the project's commands, structure, or conventions change:

```text
/meta-init refresh
```

Initialization does not generate a stock list of goals. It can propose follow-ups based on gaps
actually found, but you choose whether to skip them, log them, or request planning.

## Plan only, or deliver a change

For scope discussion without implementation:

```text
/meta-plan Fix the empty-state message in the search results.
```

For implementation, start directly with delivery; you do not need to invoke planning separately:

```text
/meta-deliver Fix the empty-state message in the search results.
```

The delivery procedure calls for inspecting the code, preparing one plan or an epic with goal
plans, and stopping for your explicit scope approval before implementation. Missing material
requirements should be raised as questions, not filled in by assumption.

Review the proposed behavior, scope, acceptance criteria, exclusions, and checks. Request changes
or approve. If scope materially changes later, delivery calls for renewed approval.

For multiple independent goals, an epic coordinates the plans. Its execution cadence is either
stop after each plan or continue through ready plans in dependency order. The choice comes from
your request, the project's delivery defaults, or a question. Even continuous execution checks
each plan before moving on.

Already have a plan?

```text
/meta-deliver Execute plan <number>.
```

Copilot checks its approval, dependencies, and current state rather than redrafting it. An old
approval or completion label is not evidence that the current code still matches the plan.

`meta-deliver` is configured for explicit invocation. This limits selection of that skill; it
does not prevent Copilot from making edits outside the skill.

## Verification and completion

Delivery includes verification; it is not a separate mandatory stage that you must invoke.
Checks come from the selected project and the change's acceptance criteria, not a universal
command list.

- Ordinary commands, results, and gaps belong in the plan's Verification section.
- Use `meta-testing` when you need a separate report or cross-layer/data-dependent validation.
- Use `meta-e2e` for applicable browser checks. Installing the skill does not install Playwright
  or browsers, and a passing smoke test is not complete UI coverage.
- Use `meta-business-documentation` when business-logic explanation is needed, not as an automatic
  final step for every change.

A passing command supports only what that check covered. Failures, unrun checks, inaccessible
data, and baseline issues should be recorded explicitly. Local implementation is not deployment,
release, or business acceptance. Commit, push, deploy, and external actions need separate
authorization.

## Pause and resume

Ask Copilot to record completed work, decisions, checks, remaining steps, and blockers in the
active plan or epic before stopping. In a later session, invoke delivery with that record.
Copilot should reconcile it with the current files and checks before continuing.

By default, context, plans, epics, and testing reports live under `.meta/`; the project's context
can specify existing destinations instead. These records help continuity, but are not proof that
work was completed.

## Skills, instructions, and automation

A skill is an on-demand procedure with optional templates, references, or scripts. Repository
instructions provide broader guidance. Neither is deterministic enforcement.

The kit does not install custom agents, enforcement hooks, or GitHub Actions into your project.
It does not pin a model or require a subagent runtime. Copilot host support determines skill
discovery and slash-command availability; installing files alone does not validate those features.

For Word extraction, Python and the extractor's dependencies are required; see the
[extractor guide](../../resources/word-extraction/README.md). Reviewing a document does not
authorize implementing its contents, and text extraction alone does not establish that embedded
images were understood.