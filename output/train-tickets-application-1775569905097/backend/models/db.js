const { Pool } = require('pg');

const dbConfig = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbConfig,
});

module.exports = pool;