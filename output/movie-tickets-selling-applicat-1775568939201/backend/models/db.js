const { Pool } = require('pg');

const dbConfig = process.env.DATABASE_URL;

if (!dbConfig) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: dbConfig,
});

module.exports = pool;