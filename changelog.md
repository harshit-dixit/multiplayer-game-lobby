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
