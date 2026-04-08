const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const routes = require('./routes');

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});