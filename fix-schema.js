const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
async function run() {
  try {
    await pool.query('ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reasonToBuild" TEXT, ADD COLUMN IF NOT EXISTS "problemSolved" TEXT;');
    console.log("Successfully ensured missing columns exist.");
  } catch (e) {
    console.error("Failed to alter table:", e.message);
  } finally {
    await pool.end();
  }
}
run();
