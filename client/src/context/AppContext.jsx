import { createContext, useState, useEffect } from 'react';
import { socket } from '../socket';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameOver, setGameOver] = useState(null); // { winner: 'X' } or { isDraw: true }

  useEffect(() => {
    const onRoomCreated = ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setGameState(room.state);
    };

    const onRoomJoined = ({ room, player }) => {
      setRoom(room);
      setPlayer(player);
      setGameState(room.state);
    };

    const onPlayerJoined = ({ player: newPlayer }) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        players: [...prevRoom.players, newPlayer],
      }));
    };

    const onGameStarted = (data) => {
      // When a new game starts, update the state and clear the gameOver message
      setGameState(data.state);
      setGameOver(null);
    };

    const onMoveMade = ({ state }) => {
      setGameState(state);
    };

    const onGameOver = (data) => {
      setGameOver(data);
    };

    socket.on('roomCreated', onRoomCreated);
    socket.on('roomJoined', onRoomJoined);
    socket.on('playerJoined', onPlayerJoined);
    socket.on('gameStarted', onGameStarted);
    socket.on('moveMade', onMoveMade);
    socket.on('gameOver', onGameOver);

    return () => {
      socket.off('roomCreated', onRoomCreated);
      socket.off('roomJoined', onRoomJoined);
      socket.off('playerJoined', onPlayerJoined);
      socket.off('gameStarted', onGameStarted);
      socket.off('moveMade', onMoveMade);
      socket.off('gameOver', onGameOver);
    };
  }, []);

  const value = {
    socket,
    player,
    room,
    gameState,
    gameOver,
    setPlayer,
    setRoom,
    setGameState,
    setGameOver,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 