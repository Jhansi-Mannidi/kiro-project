const db = require('../models/index');
const { validationResult } = require('express-validator');

class MainController {
  async getMovies(req, res) {
    try {
      const movies = await db.Movie.findAll();
      return res.json(movies);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getMovie(req, res) {
    try {
      const movieId = req.params.id;
      const movie = await db.Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      return res.json(movie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createMovie(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const movie = await db.Movie.create(req.body);
      return res.json(movie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateMovie(req, res) {
    try {
      const movieId = req.params.id;
      const movie = await db.Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      await db.Movie.update(req.body, { where: { id: movieId } });
      return res.json({ message: 'Movie updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteMovie(req, res) {
    try {
      const movieId = req.params.id;
      await db.Movie.destroy({ where: { id: movieId } });
      return res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getShowtimes(req, res) {
    try {
      const showtimes = await db.Showtime.findAll();
      return res.json(showtimes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getShowtime(req, res) {
    try {
      const showtimeId = req.params.id;
      const showtime = await db.Showtime.findByPk(showtimeId);
      if (!showtime) {
        return res.status(404).json({ message: 'Showtime not found' });
      }
      return res.json(showtime);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createShowtime(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const showtime = await db.Showtime.create(req.body);
      return res.json(showtime);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateShowtime(req, res) {
    try {
      const showtimeId = req.params.id;
      const showtime = await db.Showtime.findByPk(showtimeId);
      if (!showtime) {
        return res.status(404).json({ message: 'Showtime not found' });
      }
      await db.Showtime.update(req.body, { where: { id: showtimeId } });
      return res.json({ message: 'Showtime updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteShowtime(req, res) {
    try {
      const showtimeId = req.params.id;
      await db.Showtime.destroy({ where: { id: showtimeId } });
      return res.json({ message: 'Showtime deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getTickets(req, res) {
    try {
      const tickets = await db.Ticket.findAll();
      return res.json(tickets);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getTicket(req, res) {
    try {
      const ticketId = req.params.id;
      const ticket = await db.Ticket.findByPk(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      return res.json(ticket);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createTicket(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const ticket = await db.Ticket.create(req.body);
      return res.json(ticket);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateTicket(req, res) {
    try {
      const ticketId = req.params.id;
      const ticket = await db.Ticket.findByPk(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      await db.Ticket.update(req.body, { where: { id: ticketId } });
      return res.json({ message: 'Ticket updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteTicket(req, res) {
    try {
      const ticketId = req.params.id;
      await db.Ticket.destroy({ where: { id: ticketId } });
      return res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = MainController;