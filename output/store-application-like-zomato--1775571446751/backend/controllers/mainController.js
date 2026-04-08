const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

async function getStores(req, res) {
  try {
    const result = await pool.query('SELECT * FROM stores');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching stores' });
  }
}

async function getStore(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM stores WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Store not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching store' });
  }
}

async function createStore(req, res) {
  try {
    const { name, address, rating } = req.body;
    await pool.query(`INSERT INTO stores (name, address, rating) VALUES ($1, $2, $3) RETURNING *`, [name, address, rating]);
    res.status(201).send({ message: 'Store created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating store' });
  }
}

async function updateStore(req, res) {
  try {
    const { id } = req.params;
    const { name, address, rating } = req.body;
    await pool.query(`UPDATE stores SET name = $1, address = $2, rating = $3 WHERE id = $4`, [name, address, rating, id]);
    res.status(200).send({ message: 'Store updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating store' });
  }
}

async function deleteStore(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM stores WHERE id = $1`, [id]);
    res.status(200).send({ message: 'Store deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting store' });
  }
}

module.exports = {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
};