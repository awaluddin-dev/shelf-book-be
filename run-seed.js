const fs = require('fs');
const { execSync } = require('child_process');

if (fs.existsSync('./dist/prisma/seed.js')) {
  console.log('Running compiled seed...');
  execSync('node ./dist/prisma/seed.js', { stdio: 'inherit' });
} else {
  console.log('Running typescript seed...');
  execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
}
