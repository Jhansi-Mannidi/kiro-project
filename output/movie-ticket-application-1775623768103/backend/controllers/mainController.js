const db = require('../models/index');
const { validationResult } = require('express-validator');

exports.getMovies = async (req, res) => {
  try {
    const movies = await db.Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await db.Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const movie = await db.Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await db.Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).send({ message: 'Movie not found' });
    }
    await db.Movie.update(req.body, { where: { id: movieId } });
    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await db.Movie.destroy({ where: { id: movieId } });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};