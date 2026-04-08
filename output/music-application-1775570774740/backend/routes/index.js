const express = require('express');
const app = express();
const router = express.Router();

// Mount route modules
router.use('/artists', require('./artist'));
router.use('/albums', require('./album'));
router.use('/tracks', require('./track'));

app.use(express.json());
app.use(router);

module.exports = app;