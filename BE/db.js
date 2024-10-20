const { Pool } = require('pg');
require('dotenv').config(); // Memungkinkan penggunaan variabel lingkungan dari .env

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Pastikan password ditangkap dari .env sebagai string
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

module.exports = pool;
