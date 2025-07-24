const ticTacToe = {
  createGame: () => ({
    board: Array(9).fill(null),
    turn: 'X',
  }),

  makeMove: (state, index, symbol) => {
    if (state.board[index]) {
      return { state, winner: null, isDraw: false };
    }

    const newBoard = [...state.board];
    newBoard[index] = symbol;

    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const combination of winConditions) {
      const [a, b, c] = combination;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return {
          state: { ...state, board: newBoard },
          winner: newBoard[a],
          isDraw: false,
          combination, // Return the winning combination
        };
      }
    }

    const isDraw = newBoard.every(cell => cell);

    return {
      state: {
        ...state,
        board: newBoard,
        turn: state.turn === 'X' ? 'O' : 'X',
      },
      winner: null,
      isDraw,
    };
  },
};

module.exports = ticTacToe;
