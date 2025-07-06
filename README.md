# ♟️ React Chess Game

A full-featured chess game built from scratch using React.  
All game logic, board setup, piece movement, capturing, and score tracking are implemented manually — no external chess libraries used!

## 🚀 Features

- Interactive chess board UI
- Custom game logic for each piece
- Turn-based movement with highlighting
- Capture tracking with live scores
- Castling and check detection
- Fully responsive and customizable

## ✅ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Logic:** Pure JavaScript (OOP-based board, pieces, and move validation)
- **State Management:** React `useState`, `useEffect`

## 📸 Screenshots

> *(Add screenshots here if available — maybe a gif showing piece movement and check detection!)*

## ⚒️ Still in Progress

- [ ] **Castling logic**: Add path obstruction checks  
- [ ] **Check rule enforcement**: Restrict moves to only those that escape check  
- [ ] **Pawn promotion**: Implement choice of piece on reaching the final rank  

## 📁 Project Structure

### frontend

/src
├── components/
│ └── BoardUI.jsx # Main board UI with state handling
│ └── socket.js   # To be used for realtime game handling
├── logic/
│ ├── Board.js         # Board class and structure
│ ├── Piece.js         # Base class for chess pieces
│ ├── MoveValidator.js # Core move validation logic
│ └── checkFinder.js   # Check detection logic
└── App.jsx

### backend

Still under development

## 🧠 Learning Goals

This project is a personal challenge to:

- Understand chess rules deeply
- Apply object-oriented programming in JavaScript
- Handle stateful UI logic with React
- Design reusable game logic components
- Use services like socket.io to understand websockets

## 📌 How to Run

```bash
npm install
npm run dev```
