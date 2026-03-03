---
name: github-mcp-branch-pr
description: Git + GitHub MCP workflow for branch-based development. Uses direct bash commands for branching/push and creates PRs through GitHub MCP with explicit permission checks.
---

# GitHub Branch & PR Workflow

## Naming Rule (Date-First)

Use a date-prefixed slug to ensure sortable task history:

- `TASK_NAME="YYYY-MM-DD-task-specific-name"`
- Task file: `taskReadme/TASK_NAME.md`
- Branch: `feature/TASK_NAME`

## Primary Method: Git + GitHub MCP

The coordinator executes these directly. No sub-agent delegation needed.

### Pre-flight Metadata + MCP Permission Check (required)

```bash
# Detect repository metadata
REPO_URL=$(git remote get-url origin)
if [[ "$REPO_URL" =~ ^https://[^/@]+:[^@]+@github.com/(.+)$ ]]; then
  git remote set-url origin "https://github.com/${BASH_REMATCH[1]}"
  REPO_URL=$(git remote get-url origin)
fi
OWNER=$(node -e "const u=process.argv[1]||'';const m=u.match(/[:/]([^/]+)\/[^/]+(?:\.git)?$/);process.stdout.write(m?m[1]:'');" "$REPO_URL")
REPO=${REPO_URL##*/}
REPO=${REPO%.git}
echo "owner=$OWNER repo=$REPO"
```

Now verify repository access through GitHub MCP before continuing:

```
Call mcp_io_github_git_list_pull_requests with owner, repo, state='open', perPage=1.
If it fails (auth/scope/repo access), stop and report exact MCP error.
```

### Create Branch & PR (Phase 2)

```bash
# Prerequisite: MCP permission check passed via Pre-flight

# 1. Fetch and create branch
git fetch origin
git checkout BASE_BRANCH && git pull origin BASE_BRANCH
git checkout -b feature/TASK_NAME

# 2. Commit initial file(s)
git add taskReadme/TASK_NAME.md
git commit -m "task: add plan for TASK_NAME"

# 3. Push branch
git push -u origin feature/TASK_NAME
```

# 4. Create PR with GitHub MCP (not gh)

```
Use mcp_io_github_git_create_pull_request with:
- owner
- repo
- base=BASE_BRANCH
- head=feature/TASK_NAME
- title
- body
```

If a PR already exists, recover with `mcp_io_github_git_list_pull_requests` filtered by `head` and `base`.

### Push Code Changes (Phase 4)

```bash
git add -A
git diff --cached --quiet || git commit -m "feat: implement TASK_TITLE"
git push origin feature/TASK_NAME
```

## Fallback Method (only when needed)

1. If `git push` fails due to credential issues, optionally repair `gh` credentials and retry push.
2. If push still fails, use GitHub MCP `push_files` as last resort.
3. PR creation remains MCP-first by default.

```
1. Use `push_files` MCP tool: owner, repo, branch, files[], commitMessage
2. Use `create_pull_request` MCP tool: owner, repo, title, body, head, base
```

## ⚠️ Important

- **NEVER delegate these operations to a separate Task/agent** — execute directly from the coordinator.
- Delegating spawns a new model session (cold start overhead + risk of ProviderModelNotFoundError).
- Direct execution with MCP checks avoids silent auth failures and keeps PR creation deterministic.
