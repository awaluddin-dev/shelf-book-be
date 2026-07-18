const fs = require('fs');
let content = fs.readFileSync('prisma/seed.ts', 'utf8');

// The projects array is a variable assignment. We can find the start of the array and the end.
// Alternatively, since we know exactly which objects to remove based on their IDs, we can use regex or just string manipulation.
// It's safer to just replace everything from `{ id: 'sera-migration'` to the end of that object, etc.

content = content.replace(/,\s*\{\s*id:\s*'sera-migration'[\s\S]*?(?=\s*\{\s*id:\s*'ledgerflow')/, '');
content = content.replace(/,\s*\{\s*id:\s*'telkomsel-iot'[\s\S]*?(?=\s*\];)/, '');

fs.writeFileSync('prisma/seed.ts', content);
console.log("Replaced successfully");
