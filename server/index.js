const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rooms = require('./rooms');
const ticTacToe = require('./ticTacToe');
const connectFour = require('./connectFour');

const app = express();
const colors = ['#ff0000', '#0000ff', '#00ff00', '#ffff00'];
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

  socket.on('createRoom', ({ name, gameType }) => {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const player = { id: socket.id, name, symbol: null, score: 0 };
    let game;
    if (gameType === 'TicTacToe') {
      game = ticTacToe.createGame();
    } else {
      game = { players: [player], board: [], boxes: [], turn: 0, scores: [] };
    }
    const room = {
      gameType,
      players: [player],
      state: game,
      roomCode,
      availableSymbols: gameType === 'TicTacToe' ? ['X', 'O'] : [],
    };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, player, room });
  });

  socket.on('joinRoom', ({ name, roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      const maxPlayers = room.gameType === 'TicTacToe' ? 2 : 4;
      if (room.players.length < maxPlayers) {
        const player = { id: socket.id, name, symbol: null, score: 0 };
        room.players.push(player);
        if (room.gameType === 'ConnectFour') {
          room.state.players = room.players;
          room.players.forEach((p, i) => {
            p.symbol = p.name.charAt(0).toUpperCase();
            p.color = colors[i];
          });
        }
        socket.join(roomCode);
        socket.emit('roomJoined', { roomCode, player, room });
        socket.to(roomCode).emit('playerJoined', { player, room });
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
    } else if (room.gameType === 'ConnectFour' && room.players.length >= 2) {
      room.state = connectFour.createGame(room.players);
      io.to(roomCode).emit('gameStarted', { state: room.state, players: room.players });
    } else {
      socket.emit('error', 'Both players must choose a symbol before starting the game.');
    }
  });

  socket.on('makeMove', ({ roomCode, index, move }) => {
    console.log(`[Server] Move received for room ${roomCode} at index ${index} from socket ${socket.id}`);
    const room = rooms.get(roomCode);
    const player = room.players.find((p) => p.id === socket.id);

    if (room.gameType === 'TicTacToe') {
      if (!player || !player.symbol) {
        console.log(`[Server] Invalid move in room ${roomCode}: Not player's turn or missing symbol.`);
        return;
      }
      if (room.state.turn === player.symbol) {
        const { state, winner, isDraw, combination } = ticTacToe.makeMove(room.state, index, player.symbol);
        room.state = state;
        io.to(roomCode).emit('moveMade', { state });
        if (winner) {
          // Find winner by symbol
          const winnerPlayer = room.players.find((p) => p.symbol === winner);
          if (winnerPlayer) winnerPlayer.score += 1;
          io.to(roomCode).emit('gameOver', { winner: winnerPlayer ? winnerPlayer.name : winner, winnerSymbol: winner, combination, scores: room.players.map(p => ({ name: p.name, symbol: p.symbol, score: p.score })), state });
        } else if (isDraw) {
          io.to(roomCode).emit('gameOver', { isDraw, scores: room.players.map(p => ({ name: p.name, symbol: p.symbol, score: p.score })), state });
        }
      }
    } else {
      const { state, error } = connectFour.makeMove(room.state, { player, side: move });
      if (error) {
        socket.emit('error', error);
      } else {
        room.state = state;
        io.to(roomCode).emit('moveMade', { state });
        if (state.isGameOver) {
          io.to(roomCode).emit('gameOver', { winner: state.winner, scores: state.scores, state });
        }
      }
    }
  });

  socket.on('requestRematch', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (!room.rematchRequestedBy) {
        room.rematchRequestedBy = player;
        io.to(roomCode).emit('rematchRequested', { requestedBy: player });
      } else if (room.rematchRequestedBy.id !== player.id) {
        // Both players have requested a rematch, start a new game
        if (room.gameType === 'TicTacToe') {
          room.state = ticTacToe.createGame();
        } else {
          room.state = connectFour.createGame(room.players);
        }
        // Keep the same symbols
        io.to(roomCode).emit('gameStarted', { state: room.state, players: room.players });
        delete room.rematchRequestedBy; // Reset for next rematch
      }
    }
  });

  socket.on('leaveRoom', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length < 2) {
        socket.to(roomCode).emit('opponentLeft');
        rooms.delete(roomCode);
      } else {
        io.to(roomCode).emit('playerLeft', { players: room.players });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const roomCode = rooms.findRoomByPlayer(socket.id);
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        room.players = room.players.filter((p) => p.id !== socket.id);
        if (room.players.length < 2) {
          socket.to(roomCode).emit('opponentLeft');
          rooms.delete(roomCode);
        } else {
          io.to(roomCode).emit('playerLeft', { players: room.players });
        }
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
