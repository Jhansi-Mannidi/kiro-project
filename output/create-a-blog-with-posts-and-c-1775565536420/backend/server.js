const express = require('express');
const cors = require('cors');
const jsonParser = express.json();
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(jsonParser);

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = { app };