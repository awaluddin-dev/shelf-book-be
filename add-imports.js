const fs = require('fs');
const path = require('path');

const files = [
  'src/features/ai/ai.controller.ts',
  'src/features/ai/chat/chat.controller.ts',
  'src/features/ai/cover-letter/cover-letter.controller.ts',
  'src/features/auth/login/login.controller.ts',
  'src/features/auth/refresh-token/refresh-token.controller.ts',
  'src/features/auth/register/register.controller.ts',
  'src/features/contact/contact.controller.ts',
  'src/features/github/github.controller.ts',
  'src/features/portfolio/experience/experience.controller.ts',
  'src/features/portfolio/hero/hero.controller.ts',
  'src/features/portfolio/projects/projects.controller.ts',
  'src/features/portfolio/skills/skills.controller.ts'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('ApiGlobalResponses')) {
    // This shouldn't happen based on the TS errors, but just in case
    return;
  }
  if (!content.includes("from 'src/common/decorators/api-global-responses.decorator'")) {
    const importStr = "import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';\n";
    content = importStr + content;
    fs.writeFileSync(fullPath, content);
    console.log(`Added import to ${file}`);
  }
});
