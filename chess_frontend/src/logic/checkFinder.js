import validMoves from "./MoveValidator";

/* 

Board class schema

constructor(size) {
    this.size = size;
    this.board = [...Array(size)].map((_, row) =>
    [...Array(size)].map((_, col) => ({
        row,
        col,
        piece: null, // or set initial pieces as needed, e.g. new Piece('P'), etc.
    }))
    );
} */

export default function lookForChecks(king, kingSquares, myBoard, canCastle) {
  const kingColor = king?.color;
  const kingIndex = kingColor === "white" ? 0 : 1;
  const kingPos = kingSquares[kingIndex];

  for (let row = 0; row < myBoard.size; row++) {
    for (let col = 0; col < myBoard.size; col++) {
      const piece = myBoard.board[row][col].piece;

      if (piece && piece.color !== kingColor) {
        const moves = validMoves(piece, myBoard, canCastle);

        if (moves.some(([r, c]) => r === kingPos[0] && c === kingPos[1])) {
          return true; // King is under threat
        }
      }
    }
  }

  return false;
}
