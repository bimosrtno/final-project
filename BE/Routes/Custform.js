const express = require('express');
const router = express.Router();
const pool = require('../db'); // Koneksi ke database PostgreSQL

// Endpoint untuk mendapatkan semua customers
router.get('/', async (req, res) => {
    try {
        const customers = await pool.query('SELECT * FROM customers');
        res.json(customers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Endpoint untuk menyimpan data customer baru
router.post('/', async (req, res) => {
    const { Name, Phone, Email, Company, City, Status } = req.body; // Tambahkan Status di sini

    try {
        const query = 'INSERT INTO customers("Name", "Phone", "Email", "Company", "City", "Status") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [Name, Phone, Email, Company, City, Status]; // Sertakan Status di array values
        const result = await pool.query(query, values);

        res.status(201).send(result.rows[0]); 
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).send('Error saving data');
    }
});

// Endpoint untuk memperbarui status customer berdasarkan nama
router.put('/:Name/status', async (req, res) => {
    const { Name } = req.params; 
    const { status } = req.body;

    try {
        const updateStatus = await pool.query(
            'UPDATE customers SET "Status" = $1 WHERE "Name" = $2 RETURNING *',
            [status, Name]
        );
        if (updateStatus.rows.length === 0) {
            return res.status(404).json('Customer not found');
        }
        res.json('Status updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

module.exports = router;