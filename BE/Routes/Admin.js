const express = require('express');
const { authenticateToken, authorizeRoles } = require('../AuthMiddleware');
const router = express.Router();

// Route khusus superadmin
router.get('/superadmin', authenticateToken, authorizeRoles(['superadmin']), (req, res) => {
    res.json({ message: 'Selamat datang di dashboard superadmin!' });
});

// Route khusus admin gudang
router.get('/gudang', authenticateToken, authorizeRoles(['gudang']), (req, res) => {
    res.json({ message: 'Selamat datang di dashboard admin gudang!' });
});

// Route khusus admin sales
router.get('/sales', authenticateToken, authorizeRoles(['sales']), (req, res) => {
    res.json({ message: 'Selamat datang di dashboard admin sales!' });
});

module.exports = router;
