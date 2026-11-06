# Intent Kit

Reusable skills for GitHub Copilot: project discovery, planning, delivery, testing, and documentation.
The skills guide Copilot to use repository facts, seek approval for plans, and record verification
evidence. They are instructions, not guarantees of model behavior.

## Install

Requires Node.js 18+ and Git. By default, installation targets the Git repository root,
even when you run the command from a child directory.

The default `core` bundle installs project-discovery, planning, delivery, and testing skills under
`.github/skills/` and a backlog guide under `.meta/instructions/`. The `word` bundle also copies its
tool under `.meta/scripts/word-extraction/`.

Installation only copies kit files. It does **not** run the skills or create project context,
plans, epics, or `.github/copilot-instructions.md`. Those are created only when you ask Copilot
to use the relevant skill.

Add optional bundles as needed:

| Bundle | Adds |
| --- | --- |
| `e2e` | Playwright UI-testing skill |
| `docs` | Business-logic documentation skill and audit guide |
| `word` | Word requirements-extraction skill and tool |
| `design` | Premium frontend design and read-only web design review skills |

```sh
# Install core skills
npx github:bahsim/intent-kit install
```
```sh
# Install core plus selected optional bundles (comma-separated, no spaces)
npx github:bahsim/intent-kit install --with e2e,docs,design
```
```sh
# Or install every optional bundle
npx github:bahsim/intent-kit install --with all
```

Choose one install command. Each run installs core plus only the bundles you specify.

Installation overwrites selected kit files, including local edits. Run it again to update them.

Use `--target <path>` to select a specific project directory inside a Git repository.
To install into your current directory instead of the repository root (for example, a child
project in a monorepo):

```sh
npx github:bahsim/intent-kit install --with all --target .
```

Use `--skills-dir <path>` to change the default `.github/skills` destination relative to the
target directory.

## Use the skills

| Task | Skill |
| --- | --- |
| Create or refresh project context | `/meta-init` |
| Plan one change without implementation | `/meta-plan` |
| Organize several independently shippable goals | `/meta-epic` |
| Implement a change or execute a plan | `/meta-deliver` |
| Record validation results | `/meta-testing` |
| Build or run browser checks | `/meta-e2e` (`e2e` bundle) |
| Explain business logic from code | `/meta-business-documentation` (`docs` bundle) |
| Extract and review a Word specification | `/meta-word-extract` (`word` bundle) |
| Design a polished frontend | `/premium-frontend-ui` (`design` bundle) |
| Review a website's visual quality | `/web-design-reviewer` (`design` bundle) |

These are task entry points, not required steps. For examples, approval behavior, and how the
skills work together, read the [user guide](./docs/agentic-approach/README.md).

### Next: Initialize Project Context

After installation, invoke the skill in Copilot Chat:

```text
/meta-init
```

It inspects the repository and drafts a project context for your approval. In a monorepo, include
the project name and folder.

For kit development and tests, see [CONTRIBUTING.md](./CONTRIBUTING.md) :)
