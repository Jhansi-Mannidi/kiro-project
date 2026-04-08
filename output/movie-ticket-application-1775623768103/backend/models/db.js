const { Pool } = require('pg');
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

module.exports = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});