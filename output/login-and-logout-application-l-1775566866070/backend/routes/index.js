const express = require('express');
const app = express();
const router = express.Router();

router.use('/users', require('./user'));
router.use('/sessions', require('./session'));

app.use(express.json());
app.use(router);

module.exports = app;