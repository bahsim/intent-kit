# How to Build High-Level Documentation (with Diagrams)

Terse rules for writing an in-depth, business-analyst-level logic document with Mermaid diagrams
in the selected project's documentation destination.

## Selected Context
Follow the [selected-project context contract](../../meta-project-context/SKILL.md) first. Establish identity/root,
authoritative sources, topic, document destination/index, and any applicable writing standard.
Use the destination and indexing convention from the selected project's maintained context; do not
import another application's domain examples or documentation authority.

## When to do this
- A discrete piece of business/calculation logic (a pipeline stage, a formula, a ranking
  algorithm) needs a standalone explanation aimed at a business analyst, not a developer.
- The existing high-level flow doc or another logic doc references a topic as "out of scope, see
  `NN-topic-name.md`" and that file doesn't exist yet or is still a title-only stub.

## Ground rule: describe the code as it is, not as it should be
Every claim in the document must be traceable to a specific function or file. Never describe an
idealized/aspirational design unless the document explicitly says so in its title or intro (e.g.
a "recommended model" draft, clearly labeled as such). If asked for a "factual" or "source of
truth" document, that means: read the actual implementation first, and call out every place where
behavior is surprising, inconsistent with a naive mental model, or differs between two similar
features — don't smooth those over for readability.

## Before writing
1. Read the primary source file(s) in full (not just a grep snippet) — the function(s) that
   actually implement the logic, plus any constants/defaults they use.
2. Read at least one caller (an API route or component) to confirm how the function is actually
   invoked in practice — parameters, defaults, and ordering can differ from what the function
   signature alone suggests.
3. If the logic has a UI surface (a slider, toggle, badge, tooltip), check the component for any
   user-facing copy or default values shown on screen — quote or reflect that copy accurately
   rather than inventing your own phrasing for the same concept.
4. Don't read unrelated docs already in the folder unless the user asks you to cross-check
   against them; each doc should be independently verified against code, not copied from a sibling
   doc's claims.

## File
- Path and filename: use the selected project's documented destination and naming convention.
  Continue existing numbering only when that project requires it.
- One topic per file. If a topic naturally splits into two independent concerns (e.g. "how periods
  are compared" vs. "how the resulting pair is decomposed into effects"), use two files and
  cross-link them rather than merging.
- Update the selected project's required index in the same edit, following its existing format.
  Do not invent an index when the project has no such convention.

## Required structure
1. **Title** (`# Title Case Name`).
2. **Source line** — a sentence naming the exact file(s)/function(s) this doc describes, as
   markdown links, e.g. `Source: `path/to/file.ts` — `functionName()`.`.
3. **One-paragraph framing** — what question this piece of logic answers, in plain business
   language, before any mechanics.
4. **Step-by-step body** — broken into `##`/`###` sections following the actual order of
   operations in the code (not an idealized order). Use a Mermaid diagram (` ```mermaid ` fenced
   block) wherever a decision tree, sequence, or branching structure is easier to read visually
   than as prose — see "Diagram conventions" below.
5. **Formulas in $$ math blocks or tables**, translated into one plain-language sentence
   immediately after each formula — never leave a formula unexplained.
6. **Edge cases / known gotchas** — explicitly call out defaults vs. adjustable parameters,
   clamping/fallback behavior, threshold values, and any place this logic diverges from a sibling
   feature's equivalent logic. Explain fixed versus configurable behavior from verified sources.
7. **Closing "What this document does not cover" section** — link to existing or planned sibling
   documents when that helps keep scope narrow and navigation clear.

## Diagram conventions
- Always use fenced ` ```mermaid ` blocks — never bare `flowchart` text without fencing, since it
  won't render.
- Quote any node label containing `/`, parentheses, or other punctuation Mermaid may misparse,
  e.g. `F2["Amount / Unit"]`.
- Prefer `flowchart TD` for decision trees/branching logic (classification, exclusion rules) and
  `flowchart LR` for short linear pipelines.
- Keep diagrams at the same level of detail as the surrounding prose — don't put a calculation
  formula inside a node label; put the formula in the text below the diagram instead.

## Style
- Terse, precise, no marketing language, no restating the obvious.
- Prefer concrete numbers over vague language: state actual default values, thresholds, and
  constants exactly as they appear in code, not "a small threshold" or "roughly."
- Write for a reader who understands the business domain but has never opened the codebase —
  spell out acronyms and field names in plain words on first use.
- Don't create the file with only a title — if you're scaffolding a placeholder ahead of writing
  the real content, that's fine, but note it's a stub rather than leaving it silently empty.
