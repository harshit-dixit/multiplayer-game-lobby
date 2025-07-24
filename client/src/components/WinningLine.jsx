import React from 'react';

const WinningLine = ({ gameOver }) => {
  if (!gameOver || !gameOver.combination) return null;

  const { combination, winnerSymbol } = gameOver;

  const getLineStyle = () => {
    const baseStyle = {
      position: 'absolute',
      backgroundColor: winnerSymbol === 'X' ? 'var(--color-primary)' : 'var(--color-secondary)',
      boxShadow: `0 0 15px ${winnerSymbol === 'X' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
      borderRadius: '5px',
      transformOrigin: 'top left',
      animation: 'drawLine 0.5s ease-out forwards',
    };

    const keyframes = `
      @keyframes drawLine {
        from { width: 0; }
        to { width: 100%; }
      }
    `;
    
    // Vertical
    if (combination[0] % 3 === combination[1] % 3) {
      const col = combination[0] % 3;
      return {
        ...baseStyle,
        top: '5%',
        left: `${(col * 33.33) + 16.66}%`,
        width: '10px',
        height: '90%',
        transform: 'translateX(-50%)',
      };
    }
    
    // Horizontal
    if (Math.floor(combination[0] / 3) === Math.floor(combination[1] / 3)) {
      const row = Math.floor(combination[0] / 3);
      return {
        ...baseStyle,
        left: '5%',
        top: `${(row * 33.33) + 16.66}%`,
        width: '90%',
        height: '10px',
        transform: 'translateY(-50%)',
      };
    }
    
    // Diagonal
    if (combination[0] === 0) { // Top-left to bottom-right
      return {
        ...baseStyle,
        top: '10%',
        left: '10%',
        width: '120%',
        height: '10px',
        transform: 'rotate(45deg)',
      };
    } else { // Top-right to bottom-left
      return {
        ...baseStyle,
        top: '10%',
        left: '85%',
        width: '120%',
        height: '10px',
        transform: 'rotate(-45deg)',
        transformOrigin: 'top right',
      };
    }
  };

  return <div style={getLineStyle()} />;
};

export default WinningLine; 