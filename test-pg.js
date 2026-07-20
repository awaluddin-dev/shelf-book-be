const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace('?sslmode=disable', ''),
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT 1').then(res => {
  console.log("Success:", res.rows);
  pool.end();
}).catch(err => {
  console.error("Error:", err);
  pool.end();
});
