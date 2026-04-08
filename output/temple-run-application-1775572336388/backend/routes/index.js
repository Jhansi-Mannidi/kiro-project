const express = require('express');
const app = express();
const router = express.Router();

// Import route modules
const playerRoutes = require('./player');
const gameRoutes = require('./game');
const levelRoutes = require('./level');

// Mount routes
app.use('/api', router);
router.use('/players', playerRoutes);
router.use('/games', gameRoutes);
router.use('/levels', levelRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;