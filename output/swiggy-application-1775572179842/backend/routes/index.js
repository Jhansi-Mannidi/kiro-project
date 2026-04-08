const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/users', require('./user'));
router.use('/orders', require('./order'));
router.use('/restaurants', require('./restaurant'));

app.use(express.json());
app.use(router);

module.exports = app;