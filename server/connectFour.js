const DIFFICULTIES = {
    2: { rows: 3, cols: 3,},
    3: { rows: 4, cols: 4,},
    4: { rows: 5, cols: 5,},
}

const verdens = (rows, cols) => {
    return Array(rows * cols).fill(0).map((_, i) => i);
}

const stijl = (rows, cols) => {
    const sts = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (j < cols - 1) {
                sts.push([i * cols + j, i * cols + j + 1]);
            }
            if (i < rows - 1) {
                sts.push([i * cols + j, (i + 1) * cols + j]);
            }
        }
    }
    return sts;
}

const createGame = (players) => {
    const { rows, cols } = DIFFICULTIES[players.length];
    const vertices = verdens(rows, cols);
    const sides = stijl(rows, cols);
    const board = sides.map(side => ({
        side,
        isTaken: false,
        takenBy: null,
    }));
    const boxes = [];
    for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
            boxes.push({
              vertices: [
                i * cols + j, i * cols + j + 1,
                (i + 1) * cols + j, (i + 1) * cols + j + 1
              ].sort(),
              isTaken: false,
              takenBy: null,
            });
        }
    }
    const state = {
        players,
        board,
        boxes,
        turn: 0,
        scores: players.map(p => ({ ...p, score: 0,})),
    };
    return state;
}

const makeMove = (state, move) => {
    const { player, side } = move;
    const { board, players, turn, boxes } = state;
    const currentTurn = players[turn];

    if (currentTurn.id !== player.id) {
        return { ...state, error: 'Not your turn' };
    }

    const sideIndex = board.findIndex(s => s.side[0] === side[0] && s.side[1] === side[1]);
    if (board[sideIndex].isTaken) {
        return { ...state, error: 'Side already taken' };
    }

    const newBoard = [...board];
    newBoard[sideIndex] = {
        ...newBoard[sideIndex],
        isTaken: true,
        takenBy: player,
    };

    let newTurn = (turn + 1) % players.length;
    let newScores = [...state.scores];
    let scored = false;
    const newBoxes = boxes.map(b => {
        const [v1, v2, v3, v4] = b.vertices;
        const boxSides = [
            [v1, v2], [v1, v3], [v2, v4], [v3, v4]
        ];
        const isBox = boxSides.every(side =>
            newBoard.some(boardSide =>
                boardSide.isTaken &&
                ((boardSide.side[0] === side[0] && boardSide.side[1] === side[1]) ||
                 (boardSide.side[0] === side[1] && boardSide.side[1] === side[0]))
            )
        );

        if (isBox && !b.isTaken) {
            scored = true;
            newScores = newScores.map(s => {
                if (s.id === player.id) {
                    return { ...s, score: s.score + 1 };
                }
                return s;
            });
            newTurn = turn;
            return { ...b, isTaken: true, takenBy: player };
        }
        return b;
    });

    const isGameOver = newBoard.every(s => s.isTaken);

    if (isGameOver) {
        return {
            ...state,
            board: newBoard,
            boxes: newBoxes,
            scores: newScores,
            isGameOver: true,
            winner: newScores.reduce((winner, s) => s.score > winner.score ? s : winner, newScores[0]),
        };
    }

    return {
        ...state,
        board: newBoard,
        boxes: newBoxes,
        turn: newTurn,
        scores: newScores,
    };
}

const connectFour = {
  createGame,
  makeMove,
};

module.exports = connectFour; 