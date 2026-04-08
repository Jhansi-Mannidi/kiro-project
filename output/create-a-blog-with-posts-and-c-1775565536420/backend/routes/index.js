const express = require('express');
const app = express();
const router = express.Router();

// Mount routes
router.use('/posts', require('./post'));
router.use('/comments', require('./comment'));

app.use('/', router);

module.exports = app;