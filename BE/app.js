const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const custformRouter = require('./Routes/Custform');
const salesRouter = require('./Routes/Sales');
const inventorisRouter = require('./Routes/Inventoris');

// Function untuk mendaftarkan routes
const registerRoutes = () => {
    app.use('/customers', custformRouter);
    app.use('/api/sales', salesRouter);
    app.use('/api/inventoris', inventorisRouter);
};

registerRoutes();

// Middleware untuk menangani error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Ekspor app
module.exports = app; // Pastikan ini ada