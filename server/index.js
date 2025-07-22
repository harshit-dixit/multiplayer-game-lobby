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
    const player = { id: socket.id, name, symbol: null, score: 0 };
    const game = createGame();
    const room = {
      gameType: 'TicTacToe',
      players: [player],
      state: game,
      roomCode,
      availableSymbols: ['X', 'O'],
    };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, player, room });
  });

  socket.on('joinRoom', ({ name, roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      if (room.players.length < 2) {
        const player = { id: socket.id, name, symbol: null, score: 0 };
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

  // Symbol selection event
  socket.on('chooseSymbol', ({ roomCode, symbol }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    if (!room.availableSymbols.includes(symbol)) {
      socket.emit('error', 'Symbol already taken');
      return;
    }
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    player.symbol = symbol;
    // Remove symbol from available
    room.availableSymbols = room.availableSymbols.filter((s) => s !== symbol);
    // If both players have chosen, assign remaining symbol to the other
    if (room.players.length === 2) {
      const other = room.players.find((p) => !p.symbol);
      if (other && room.availableSymbols.length === 1) {
        other.symbol = room.availableSymbols[0];
        room.availableSymbols = [];
      }
    }
    io.to(roomCode).emit('symbolChosen', { players: room.players });
  });

  socket.on('startGame', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.players.length === 2 && room.players.every(p => p.symbol)) {
      // Set initial turn to the player who chose 'X'
      room.state.turn = 'X';
      io.to(roomCode).emit('gameStarted', { state: room.state, players: room.players });
    } else {
      socket.emit('error', 'Both players must choose a symbol');
    }
  });

  socket.on('makeMove', ({ roomCode, index }) => {
    console.log(`[Server] Move received for room ${roomCode} at index ${index} from socket ${socket.id}`);
    const room = rooms.get(roomCode);
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.symbol) {
      console.log(`[Server] Invalid move in room ${roomCode}: Not player's turn or missing symbol.`);
      return;
    }
    if (room.state.turn === player.symbol) {
      const { state, winner, isDraw } = makeMove(room.state, index, player.symbol);
      room.state = state;
      io.to(roomCode).emit('moveMade', { state });
      if (winner) {
        // Find winner by symbol
        const winnerPlayer = room.players.find((p) => p.symbol === winner);
        if (winnerPlayer) winnerPlayer.score += 1;
        io.to(roomCode).emit('gameOver', { winner: winnerPlayer ? winnerPlayer.name : winner, winnerSymbol: winner, scores: room.players.map(p => ({ name: p.name, symbol: p.symbol, score: p.score })), state });
        setTimeout(() => {
          room.state = createGame();
          io.to(roomCode).emit('gameStarted', { state: room.state, players: room.players });
        }, 3000);
      } else if (isDraw) {
        io.to(roomCode).emit('gameOver', { isDraw, scores: room.players.map(p => ({ name: p.name, symbol: p.symbol, score: p.score })), state });
        setTimeout(() => {
          room.state = createGame();
          io.to(roomCode).emit('gameStarted', { state: room.state, players: room.players });
        }, 3000);
      }
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
