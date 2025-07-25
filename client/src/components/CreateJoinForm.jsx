import React, { useState } from 'react';

const CreateJoinForm = ({ onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [gameType, setGameType] = useState('TicTacToe');

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateRoom(name, gameType);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinRoom(name, roomCode);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
          <option value="TicTacToe">Tic Tac Toe</option>
          <option value="ConnectFour">Connect Four</option>
        </select>
        <button type="button" onClick={handleCreate}>Create Room</button>
      </form>

      <hr />

      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          required
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default CreateJoinForm;
