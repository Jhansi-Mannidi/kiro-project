const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

const routes = require('./routes');

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});