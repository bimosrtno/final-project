
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db'); // Memuat koneksi database
const router = express.Router();

// Endpoint untuk registrasi pengguna
router.post('/register', async (req, res) => {
    const { username, password, role, nama, nomor } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password, role, nama, nomor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, hashedPassword, role.toLowerCase(), nama, nomor]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in registering user' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username.trim()]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Log data user yang digunakan untuk membuat token
        console.log("Generating token for:", user);

        const token = jwt.sign(
            { id: user.id, role: user.role.toLowerCase() },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role.toLowerCase() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});



// Endpoint untuk mendapatkan semua data pengguna
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, role, nama, nomor, is_active FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.put('/reset-password', async (req, res) => {
    const { id, newPassword } = req.body;

    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash password baru

    try {
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, id]);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

router.put('/toggle-active', async (req, res) => {
    const { id, isActive } = req.body;
    console.log(`Updating user id: ${id} to is_active: ${isActive}`); // Debug log

    try {
        await pool.query('UPDATE users SET is_active = $1 WHERE id = $2', [isActive, id]); // Pastikan ini sesuai
        res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// Ekspor router
module.exports = router;