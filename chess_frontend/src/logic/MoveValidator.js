export default function validMoves(Piece, myBoard, canCastle) {
  let possibleMoves = [];
  let { row, col } = Piece.position;

  switch (Piece.type) {
    case "pawn":
      const direction = Piece.color === "white" ? -1 : 1;
      const startRow = Piece.color === "white" ? 6 : 1;
      const r = Piece.position.row;
      const c = Piece.position.col;

      // Always consider forward one square
      possibleMoves.push([r + direction, c]);

      // Two-step from starting row
      if (r === startRow) {
        possibleMoves.push([r + 2 * direction, c]);
      }

      // Diagonal captures (only candidates, filtering handles validity)
      possibleMoves.push([r + direction, c - 1]);
      possibleMoves.push([r + direction, c + 1]);
      break;

    case "knight":
      possibleMoves = [
        [Piece.position.row + 2, Piece.position.col + 1],
        [Piece.position.row + 2, Piece.position.col - 1],
        [Piece.position.row - 2, Piece.position.col + 1],
        [Piece.position.row - 2, Piece.position.col - 1],
        [Piece.position.row + 1, Piece.position.col + 2],
        [Piece.position.row + 1, Piece.position.col - 2],
        [Piece.position.row - 1, Piece.position.col + 2],
        [Piece.position.row - 1, Piece.position.col - 2],
      ];
      break;

    case "bishop":
      // Top-right diagonal
      for (let i = 1; row - i >= 0 && col + i < 8; i++) {
        possibleMoves.push([row - i, col + i]);
      }
      // Top-left diagonal
      for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
        possibleMoves.push([row - i, col - i]);
      }
      // Bottom-right diagonal
      for (let i = 1; row + i < 8 && col + i < 8; i++) {
        possibleMoves.push([row + i, col + i]);
      }
      // Bottom-left diagonal
      for (let i = 1; row + i < 8 && col - i >= 0; i++) {
        possibleMoves.push([row + i, col - i]);
      }

      break;

    case "rook":
      // Up
      for (let i = 1; row - i >= 0; i++) {
        possibleMoves.push([row - i, col]);
      }

      // Down
      for (let i = 0; row + i < 8; i++) {
        possibleMoves.push([row + i, col]);
      }

      // Left
      for (let i = 1; col - i >= 0; i++) {
        possibleMoves.push([row, col - i]);
      }

      // Right
      for (let i = 0; col + i < 8; i++) {
        possibleMoves.push([row, col + i]);
      }

      break;

    case "queen":
      // Combine rook and bishop moves for the queen
      possibleMoves = [
        ...validMoves({ ...Piece, type: "rook" }),
        ...validMoves({ ...Piece, type: "bishop" }),
      ];
      break;

    case "king":
      possibleMoves = [
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1],
        [row, col + 1],
        [row, col - 1],
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
      ];

      const rowIndex = Piece.color === "white" ? 7 : 0;

      // King-side castling
      if (
        canCastle[Piece.color === "white" ? 0 : 1] &&
        canCastle[Piece.color === "white" ? 0 : 1]
      ) {
        const squaresBetween = [
          myBoard?.board[rowIndex][5]?.piece,
          myBoard?.board[rowIndex][6]?.piece,
        ];
        const allEmpty = squaresBetween.every((p) => !p);

        if (allEmpty) {
          possibleMoves.push([rowIndex, 6]);
        }
      }

      // Queen-side castling
      if (
        canCastle[Piece.color === "white" ? 0 : 1] &&
        canCastle[Piece.color === "white" ? 0 : 1]
      ) {
        const squaresBetween = [
          myBoard?.board[rowIndex][1]?.piece,
          myBoard?.board[rowIndex][2]?.piece,
          myBoard?.board[rowIndex][3]?.piece,
        ];
        const allEmpty = squaresBetween.every((p) => !p);

        if (allEmpty) {
          possibleMoves.push([rowIndex, 2]);
        }
      }

      break;

    default:
      possibleMoves = [];
      break;
  }

  const allowedMoves = possibleMoves.filter(([r, c]) => {
    // Edge case for outOfBounds
    if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;

    // For knight and king, just check destination
    if (Piece.type === "knight" || Piece.type === "king") {
      const target = myBoard?.board[r][c]?.piece;
      return !target || target.color !== Piece.color;
    }

    // Pawn moves
    if (Piece.type === "pawn") {
      const target = myBoard?.board[r][c]?.piece;
      const direction = Piece.color === "white" ? -1 : 1;
      const startRow = Piece.color === "white" ? 6 : 1;

      const rowDiff = r - Piece.position.row;
      const colDiff = c - Piece.position.col;

      // Diagonal capture
      if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        return target && target.color !== Piece.color;
      }

      // One-step forward
      if (colDiff === 0 && rowDiff === direction) {
        return !target;
      }

      // Two-step forward from starting position
      if (
        colDiff === 0 &&
        rowDiff === 2 * direction &&
        Piece.position.row === startRow
      ) {
        const midRow = Piece.position.row + direction;
        const midCell = myBoard?.board[midRow][c]?.piece;
        const destCell = myBoard?.board[r][c]?.piece;

        return !midCell && !destCell;
      }

      return false;
    }

    // For sliding pieces (rook, bishop, queen), block after first piece
    // Find direction
    let dr = Math.sign(r - row);
    let dc = Math.sign(c - col);
    let currRow = row + dr;
    let currCol = col + dc;
    while (currRow !== r || currCol !== c) {
      if (myBoard?.board[currRow][currCol]?.piece) return false;
      currRow += dr;
      currCol += dc;
    }
    if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;
    const target = myBoard?.board[r][c]?.piece;
    return !target || target.color !== Piece.color;
  });

  return allowedMoves;
}
