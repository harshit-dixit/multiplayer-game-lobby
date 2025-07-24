# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Initial project setup.
- `PLAN.md`: Detailed development plan.
- `changelog.md`: This changelog file.
- Fixed backend bug: Added 'startGame' event handler to emit 'gameStarted' with initial game state, enabling the game to start from the frontend.
- Added 'roomCode' property to the room object sent to the frontend, fixing the Room Code display in the waiting room.
- Preparing to redesign the frontend UI for a beautiful, modern multiplayer game experience.
- Refactored frontend to use react-router-dom with HomeScreen, LobbyScreen, and GameScreen routes as per UI_Design.md.
- Added global styles and color variables for the new design system.
- Implemented a modern HomeScreen with game selection cards and navigation.
- Added PhaserBackground component with animated clouds and floating blocks to HomeScreen for a Minecraft-inspired, attractive look using Phaser scenes and animation.
- LobbyScreen and GameScreen are currently placeholders for further UI work.
- Redesigned HomeScreen with a full-page, animated parallax landscape background using Phaser for a more immersive and attractive UI.
- Updated UI elements with a semi-transparent, blurred glass effect to ensure readability and style over the detailed background.
- Fixed a critical bug where the parallax background was not visible due to broken asset URLs. Updated image paths to point to the stable official Phaser 3 examples GitHub repository.

### Changed

- Replaced the Phaser.js background with a new physics-based background using Pixi.js and Matter.js to create a more interactive, "Angry Birds"-style lobby experience. This change includes removing all old Phaser assets and dependencies.
- Tic Tac Toe: Server now supports player symbol selection (X/O) by both players. The first to choose locks their choice; the other is assigned the remaining symbol. Added a new socket event for symbol selection and updated the room/player structure.
- Tic Tac Toe: Added score tracking per player in each room. Scores are incremented on win and sent to clients after each game.
- Tic Tac Toe: Client lobby/waiting room now allows both players to choose X or O. The first to choose locks their choice; the other is assigned the remaining symbol. UI reflects chosen/locked symbols.
- Tic Tac Toe: Game screen now displays player names and symbols for turns and win messages (e.g., "Alice's Turn (X)", "Bob Won.", "You won").
- Tic Tac Toe: Scores are tracked and displayed below the room name for both players, updating after each game.

### Fixed

- Corrected an asset loading issue in the `PhaserBackground` component that prevented the background from rendering. The component now correctly processes the asset array.
- The sun asset is now loaded and displayed in the background, with a subtle rotation animation.
- Removed a global background color that was obscuring the animated background, making it visible across the application.

### Redesigned

- **Complete UI Overhaul**: Implemented a new, modern design system to create a more attractive and "game-like" user experience.
  - **New Font**: Added the "Lilita One" Google Font for a playful, bold aesthetic.
  - **New Color Palette**: Established a vibrant new color palette for a cohesive look and feel.
  - **Redesigned Components**: Overhauled all UI components (`Button`, `Card`, `Input`) with a chunky, tactile, and modern style.
- **New Parallax Background**: Replaced the previous background with a beautiful, layered parallax scene to create a sense of depth and immersion.
- **Redesigned Screens**: Applied the new design system to the `HomeScreen`, `LobbyScreen`, `WaitingRoom`, and `GameScreen` for a polished and consistent user experience.
- **Added "Play Again" Feature**: Added a "Play Again" button to the `GameScreen` to allow for quick rematches.
