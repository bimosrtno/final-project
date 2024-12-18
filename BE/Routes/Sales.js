const express = require('express');
const router = express.Router();
const pool = require('../db'); // Sesuaikan dengan konfigurasi pool Anda

// Helper function untuk mendapatkan ID transaksi terakhir
async function getLastTransactionId() {
    try {
        const result = await pool.query('SELECT id_transaksi FROM sales ORDER BY id_transaksi DESC LIMIT 1');
        return result.rows[0] ? result.rows[0].id_transaksi : null;
    } catch (error) {
        console.error('Error fetching last transaction ID:', error);
        throw error;
    }
}

// Route GET untuk mengambil data sales berdasarkan ID transaksi
router.get('/', async (req, res) => {
    const { transactionId } = req.query; // Mengambil transactionId dari query

    try {
        let query;
        let values;

        if (transactionId) {
            query = 'SELECT * FROM sales WHERE id_transaksi = $1';
            values = [transactionId];
        } else {
            query = 'SELECT * FROM sales'; // Mengambil semua data jika tidak ada query
            values = [];
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Gagal mengambil data sales', details: error.message });
    }
});

// Route POST untuk menambahkan sales baru
router.post('/', async (req, res) => {
    const { items, customer_name, phone, address, total_transaksi, id_customer } = req.body;

    // Validasi data yang diterima
    if (!items || !customer_name || !phone || !address || !Array.isArray(items) || items.length === 0 || isNaN(total_transaksi)) {
        return res.status(400).json({ message: 'Data sales tidak valid' });
    }

    for (const item of items) {
        if (!item.nama_produk || !item.quantity || item.quantity <= 0 || !item.harga_jual) {
            return res.status(400).json({ message: 'Data item tidak valid' });
        }
    }

    const client = await pool.connect(); // Koneksi ke database

    try {
        await client.query('BEGIN');

        // Ambil ID transaksi terakhir dan buat ID transaksi baru
        const lastTransactionId = await getLastTransactionId();
        const newTransactionId = lastTransactionId
            ? `TRS${(parseInt(lastTransactionId.replace('TRS', '')) + 1).toString().padStart(3, '0')}`
            : 'TRS003'; // Jika belum ada ID transaksi, mulai dari TRS003

        // Memastikan data yang akan dimasukkan valid dengan stok inventoris
        const productNames = items.map(item => item.nama_produk); // Menyimpan nama produk sebagai array
        const quantities = items.map(item => item.quantity); // Menyimpan quantity sebagai array

        for (const item of items) {
            const inventoryQuery = 'SELECT quantity AS stok FROM inventoris WHERE nama_produk = $1';
            const inventoryResult = await client.query(inventoryQuery, [item.nama_produk]);

            // Jika produk tidak ditemukan di inventaris atau stok kurang dari yang dibutuhkan
            if (inventoryResult.rows.length === 0) {
                throw new Error(`Produk ${item.nama_produk} tidak ditemukan di inventaris`);
            }

            const stokTersedia = inventoryResult.rows[0].stok;
            console.log(`Stok tersedia untuk ${item.nama_produk}: ${stokTersedia}, Quantity diminta: ${item.quantity}`);

            if (stokTersedia < item.quantity) {
                throw new Error(`Stok produk ${item.nama_produk} tidak mencukupi`);
            }

            const updateStockQuery = 'UPDATE inventoris SET quantity = quantity - $1 WHERE nama_produk = $2';
            await client.query(updateStockQuery, [item.quantity, item.nama_produk]);
        }

        // Insert ke tabel sales
        const totalQuantity = quantities.reduce((sum, quantity) => sum + quantity, 0); // Menghitung total quantity
        const salesInsertQuery = `
            INSERT INTO sales (id_transaksi, customer_name, phone, address, nama_produk, quantity, total_transaksi, date, status, id_customer)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `;

        const salesResult = await client.query(salesInsertQuery, [
            newTransactionId,
            customer_name,
            phone,
            address,
            `{${productNames.join(',')}}`, // Memastikan menggunakan format array literal untuk nama_produk
            `{${quantities.join(',')}}`, // Memastikan menggunakan format array literal untuk quantity
            total_transaksi,
            new Date(), // Tanggal saat ini
            'proses', // Status transaksi
            id_customer
        ]);

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({
            message: 'Data sales berhasil ditambahkan',
            grandTotal: total_transaksi,
            salesData: salesResult.rows
        });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback jika terjadi error
        console.error('Error adding sales:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    } finally {
        client.release(); // Pastikan koneksi dilepaskan
    }
});

// Route untuk mengupdate status transaksi di tabel sales
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

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

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route untuk membatalkan transaksi dengan mengubah status dan menambahkan note
router.put('/cancel/:id', async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
        return res.status(400).json({ error: 'Note tidak valid' });
    }

    try {
        const result = await pool.query(
            'UPDATE sales SET status = $1, note = $2 WHERE id_transaksi = $3 RETURNING *',
            ['Batal', note, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'ID Transaksi tidak ditemukan' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating status and note:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Update endpoint untuk mengupdate status dan menyimpan jasa pengiriman dan nomor resi
router.put('/sales/:idTransaksi', async (req, res) => {
    const { idTransaksi } = req.params;  // Mengambil idTransaksi dari URL
    const { status, pengiriman, no_resi } = req.body;  // Mengambil data dari body request

    // Validasi input
    if (!status || !pengiriman || !no_resi) {
        return res.status(400).json({ error: 'Status, pengiriman, atau nomor resi tidak valid' });
    }

    try {
        // Query untuk memperbarui status, pengiriman, dan nomor resi
        const result = await pool.query(`
            UPDATE sales 
            SET status = $1, pengiriman = $2, no_resi = $3 
            WHERE id_transaksi = $4
            RETURNING *
        `, [status, pengiriman, no_resi, idTransaksi]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
        }

        // Mengirimkan respons sukses dengan data yang sudah diperbarui
        res.status(200).json({ message: 'Status dan informasi pengiriman berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating sales data:', error);
        res.status(500).send('Kesalahan server');
    }
});

// Route GET untuk mendapatkan ID transaksi terakhir
router.get('/last-transaction-id', async (req, res) => {
    try {
        const result = await pool.query('SELECT id_transaksi FROM sales ORDER BY id_transaksi DESC LIMIT 1');
        const lastTransactionId = result.rows[0] ? result.rows[0].id_transaksi : 'TRS002';
        res.json({ lastTransactionId });
    } catch (error) {
        console.error('Error fetching last transaction ID:', error);
        res.status(500).json({ error: 'Gagal mengambil ID transaksi terakhir' });
    }
});

// Route GET untuk mengambil data customers
router.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT id_customer, "Name", "Phone" FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers data:', error);
        res.status(500).json({ error: 'Gagal mengambil data customers', details: error.message });
    }
});

// Route untuk mendapatkan top sale
router.get('/top-sale', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sales ORDER BY total_transaksi DESC LIMIT 1');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Route untuk mendapatkan top customer
router.get('/top-customer', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id_customer, customer_name, COUNT(*) AS transaction_count, SUM(total_transaksi) AS total_transaksi
            FROM sales
            WHERE status = 'terkirim'
            GROUP BY id_customer, customer_name
            ORDER BY transaction_count DESC
            LIMIT 1
        `);
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Tidak ada data customer." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

module.exports = router;