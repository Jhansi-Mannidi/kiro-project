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
    const result = await pool.query(`SELECT * FROM stores`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve stores' });
  }
}

async function getStore(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM stores WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Store not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve store' });
  }
}

async function createStore(req, res) {
  try {
    const { name, address } = req.body;
    const result = await pool.query(`INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *`, [name, address]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create store' });
  }
}

async function updateStore(req, res) {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    await pool.query(`UPDATE stores SET name = $1, address = $2 WHERE id = $3`, [name, address, id]);
    res.json({ message: 'Store updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update store' });
  }
}

async function deleteStore(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM stores WHERE id = $1`, [id]);
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete store' });
  }
}

module.exports = {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
};