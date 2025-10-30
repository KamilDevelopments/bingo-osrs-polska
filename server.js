const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store the current state for each team (5 teams, each with 30 cells)
const teamStates = {
  1: new Array(30).fill(false),
  2: new Array(30).fill(false),
  3: new Array(30).fill(false),
  4: new Array(30).fill(false),
  5: new Array(30).fill(false)
};

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send current state to newly connected client
  socket.on('requestState', (team) => {
    if (teamStates[team]) {
      socket.emit('stateUpdate', { team, state: teamStates[team] });
    }
  });

  // Handle tile toggle
  socket.on('toggleTile', (data) => {
    const { team, index, value } = data;
    
    // Validate input
    if (team >= 1 && team <= 5 && index >= 0 && index < 30) {
      // Update server state
      teamStates[team][index] = value;
      
      // Broadcast to all clients including sender
      io.emit('tileUpdated', { team, index, value });
    }
  });

  // Handle full state update (for import/reset)
  socket.on('updateState', (data) => {
    const { team, state } = data;
    
    // Validate input
    if (team >= 1 && team <= 5 && Array.isArray(state) && state.length === 30) {
      // Update server state
      teamStates[team] = state;
      
      // Broadcast to all clients including sender
      io.emit('stateUpdate', { team, state });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
