const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Ambil token dari header
    if (!token) return res.sendStatus(401); // Tidak ada token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token tidak valid
        req.user = user;
        next();
    });
}

// Middleware untuk otorisasi berdasarkan role
function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied!' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };
