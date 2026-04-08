const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));

app.use(express.json());
app.use(router);

module.exports = app;