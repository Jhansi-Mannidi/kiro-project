const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/products', require('./product'));
router.use('/categories', require('./category'));

app.use(express.json());
app.use(router);

module.exports = app;