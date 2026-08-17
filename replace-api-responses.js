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

// The exact multi-line string block to replace (60+ lines)
const regex = /^\s*@ApiResponse\(\{\s*status:\s*400[\s\S]*?status:\s*500[\s\S]*?\}\)\s*$/gm;

// Only match if it actually contains the 400 to 500 block sequentially. 
// A safer regex for the exact boilerplate:
const exactRegex = /@ApiResponse\(\{\s*status: 400,[\s\S]*?status: 500,\s*description: 'Internal Server Error',\s*schema: \{ example: \{ statusCode: 500, message: 'Internal server error' \} \},\s*\}\)/g;

let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (exactRegex.test(content)) {
    content = content.replace(exactRegex, '@ApiGlobalResponses()');
    
    // add import if not present
    if (!content.includes('ApiGlobalResponses')) {
      // Find the last import
      const importMatch = content.match(/import .* from '.*';/g);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        // Ensure relative path to src/common/decorators/api-global-responses.decorator
        content = content.replace(lastImport, `${lastImport}\nimport { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';`);
      }
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    totalReplaced++;
  }
});

console.log(`Replaced massive ApiResponse blocks in ${totalReplaced} files.`);
