const { Pool } = require('pg');
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'clockin_clockout',
  password: 'password',
  port: 5432,
});

async function getAllClockins(req, res) {
  try {
    const result = await pool.query('SELECT * FROM clockins');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching all clockins' });
  }
}

async function getClockin(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM clockins WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Clockin not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching clockin' });
  }
}

async function createClockin(req, res) {
  try {
    const { employeeId, clockedInAt, clockedOutAt } = req.body;
    await pool.query(`INSERT INTO clockins (employee_id, clocked_in_at, clocked_out_at) VALUES ($1, $2, $3) RETURNING *`, [employeeId, clockedInAt, clockedOutAt]);
    res.status(201).send({ message: 'Clockin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating clockin' });
  }
}

async function updateClockin(req, res) {
  try {
    const { id } = req.params;
    const { employeeId, clockedInAt, clockedOutAt } = req.body;
    await pool.query(`UPDATE clockins SET employee_id = $1, clocked_in_at = $2, clocked_out_at = $3 WHERE id = $4`, [employeeId, clockedInAt, clockedOutAt, id]);
    res.status(200).send({ message: 'Clockin updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating clockin' });
  }
}

async function deleteClockin(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM clockins WHERE id = $1`, [id]);
    res.status(200).send({ message: 'Clockin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting clockin' });
  }
}

module.exports = { getAllClockins, getClockin, createClockin, updateClockin, deleteClockin };