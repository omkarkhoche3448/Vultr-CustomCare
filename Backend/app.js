const express = require('express');
const cors = require('cors');  
const { connectDB } = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const repRoutes = require('./routes/repRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  httpOnly: true,
  credentials: true, 
}));  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/representative', repRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
