const { Pool } = require('pg');
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'ecommerce',
  password: 'password',
  port: 5432,
});

async function getAllProducts(req, res) {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve products' });
  }
}

async function getProductById(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM products WHERE product_id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Product not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve product' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, category } = req.body;
    await pool.query(`INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *`, [name, description, price, category]);
    res.status(201).send({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const { name, description, price, category } = req.body;
    await pool.query(`UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE product_id = $5`, [name, description, price, category, id]);
    res.status(200).send({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      res.status(404).send({ message: 'Product not found' });
    } else {
      res.status(500).send({ message: 'Failed to update product' });
    }
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    await pool.query(`DELETE FROM products WHERE product_id = $1`, [id]);
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      res.status(404).send({ message: 'Product not found' });
    } else {
      res.status(500).send({ message: 'Failed to delete product' });
    }
  }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };