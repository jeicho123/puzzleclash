# PuzzleClash

A real-time multiplayer chess puzzle solving app that includes a live leaderboard and daily puzzle tracking.

## Demo
https://github.com/user-attachments/assets/93b0f3e2-870b-42e5-bffb-e5a2eba36acc
  
https://puzzleclash.onrender.com  
(deployed on Render, may take a few seconds upon initial load to cold start backend server from auto-sleep)
## Features

- Interactive Chessboard - Seamless puzzle solving experience with new random puzzles
- Websocket Integration - Real time updates
  - Live Leaderboard - See your score and other players' scores update instantly
  - Puzzle History - Track daily puzzle score over time
- JWT Authentication - Secure login and personalized stats

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT


### Frontend
- React.js
- Socket.IO Client
- react-chessboard (chessboard UI)
- chessjs (game logic)


## Getting Started
### Prerequisites

- Node.js
- MongoDB account
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeicho123/puzzleclash.git
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

### Running the Application

1. Start the server:
   ```bash
   npm run start
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:3001`
