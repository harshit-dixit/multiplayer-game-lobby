import React from 'react';

const WaitingRoom = ({ room, player, onChooseSymbol, onStartGame }) => {
  const symbols = ['X', 'O'];
  return (
    <div>
      <h2>Room Code: {room.roomCode}</h2>
      <h3>Players:</h3>
      <ul>
        {room.players.map((p) => (
          <li key={p.id}>
            {p.name} {p.symbol ? `(${p.symbol})` : ''} {typeof p.score === 'number' ? `- Score: ${p.score}` : ''}
          </li>
        ))}
      </ul>
      <h4>Choose your symbol:</h4>
      {player && !player.symbol && (
        <div style={{ marginBottom: '1rem' }}>
          {symbols.map((symbol) => {
            const taken = room.players.some((p) => p.symbol === symbol);
            return (
              <button
                key={symbol}
                onClick={() => onChooseSymbol(symbol)}
                disabled={taken}
                style={{ marginRight: 8, padding: '8px 16px', fontWeight: 'bold', background: taken ? '#ccc' : '#fff' }}
              >
                {symbol} {taken ? '(Taken)' : ''}
              </button>
            );
          })}
        </div>
      )}
      {player && player.symbol && (
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          You are <span style={{ color: '#1E88E5' }}>{player.symbol}</span>
        </div>
      )}
      {room.players.length === 2 && room.players.every((p) => p.symbol) && <button onClick={onStartGame}>Start Game</button>}
    </div>
  );
};

export default WaitingRoom;
