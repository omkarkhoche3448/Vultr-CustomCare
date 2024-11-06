// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle joining specific channels
  socket.on('join-channel', (channelName) => {
    socket.join(channelName);
    console.log(`Client ${socket.id} joined channel: ${channelName}`);
  });

  // Handle transcription messages
  socket.on('transcription', (data) => {
    console.log('Received transcription:', data);
    
    // If channelName is provided, broadcast only to that channel
    if (data.channelName) {
      io.to(data.channelName).emit('transcription', data);
      console.log(`Broadcasting to channel: ${data.channelName}`);
    } else {
      // Fallback to broadcasting to all clients
      io.emit('transcription', data);
      console.log('Broadcasting to all clients (no channel specified)');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.send('Server is running');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});