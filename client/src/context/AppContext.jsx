import { createContext, useState, useEffect } from 'react';
import { socket } from '../socket';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(null); // { winner: 'X' } or { isDraw: true }
  const [gameHasStarted, setGameHasStarted] = useState(false);

  useEffect(() => {
    const onRoomCreated = ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setGameState(room.state);
      setGameHasStarted(false); // Reset on new room
    };

    const onRoomJoined = ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setGameState(room.state);
      setGameHasStarted(false); // Reset on new room
    };

    const onPlayerJoined = ({ player: newPlayer }) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        players: [...prevRoom.players, newPlayer],
      }));
    };

    // New: handle symbol selection updates
    const onSymbolChosen = ({ players }) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        players,
      }));
      // If this client is one of the players, update their symbol
      const me = players.find((p) => p.id === socket.id);
      if (me) setPlayer(me);
    };

    // Updated: handle new gameStarted payload
    const onGameStarted = (data) => {
      setGameState(data.state);
      setGameOver(null);
      if (data.players) {
        setRoom((prevRoom) => ({ ...prevRoom, players: data.players }));
      }
      setGameHasStarted(true); // Signal that game has started
    };

    // Updated: handle new gameOver payload (with scores)
    const onGameOver = (data) => {
      setGameOver(data);
      if (data.state) {
        setGameState(data.state);
      }
      setGameHasStarted(false); // Reset on game over
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

    socket.on('roomCreated', onRoomCreated);
    socket.on('roomJoined', onRoomJoined);
    socket.on('playerJoined', onPlayerJoined);
    socket.on('symbolChosen', onSymbolChosen);
    socket.on('gameStarted', onGameStarted);
    socket.on('moveMade', ({ state }) => setGameState(state));
    socket.on('gameOver', onGameOver);

    return () => {
      socket.off('roomCreated', onRoomCreated);
      socket.off('roomJoined', onRoomJoined);
      socket.off('playerJoined', onPlayerJoined);
      socket.off('symbolChosen', onSymbolChosen);
      socket.off('gameStarted', onGameStarted);
      socket.off('moveMade');
      socket.off('gameOver', onGameOver);
    };
  }, []);

  const value = {
    socket,
    player,
    room,
    gameState,
    gameOver,
    gameHasStarted, // Expose the new state
    setPlayer,
    setRoom,
    setGameState,
    setGameOver,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 