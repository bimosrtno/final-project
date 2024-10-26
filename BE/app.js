// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Sesuaikan dengan origin frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

const custformRouter = require('./Routes/Custform');
const salesRouter = require('./Routes/Sales');
const inventorisRouter = require('./Routes/Inventoris');

app.use('/customers', custformRouter);
app.use('/api/sales', salesRouter);
app.use('/api/inventoris', inventorisRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
