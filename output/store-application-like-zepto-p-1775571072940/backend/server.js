const express = require('express');
const cors = require('cors');
const json = require('body-parser').json;
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(json());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});