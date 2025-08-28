const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');
const programRoutes = require('./routes/programs');

const app = express();

// Connect to db
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);

// Routes
app.use('/api/programs', programRoutes);

module.exports = app;
