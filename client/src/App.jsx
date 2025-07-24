import { Routes, Route } from 'react-router-dom';
import './App.css';
import PixiBackground from './components/PixiBackground';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

function App() {
  return (
    <>
      <PixiBackground />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/lobby/:gameType/:roomCode?" element={<LobbyScreen />} />
        <Route path="/game/:gameType/:roomCode" element={<GameScreen />} />
      </Routes>
    </>
  );
}

export default App;
