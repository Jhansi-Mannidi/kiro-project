const db = require('../models/index');
const { validationResult } = require('express-validator');

class MainController {
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await db.User.findOne({
        where: { email: req.body.email },
      });

      if (!user || !await user.comparePassword(req.body.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = await user.generateToken();
      res.json({ token, user: user.toJSON() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async logout(req, res) {
    try {
      req.user.destroy();
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.User.findAll({
        attributes: ['id', 'email'],
      });
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getUser(req, res) {
    try {
      const user = await db.User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.toJSON());
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createUser(req, res) {
    try {
      const user = await db.User.create(req.body);
      res.json(user.toJSON());
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid request' });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await db.User.update(req.body, {
        where: { id: req.params.id },
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user[1]);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid request' });
    }
  }

  async deleteUser(req, res) {
    try {
      await db.User.destroy({
        where: { id: req.params.id },
      });
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = MainController;