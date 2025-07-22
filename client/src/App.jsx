import { Routes, Route } from 'react-router-dom';
import './App.css';
import PhaserBackground from './components/PhaserBackground';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';

import sky from './assets/sky4.png';
import clouds from './assets/clouds.png';
import sun from './assets/sunorbit.png';
import mountains from './assets/mountains-tile.png';

const assets = [
  { type: 'image', key: 'sky', url: 'https://labs.phaser.io/assets/skies/ms3-sky.png' },
  { type: 'image', key: 'mountains', url: 'https://labs.phaser.io/assets/skies/mountains-back.png' },
  { type: 'image', key: 'clouds', url: 'https://labs.phaser.io/assets/skies/clouds-white.png' },
  { type: 'image', key: 'trees', url: 'https://labs.phaser.io/assets/skies/trees-black.png' },
];

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
