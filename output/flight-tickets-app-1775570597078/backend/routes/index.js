const express = require('express');
const app = express();
const router = express.Router();

router.use('/flights', require('./flights'));
router.use('/airlines', require('./airlines'));
router.use('/bookings', require('./bookings'));

app.use(express.json());
app.use(router);

module.exports = app;