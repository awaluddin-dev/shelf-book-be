const { spawnSync } = require('child_process');
require('dotenv').config();

// Meneruskan environment variables (termasuk yang diload dari .env) ke proses sonar-scanner
const result = spawnSync('npx', ['sonar-scanner-npm'], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

if (result.error) {
  console.error('Gagal menjalankan Sonar Scanner:', result.error);
  process.exit(1);
}

process.exit(result.status);
