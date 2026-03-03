---
name: E2E-task-calistenia
description: Run end-to-end validation for implemented tasks in the calistenia project. Use this skill whenever a task has just been implemented and needs to be tested before closing, when the user says "prueba la tarea", "valida el desarrollo", "testea la funcionalidad", "E2E", or when the coordinador workflow has completed Phase 3. This skill starts the test server, uses the Playwright MCP browser to validate the feature manually, fixes any issues found, then documents the results and pushes a final commit.
---

# E2E Task Validator — calistenia

This skill validates a completed development task by interacting with the running app through the browser, fixing any regressions, documenting what was tested, and committing/pushing the final result.

## Context you need before starting

Locate the task file at `taskReadme/YYYY-MM-DD-[task-name].md`.  
Read it to understand:

- **What was implemented** (Descripción + Plan de Implementación)
- **Acceptance criteria** (Criterios de Aceptación) — these are your test targets
- **Current branch** — read `branch_name` from the frontmatter

```bash
# Confirm current branch matches the task
git branch --show-current
```

## Credentials (from .env.test)

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@gmail.com   | 123456   |
| Client| client@gmail.com  | 123456   |

The app URL when running with `start:test` is: **http://localhost:5173**

---

## Phase 1 — Start the test server

Run the development server in test mode as a background process:

```bash
pnpm run start:test
```

Wait ~5 seconds for Vite to finish compiling. The app will be available at `http://localhost:5173`.

> If the port is already in use, kill the occupying process first:
> ```bash
> npx kill-port 5173
> pnpm run start:test
> ```

---

## Phase 2 — Test in the browser via Playwright MCP

Use the Playwright MCP browser tools to navigate and interact with the app.
Your goal is to verify **each acceptance criterion** from the task file.

### Standard login flows

**Login as Client:**
1. Navigate to `http://localhost:5173`
2. Click on the login/access button if on the landing page
3. Fill in `client@gmail.com` and `123456`
4. Submit and confirm redirection to `/app/*`

**Login as Admin:**
1. Navigate to `http://localhost:5173`
2. Login with `admin@gmail.com` and `123456`
3. Confirm redirection to `/admin/*`

### Testing approach

Work through each acceptance criterion **one at a time**:

1. Take a browser snapshot to see the current state
2. Interact with the relevant UI element (click, fill, navigate)
3. Take another snapshot to verify the result
4. Mark the criterion as PASS or FAIL

For each criterion, document:
- What you clicked / filled / navigated to
- What you observed in the snapshot
- Whether it matches the expected behavior

### Common interactions to use

```
browser_navigate → go to a URL
browser_click → click a button/link by ref
browser_snapshot → capture the accessibility tree (PREFER over screenshots)
browser_type → type into an input
browser_select_option → choose from a dropdown
```

---

## Phase 3 — Fix and retest (if failures found)

If any acceptance criterion fails:

1. **Stop the server** (or leave it running — Vite hot-reloads)
2. **Identify the root cause** from the snapshot and the source code
3. **Apply the fix** to the relevant file(s)
4. **Retest** — go back to Phase 2 and re-verify the failing criterion
5. **Repeat** until all criteria pass

Keep fixes minimal and targeted. Do not refactor unrelated code.

---

## Phase 4 — Document test results in the task file

Once all acceptance criteria pass, append a `## Resultados de Pruebas E2E` section to the task `.md` file:

```markdown
## Resultados de Pruebas E2E

**Fecha:** YYYY-MM-DD  
**Rama:** feature/YYYY-MM-DD-[task-name]  
**Resultado:** ✅ Todos los criterios pasaron

### Pruebas realizadas

| Criterio | Acción realizada | Resultado |
|----------|-----------------|-----------|
| [Criterio 1 del .md] | [Lo que hiciste en el browser] | ✅ Pasa |
| [Criterio 2 del .md] | [Lo que hiciste en el browser] | ✅ Pasa |

### Notas
[Any relevant observations, edge cases noticed, or things left for future improvement]
```

Also update the frontmatter `updated` timestamp:

```bash
sed -i 's/^updated: .*/updated: '"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'/' "taskReadme/TASK_NAME.md"
```

---

## Phase 5 — Commit and push

Stage all changes (code fixes + updated task file) and push to the task branch:

```bash
# 1. Stop the dev server if still running (optional — Ctrl+C or kill-port)

# 2. Stage everything
git add -A

# 3. Commit (only if there are changes)
if git diff --cached --quiet; then
  echo "Nothing new to commit"
else
  git commit -m "test(e2e): validate task and document results

All acceptance criteria verified via Playwright MCP browser testing.
See taskReadme/TASK_NAME.md for detailed test results."

  # 4. Push to the current branch
  BRANCH=$(git branch --show-current)
  git push origin "$BRANCH"
  echo "✅ Pushed to $BRANCH"
fi
```

If `git push` fails due to credential issues:

```bash
gh auth setup-git
git push origin "$BRANCH"
```

---

## Status summary checklist

Before finishing, confirm:

- [ ] Server started and app loaded in browser
- [ ] All acceptance criteria tested in the browser (one by one)
- [ ] Any failures were fixed and retested until passing
- [ ] `## Resultados de Pruebas E2E` section added to the task `.md`
- [ ] Commit created with fix + documentation
- [ ] Pushed to the task feature branch

---

## Tips

- **Always use `browser_snapshot`** before clicking — references (refs) change between snapshots, don't reuse stale refs.
- If the app shows a loading spinner for too long, wait and re-snapshot.
- Test both happy path AND edge cases mentioned in "Riesgos y Notas" of the task file.
- If the task requires admin-only flows, test as admin. If it requires client flows, test as client. Some tasks need both.
- The app uses Supabase as backend — changes are real, so clean up test data if needed (e.g., cancel any test bookings made during testing).
