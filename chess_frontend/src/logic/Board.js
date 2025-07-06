import Piece from "./Pieces";


class Board {
  constructor(size) {
    this.size = size;
    this.board = [...Array(size)].map((_, row) =>
      [...Array(size)].map((_, col) => ({
        row,
        col,
        piece: null, // or set initial pieces as needed, e.g. new Piece('P'), etc.
      }))
    );
  }

  get boardState() {
    return this.board;
  }

  set boardState(newBoardState) {
    this.board = newBoardState;
  }

  isInBounds(move) {
    return (
      move.row >= 0 &&
      move.col >= 0 &&
      move.row < this.size &&
      move.col < this.size
    );
  }

  initBoard(){
    // Init Pawns
    for (let i = 0; i < 8; i++){
        this.board[1][i].piece = new Piece("black",{row:1, col:i},"pawn", "/sprites/pawnB.svg",1)
    }

    for (let i = 0; i < 8; i++){
        this.board[6][i].piece = new Piece("white",{row:6, col:i},"pawn", "/sprites/pawnW.svg",1)
    }

    // Init Rooks
    this.board[0][0].piece = new Piece("black",{row:0, col:0},"rook", "/sprites/rookB.svg", 5)
    this.board[0][7].piece = new Piece("black",{row:0, col:7},"rook", "/sprites/rookB.svg", 5)
    this.board[7][0].piece = new Piece("white",{row:7, col:0},"rook", "/sprites/rookW.svg", 5)
    this.board[7][7].piece = new Piece("white",{row:7, col:7},"rook", "/sprites/rookW.svg", 5)

    // Init Knights
    this.board[0][1].piece = new Piece("black",{row:0, col:1},"knight", "/sprites/knightB.svg", 3)
    this.board[0][6].piece = new Piece("black",{row:0, col:6},"knight", "/sprites/knightB.svg", 3)
    this.board[7][1].piece = new Piece("white",{row:7, col:1},"knight", "/sprites/knightW.svg", 3)
    this.board[7][6].piece = new Piece("white",{row:7, col:6},"knight", "/sprites/knightW.svg", 3)

    // Init Bishops
    this.board[0][2].piece = new Piece("black",{row:0, col:2},"bishop", "/sprites/bishopB.svg", 3)
    this.board[0][5].piece = new Piece("black",{row:0, col:5},"bishop", "/sprites/bishopB.svg", 3)
    this.board[7][2].piece = new Piece("white",{row:7, col:2},"bishop", "/sprites/bishopW.svg", 3)
    this.board[7][5].piece = new Piece("white",{row:7, col:5},"bishop", "/sprites/bishopW.svg", 3)

    // Init Queens
    this.board[0][3].piece = new Piece("black", {row: 0, col: 3},"queen", "/sprites/queenB.svg", 9)
    this.board[7][3].piece = new Piece("white", {row: 7, col: 3},"queen", "/sprites/queenW.svg", 9)

    // Init Kings
    this.board[0][4].piece = new Piece("black", {row: 0, col: 4},"king", "/sprites/kingB.svg")
    this.board[7][4].piece = new Piece("white", {row: 7, col: 4},"king", "/sprites/kingW.svg")
  }
}


export default Board;
