const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper function untuk mendapatkan semua data sales
async function getAllSales() {
  try {
    const result = await pool.query('SELECT * FROM sales');
    return result.rows;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
}

// Route untuk mengambil data sales
router.get('/', async (req, res) => {
  try {
    const sales = await getAllSales();
    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// Route untuk mengupdate status transaksi di tabel sales
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validasi input
  if (!status) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  try {
    const result = await pool.query(
      'UPDATE sales SET status = $1 WHERE id_transaksi = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ID Transaksi tidak ditemukan' });
    }

    res.json(result.rows[0]); // Mengembalikan data yang telah diupdate
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route POST untuk menambahkan sales baru
router.post('/', async (req, res) => {
  const { items, id_transaksi, grandTotal } = req.body; // items dari TransForm.jsx

  // Validasi input
  if (!items || !id_transaksi || !Array.isArray(items) || items.length === 0 || isNaN(grandTotal)) {
    return res.status(400).json({ message: 'Data sales tidak valid' });
  }

  try {
    await pool.query('BEGIN');

    for (const item of items) {
      const { nama_produk, quantity } = item;

      // Ambil kode_produk dari tabel inventoris berdasarkan nama_produk
      const product = await pool.query('SELECT kode_produk, quantity FROM inventoris WHERE nama_produk = $1', [nama_produk]);
      if (product.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }
      const kode_produk = product.rows[0].kode_produk;
      const currentQuantity = product.rows[0].quantity;

      if (currentQuantity < quantity) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ message: `Quantity tidak mencukupi untuk produk ${nama_produk}` });
      }

      // Hitung total_harga untuk item saat ini
      const total_harga = item.harga_jual * quantity;

      // Query untuk menambahkan data sales baru (dengan kolom status)
      const result = await pool.query(
        'INSERT INTO sales (id_transaksi, customer_name, nama_produk, phone, address, quantity, total_harga, date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), DEFAULT) RETURNING *',
        [id_transaksi, item.customer_name, nama_produk, item.phone, item.address, quantity, total_harga]
      );

      await pool.query(
        'UPDATE inventoris SET quantity = quantity - $1 WHERE kode_produk = $2',
        [quantity, kode_produk]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Data sales berhasil ditambahkan', grandTotal });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error adding sales:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
