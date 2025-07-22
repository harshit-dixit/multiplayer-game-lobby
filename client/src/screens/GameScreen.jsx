import React, { useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Phaser from 'phaser';
import { AppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button'; // Import the Button component

class TicTacToeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeScene' });
  }

  create() {
    this.board = this.add.graphics();
    this.drawBoard();

    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  drawBoard() {
    this.board.lineStyle(5, 0x424242, 1); // Changed to a visible dark grey
    // Vertical lines
    this.board.lineBetween(133, 0, 133, 400);
    this.board.lineBetween(266, 0, 266, 400);
    // Horizontal lines
    this.board.lineBetween(0, 133, 400, 133);
    this.board.lineBetween(0, 266, 400, 266);
  }

  handlePointerDown(pointer) {
    const x = Math.floor(pointer.x / 133);
    const y = Math.floor(pointer.y / 133);
    const index = y * 3 + x;
    
    // Emit event to React component
    console.log('[Phaser] Click detected at index:', index);
    this.game.events.emit('makeMove', { index });
  }

  updateBoard(boardState) {
    // Clear existing symbols before redrawing
    if (this.symbols) {
      this.symbols.forEach(symbol => symbol.destroy());
    }
    this.symbols = [];

    boardState.forEach((cell, index) => {
      if (cell) {
        const x = (index % 3) * 133 + 66.5;
        const y = Math.floor(index / 3) * 133 + 66.5;
        const symbol = this.add.text(x, y, cell, { fontSize: '100px', color: '#212121' }).setOrigin(0.5); // Changed to a visible dark color
        this.symbols.push(symbol);
      }
    });
  }
}

const GameScreen = () => {
  const { socket, gameState, room, gameOver, setGameOver } = useContext(AppContext);
  const { roomCode } = useParams();
  const phaserGame = useRef(null);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 400,
      height: 400,
      transparent: true,
      scene: TicTacToeScene,
      parent: 'phaser-container',
    };

    phaserGame.current = new Phaser.Game(config);

    phaserGame.current.events.on('makeMove', ({ index }) => {
      // Prevent moves if the game is over
      if (gameOverRef.current) return;
      console.log('[React] makeMove event received, emitting to server with index:', index);
      socket.emit('makeMove', { roomCode, index });
    });

    return () => {
      phaserGame.current.destroy(true);
    };
  }, [socket, roomCode]); 

  useEffect(() => {
    if (gameState && phaserGame.current.scene.scenes[0]) {
      phaserGame.current.scene.scenes[0].updateBoard(gameState.board);
    }
  }, [gameState]);

  if (!gameState || !room) {
    return <div>Loading...</div>;
  }

  // Find player info by symbol
  const getPlayerBySymbol = (symbol) => room.players.find((p) => p.symbol === symbol);
  // Find current turn player
  const turnPlayer = getPlayerBySymbol(gameState.turn);
  // Find local player
  const localPlayer = room.players.find((p) => p.id === socket.id);

  // Scoreboard
  const renderScores = () => (
    <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
      <span>Scores: </span>
      {room.players.map((p, i) => (
        <span key={p.id} style={{ marginRight: 12 }}>
          {p.name} ({p.symbol}): {typeof p.score === 'number' ? p.score : 0}
        </span>
      ))}
    </div>
  );

  // Win/Draw message
  let resultMessage = null;
  if (gameOver) {
    if (gameOver.winner) {
      if (localPlayer && gameOver.winner === localPlayer.name) {
        resultMessage = 'You won!';
      } else {
        resultMessage = `${gameOver.winner} Won.`;
      }
    } else if (gameOver.isDraw) {
      resultMessage = "It's a Draw!";
    }
  }

  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
      <Card style={{ width: 'clamp(300px, 80vw, 500px)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Tic-Tac-Toe</h1>
        <h2 style={{ marginBottom: '1rem' }}>Room: {roomCode}</h2>
        {renderScores()}
        <div id="phaser-container" style={{ width: 400, height: 400, margin: 'auto', pointerEvents: gameOver ? 'none' : 'auto' }} />
        {gameOver ? (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>{resultMessage}</h3>
          </div>
        ) : (
          <h3 style={{ marginTop: '1rem' }}>
            {turnPlayer ? `${turnPlayer.name}'s Turn (${turnPlayer.symbol})` : `Turn: ${gameState.turn}`}
          </h3>
        )}
      </Card>
    </div>
  );
};

export default GameScreen; 