const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import koneksi database

// GET /api/inventoris - Mendapatkan semua data inventaris
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventoris ORDER BY kode_produk ASC'); // Menjaga urutan kode_produk
    console.log("Hasil query:", result.rows); // Menampilkan hasil query di console
    res.json(result.rows); // Mengirimkan data ke frontend
  } catch (error) {
    console.error('Error fetching inventoris data:', error);
    res.status(500).json({ error: 'Failed to fetch inventoris data' });
  }
});

// PATCH /api/inventoris/:kode_produk - Memperbarui quantity produk
router.patch('/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk; // Mengambil kode_produk dari URL
  const { quantity } = req.body; // Mengambil quantity dari body request

  // Memastikan quantity yang diterima adalah angka valid
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
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /api/inventoris - Menambahkan produk baru
router.post('/', async (req, res) => {
  const { kode_produk, nama_produk, modal, harga_jual, quantity } = req.body;

  // Validasi input
  if (!kode_produk || !nama_produk || isNaN(modal) || isNaN(harga_jual) || isNaN(quantity)) {
    return res.status(400).json({ message: 'Data produk tidak valid' });
  }

  try {
    // Menambahkan produk baru ke database
    const result = await pool.query(
      'INSERT INTO inventoris (kode_produk, nama_produk, modal, harga_jual, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [kode_produk, nama_produk, modal, harga_jual, quantity]
    );

    res.status(201).json(result.rows[0]); // Mengembalikan produk yang baru ditambahkan
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
