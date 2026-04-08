const express = require('express');
const router = express.Router();
const productRouter = require('./product');
const categoryRouter = require('./category');

router.use('/products', productRouter);
router.use('/categories', categoryRouter);

module.exports = router;