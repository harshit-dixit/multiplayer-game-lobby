import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import WaitingRoom from '../components/WaitingRoom';

const LobbyScreen = () => {
  const { socket, room, error } = useContext(AppContext);
  const navigate = useNavigate();
  const { gameType, roomCode: paramRoomCode } = useParams();
  
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [localError, setLocalError] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (room && room.roomCode && !paramRoomCode) {
      navigate(`/lobby/${gameType}/${room.roomCode}`);
    }
  }, [room, gameType, navigate, paramRoomCode]);

  const handleCreateRoom = () => {
    if (!name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }
    setLocalError('');
    socket.emit('createRoom', { name, gameType });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomCode.trim()) {
      setLocalError('Please enter your name and a room code.');
      return;
    }
    setLocalError('');
    socket.emit('joinRoom', { roomCode, name });
  };

  useEffect(() => {
    if(socket.connected) setIsConnected(true);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  if (paramRoomCode) {
    return <WaitingRoom />;
  }
  
  const renderForm = () => {
    if (activeTab === 'create') {
      return (
        <>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>Create a New Game</h2>
          <Input 
            type="text" 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
          <Button onClick={handleCreateRoom} style={{ marginTop: '1rem', width: '100%' }} disabled={!isConnected}>Create Room</Button>
        </>
      );
    }
    
    return (
      <>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>Join a Game</h2>
        <Input 
          type="text" 
          placeholder="Enter your name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          style={{ marginBottom: '1rem' }}
        />
        <Input 
          type="text" 
          placeholder="Enter room code" 
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)} 
        />
        <Button onClick={handleJoinRoom} style={{ marginTop: '1rem', width: '100%' }} disabled={!isConnected}>Join Room</Button>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 'clamp(350px, 90vw, 450px)', textAlign: 'center' }}>
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          <Button 
            variant={activeTab === 'create' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('create')} 
            style={{ flex: 1, marginRight: '0.5rem', borderBottomLeftRadius: activeTab === 'join' ? 0 : 'var(--border-radius)', borderBottomRightRadius: 0 }}
          >
            Create
          </Button>
          <Button 
            variant={activeTab === 'join' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('join')}
            style={{ flex: 1, marginLeft: '0.5rem', borderBottomLeftRadius: 0, borderBottomRightRadius: activeTab === 'create' ? 0 : 'var(--border-radius)' }}
          >
            Join
          </Button>
        </div>
        
        {renderForm()}
        
        {localError && <p style={{ color: 'var(--color-error)', marginTop: '1rem', fontWeight: 'bold' }}>{localError}</p>}
        {error && <p style={{ color: 'var(--color-error)', marginTop: '1rem', fontWeight: 'bold' }}>{error}</p>}
      </Card>
    </div>
  );
};

export default LobbyScreen; 