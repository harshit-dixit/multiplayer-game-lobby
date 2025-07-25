import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Card style={{ 
        width: 'clamp(350px, 90vw, 500px)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: 'var(--color-accent)',
          textShadow: '3px 3px 0px rgba(0,0,0,0.2)'
        }}>
          Game Lobby
        </h1>
        <p style={{
          margin: '1rem 0 2rem',
          fontSize: '1.2rem',
          color: 'var(--color-text)'
        }}>
          Choose a game and start playing!
        </p>
        <Button 
          onClick={() => navigate('/lobby/TicTacToe')}
          style={{ width: '100%', fontSize: '1.5rem', marginBottom: '1rem' }}
        >
          Play Tic-Tac-Toe
        </Button>
        <Button
          onClick={() => navigate('/lobby/ConnectFour')}
          style={{ width: '100%', fontSize: '1.5rem' }}
        >
          Play Connect Four
        </Button>
      </Card>
    </div>
  );
};

export default HomeScreen; 