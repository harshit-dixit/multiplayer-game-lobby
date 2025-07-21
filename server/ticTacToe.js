function createGame() {
  return {
    board: Array(9).fill(null),
    turn: 'X',
  };
}

function makeMove(state, index, symbol) {
  if (state.board[index] || state.winner) {
    return { state, winner: null, isDraw: false };
  }

  const newBoard = [...state.board];
  newBoard[index] = symbol;

  const newState = {
    ...state,
    board: newBoard,
    turn: symbol === 'X' ? 'O' : 'X',
  };

  const winner = checkWinner(newBoard);
  const isDraw = !winner && newBoard.every((cell) => cell !== null);

  return { state: newState, winner, isDraw };
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

module.exports = { createGame, makeMove };
