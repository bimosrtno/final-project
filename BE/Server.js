const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const custformRouter = require('./Routes/Custform'); // Import file Custform.js
app.use('/customers', custformRouter);  // Gunakan '/customers' sebagai path utama 

//start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});