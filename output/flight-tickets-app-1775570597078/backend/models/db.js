const { Pool } = require('pg');
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const dbConfig = new URL(DATABASE_URL);
const username = dbConfig.username;
const password = dbConfig.password;
const host = dbConfig.host;
const port = dbConfig.port;
const database = dbConfig.pathname.replace(/^\/+/, '');

const pool = new Pool({
  user: username,
  password,
  host,
  port,
  database,
});

module.exports = pool;