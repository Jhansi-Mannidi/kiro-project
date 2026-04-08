const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: dbUrl,
});

module.exports = pool;