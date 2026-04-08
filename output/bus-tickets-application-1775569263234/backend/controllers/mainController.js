const db = require('../models');
const { validationResult } = require('express-validator');

exports.getTickets = async (req, res) => {
  try {
    const tickets = await db.Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await db.Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map(error => error.msg) });
    }

    const { departureTime, arrivalTime, price } = req.body;
    const newTicket = await db.Ticket.create({
      departureTime,
      arrivalTime,
      price
    });

    res.json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map(error => error.msg) });
    }

    const { departureTime, arrivalTime, price } = req.body;
    const updatedTicket = await db.Ticket.update({
      departureTime,
      arrivalTime,
      price
    }, {
      where: { id: ticketId }
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    await db.Ticket.destroy({
      where: { id: ticketId }
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};