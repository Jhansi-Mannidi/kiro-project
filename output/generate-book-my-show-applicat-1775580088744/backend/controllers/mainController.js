const db = require('../models/index');
const { validationResult } = require('express-validator');

class MainController {
  async getShows(req, res) {
    try {
      const shows = await db.Show.findAll();
      res.json(shows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching shows' });
    }
  }

  async getShow(req, res) {
    try {
      const showId = req.params.id;
      const show = await db.Show.findByPk(showId);
      if (!show) {
        return res.status(404).json({ message: 'Show not found' });
      }
      res.json(show);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching show' });
    }
  }

  async createShow(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newShow = await db.Show.create(req.body);
      res.json(newShow);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating show' });
    }
  }

  async updateShow(req, res) {
    try {
      const showId = req.params.id;
      const show = await db.Show.findByPk(showId);
      if (!show) {
        return res.status(404).json({ message: 'Show not found' });
      }
      await show.update(req.body);
      res.json(show);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating show' });
    }
  }

  async deleteShow(req, res) {
    try {
      const showId = req.params.id;
      await db.Show.destroy({ where: { id: showId } });
      res.json({ message: 'Show deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting show' });
    }
  }

  async getVenues(req, res) {
    try {
      const venues = await db.Venue.findAll();
      res.json(venues);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching venues' });
    }
  }

  async getVenue(req, res) {
    try {
      const venueId = req.params.id;
      const venue = await db.Venue.findByPk(venueId);
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
      res.json(venue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching venue' });
    }
  }

  async createVenue(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newVenue = await db.Venue.create(req.body);
      res.json(newVenue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating venue' });
    }
  }

  async updateVenue(req, res) {
    try {
      const venueId = req.params.id;
      const venue = await db.Venue.findByPk(venueId);
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
      await venue.update(req.body);
      res.json(venue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating venue' });
    }
  }

  async deleteVenue(req, res) {
    try {
      const venueId = req.params.id;
      await db.Venue.destroy({ where: { id: venueId } });
      res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting venue' });
    }
  }

  async getEvents(req, res) {
    try {
      const events = await db.Event.findAll();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  }

  async getEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await db.Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching event' });
    }
  }

  async createEvent(req, res) {
    try {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newEvent = await db.Event.create(req.body);
      res.json(newEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating event' });
    }
  }

  async updateEvent(req, res) {
    try {
      const eventId = req.params.id;
      const event = await db.Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      await event.update(req.body);
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event' });
    }
  }

  async deleteEvent(req, res) {
    try {
      const eventId = req.params.id;
      await db.Event.destroy({ where: { id: eventId } });
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  }
}

module.exports = MainController;