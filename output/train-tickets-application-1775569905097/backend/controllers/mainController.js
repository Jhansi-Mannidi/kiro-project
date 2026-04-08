const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

async function getTrainTickets(req, res) {
  try {
    const result = await pool.query('SELECT * FROM train_tickets');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching train tickets' });
  }
}

async function getTrainTicket(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM train_tickets WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Train ticket not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching train ticket' });
  }
}

async function createTrainTicket(req, res) {
  try {
    const { train_number, departure_time, arrival_time, price } = req.body;
    await pool.query(`INSERT INTO train_tickets (train_number, departure_time, arrival_time, price)
      VALUES ($1, $2, $3, $4) RETURNING *`, [train_number, departure_time, arrival_time, price]);
    res.status(201).send({ message: 'Train ticket created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating train ticket' });
  }
}

async function updateTrainTicket(req, res) {
  try {
    const { id } = req.params;
    const { train_number, departure_time, arrival_time, price } = req.body;
    await pool.query(`UPDATE train_tickets SET train_number = $1, departure_time = $2, 
      arrival_time = $3, price = $4 WHERE id = $5`, [train_number, departure_time, arrival_time, price, id]);
    res.status(200).send({ message: 'Train ticket updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating train ticket' });
  }
}

async function deleteTrainTicket(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM train_tickets WHERE id = $1`, [id]);
    res.status(200).send({ message: 'Train ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting train ticket' });
  }
}

module.exports = {
  getTrainTickets,
  getTrainTicket,
  createTrainTicket,
  updateTrainTicket,
  deleteTrainTicket,
};