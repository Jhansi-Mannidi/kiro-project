const express = require('express');
const router = express.Router();

router.use('/movies', require('./movieRoutes'));
router.use('/theaters', require('./theaterRoutes'));
router.use('/seats', require('./seatRoutes'));

module.exports = router;
