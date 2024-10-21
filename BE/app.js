const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db'); // Pastikan Anda sudah mengimpor koneksi ke database

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const custformRouter = require('./Routes/Custform');  // Import file Custform.js
const salesRouter = require('./Routes/Sales');        // Import file routes sales
const inventorisRouter = require('./Routes/Inventoris'); // Import file inventoris.js

app.use('/customers', custformRouter);  // Gunakan '/customers' sebagai path utama untuk route customers
app.use('/api/sales', salesRouter);     // Gunakan '/api/sales' sebagai path utama untuk route sales
app.use('/api/inventoris', inventorisRouter); // Gunakan '/api/inventoris' sebagai path utama 

// Endpoint untuk memperbarui quantity produk
app.patch('/api/inventoris/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      'UPDATE inventoris SET quantity = quantity + $1 WHERE kode_produk = $2 RETURNING *',
      [quantity, kodeProduk]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]); // Mengembalikan produk yang diperbarui
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint untuk menambahkan produk baru
app.post('/api/inventoris', async (req, res) => {
  const { kode_produk, nama_produk, modal, harga_jual, quantity } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO inventoris (kode_produk, nama_produk, modal, harga_jual, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [kode_produk, nama_produk, modal, harga_jual, quantity]
    );

    res.status(201).json(result.rows[0]); // Mengembalikan produk yang baru ditambahkan
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = app;

