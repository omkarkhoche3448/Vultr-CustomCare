const express = require('express');
const cors = require('cors');  
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const repRoutes = require('./routes/repRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  httpOnly: true,
  credentials: true, 
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/representative', repRoutes);

// Start server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
