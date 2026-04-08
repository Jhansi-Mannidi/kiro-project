const express = require('express');
const cors = require('cors');
const jsonParser = express.json();
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(jsonParser);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});