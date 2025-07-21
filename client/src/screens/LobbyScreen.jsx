import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';

const LobbyScreen = () => {
  const { socket, room } = useContext(AppContext);
  const navigate = useNavigate();
  const { gameType, roomCode: roomCodeParam } = useParams();

  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState(roomCodeParam || '');
  const [view, setView] = useState(roomCodeParam ? 'join' : 'create');

  // This effect will run when the 'room' object in our global state changes.
  // It ensures we only navigate AFTER we have successfully joined a room.
  useEffect(() => {
    if (room && room.roomCode) {
      navigate(`/game/${room.gameType}/${room.roomCode}`);
    }
  }, [room, navigate]);

  useEffect(() => {
    if (roomCodeParam) {
      setRoomCode(roomCodeParam);
      setView('join');
    }
  }, [roomCodeParam]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    socket.emit('createRoom', { name, gameType });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('joinRoom', { name, roomCode, gameType });
  };

  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
      <Card style={{ width: 'clamp(300px, 50vw, 450px)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Button
            onClick={() => setView('create')}
            style={{
              background: view === 'create' ? 'var(--color-primary)' : 'transparent',
              color: view === 'create' ? '#fff' : 'var(--color-text-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: '8px 0 0 8px',
              margin: 0,
            }}
          >
            Create Room
          </Button>
          <Button
            onClick={() => setView('join')}
            style={{
              background: view === 'join' ? 'var(--color-primary)' : 'transparent',
              color: view === 'join' ? '#fff' : 'var(--color-text-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: '0 8px 8px 0',
              margin: 0,
            }}
          >
            Join Room
          </Button>
        </div>

        {view === 'create' ? (
          <form onSubmit={handleCreateRoom}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create a New Game Room</h2>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginBottom: '1rem' }}
            />
            <Button type="submit">Create</Button>
          </form>
        ) : (
          <form onSubmit={handleJoinRoom}>
            <h2 style={{ marginBottom: '1.5rem' }}>Join an Existing Room</h2>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginBottom: '1rem' }}
            />
            <Input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              required
              style={{ marginBottom: '1.5rem' }}
            />
            <Button type="submit">Join</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default LobbyScreen; 