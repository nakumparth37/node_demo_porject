require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRotes = require('./routes/roleRoutes');
const auth = require('./middleware/authMiddleware');
require("./events/eventListeners");

const app = express();
const port = process.env.PORT || 9000;

// Connect to the Database
connectDB();

// Middleware
app.use(express.json());

// Public Routes
app.use('/', authRoutes);

// Protected Routes
app.use('/movies', movieRoutes);
app.use('/users', auth.protect, userRoutes);
app.use('/roles', auth.protect, auth.adminOnly, roleRotes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});