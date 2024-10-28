const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import koneksi database

// Helper function untuk mendapatkan produk berdasarkan kode_produk
async function getProductByKode(kode_produk) {
  try {
    const result = await pool.query(
      'SELECT * FROM inventoris WHERE kode_produk = $1',
      [kode_produk]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error getting product by kode_produk:", err.message);
    throw err;
  }
}

// Helper function untuk memperbarui quantity
async function updateInventoryQuantity(kode_produk, quantityChange) {
  try {
    const result = await pool.query(
      'UPDATE inventoris SET quantity = quantity + $1 WHERE kode_produk = $2 RETURNING *',
      [quantityChange, kode_produk]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating inventory quantity:", err.message);
    throw err;
  }
}

// GET /api/inventoris - Mendapatkan semua data inventaris
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventoris ORDER BY kode_produk ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching inventoris data:', error);
    res.status(500).json({ error: 'Failed to fetch inventoris data' });
  }
});

// DELETE /api/inventoris/:kode_produk - Menghapus produk berdasarkan kode_produk
router.delete('/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk;

  try {
    // Menggunakan helper function untuk mendapatkan produk
    const product = await getProductByKode(kodeProduk);
    
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Menghapus produk dari database
    await pool.query('DELETE FROM inventoris WHERE kode_produk = $1', [kodeProduk]);
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk', error: error.message });
  }
});

// PATCH /api/inventoris/:kode_produk - Memperbarui quantity produk
router.patch('/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk;
  const { quantity } = req.body;

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity tidak valid' });
  }

  try {
    const updatedProduct = await updateInventoryQuantity(kodeProduk, quantity);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /api/inventoris - Menambahkan produk baru
router.post('/', async (req, res) => {
  const { kode_produk, nama_produk, modal, harga_jual, quantity } = req.body;

  if (!kode_produk || !nama_produk || isNaN(modal) || isNaN(harga_jual) || isNaN(quantity)) {
    return res.status(400).json({ message: 'Data produk tidak valid' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO inventoris (kode_produk, nama_produk, modal, harga_jual, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [kode_produk, nama_produk, modal, harga_jual, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
