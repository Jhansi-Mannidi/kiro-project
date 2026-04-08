const { Pool } = require('pg');
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'clockin_out',
  password: 'password',
  port: 5432,
});

async function getAllClockIns(req, res) {
  try {
    const result = await pool.query('SELECT * FROM clock_ins');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve clock ins' });
  }
}

async function getClockIn(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM clock_ins WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Clock in not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve clock in' });
  }
}

async function createClockIn(req, res) {
  try {
    const { employeeId, timestamp } = req.body;
    await pool.query(`INSERT INTO clock_ins (employee_id, timestamp) VALUES ($1, $2) RETURNING *`, [employeeId, timestamp]);
    res.json({ message: 'Clock in created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create clock in' });
  }
}

async function updateClockIn(req, res) {
  try {
    const { id } = req.params;
    const { employeeId, timestamp } = req.body;
    await pool.query(`UPDATE clock_ins SET employee_id = $1, timestamp = $2 WHERE id = $3`, [employeeId, timestamp, id]);
    res.json({ message: 'Clock in updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update clock in' });
  }
}

async function deleteClockIn(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM clock_ins WHERE id = $1`, [id]);
    res.json({ message: 'Clock in deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete clock in' });
  }
}

async function getAllClockOuts(req, res) {
  try {
    const result = await pool.query('SELECT * FROM clock_outs');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve clock outs' });
  }
}

async function getClockOut(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM clock_outs WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Clock out not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve clock out' });
  }
}

async function createClockOut(req, res) {
  try {
    const { employeeId, timestamp } = req.body;
    await pool.query(`INSERT INTO clock_outs (employee_id, timestamp) VALUES ($1, $2) RETURNING *`, [employeeId, timestamp]);
    res.json({ message: 'Clock out created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create clock out' });
  }
}

async function updateClockOut(req, res) {
  try {
    const { id } = req.params;
    const { employeeId, timestamp } = req.body;
    await pool.query(`UPDATE clock_outs SET employee_id = $1, timestamp = $2 WHERE id = $3`, [employeeId, timestamp, id]);
    res.json({ message: 'Clock out updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update clock out' });
  }
}

async function deleteClockOut(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM clock_outs WHERE id = $1`, [id]);
    res.json({ message: 'Clock out deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete clock out' });
  }
}

module.exports = {
  getAllClockIns,
  getClockIn,
  createClockIn,
  updateClockIn,
  deleteClockIn,
  getAllClockOuts,
  getClockOut,
  createClockOut,
  updateClockOut,
  deleteClockOut,
};