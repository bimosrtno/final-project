const app = require('./app'); // Import aplikasi Express dari app.js
const port = process.env.PORT || 5000;

//start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});