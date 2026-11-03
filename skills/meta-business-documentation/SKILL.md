---
name: meta-business-documentation
description: "Use when asked to write, update, or review business-logic documentation: explain how a calculation, formula, ranking, rule, or processing stage works for analysts; document branching flows, shared sources, or several consumers; or fill a topic that another doc lists as missing. Every claim is verified against the actual code and the selected project's documentation conventions."
argument-hint: "Name the topic, formula, or flows to document, and the audience if not business analysts..."
---

# Write Business-Logic Documentation

Explain what the code actually does, in business language, with evidence. Describe the
implementation as it is, not as it should be.

## When to Use
- A discrete piece of business or calculation logic needs a standalone explanation for a business
  analyst, not a developer.
- A document references a topic that is missing or only a stub.
- Several flows, services, reports, or views consume shared sources and their differences need
  documenting.

Do not use to change behavior, to audit documentation quality across a corpus (follow the
audit guide `.meta/instructions/how-to-audit-documentation.md`), or to record validation
evidence (see the [testing skill](../meta-testing/SKILL.md)).

## Choose the Form
| Situation | Follow |
| --- | --- |
| One topic: its behavior, formulas, edge cases, business meaning | [high-level documentation](./references/high-level-documentation.md) |
| Branching flows, shared sources, several consumers, different processing paths | [multi-flow business logic](./references/multi-flow-business-logic.md) |

Load only the matching reference. Load both only when the task compares the two forms; for a
multi-flow document also use the high-level reference for source verification, formulas, and
edge-case rules, as it directs.

## Procedure
1. **Establish context.** Read `.meta/project-context.md` and apply the
   [selected-project context contract](../meta-project-context/SKILL.md): project id/root,
   authoritative sources, document destination and index, writing standard, domain gates.
2. **Read the implementation.** Read the complete relevant functions and constants/defaults, and
   at least one real caller. Check UI copy and defaults only where a UI exists. Do not copy a
   sibling document's claims; verify each independently.
3. **Place the file.** Follow the selected project's maintained context for the destination,
   filename, numbering, and index convention. Ask if these are not established. One topic per file;
   split independent concerns into linked files.
4. **Write the document** from the [document skeleton](./assets/business-doc-skeleton.md) and the
   chosen reference.
5. **Update the index in the same edit** when the selected project maintains one. Follow its
   existing format; a required but missing index entry makes the task incomplete.
6. **Check completeness** against the checklist at the end.

## Existing Document
Update in place; keep its number and file name.
- **Re-verify first:** read the current code and a real caller, then compare every claim in the
  document with it. Fix only the claims that differ and say what changed.
- **Behavior changed:** update the formula, defaults, thresholds, and diagrams together; do not
  leave a stale number in prose or a diagram.
- **Index:** refresh the selected project's required index when the title or scope changes.
- **Unverifiable claim:** mark it unverified rather than keeping or deleting it silently.

## Core Rules
- Every claim must be traceable to a specific function or file. Call out surprising,
  inconsistent, or divergent behavior between similar features; do not smooth it over.
- Never present an aspirational design as fact unless the title or intro says it is a proposal.
- State actual defaults, thresholds, and constants exactly as they appear in code, not "roughly".
- Separate source facts from interpretation, and label unverified behavior.
- A formula always gets a one-sentence plain-language explanation immediately after it.
- Mermaid: always fenced, quote punctuation-heavy labels, formulas in text rather than node labels.
- Do not invent a business decision, cache boundary, endpoint, or UI that the code does not have.
- A stub is acceptable only when labeled as one.

## Completion Checklist
- [ ] Every claim cites a function or file read in full, plus a real caller.
- [ ] Structure follows the chosen reference; scope exclusions link to sibling documents.
- [ ] Formulas are explained; diagrams are fenced and quoted correctly.
- [ ] Edge cases, defaults vs adjustable parameters, and divergences are explicit.
- [ ] Required project index updated in the same change.
- [ ] Applicable documentation checks defined by the project context pass for the new links.
