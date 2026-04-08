const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

async function getFlights(req, res) {
  try {
    const result = await pool.query('SELECT * FROM flights');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching flights' });
  }
}

async function getFlight(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM flights WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Flight not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching flight' });
  }
}

async function createFlight(req, res) {
  try {
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, price } = req.body;
    const result = await pool.query(
      `INSERT INTO flights (departure_airport, arrival_airport, departure_time, arrival_time, price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [departureAirport, arrivalAirport, departureTime, arrivalTime, price]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating flight' });
  }
}

async function updateFlight(req, res) {
  try {
    const { id } = req.params;
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, price } = req.body;
    const result = await pool.query(
      `UPDATE flights SET departure_airport = $1, arrival_airport = $2, departure_time = $3, arrival_time = $4, price = $5 WHERE id = $6 RETURNING *`,
      [departureAirport, arrivalAirport, departureTime, arrivalTime, price, id]
    );
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Flight not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating flight' });
  }
}

async function deleteFlight(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM flights WHERE id = $1`, [id]);
    res.send({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting flight' });
  }
}

module.exports = {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
};