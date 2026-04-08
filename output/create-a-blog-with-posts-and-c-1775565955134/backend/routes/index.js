const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/posts', require('./post'));
router.use('/comments', require('./comment'));

app.use('/api/v1', router);

module.exports = app;