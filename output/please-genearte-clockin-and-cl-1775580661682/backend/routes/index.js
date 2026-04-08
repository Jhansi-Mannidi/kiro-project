const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/clockins', require('./clockins'));
router.use('/clockouts', require('./clockouts'));

app.use('/', router);

module.exports = app;