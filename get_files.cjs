const fs = require('fs');
const files = [
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
