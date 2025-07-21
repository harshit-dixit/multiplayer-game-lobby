import React from 'react';

const WaitingRoom = ({ room, onStartGame }) => {
  return (
    <div>
      <h2>Room Code: {room.roomCode}</h2>
      <h3>Players:</h3>
      <ul>
        {room.players.map((player) => (
          <li key={player.id}>
            {player.name} ({player.symbol})
          </li>
        ))}
      </ul>
      {room.players.length === 2 && <button onClick={onStartGame}>Start Game</button>}
    </div>
  );
};

export default WaitingRoom;
