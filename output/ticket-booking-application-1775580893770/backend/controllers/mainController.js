const db = require('../models/index');
const { validationResult } = require('express-validator');

class MainController {
  async getTickets(req, res) {
    try {
      const tickets = await db.Ticket.findAll();
      res.json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getTicket(req, res) {
    try {
      const { id } = req.params;
      const ticket = await db.Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createTicket(req, res) {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map((error) => error.msg) });
      }
      const { title, description } = req.body;
      const ticket = await db.Ticket.create({ title, description });
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const ticket = await db.Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map((error) => error.msg) });
      }
      const { title, description } = req.body;
      await ticket.update({ title, description });
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteTicket(req, res) {
    try {
      const { id } = req.params;
      const ticket = await db.Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      await ticket.destroy();
      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = MainController;