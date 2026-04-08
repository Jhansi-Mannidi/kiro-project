const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

async function getTempleRuns(req, res) {
  try {
    const result = await pool.query('SELECT * FROM temple_runs');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve temple runs' });
  }
}

async function getTempleRun(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM temple_runs WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Temple run not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve temple run' });
  }
}

async function createTempleRun(req, res) {
  try {
    const { name, description } = req.body;
    const result = await pool.query(`INSERT INTO temple_runs (name, description) VALUES ($1, $2) RETURNING *`, [name, description]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create temple run' });
  }
}

async function updateTempleRun(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query(`UPDATE temple_runs SET name = $1, description = $2 WHERE id = $3`, [name, description, id]);
    res.send({ message: 'Temple run updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update temple run' });
  }
}

async function deleteTempleRun(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM temple_runs WHERE id = $1`, [id]);
    res.send({ message: 'Temple run deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete temple run' });
  }
}

module.exports = {
  getTempleRuns,
  getTempleRun,
  createTempleRun,
  updateTempleRun,
  deleteTempleRun,
};