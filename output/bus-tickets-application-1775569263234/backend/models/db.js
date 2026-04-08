const { Pool } = require('pg');
const config = process.env;

const dbPool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: parseInt(config.DB_PORT, 10),
});

module.exports = dbPool;