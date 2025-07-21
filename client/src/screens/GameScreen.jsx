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
      if (gameOver) return;
      socket.emit('makeMove', { roomCode, index });
    });

    return () => {
      phaserGame.current.destroy(true);
    };
  }, [socket, roomCode, gameOver]); // Add gameOver to dependency array

  useEffect(() => {
    if (gameState && phaserGame.current.scene.scenes[0]) {
      phaserGame.current.scene.scenes[0].updateBoard(gameState.board);
    }
  }, [gameState]);

  const handlePlayAgain = () => {
    // We will now only emit the 'playAgain' event.
    // The server will handle resetting the state, and the
    // client will receive the new state via the 'gameStarted' event.
    socket.emit('playAgain', { roomCode });
  };

  if (!gameState || !room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
      <Card style={{ width: 'clamp(300px, 80vw, 500px)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Tic-Tac-Toe</h1>
        <h2 style={{ marginBottom: '1rem' }}>Room: {roomCode}</h2>
        <div id="phaser-container" style={{ width: 400, height: 400, margin: 'auto', pointerEvents: gameOver ? 'none' : 'auto' }} />
        
        {gameOver ? (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
              {gameOver.winner ? `Player ${gameOver.winner} Wins!` : "It's a Draw!"}
            </h3>
            <Button onClick={handlePlayAgain} style={{ marginTop: '1rem' }}>
              Play Again
            </Button>
          </div>
        ) : (
          <h3 style={{ marginTop: '1rem' }}>Turn: {gameState.turn}</h3>
        )}
      </Card>
    </div>
  );
};

export default GameScreen; 