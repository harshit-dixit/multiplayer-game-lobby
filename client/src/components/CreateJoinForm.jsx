import React, { useState } from 'react';

const CreateJoinForm = ({ onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateRoom(name);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    onJoinRoom(name, roomCode);
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create Room</button>
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
