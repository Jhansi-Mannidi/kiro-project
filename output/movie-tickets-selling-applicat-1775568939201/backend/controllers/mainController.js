const db = require('../models');
const { validationResult } = require('express-validator');

exports.getMovies = async (req, res) => {
  try {
    const movies = await db.Movie.findAll();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await db.Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const movie = await db.Movie.create({ title, description });
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const movie = await db.Movie.update({ title, description }, { where: { id: movieId } });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await db.Movie.destroy({ where: { id: movieId } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};