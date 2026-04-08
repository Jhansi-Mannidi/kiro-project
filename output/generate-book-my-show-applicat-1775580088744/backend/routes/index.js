const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json());
app.use('/api', router);

router.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

router.use('/shows', require('./routes/shows'));
router.use('/theaters', require('./routes/theaters'));
router.use('/movies', require('./routes/movies'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});