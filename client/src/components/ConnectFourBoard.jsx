import React from 'react';

const ConnectFourBoard = ({ board, boxes, onMove, players }) => {
    if (!players || players.length === 0) {
        return <div>Loading...</div>;
    }
    const numPlayers = players.length;
    const { numRows, numCols } = {
        2: { numRows: 3, numCols: 3 },
        3: { numRows: 4, numCols: 4 },
        4: { numRows: 5, numCols: 5 },
    }[numPlayers];

    const dots = Array.from({ length: numRows * numCols });
    const horizontalLines = board.filter(line => line.side[1] - line.side[0] === 1);
    const verticalLines = board.filter(line => line.side[1] - line.side[0] === numCols);

    const handleLineClick = (line) => {
        if (!line.isTaken) {
            onMove(line.side);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
            {dots.map((_, index) => (
                <div
                    key={`dot-${index}`}
                    style={{
                        position: 'absolute',
                        left: `${(index % numCols) * (100 / (numCols - 1))}%`,
                        top: `${Math.floor(index / numCols) * (100 / (numRows - 1))}%`,
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'black',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
            {horizontalLines.map((line, index) => (
                <div
                    key={`h-line-${index}`}
                    onClick={() => handleLineClick(line)}
                    style={{
                        position: 'absolute',
                        left: `${(line.side[0] % numCols) * (100 / (numCols - 1))}%`,
                        top: `${Math.floor(line.side[0] / numCols) * (100 / (numRows - 1))}%`,
                        width: `${100 / (numCols - 1)}%`,
                        height: '10px',
                        backgroundColor: line.isTaken ? line.takenBy.color : 'lightgray',
                        transform: 'translateY(-50%)',
                        cursor: line.isTaken ? 'default' : 'pointer',
                    }}
                />
            ))}
            {verticalLines.map((line, index) => (
                <div
                    key={`v-line-${index}`}
                    onClick={() => handleLineClick(line)}
                    style={{
                        position: 'absolute',
                        left: `${(line.side[0] % numCols) * (100 / (numCols - 1))}%`,
                        top: `${Math.floor(line.side[0] / numCols) * (100 / (numRows - 1))}%`,
                        width: '10px',
                        height: `${100 / (numRows - 1)}%`,
                        backgroundColor: line.isTaken ? line.takenBy.color : 'lightgray',
                        transform: 'translateX(-50%)',
                        cursor: line.isTaken ? 'default' : 'pointer',
                    }}
                />
            ))}
            {boxes.map((box, index) => {
                if (!box.isTaken) return null;
                const topLeftDotIndex = box.vertices[0];
                return (
                    <div
                        key={`box-${index}`}
                        style={{
                            position: 'absolute',
                            left: `${(topLeftDotIndex % numCols) * (100 / (numCols - 1))}%`,
                            top: `${Math.floor(topLeftDotIndex / numCols) * (100 / (numRows - 1))}%`,
                            width: `${100 / (numCols - 1)}%`,
                            height: `${100 / (numRows - 1)}%`,
                            backgroundColor: box.takenBy.color,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        {box.takenBy.symbol}
                    </div>
                );
            })}
        </div>
    );
};

export default ConnectFourBoard; 