const { Pool } = require('pg');
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const dbPool = new Pool({
  connectionString: DATABASE_URL,
});

module.exports = dbPool;