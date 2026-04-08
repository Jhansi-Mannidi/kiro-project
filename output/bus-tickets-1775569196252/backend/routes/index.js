const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/bus-tickets', require('./routes/busTickets'));

app.use(express.json());
app.use(router);

module.exports = app;