const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import koneksi database

// GET /api/inventoris
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventoris');
    console.log("Hasil query:", result.rows); // Menampilkan hasil query di console
    res.json(result.rows); // Mengirimkan data ke frontend
  } catch (error) {
    console.error('Error fetching inventoris data:', error);
    res.status(500).json({ error: 'Failed to fetch inventoris data' });
  }
});

// PATCH /api/inventoris/:kode_produk
router.patch('/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk; // Mengambil kode_produk dari URL
  const { quantity } = req.body; // Mengambil quantity dari body request

  // Memastikan quantity yang diterima adalah angka
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity tidak valid' });
  }

  try {
    // Logika untuk memperbarui quantity di database
    const result = await pool.query(
      'UPDATE inventoris SET quantity = quantity + $1 WHERE kode_produk = $2 RETURNING *',
      [quantity, kodeProduk]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]); // Mengembalikan produk yang telah diperbarui
  } catch (error) {
    console.error('Error updating quantity:', error); // Log error ke console
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Kembalikan error detail
  }
});

module.exports = router;

