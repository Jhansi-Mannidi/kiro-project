const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/businesses', require('./businesses'));
router.use('/reviews', require('./reviews'));

app.use(express.json());
app.use(router);

module.exports = app;