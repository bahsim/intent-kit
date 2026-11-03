---
name: meta-init
description: "Use when starting a new project or when .meta/project-context.md is missing: initialize or bootstrap project metadata, create the project context, set up .meta record folders, or refresh, update, or check an existing project context for drift against package scripts and code. Discovers facts from the repo, asks only about what it cannot find, and writes a short dated project-context.md after approval. Offered automatically by the other meta-* skills when the context is missing."
argument-hint: "Name the project (and root folder if in a monorepo), or say 'refresh' to re-check the existing context..."
---

# Initialize or Refresh the Project Context

Create `.meta/project-context.md`, the file the other `meta-*` skills read for project identity,
destinations, commands, and evidence limits, or re-check an existing one. The file records
**facts, not authority**: it never grants permission to install, authenticate, query, publish,
deploy, or delete.

## When to Use
- A new project has no `.meta/project-context.md`, or another `meta-*` skill stopped because it is
  missing.
- The user asks to initialize or bootstrap project metadata, or to refresh or verify the context.

Not for creating plans, epics, testing records, or docs (use those skills afterwards), and not for
standalone work that needs no project record (for example a Word extraction to a chosen folder).

## Mode
- **Create** when `.meta/project-context.md` does not exist.
- **Refresh** when it exists: compare it with the repo, report drift, and change only what the user
  approves. Never overwrite an existing context without showing a diff and getting approval.

## Procedure
1. **Select the project.** Take the project and root from the user's task, not from the current
   directory. In a monorepo, confirm which package is the project. Never reuse another project's
   context as a starting point.
2. **Discover read-only.** Collect what the repo can prove, with the file each fact came from:
   - identity: name in `package.json`, `pyproject.toml`, `go.mod`, or the README; git root;
   - commands: scripts in `package.json`, `Makefile`, `pyproject.toml`, and CI workflows, plus the
     package manager implied by the lockfile;
   - stack and skills: framework dependencies and the names of existing `.github/skills/*`;
   - structure: existing `.meta/` or docs folders, plan and doc conventions already in use;
   - git hygiene: `.gitignore` rules that would hide `.github/` or `.meta/` files.

   Never read `.env*`, credentials, or tokens, and make no remote requests.
3. **Ask about the rest** in one short form (see the checklist below). Offer discovered defaults,
   and write anything unanswered as `Unknown — ask owner` rather than inventing it.
4. **Draft** from the [context template](./assets/project-context-template.md). List each command
   as `Defined in <file>; not run` unless you actually ran it with the user's agreement and
   recorded the result and date. Keep the file short (about 100 lines or fewer); procedure stays in
   the skills, only project facts go here.
5. **Approve and write.** Show the draft or diff with its unknowns, then write the file.
   Use paths relative to the project root; do not commit machine-specific absolute paths.
6. **Offer scaffolding, do not impose it.** Ask before creating any of: empty record folders
   (`.meta/plans`, `epics`, `testing`, `backlog`), a `.github/copilot-instructions.md` pointer to
   the context (start from [the instructions template](./assets/copilot-instructions-template.md)
   and merge into an existing file instead of replacing it), and `.gitignore` exceptions needed to
   track `.github/skills` (and `.github/agents` if the project uses agents).
7. **Propose follow-up work from real gaps.** Only after the context is approved, list follow-ups
   that discovery actually justifies, each with the evidence that triggered it. Examples: no
   test or validation command found; a browser UI with no browser-level checks; no documentation
   entry point; unknown owners for tracker or privacy rules. Do not propose work for a gap that was
   not observed, do not assume a stack, and do not run, install, or plan anything. Offer one
   choice: skip, log each as a backlog item (see the backlog guide in `.meta/instructions/` when
   installed), or draft an epic with the [epic skill](../meta-epic/SKILL.md). Never present a
   generic checklist as findings.
8. **Hand back.** If another skill triggered this, resume that request with the new context.

## Questions to ask (only what discovery could not answer)
- Work-item tracker and label (Jira, Azure DevOps, GitHub Issues, none), and whether remote tickets
  may ever be created.
- Record destinations: accept the `.meta/` defaults or name existing ones.
- Privacy and redaction limits for evidence (restricted identifiers, customer data).
- Data and connection needs, described without secrets: services, environments, who authorizes access.
- Domain gates that apply to behavior changes (for example parity between normal and debug paths).
- Delivery defaults: the epic cadence (stop after each plan or continuous), when a testing record
  is required, and whether reusable scripts and queries should be offered for keeping (`ask` or
  `never`). Recommend `ask` for all when the team has no settled preference.
- Where reusable tools should live: project scripts, portable resources, and non-app queries
  (defaults: `scripts/`, `.meta/scripts/<name>/`, `.meta/queries/`).
- Source formats needing an adapter (transcripts, Word documents) and who owns decisions.

## Refresh Mode
Compare each recorded fact with its source and report a table: item, recorded value, value found,
proposed action.
- Commands against current scripts and CI; skill baselines against `.github/skills/`; destinations
  against folders that exist; any "present", "blocked", or "verified" claim against the repo today.
- Do not trust a stale "verified" or date; mark it unverified when it cannot be re-checked.
- Update `Date` and `Evidence basis` only for what was actually re-checked.

## Rules
- Record only verifiable facts with their source; label everything else unknown.
- No secrets, no credentials, no installs, no live queries, no deployment while initializing.
- Keep the context a fact sheet that links to skills for procedure; never copy a full procedure in.
- An example is not an acceptance value, and a listed script is not proof that it passes.

## Completion Checklist
- [ ] Project and root confirmed with the user; no other project's content reused.
- [ ] Every fact has a source or is marked `Unknown — ask owner`.
- [ ] Commands are marked run or not run, with the date when run.
- [ ] File is short, dated, and states its evidence basis; no secrets or absolute machine paths.
- [ ] Existing context was changed only after an approved diff.
- [ ] Scaffolding created only where the user agreed.
- [ ] Follow-up proposals cite observed gaps, nothing was started without a choice, and the original request resumed.
