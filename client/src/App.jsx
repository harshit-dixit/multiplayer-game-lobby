import { Routes, Route } from 'react-router-dom';
import './App.css';
import PhaserBackground from './components/PhaserBackground';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

import sky from './assets/bigsky.png';
import mountains from './assets/background1.png';
import clouds from './assets/clouds.png';

const assets = {
  sky,
  mountains,
  clouds,
};

function App() {
  return (
    <>
      <PhaserBackground assets={assets} />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/lobby/:gameType/:roomCode?" element={<LobbyScreen />} />
        <Route path="/game/:gameType/:roomCode" element={<GameScreen />} />
      </Routes>
    </>
  );
}

export default App;
