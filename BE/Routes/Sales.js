const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import pool dari server.js

// Route untuk mengambil data sales
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// Tambahkan route lain untuk sales jika diperlukan (misal: POST, PUT, DELETE)

module.exports = router;