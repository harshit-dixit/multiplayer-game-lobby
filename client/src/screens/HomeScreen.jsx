import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Card from '../components/ui/Card';

const HomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1, backgroundColor: 'transparent' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, margin: '2rem 0', textAlign: 'center', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        Multiplayer Game Lobby
      </h1>
      <div className="flex-row" style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
        <Card>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Tic-Tac-Toe</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Classic 3x3 grid game. Play with a friend online!</p>
          <button className="button" style={{ marginTop: '1rem' }} onClick={() => navigate('/lobby/TicTacToe')}>Create / Join</button>
        </Card>
        <Card>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connect Four</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Drop discs and connect four in a row. Coming soon!</p>
          <button className="button" style={{ marginTop: '1rem' }} disabled>Coming Soon</button>
        </Card>
        <Card>
          <h2 style={{ color: 'var(--color-accent)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bingo</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Multiplayer Bingo fun. Coming soon!</p>
          <button className="button" style={{ marginTop: '1rem' }} disabled>Coming Soon</button>
        </Card>
      </div>
      <footer style={{ marginTop: '3rem', color: '#fff', fontSize: '1rem', textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>GitHub</a> |
        <a href="/LICENSE" style={{ margin: '0 8px', color: 'inherit' }}>License</a> |
        <a href="#about" style={{ color: 'inherit' }}>About</a>
      </footer>
    </div>
  );
};

export default HomeScreen; 