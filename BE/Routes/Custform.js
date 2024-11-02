const express = require('express');
const router = express.Router();
const pool = require('../db'); // Koneksi ke database PostgreSQL

// Fungsi untuk menghasilkan ID customer baru
async function generateCustomerID() {
    const lastIdQuery = await pool.query('SELECT id_customer FROM customers ORDER BY id_customer DESC LIMIT 1');
    const lastId = lastIdQuery.rows[0] ? lastIdQuery.rows[0].id_customer : null;

    if (lastId) {
        // Ambil nomor dari ID terakhir dan tambahkan 1
        const lastNumber = parseInt(lastId.replace('CUST', ''), 10);
        const newNumber = lastNumber + 1;
        return `CUST${newNumber.toString().padStart(3, '0')}`;
    } else {
        // Jika belum ada ID, mulai dari CUST008
        return 'CUST008';
    }
}

// Endpoint untuk mendapatkan semua customers dengan urutan yang dapat diatur
router.get('/', async (req, res) => {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; // Default ke ascending jika tidak ada query

    try {
        // Mengambil data dengan pengurutan berdasarkan created_at atau id_customer
        const customers = await pool.query(`SELECT * FROM customers ORDER BY id_customer ${order}`);
        res.json(customers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Endpoint untuk menyimpan data customer baru
router.post('/', async (req, res) => {
    const { Name, Phone, Email, Company, City, Status, source } = req.body;

    try {
        // Dapatkan ID customer baru
        const newCustomerID = await generateCustomerID();

        const query = `
            INSERT INTO customers(id_customer, "Name", "Phone", "Email", "Company", "City", "Status", source) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;
        const values = [newCustomerID, Name, Phone, Email, Company, City, 'potensial', source];
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

// Endpoint untuk mendapatkan total transaksi dan jumlah transaksi berdasarkan customer_id
router.get('/:customerId/transactions', async (req, res) => {
    const { customerId } = req.params;

    try {
        const transactionQuery = `
            SELECT 
                COUNT(*) AS total_count,
                SUM(total_transaksi) AS total_amount
            FROM 
                sales 
            WHERE 
                id_customer = $1
        `;
        const result = await pool.query(transactionQuery, [customerId]);

        if (result.rows.length === 0) {
            return res.status(404).json('Customer not found or no transactions');
        }

        res.json({
            totalCount: result.rows[0].total_count,
            totalAmount: result.rows[0].total_amount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

module.exports = router;
