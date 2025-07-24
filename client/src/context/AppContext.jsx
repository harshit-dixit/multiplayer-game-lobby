import { createContext, useState, useEffect } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [error, setError] = useState(null);
  const [rematch, setRematch] = useState({ requestedBy: null, acceptedBy: null });

  const navigate = useNavigate();

  useEffect(() => {
    const onRoomCreated = ({ room }) => {
      setRoom(room);
      setPlayer(room.players[0]);
      setGameState(room.state);
    };

    const onJoinedRoom = ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setGameState(room.state);
      setGameHasStarted(false); // Explicitly set game as not started
      navigate(`/lobby/${room.gameType}/${room.roomCode}`);
    };

    const onPlayerJoined = ({ player: newPlayer }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          players: [...prevRoom.players, newPlayer],
        }
      });
    };

    const onSymbolChosen = ({ players }) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        players,
      }));
      const me = players.find((p) => p.id === socket.id);
      if (me) setPlayer(me);
    };

    const onGameStarted = (data) => {
      setGameState(data.state);
      setGameOver(null);
      if (data.players) {
        setRoom((prevRoom) => ({ ...prevRoom, players: data.players }));
      }
      setGameHasStarted(true);
    };

    const onGameOver = (data) => {
      setGameOver(data);
      if (data.state) {
        setGameState(data.state);
      }
      setGameHasStarted(false);
      setRematch({ requestedBy: null, acceptedBy: null }); // Reset rematch state on game over
      if (data.scores) {
        setRoom((prevRoom) => ({
          ...prevRoom,
          players: prevRoom.players.map((p) => {
            const scoreObj = data.scores.find((s) => s.name === p.name && s.symbol === p.symbol);
            return scoreObj ? { ...p, score: scoreObj.score } : p;
          }),
        }));
      }
    };

    const onRematchRequested = ({ requestedBy }) => {
      setRematch(prev => ({ ...prev, requestedBy }));
    };

    const onError = (message) => {
      setError(message);
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    };
    
    socket.on('roomCreated', onRoomCreated);
    socket.on('roomJoined', onJoinedRoom);
    socket.on('playerJoined', onPlayerJoined);
    socket.on('symbolChosen', onSymbolChosen);
    socket.on('gameStarted', onGameStarted);
    socket.on('moveMade', ({ state }) => setGameState(state));
    socket.on('gameOver', onGameOver);
    socket.on('rematchRequested', onRematchRequested);
    socket.on('error', onError);

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playerJoined');
      socket.off('symbolChosen');
      socket.off('gameStarted');
      socket.off('moveMade');
      socket.off('gameOver');
      socket.off('rematchRequested');
      socket.off('error');
    };
  }, [navigate]);

  const value = {
    socket,
    player,
    room,
    gameState,
    gameOver,
    gameHasStarted,
    error,
    rematch,
    setPlayer,
    setRoom,
    setGameState,
    setGameOver,
    setRematch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 