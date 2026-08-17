const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.controller.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src/features'));

const regex = /^\s*@ApiResponse\(\{\s*status:\s*401,\s*description:\s*'Unauthorized\.',\s*schema:\s*\{\s*example:\s*\{\s*statusCode:\s*401,\s*message:\s*'Unauthorized',\s*error:\s*'Unauthorized',\s*\},\s*\},\s*\}\)\s*$/gm;

let totalRemoved = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialLength = content.length;
  content = content.replace(regex, '');
  if (content.length !== initialLength) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    totalRemoved++;
  }
});

console.log(`Removed 401 ApiResponse duplicates in ${totalRemoved} files.`);
