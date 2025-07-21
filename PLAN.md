# Multiplayer Web Game Lobby: Development Plan

This document outlines the development plan for creating a multiplayer game lobby, starting with Tic-Tac-Toe and later expanding to include other games like Connect Four.

## 1. Core Technologies

*   **Backend:** Node.js, Express, Socket.io
*   **Frontend:** React (with Vite), CSS for styling.
    *   **Note on Phaser.js:** While Phaser is excellent for complex 2D games, for simple grid-based games like Tic-Tac-Toe and Connect Four, using React's component model with standard HTML/CSS is more lightweight and efficient. We will proceed with this approach and can integrate Phaser later if more complex games are added.
*   **Database:** MongoDB (for future enhancements like leaderboards)

---

## Phase 1: Tic-Tac-Toe Implementation

###  स्टेप 1: Project Setup

1.  **Initialize Git:** The project is already a Git repository.
2.  **Create Directory Structure:**
    *   `server/`: For the Node.js backend.
    *   `client/`: For the React frontend.

### स्टेप 2: Backend (server/) Development

1.  **Initialize Node.js Project:**
    *   `cd server`
    *   `npm init -y`
2.  **Install Dependencies:**
    *   `npm install express socket.io cors`
    *   `npm install --save-dev nodemon`
3.  **Create `server/index.js`:**
    *   Set up an Express server on port 4000.
    *   Integrate Socket.io.
    *   Enable CORS for `http://localhost:3000`.
4.  **Implement Room Management (`server/rooms.js`):**
    *   Use an in-memory `Map` to store room data.
    *   Room object structure:
        ```javascript
        {
          gameType: "TicTacToe",
          players: [ { id, name, symbol } ],
          state: { board: Array(9).fill(null), turn: "X" }
        }
        ```
5.  **Create Tic-Tac-Toe Logic (`server/ticTacToe.js`):**
    *   `createGame()`: Returns the initial game state.
    *   `makeMove(state, index, symbol)`: Processes a move and returns the new state, winner, or draw status.
6.  **Define Socket.io Events:**
    *   `connection`: Handle new client connections.
    *   `createRoom`: Create a new game room.
    *   `joinRoom`: Allow a player to join an existing room.
    *   `makeMove`: Handle a player's move and broadcast updates.
    *   `disconnect`: Clean up when a player disconnects.

### स्टेप 3: Frontend (client/) Development

1.  **Initialize React Project:**
    *   `cd client`
    *   `npm create vite@latest . --template react`
    *   `npm install`
2.  **Install Dependencies:**
    *   `npm install socket.io-client`
3.  **Set up Component Structure:**
    *   `src/components/CreateJoinForm.jsx`: Form to create or join a room.
    *   `src/components/WaitingRoom.jsx`: Shows players in the room before the game starts.
    *   `src/components/GameBoard.jsx`: The Tic-Tac-Toe game board.
    *   `src/App.jsx`: Main application component to manage views and state.
4.  **Implement Socket.io Integration (`src/socket.js`):**
    *   Initialize and export the Socket.io client instance.
5.  **Develop UI Components:**
    *   Implement the forms, buttons, and game board.
    *   Connect UI elements to Socket.io events to communicate with the server.

### स्टेप 4: Testing

1.  **Run Backend and Frontend:**
    *   `npm run dev` in both `server/` and `client/` directories.
2.  **Perform Manual Testing:**
    *   Open two browser windows to `http://localhost:3000`.
    *   Create a room in one window and join with the other.
    *   Play the game and verify that the state is synced in real-time.
    *   Test win and draw conditions.

---

## Phase 2: Connect Four Implementation

### स्टेप 1: Backend

1.  **Create Connect Four Logic (`server/connectFour.js`):**
    *   `createGame()`: Returns the initial game state (6x7 grid).
    *   `makeMove(state, column, symbol)`: Processes a move and checks for a win.
2.  **Update Room Management:**
    *   Modify the `createRoom` event to accept a `gameType` parameter.
    *   Store the selected game logic in the room object.

### स्टेप 2: Frontend

1.  **Add Game Selection to UI:**
    *   Update `CreateJoinForm.jsx` to include a dropdown for selecting the game (Tic-Tac-Toe or Connect Four).
2.  **Create `ConnectFourBoard.jsx`:**
    *   Implement the Connect Four game board component.
3.  **Conditionally Render Game Board:**
    *   In `App.jsx`, render the correct game board based on the `gameType` in the room data.

---

## Phase 3: Future Enhancements

*   **User Authentication:** Implement user accounts and login.
*   **Database Integration:** Persist user data, game history, and leaderboards in MongoDB.
*   **Leaderboards:** Create a new component to display player rankings.
*   **Deployment:** Deploy the application to a platform like Netlify or Vercel.

---

## Changelog

All changes and progress will be documented in `changelog.md`.
