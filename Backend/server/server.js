const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const { publicLimiter, protectedLimiter } = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const representativeRoutes = require('./routes/representative');
const setupWebSocket = require('./websocket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());

// Rate limiting
app.use('/admin/login', publicLimiter);
app.use('/user/login', publicLimiter);
app.use(['/admin', '/representative'], protectedLimiter);

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/representative', representativeRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Customer Service Portal API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        code: 'SERVER_ERROR',
        message: 'Internal server error'
    });
});

// Setup WebSocket
const wss = setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});