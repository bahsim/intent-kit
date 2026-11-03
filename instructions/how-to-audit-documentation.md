# How to Audit Documentation

Use this guide to assess whether a selected project's documentation is accurate, complete,
discoverable, and maintainable. An audit records evidence and gaps; it does not authorize
rewriting documentation, changing application behavior, or deploying.

## Establish scope

1. Select the project explicitly and follow its maintained context and privacy limits.
2. Record the date, revision or working-tree basis, audience, corpus boundary, exclusions, and
   report destination.
3. Inventory the in-scope documents and attachments before judging completeness. Separate current
   guidance, historical material, proposals, delivery records, observed evidence, and reusable
   process guidance.
4. Do not read restricted files, bypass unavailable sources, or infer evidence from filenames.

## Review structure and navigation

- Check local links, anchors, indexes, referenced code/evidence, stubs, placeholders, and
  supersession links.
- Use the project's configured documentation checks if they are defined in its context. Record
  tool limitations and unverified external or viewer-specific links.
- Distinguish a confirmed defect from a historical/template exception, unavailable destination,
  or item requiring manual review.
- For broad audits, track each in-scope item and its review status; do not call an inventory an
  exhaustive semantic review.

## Verify factual claims

- Verify current behavior against the actual implementation and a real caller where applicable.
- Separate source facts, interpretation, stakeholder decisions, and deployed behavior.
- Check only the relevant execution, UI, data, and operational surfaces. Do not assume a project
  has a particular framework, database, API, cache, or deployment target.
- State unsupported claims, conflicts, inaccessible evidence, and unreviewed content explicitly.
- Do not generalize from a sample or a passing automated check beyond what it proves.

## Report

Summarize scope and evidence basis, reviewed areas, findings with source locations and confidence,
limitations, and recommended follow-up. Keep an auditable inventory when the corpus is large.
Report a partial review whenever material sources or required surfaces remain uninspected.
