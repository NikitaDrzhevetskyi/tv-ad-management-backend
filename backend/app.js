const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const app = express();
const programRoutes = require('./routes/programsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

// Connect to db
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
