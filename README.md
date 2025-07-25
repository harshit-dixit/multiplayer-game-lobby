# Multiplayer Game Lobby 🎮

Welcome to **Multiplayer Game Lobby** – a full-stack web application that lets friends jump into classic board-style games together in real-time.  The project currently ships with fully-playable **Tic-Tac-Toe** and an early **Connect Four** beta, and is designed to be easily extended with new games.

<p align="center">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
  <img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20Socket.io%20%7C%20React%20%7C%20Vite-lightgrey" />
</p>

---

## ✨ Features

• **Instant Multiplayer Rooms** – create a private room with a single click and share the 4-letter code with friends.

• **Real-time Gameplay** – powered by Socket.io websockets – every move is synced live across all connected clients.

• **Multiple Games**
  - **Tic-Tac-Toe** (2-player)
  - **Connect Four** (up to 4 players, beta)

• **Rematch & Score Tracking** – challenge your opponent to a rematch and keep track of round-by-round scores.

• **Polished UI** – React, Vite and PixiJS combine for a snappy interface with subtle animations and ambient particle backgrounds.

• **Extensible Architecture** – adding a new turn-based game is as simple as dropping your game logic into the `server/` folder and a React board into `client/src/components/`.

---

## 📂 Project Structure

```
multiplayer-game-lobby
├── client                # React + Vite front-end
│   ├── src
│   │   ├── components    # Reusable UI & game boards
│   │   ├── screens       # Route containers (Home, Lobby, Game)
│   │   ├── context       # Global React context
│   │   └── socket.js     # Socket.io client instance
│   └── public            # Static assets
└── server                # Express + Socket.io back-end
    ├── index.js          # API + websocket entrypoint
    ├── rooms.js          # In-memory room registry helper
    ├── ticTacToe.js      # Game rules / reducer
    └── connectFour.js    # Game rules / reducer (beta)
```

---

## 🚀 Quick Start

### 1. Prerequisites

• Node.js ≥ 18

### 2. Clone & Install

```bash
git clone https://github.com/harshit-dixit/multiplayer-game-lobby.git
cd multiplayer-game-lobby

# Install root-level dev tools (optional)
npm install

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 3. Start Development Servers

Run the back-end (port **4000** by default):

```bash
cd server
npm run dev
```

Run the front-end (port **5173** by default – Vite):

```bash
cd ../client
npm run dev
```

Open `http://localhost:5173` in 2 browser tabs (or share your local network URL) and start playing!

---

## 🛠  Available Scripts

### Client (React)

| Script          | Description                       |
|-----------------|-----------------------------------|
| `npm run dev`   | Launch Vite dev server with HMR   |
| `npm run build` | Bundle for production             |
| `npm run preview` | Preview the production build    |

### Server (Node.js)

| Script          | Description                       |
|-----------------|-----------------------------------|
| `npm run dev`   | Start Express + Socket.io via Nodemon (auto-reload) |
| `npm start`     | Start in production mode          |

---

## 🧩 Adding Your Own Game

1. **Back-end** – create `<game>.js` inside `server/` exporting:
   ```js
   module.exports = {
     createGame: () => initialState,
     makeMove: (state, params) => ({ state: newState, winner, isDraw })
   }
   ```
2. **Front-end** – add a board component under `client/src/components/` and render it conditionally in `GameScreen.jsx`.
3. Update the game dropdown in `CreateJoinForm.jsx` and you’re done!

---

## 📈 Roadmap

- [x] Tic-Tac-Toe MVP
- [x] Connect Four beta with up to 4 players
- [ ] MongoDB persistence (rooms, leaderboards)
- [ ] User accounts & authentication
- [ ] Deploy to Vercel (client) & Render (server)
- [ ] More games (Gomoku, Checkers, Reversi…)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m 'feat: add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License.  See `LICENSE` for more information.

---

## 🙏 Acknowledgements

Inspired by countless online board-game nights and the open-source community.  Special thanks to [Socket.io](https://socket.io), [React](https://react.dev) and [PixiJS](https://pixijs.com/) for the amazing tooling. 