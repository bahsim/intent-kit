# Project Instructions

- Before creating or editing a project record under `.meta/` (plan, epic, testing, backlog,
  documentation, audit), read `.meta/project-context.md` and use the matching `meta-*` skill in
  `.github/skills/`. If the context file does not exist, offer the `meta-init` skill first.
- To implement a described change or execute an approved plan or epic, the user invokes
  `/meta-deliver` explicitly; it is not selected automatically.
- To check browser UI behavior or keep reusable UI checks, use the `meta-e2e` skill with the
  runner and commands recorded in the project context.
- Do not infer the project, its commands, or its destinations from the current directory or from
  another project's examples.
