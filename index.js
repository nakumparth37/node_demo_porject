require('dotenv').config();
const express = require ('express');
const connectDB = require('./config/db')
const movieRoutes = require('./routes/movieRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const auth = require('./middleware/authMiddleware');


const app = express();
const port = process.env.PORT || 9000;
const protectedRoute = express.Router();


app.use(express.json());
app.use('/movies', movieRoutes)
app.use('/users', auth.protect, userRoutes)
app.use('/', authRoutes)

connectDB();
app.listen(port,() => {
    console.log(`Our express appliction run on the ${port} port`);
});