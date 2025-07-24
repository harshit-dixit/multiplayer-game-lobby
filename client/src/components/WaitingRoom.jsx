import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Button from './ui/Button';

const WaitingRoom = () => {
  const { socket, room, player, gameHasStarted, error } = useContext(AppContext);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameHasStarted && room) {
      navigate(`/game/${room.gameType}/${room.roomCode}`);
    }
  }, [gameHasStarted, room, navigate]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  if (!room || !room.players || room.players.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'var(--color-secondary)' }}>Loading Room...</h2>
      </div>
    );
  }

  const handleChooseSymbol = (symbol) => {
    socket.emit('chooseSymbol', { roomCode: room.roomCode, symbol });
  };

  const handleStartGame = () => {
    socket.emit('startGame', { roomCode: room.roomCode });
  };

  return (
    <div>
      <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Room Code:</h2>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '2rem',
        color: 'var(--color-accent)',
        backgroundColor: 'var(--color-background)',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--border-radius)',
        display: 'inline-block',
        border: '2px dashed var(--color-border)',
        marginBottom: '2rem',
        letterSpacing: '4px'
      }}>{room.roomCode}</p>

      <h3 style={{ marginBottom: '1rem' }}>Players:</h3>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
        {room.players.map((p) => (
          <li key={p.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: p.id === player?.id ? 'rgba(80, 227, 194, 0.2)' : 'transparent',
            borderRadius: 'var(--border-radius)',
            marginBottom: '0.5rem',
          }}>
            <span>{p.name} (Score: {p.score})</span>
            <span style={{
              fontWeight: 'bold',
              color: p.symbol ? 'var(--color-accent)' : 'inherit'
            }}>{p.symbol || '...'}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Choose your side:</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => handleChooseSymbol('X')}
            disabled={!isConnected || room.players.some(p => p.symbol === 'X')}
            style={{ marginRight: '1rem', fontSize: '2rem', width: '80px', height: '80px' }}
          >X</Button>
          <Button
            onClick={() => handleChooseSymbol('O')}
            disabled={!isConnected || room.players.some(p => p.symbol === 'O')}
            style={{ fontSize: '2rem', width: '80px', height: '80px' }}
          >O</Button>
        </div>
        </div>

      <Button
        onClick={handleStartGame}
        disabled={!isConnected || room.players.length < 2 || room.players.some(p => !p.symbol)}
        style={{ width: '100%', backgroundColor: 'var(--color-secondary)', boxShadow: '0 4px 0 #3a9d83' }}
      >
        Start Game
      </Button>

      {error && <p style={{ color: 'var(--color-error)', marginTop: '1rem', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
};

export default WaitingRoom;
