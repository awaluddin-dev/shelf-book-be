const { Pool } = require('pg');

// Use AIVEN_DATABASE_URL directly (before start.sh mangles DATABASE_URL with sslaccept)
const connectionString = process.env.AIVEN_DATABASE_URL || process.env.DATABASE_URL;

// Build SSL config exactly like prisma.service.ts does
let sslConfig = false;
if (process.env.DB_REQUIRE_SSL === 'true') {
  if (process.env.DATABASE_CA) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: Buffer.from(process.env.DATABASE_CA, 'base64').toString('utf-8'),
    };
    console.log('[fix-schema] Using DATABASE_CA for SSL');
  } else {
    sslConfig = { rejectUnauthorized: false };
    console.log('[fix-schema] Using SSL with rejectUnauthorized=false');
  }
} else {
  console.log('[fix-schema] SSL disabled (DB_REQUIRE_SSL != true)');
}

console.log('[fix-schema] Connecting to:', connectionString ? connectionString.split('@')[1]?.split('/')[0] : 'NO URL');

const pool = new Pool({
  connectionString: connectionString,
  ssl: sslConfig,
});

async function run() {
  try {
    const result = await pool.query(`
      ALTER TABLE "projects" 
      ADD COLUMN IF NOT EXISTS "reasonToBuild" TEXT,
      ADD COLUMN IF NOT EXISTS "problemSolved" TEXT;
    `);
    console.log('[fix-schema] SUCCESS: Columns ensured on projects table. Result:', result.command);
    
    // Verify columns actually exist now
    const check = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name IN ('reasonToBuild', 'problemSolved');
    `);
    console.log('[fix-schema] Verified columns:', check.rows.map(r => r.column_name));
  } catch (e) {
    console.error('[fix-schema] FAILED:', e.message);
    console.error('[fix-schema] Full error:', e);
  } finally {
    await pool.end();
  }
}
run();
