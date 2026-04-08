const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/trains', require('./trainRoutes'));
router.use('/stations', require('./stationRoutes'));
router.use('/tickets', require('./ticketRoutes'));

app.use(express.json());
app.use(router);

module.exports = app;