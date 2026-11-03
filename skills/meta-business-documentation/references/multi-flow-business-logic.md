# How to Document Multi-Flow Business Logic

Use this guide for branching processing flows, services, reports, or multiple views consuming shared sources. Do not assume either independent processing or a single precomputed dataset: establish the actual execution model from source.

## Selected Context

Follow the [selected-project context contract](../../meta-project-context/SKILL.md) first. Select identity/root, actual flows/sources, input/output boundaries, document destination/index, and relevant domain references. Endpoints, GUI, SQL, caching, frameworks, and aggregation stages are conditional, not universal prerequisites.

Use the selected destination and index convention, if the project maintains one, and update the
index in the same edit. See the [high-level documentation guide](high-level-documentation.md) for
source verification, business framing, formulas, edge cases, and scope exclusions.

## Core Principles

### 1. Code-Factual Execution Isolation

Trace each flow's implementation and at least one actual caller, including constants/defaults. Identify what processing is shared, independently rerun, bypassed, or modified. Verify the exact entry point or query/function, input parameters, overridden scope, and fallback behavior. A similar name or common source does not prove identical rules.

### 2. Separate Scoping, Exclusions, and Rollup

Where these concepts exist, distinguish:

- **Population scoping:** inputs removed by selection, with or without a recorded reason.
- **Auditable exclusions:** in-scope inputs failing a governed rule and routed to a diagnostic register.
- **Structural grouping/rollup:** aggregation that changes grain without necessarily discarding inputs.

Use the project's actual terminology and rules. Verify whether exclusions are really recorded; do not invent an audit path or infer lost records from a rollup.

### 3. Trace Trigger to Consumer

For every active and auxiliary flow, record:

1. Trigger: user action, scheduled event, command, request, or dependency completion.
2. Exact entry point/function and verified caller.
3. Actual stages applied, in order; name shared and bypassed stages.
4. Overrides: fixed versus selected inputs, scope changes, reference grain, and error/fallback behavior.
5. Output grain/shape and actual consumer/presentation, if any.

Read complete relevant functions, not just search snippets. Check UI copy/defaults only where a UI exists. Separate source facts from interpretation and label unverified behavior.

## Required Structure

### 1. Architectural Overview and Execution Model

Explain actual sharing, fan-out, processing, and caching boundaries. State what is cached, its owner/lifetime/key, and what is recomputed when relevant. Use a fenced vertical Mermaid diagram for complex branching. Do not invent cache or server boundaries to match an example.

### 2. Summary Comparison Matrix

| Flow / Consumer | Entry Point | Processing Scope | Overrides / Edge Cases | Output Shape |
| --- | --- | --- | --- | --- |
| Verified flow | Source reference | Actual stages | Verified differences | Actual grain/contract |

### 3. Detailed Per-Flow Specifications

For every active and auxiliary/hidden flow, include purpose, trigger/caller, source references, stages, special business logic, input overrides, fallback/error behavior, output shape/grain, and consumer mapping. Document formulas with units and plain-language explanations when applicable.

Highlight differences in filtering, time inputs, reference populations, thresholds, aggregation, and output handling only where source verifies them. A non-UI consumer still requires its actual output contract, not a fictitious widget.

### 4. Cross-Flow Interactions and Caching

Describe actual dependency, invalidation, batching, shared state, and refresh behavior. Distinguish global scope changes from local actions where these exist. Record non-applicability or missing evidence explicitly.

### 5. Boundaries and Evidence Gaps

Link adjacent topics, state exclusions, identify unverified flows/consumers, and distinguish local source evidence from live/deployed acceptance. Do not smooth over conflicting behavior or infer a business decision.

## Mermaid Conventions

- Use fenced `mermaid` blocks with `flowchart TD` for complex branching to avoid excessive width.
- Quote punctuation-heavy node labels. Keep calculations in explained prose/math, not node labels.
- Distinguish sources (`[(Source)]`), processing (`[Stage]`), inputs (`[/Inputs/]`), decisions (`{{Decision}}`), and consumers (`[[Consumer]]`) where relevant.
- Reserve dashed arrows (`-.->`) for actual secondary/diagnostic paths, explaining their meaning.
