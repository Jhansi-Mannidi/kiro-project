const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'swiggy_database',
  password: 'your_password',
  port: 5432,
});

async function getRestaurants(req, res) {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching restaurants' });
  }
}

async function getRestaurant(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM restaurants WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Restaurant not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching restaurant' });
  }
}

async function createRestaurant(req, res) {
  try {
    const { name, location } = req.body;
    const result = await pool.query(`INSERT INTO restaurants (name, location) VALUES ($1, $2) RETURNING *`, [name, location]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating restaurant' });
  }
}

async function updateRestaurant(req, res) {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    await pool.query(`UPDATE restaurants SET name = $1, location = $2 WHERE id = $3`, [name, location, id]);
    res.send({ message: 'Restaurant updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating restaurant' });
  }
}

async function deleteRestaurant(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM restaurants WHERE id = $1`, [id]);
    res.send({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting restaurant' });
  }
}

module.exports = {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};