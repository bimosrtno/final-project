const express = require('express');
const router = express.Router();
const pool = require('../db'); // Sesuaikan dengan konfigurasi pool 

// Endpoint untuk mendapatkan data transaksi terkirim
router.get('/success', (req, res) => {
    const { start_date, end_date } = req.query;
    pool.query(
        'SELECT date, SUM(total_transaksi) AS total_transaksi FROM sales WHERE status = $1 AND date BETWEEN $2 AND $3 GROUP BY date ORDER BY date ASC',
        ['terkirim', start_date, end_date],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ rows: results.rows });
        }
    );
});

// Endpoint untuk mendapatkan data transaksi batal
router.get('/failed', (req, res) => {
    const { start_date, end_date } = req.query;
    pool.query(
        'SELECT date, SUM(total_transaksi) AS total_transaksi_batal FROM sales WHERE LOWER(status) = LOWER($1) AND date BETWEEN $2 AND $3 GROUP BY date ORDER BY date ASC',
        ['batal', start_date, end_date],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ rows: results.rows });
        }
    );
});

module.exports = router;