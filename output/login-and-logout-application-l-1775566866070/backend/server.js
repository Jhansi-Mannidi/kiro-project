const express = require('express');
const cors = require('cors');
const json = require('body-parser').json;
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(json());

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const error = new Error('Internal Server Error');
  error.status = 500;
  res.status(500).send({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});