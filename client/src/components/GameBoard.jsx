import React from 'react';

const GameBoard = ({ gameState, onMakeMove, player }) => {
  const { board, turn } = gameState;

  const handleClick = (index) => {
    if (board[index] === null && turn === player.symbol) {
      onMakeMove(index);
    }
  };

  return (
    <div>
      <h2>Tic-Tac-Toe</h2>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} className="cell" onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>
      <h3>Turn: {turn}</h3>
    </div>
  );
};

export default GameBoard;
