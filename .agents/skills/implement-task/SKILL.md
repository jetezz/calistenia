---
name: implement-task
description: Orchestrate parallel task execution by delegating to implement-task agents via Task sessions.
---

# Implementation Workflow

Delegate coding work to `implement-task` agents via parallel `Task` sessions. Never write code in the coordinator session.

## Steps

1. Read `taskReadme/YYYY-MM-DD-[task-name].md` and analyze the plan.
2. Group independent tasks for parallel execution (look for "Parallelizable: Yes").
3. For each group, launch a `Task`:

```json
{
  "agent": "implement-task",
  "prompt": "Implement: [task details including file paths and specific changes]. DO NOT build, start servers, or install dependencies."
}
```

4. Wait for all tasks in the group to complete before starting the next group.
5. Review changes and verify requirements are met.

## Rules

- Only launch tasks from the SAME parallel group simultaneously.
- Sequential tasks must wait for their dependencies to complete first.
- Each Task prompt must include the specific file paths and context from the plan.
