const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware untuk CORS
app.use(cors({
  origin: 'http://localhost:5173', // Sesuaikan dengan origin frontend Anda
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json()); // Menggunakan body-parser untuk JSON

// Rute
const custformRouter = require('./Routes/Custform');
const salesRouter = require('./Routes/Sales'); // Memastikan rute Sales diimpor
const inventorisRouter = require('./Routes/Inventoris');
const ChartRouter = require('./Routes/Chart');

// Mengatur rute
app.use('/customers', custformRouter);       // Rute untuk customer
app.use('/api/sales', salesRouter);          // Rute untuk sales
app.use('/api/inventoris', inventorisRouter); // Rute untuk inventoris
app.use('/api/chart', ChartRouter);         // Rute untuk chart

// Penanganan Error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;