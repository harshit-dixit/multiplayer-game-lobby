import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Howl } from 'howler';
import { AppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WinningLine from '../components/WinningLine';

import placeSound from '../assets/sounds/place.mp3';
import winSound from '../assets/sounds/win.mp3';
import drawSound from '../assets/sounds/draw.mp3';

const sounds = {
  place: new Howl({ src: [placeSound] }),
  win: new Howl({ src: [winSound] }),
  draw: new Howl({ src: [drawSound] }),
};

const GameScreen = () => {
  const { socket, gameState, room, gameOver, player, rematch } = useContext(AppContext);
  const { roomCode } = useParams();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('opponentLeft', () => setOpponentLeft(true));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('opponentLeft');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('roomJoined', (room) => {
      navigate(`/lobby/${room.gameType}/${room.roomCode}`);
    });

    return () => {
      socket.off('roomJoined');
    }
  }, [socket, navigate]);

  useEffect(() => {
    if (gameOver) {
      if (gameOver.winner) {
        sounds.win.play();
      } else if (gameOver.isDraw) {
        sounds.draw.play();
      }
    }
  }, [gameOver]);
  
  useEffect(() => {
    sounds.place.play();
  }, [gameState.board]);


  if (!gameState || !room || !player) {
    return <div>Loading...</div>;
  }

  const getPlayerBySymbol = (symbol) => room.players.find((p) => p.symbol === symbol);
  const turnPlayer = getPlayerBySymbol(gameState.turn);
  const localPlayer = room.players.find((p) => p.id === socket.id);

  const handleMakeMove = (index) => {
    if (!gameOver && gameState.board[index] === null && localPlayer?.id === turnPlayer?.id) {
      socket.emit('makeMove', { roomCode, index });
    }
  };

  const handleRematch = () => {
    socket.emit('requestRematch', { roomCode });
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', { roomCode });
    navigate('/');
  };

  let resultMessage = null;
  let isWinner = false;
  if (gameOver) {
    if (gameOver.winner) {
      const winnerPlayer = room.players.find(p => p.symbol === gameOver.winnerSymbol);
      isWinner = winnerPlayer?.id === socket.id;
      resultMessage = isWinner ? "You Won!" : `${winnerPlayer?.name} Won!`;
    } else if (gameOver.isDraw) {
      resultMessage = "It's a Draw!";
    }
  }

  if (opponentLeft) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card style={{ textAlign: 'center' }}>
          <h2>Opponent has left the game.</h2>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      {gameOver && (
        <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
          <Button 
            onClick={handleLeaveRoom}
            variant="secondary"
            style={{ padding: '0.5rem' }}
          >
            Home
          </Button>
        </div>
      )}
      <Card style={{ width: 'clamp(350px, 90vw, 450px)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', textShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}>Tic-Tac-Toe</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--color-background)',
          padding: '0.5rem',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)'
        }}>
          {room.players.map((p) => (
            <div key={p.id} style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--border-radius)',
              transition: 'all 0.3s ease',
              backgroundColor: gameState.turn === p.symbol ? 'var(--color-primary)' : 'transparent',
              color: gameState.turn === p.symbol ? 'white' : 'var(--color-text)'
            }}>
              <span style={{ fontWeight: 'bold' }}>{p.name} ({p.symbol})</span>: {p.score}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '10px',
          aspectRatio: '1 / 1',
          marginBottom: '1.5rem',
          position: 'relative', // This will contain the absolutely positioned WinningLine
        }}>
          {gameState.board.map((cell, index) => {
            const isClickable = gameState.board[index] === null && !gameOver && localPlayer?.id === turnPlayer?.id;
            return (
              <div
                key={index}
                onClick={() => handleMakeMove(index)}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--border-radius)',
                  boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 'clamp(2rem, 15vw, 5rem)',
                  color: cell === 'X' ? 'var(--color-primary)' : 'var(--color-secondary)',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.backgroundColor = '#2d3748'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-background)'; }}
              >
                {cell && <span style={{ textShadow: `0 0 10px ${cell === 'X' ? 'var(--color-primary)' : 'var(--color-secondary)'}` }}>{cell}</span>}
              </div>
            );
          })}
          <WinningLine gameOver={gameOver} />
        </div>

        {gameOver && isWinner && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={400}
          />
        )}
        
        {gameOver ? (
          <div>
            <h2 style={{ 
              color: isWinner ? 'var(--color-accent)' : (gameOver.winner ? 'var(--color-error)' : 'var(--color-accent)'), 
              marginBottom: '1rem', 
              fontSize: '2rem' 
            }}>
              {isWinner ? "You Won!" : (gameOver.winner ? "You Lost!" : "It's a Draw!")}
            </h2>
            <Button 
              onClick={handleRematch} 
              style={{ width: '100%' }} 
              disabled={!isConnected || (rematch.requestedBy && rematch.requestedBy.id === player.id)}
            >
              {rematch.requestedBy ? (rematch.requestedBy.id === player.id ? "Waiting for Opponent..." : "Accept Rematch") : "Rematch"}
            </Button>
          </div>
        ) : (
          <h2 style={{ fontSize: '1.8rem' }}>{turnPlayer?.id === socket.id ? "Your Turn" : `${turnPlayer?.name}'s Turn`}</h2>
        )}
      </Card>
    </div>
  );
};

export default GameScreen; 