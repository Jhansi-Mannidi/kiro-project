const db = require('../models/index');
const { validationResult } = require('express-validator');

exports.getTickets = async (req, res) => {
  try {
    const tickets = await db.Ticket.findAll();
    res.status(200).json(tickets);
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
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newTicket = await db.Ticket.create(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await db.Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    await ticket.update(req.body);
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    await db.Ticket.destroy({ where: { id: ticketId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};