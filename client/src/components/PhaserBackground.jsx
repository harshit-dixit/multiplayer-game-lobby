import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class LandscapeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LandscapeScene' });
  }

  init(data) {
    // Store asset URLs passed from React
    this.assetUrls = data;
  }

  preload() {
    // Use Phaser's loader within the preload hook
    this.load.image('sky', this.assetUrls.sky);
    this.load.image('mountains', this.assetUrls.mountains);
    this.load.image('clouds', this.assetUrls.clouds);
  }

  create() {
    const { width, height } = this.sys.game.config;

    this.add.image(width / 2, height / 2, 'sky').setScale(2);
    this.mountains = this.add.tileSprite(0, height, width, 512, 'mountains').setOrigin(0, 1).setScrollFactor(0);
    this.clouds = this.add.tileSprite(0, 100, width, 256, 'clouds').setOrigin(0, 0).setScrollFactor(0);
  }

  update(time, delta) {
    this.mountains.tilePositionX += 0.1;
    this.clouds.tilePositionX += 0.25;
  }
}

const PhaserBackground = ({ assets }) => {
  const phaserRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!phaserRef.current || !assets) return;

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      parent: phaserRef.current,
      scene: [LandscapeScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);
    gameRef.current.scene.start('LandscapeScene', assets);

    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [assets]);

  return <div ref={phaserRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default PhaserBackground; 