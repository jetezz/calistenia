const fs = require('fs');
const files = [
  ".agents/agents/github-mcp-branch-pr.md",
  ".agents/agents/implement-task.md",
  ".agents/agents/task-generator.md",
  ".agents/skills/coordinador/SKILL.md",
  ".agents/skills/github-mcp-branch-pr/SKILL.md",
  ".agents/skills/implement-task/SKILL.md",
  ".agents/skills/task-generator/SKILL.md",
  "src/screens/client/Booking/BookingPage.tsx",
  "taskReadme/2026-03-03-solucionar-problema-en-app-book.md",
  "tests/client/booking.spec.ts"
];

const payload = files.map(path => {
  return {
    path: path,
    content: fs.readFileSync(path, 'utf8')
  };
});
fs.writeFileSync('files_payload.json', JSON.stringify(payload));
