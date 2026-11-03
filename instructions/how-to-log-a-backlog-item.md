# How to Log a Backlog Item

Terse rules for `.meta/backlog/` — a holding area for asks (from an identified requester, in
meetings or ad hoc) that we are NOT ready to act on yet, so they don't get lost or re-discovered
from scratch later. This is not a plan (see the `meta-plan` skill): no implementation detail,
no verification steps — just enough to pick the thread back up.

## Selected Context
Follow the selected-project contract (the `meta-project-context` skill) first. Establish identity/root,
record destination, source ask, blocker/status, and owner only where known. Do not assume a tracker
or invent an assignee. Paths below are selected-project-relative.

## When to add one
- A requester/stakeholder asks for something mid-conversation that's out of scope for the current work.
- Something is blocked (missing data, unclear requirement, dependency on another team) and would
  otherwise be forgotten once the conversation moves on.
- Do NOT use this for work that's ready to plan now — write a plan in `.meta/plans/` instead.

## File
- Path: `.meta/backlog/YYYY-MM-DD-<kebab-case-topic>.md` (date = day the ask came up).
- One file per distinct ask. Don't bundle unrelated asks together.

## Required Header
```
# <Title>

Date: YYYY-MM-DD
Source: <who asked — name/role, or meeting doc filename if from a transcript>
Status: Deferred | Blocked | Needs decision
```

## Required Sections
1. **The Ask** — 1-3 sentences, in the requester's words as much as possible.
2. **Why Not Now** — the concrete blocker (missing data, unclear scope, waiting on X).
3. **Notes** — anything already known that will save time later (relevant files, prior
   investigation, related plan docs). Keep it short; expand only if genuinely useful.

## When it becomes actionable
Promote it: write a real plan in `.meta/plans/` (linking back to the backlog file if useful), then
delete the backlog file. Don't let both copies linger.

If the backlog file bundles multiple distinct asks (e.g. numbered items from one meeting/thread)
and only one is promoted, do NOT delete the whole file — the other asks are still live and may
reference each other. Instead, strike through just the promoted item (`~~...~~`) and append a note
on it: `PROMOTED — see <plan-file-name> (Plan Order N).` Leave every other item untouched. Only
delete the file once every item in it has been promoted or dropped.

Whenever an item's status changes (promoted, dropped, blocked resolved, etc.), update it in place
immediately — don't let the file drift out of sync with reality. Consistency here matters more
than brevity: a stale backlog is worse than no backlog.

## Style
Terse, no filler. This folder is a memory aid, not documentation.
