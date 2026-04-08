const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/movies', require('./movieRoutes'));
router.use('/screens', require('./screenRoutes'));
router.use('/shows', require('./showRoutes'));
router.use('/bookings', require('./bookingRoutes'));

app.use(express.json());
app.use(router);

module.exports = app;