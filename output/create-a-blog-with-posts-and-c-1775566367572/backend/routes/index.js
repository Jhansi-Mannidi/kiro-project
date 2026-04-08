const express = require('express');
const app = express();
const router = express.Router();

app.use('/api', router);

router.use('/posts', require('./postRoutes'));
router.use('/comments', require('./commentRoutes'));

module.exports = app;