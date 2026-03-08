---
name: task-generator
description: Delegate task plan generation to the task-generator agent via Task. Never formulate the plan yourself.
---

# Task Generator Workflow

Delegate task plan generation to the `task-generator` agent via `Task`. Never formulate the plan yourself.

## Naming Rule (Required)

Always create task files with date-first format for correct ordering:

- `taskReadme/YYYY-MM-DD-[task-specific-name].md`
- Use today's date in ISO format (`YYYY-MM-DD`) at the beginning.

## YAML Frontmatter (Required)

Every task file MUST include YAML frontmatter at the top. This is the single source of truth for task status tracking — the UI reads these fields directly.

```yaml
---
title: Descriptive Task Title
status: pending
created: YYYY-MM-DDThh:mm:ssZ
updated: YYYY-MM-DDThh:mm:ssZ
source_branch: ""
target_branch: ""
branch_name: ""
pr_url: ""
error_message: ""
---
```

All fields are required (use empty string `""` for unknown values). The frontmatter block must be the very first thing in the file, enclosed in `---` delimiters.

## Delegation

For **complex tasks** (new features involving external libraries, framework-specific work, integrations):

```json
{
  "agent": "task-generator",
  "prompt": "Generate a task plan for: [user's description]. FIRST use Context7 MCP to research relevant documentation. Then create `taskReadme/YYYY-MM-DD-[task-specific-name].md` (date first) with YAML frontmatter (title, status: pending, created, updated as ISO timestamps, source_branch, target_branch, branch_name, pr_url, error_message — all empty strings for unknown values). Follow the frontmatter with a Technical Documentation section and step-by-step implementation plan with parallelizability notes."
}
```

For **simple tasks** (file edits, config changes, small fixes, UI tweaks, README changes):

```json
{
  "agent": "task-generator",
  "prompt": "Generate a task plan for: [user's description]. This is a simple task — skip Context7 research and generate the plan directly. Create `taskReadme/YYYY-MM-DD-[task-specific-name].md` (date first) with YAML frontmatter (title, status: pending, created, updated as ISO timestamps, source_branch, target_branch, branch_name, pr_url, error_message — all empty strings for unknown values). Follow the frontmatter with a concise step-by-step implementation plan with parallelizability notes. Keep it brief."
}
```

## Complexity Heuristic

Use **simple** mode when the task:

- Involves editing 1-3 existing files
- Is about text/content/config changes
- Doesn't require learning new APIs or libraries
- Can be described in a sentence

Use **complex** mode when the task:

- Involves new dependencies or libraries
- Requires understanding framework internals
- Involves 4+ files or new architecture patterns

## Important Notes

- The output file path is **dynamic**: `taskReadme/YYYY-MM-DD-[task-specific-name].md` — not a hardcoded `README.md`.
- Wait for the agent to complete, then verify the file was created before proceeding.
