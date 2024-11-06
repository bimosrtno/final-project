const express = require('express');
const router = express.Router();
const pool = require('../db'); // Sesuaikan dengan konfigurasi pool 

// Endpoint untuk mendapatkan data transaksi terkirim
router.get('/success', (req, res) => {
    pool.query(
        'SELECT date, total_transaksi FROM sales WHERE status = $1 ORDER BY date ASC',
        ['terkirim'], // Status untuk transaksi yang sukses
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({ rows: results.rows }); // Kembalikan hasil dalam format yang sesuai
        }
    );
});

// Endpoint untuk mendapatkan data transaksi batal
router.get('/failed', (req, res) => {
    pool.query(
        'SELECT date, total_transaksi AS total_transaksi_batal FROM sales WHERE LOWER(status) = LOWER($1) ORDER BY date ASC',
        ['batal'], // Status untuk transaksi yang batal, kita cukup memeriksa "batal" dalam lowercase
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({ rows: results.rows }); // Kembalikan hasil dalam format yang sesuai
        }
    );
});

module.exports = router;