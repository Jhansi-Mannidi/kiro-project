const db = require('../models/index');
const { validationResult } = require('express-validator');

exports.getBooks = async (req, res) => {
  try {
    const books = await db.Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await db.Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, price } = req.body;
    await db.Book.create({ title, author, price });
    res.json({ message: 'Book created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating book' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookId = req.params.id;
    const { title, author, price } = req.body;
    await db.Book.update({ title, author, price }, { where: { id: bookId } });
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.Book.destroy({ where: { id: bookId } });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};