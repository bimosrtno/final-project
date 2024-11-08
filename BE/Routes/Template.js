const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// Mengambil semua template
router.get('/:type', async (req, res) => {
    const templateType = req.params.type;
    try {
        const result = await pool.query('SELECT * FROM templates WHERE type = $1', [templateType]); // Ambil semua sesuai type
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengambil template berdasarkan jenis' });
    }
});

// Mengambil template aktif
router.get('/sls/active', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM templates WHERE is_active = TRUE AND type = $1', ['sls']);
        res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: 'Gagal mengambil template aktif' });
    }
});

// mengambil template aktif bertipe 'cust'
router.get('/cust/active', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM templates WHERE is_active = TRUE AND type = $1', ['cust']);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil template aktif' });
    }
});

// Menambahkan template baru
router.post('/', async (req, res) => {
    const { template, type } = req.body;
    try {
        await pool.query('INSERT INTO templates (template, type, is_active) VALUES ($1, $2, $3)', [template, type, true]);
        res.status(201).send("Template berhasil ditambahkan");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menambahkan template' });
    }
});

// Menghapus template berdasarkan ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM templates WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template tidak ditemukan' });
        }

        res.send("Template berhasil dihapus");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menghapus template' });
    }
});

// Mengedit template berdasarkan ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { template, type } = req.body;

    try {
        const result = await pool.query('UPDATE templates SET template = $1, type = $2 WHERE id = $3 RETURNING *', [template, type, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template tidak ditemukan' });
        }

        res.send("Template berhasil diperbarui");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal memperbarui template' });
    }
});

// Mengubah status template
router.put('/toggle/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const templateData = await pool.query('SELECT is_active FROM templates WHERE id = $1', [id]);
        
        if (templateData.rows.length === 0) {
            return res.status(404).json({ error: 'Template tidak ditemukan' });
        }

        const isActive = templateData.rows[0].is_active;
        await pool.query('UPDATE templates SET is_active = $1 WHERE id = $2', [!isActive, id]);
        res.send("Status template berhasil diubah");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengubah status template' });
    }
});

module.exports = router; // Mengekspor router