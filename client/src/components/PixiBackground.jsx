import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PixiBackground = () => {
  const pixiContainer = useRef(null);

  useEffect(() => {
    let app;

    const init = async () => {
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo: window,
      });

      if (pixiContainer.current) {
        pixiContainer.current.appendChild(app.canvas);
      }

      // Create a gradient for the sky
      const quality = 256;
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = quality;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, 0, quality);
      gradient.addColorStop(0, '#4A90E2'); // Bright blue
      gradient.addColorStop(1, '#87CEEB'); // Sky blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, quality);
      
      const gradientTexture = PIXI.Texture.from(canvas);
      const sky = new PIXI.Sprite(gradientTexture);
      sky.width = app.screen.width;
      sky.height = app.screen.height;
      app.stage.addChild(sky);

      // Create clouds
      const cloudTexture = createCloudTexture();
      const clouds = [];
      for (let i = 0; i < 15; i++) {
        const cloud = new PIXI.Sprite(cloudTexture);
        cloud.anchor.set(0.5);
        cloud.scale.set(Math.random() * 0.5 + 0.5);
        cloud.x = Math.random() * app.screen.width;
        cloud.y = Math.random() * app.screen.height * 0.6;
        cloud.alpha = Math.random() * 0.4 + 0.3;
        cloud.speed = Math.random() * 0.2 + 0.1;
        clouds.push(cloud);
        app.stage.addChild(cloud);
      }
      
      app.ticker.add((delta) => {
        clouds.forEach(cloud => {
          cloud.x += cloud.speed * delta.deltaTime;
          if (cloud.x > app.screen.width + cloud.width) {
            cloud.x = -cloud.width;
          }
        });
      });
    };

    const createCloudTexture = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 100;

      const grad = ctx.createRadialGradient(100, 50, 10, 100, 50, 70);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(100, 50, 50, 0, Math.PI * 2);
      ctx.arc(150, 50, 40, 0, Math.PI * 2);
      ctx.arc(50, 50, 30, 0, Math.PI * 2);
      ctx.fill();
      
      return PIXI.Texture.from(canvas);
    };
    
    init();

    return () => {
      if(app) {
        app.destroy(true, true);
      }
    };
  }, []);

  return <div ref={pixiContainer} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default PixiBackground; 