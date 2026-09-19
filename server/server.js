const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const analysisRoutes = require('./routes/analysisRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const careerRoutes = require('./routes/careerRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();

connectDB();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/coding', assessmentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CareerNova Backend API' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist.' });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((e) => e.message).join(', ')
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ') || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}.`
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}.`
    });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.expose ? err.message : 'Internal server error.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerNova Backend Server running on port ${PORT}`);
});
