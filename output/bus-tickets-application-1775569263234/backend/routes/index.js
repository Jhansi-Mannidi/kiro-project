const express = require('express');
const router = express.Router();
const { busTicketRouter } = require('./busTickets');

router.use('/bus-tickets', busTicketRouter);

module.exports = router;