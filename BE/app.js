const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Opsional, jika diperlukan
const app = express();

// Middleware untuk CORS
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan origin frontend Anda
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parsing JSON request body

// Mengimpor rute
const authRouter = require('./Routes/Auth'); // Rute untuk autentikasi
const custformRouter = require('./Routes/Custform'); // Rute untuk customer
const salesRouter = require('./Routes/Sales'); // Rute untuk sales
const inventorisRouter = require('./Routes/Inventoris'); // Rute untuk inventoris
const chartRouter = require('./Routes/Chart'); // Rute untuk chart
const templateRouter = require('./Routes/Template'); // Rute untuk template
const adminRoutes = require('./Routes/Admin');

// Mengatur rute
app.use('/api/auth', authRouter); // Rute untuk autentikasi
app.use('/customers', custformRouter); // Rute untuk pelanggan
app.use('/api/sales', salesRouter); // Rute untuk sales
app.use('/api/inventoris', inventorisRouter); // Rute untuk inventoris
app.use('/api/chart', chartRouter); // Rute untuk chart
app.use('/api/templates', templateRouter); // Rute untuk template
app.use('/api/admin', adminRoutes);


// Penanganan kesalahan
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Mengeksport app untuk digunakan dalam server.js
module.exports = app;