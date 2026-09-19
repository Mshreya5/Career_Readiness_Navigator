const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analysis', analysisRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CareerNova Analysis API' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerNova Analysis Server running on port ${PORT}`);
});
