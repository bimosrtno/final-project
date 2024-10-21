const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
const custformRouter = require('./Routes/Custform');  // Import file Custform.js
const salesRouter = require('./Routes/Sales');        // Import file routes sales
const inventorisRouter = require('./Routes/Inventoris'); // Import file inventoris.js

app.use('/customers', custformRouter);  // Gunakan '/customers' sebagai path utama untuk route customers
app.use('/api/sales', salesRouter);     // Gunakan '/api/sales' sebagai path utama untuk route sales
app.use('/api/inventoris', inventorisRouter); // Gunakan '/api/inventoris' sebagai path utama 

// Endpoint untuk memperbarui quantity produk
app.patch('/api/inventoris/:kode_produk', async (req, res) => {
  const kodeProduk = req.params.kode_produk; // Mengambil kode_produk dari URL
  const { quantity } = req.body; // Mengambil quantity dari body request

  try {
    // Logika untuk memperbarui quantity di database
    const result = await pool.query(
      'UPDATE inventoris SET quantity = quantity + $1 WHERE kode_produk = $2 RETURNING *',
      [quantity, kodeProduk]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]); // Mengembalikan produk yang telah diperbarui
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = app;

