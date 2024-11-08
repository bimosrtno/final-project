// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db'); // Memuat koneksi database
const router = express.Router();

// Endpoint untuk registrasi pengguna
router.post('/register', async (req, res) => {
    const { username, password, role, nama, nomor } = req.body; // Tambahkan nama dan nomor

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Tambahkan 10 untuk lebih aman

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, role, nama, nomor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, hashedPassword, role, nama, nomor] // pastikan nomor dikirim sebagai format string
          );
        
        res.status(201).json(result.rows[0]); // Mengembalikan data pengguna yang baru dibuat
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in registering user' });
    }
});

// Endpoint untuk login pengguna

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
        id: user.rows[0].id, 
        role: user.rows[0].role 
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
        token,
        role: user.rows[0].role, // Mengembalikan role ke client
    });
});

// Endpoint untuk mendapatkan semua data pengguna

router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, role, nama, nomor FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Ekspor router
module.exports = router;