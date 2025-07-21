const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rooms = require('./rooms');
const { createGame, makeMove } = require('./ticTacToe');

const app = express();

// Use cors middleware
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'], // Explicitly allow websocket
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', ({ name }) => {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const player = { id: socket.id, name, symbol: 'X' };
    const game = createGame();

    const room = {
      gameType: 'TicTacToe',
      players: [player],
      state: game,
      roomCode, // Add roomCode to the room object
    };
    rooms.set(roomCode, room);

    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, player, room });
  });

  socket.on('joinRoom', ({ name, roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      if (room.players.length < 2) {
        const player = { id: socket.id, name, symbol: 'O' };
        room.players.push(player);

        socket.join(roomCode);
        socket.emit('roomJoined', { roomCode, player, room });
        socket.to(roomCode).emit('playerJoined', { player });
      } else {
        socket.emit('error', 'Room is full');
      }
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('startGame', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.players.length === 2) {
      io.to(roomCode).emit('gameStarted', { state: room.state });
    }
  });

  socket.on('makeMove', ({ roomCode, index }) => {
    const room = rooms.get(roomCode);
    const player = room.players.find((p) => p.id === socket.id);

    if (room.state.turn === player.symbol) {
      const { state, winner, isDraw } = makeMove(room.state, index, player.symbol);
      room.state = state;

      io.to(roomCode).emit('moveMade', { state });

      if (winner) {
        io.to(roomCode).emit('gameOver', { winner });
      } else if (isDraw) {
        io.to(roomCode).emit('gameOver', { isDraw });
      }
    }
  });

  socket.on('playAgain', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      // Reset the game state
      room.state = createGame();
      // Notify clients that a new game has started with the fresh state
      io.to(roomCode).emit('gameStarted', { state: room.state });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Handle player disconnection from rooms
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
