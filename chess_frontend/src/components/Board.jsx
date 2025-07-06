import { useEffect, useState } from "react";
import Board from "../logic/Board";
import validMoves from "../logic/MoveValidator";
import lookForChecks from "../logic/checkFinder";

const BoardUI = () => {
  const [myBoard, setMyBoard] = useState(new Board(8));
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedPieceCell, setSelectedPieceCell] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(true);
  const [capturedPieces, setCapturedPieces] = useState([[], []]);
  const [scores, setScores] = useState([0, 0]); // white, black
  const [kingSquares, setKingSquares] = useState([
    [7, 4],
    [0, 4],
  ]); // WhiteKing, BlackKing
  const [canCastle, setCanCastle] = useState([
    [true, true],
    [true, true],
  ]); // [white[kingSide, queenSide], black[kingSide, queenSide]]
  const [isCheckingKing, setIsCheckingKing] = useState(false);
  const [checkedKingPosition, setCheckedKingPosition] = useState(null);

  useEffect(() => {
    console.log("Current Score: White -", scores[0], " Black -", scores[1]);
  }, [scores]);

  useEffect(() => {
    console.log("Castleability: ");
    console.log(
      "White - KingSide: ",
      canCastle[0][0],
      "QueenSide: ",
      canCastle[0][1]
    );

    console.log(
      "Black - KingSide: ",
      canCastle[1][0],
      "QueenSide: ",
      canCastle[1][1]
    );
  }, [canCastle]);

  function refresh() {
    // Refresh state to re-render
    setMyBoard(
      Object.assign(Object.create(Object.getPrototypeOf(myBoard)), myBoard)
    );
  }

  function handleCellClick(row, col) {
    const selectedPiece = myBoard.board[row][col].piece;

    // 1. Move piece if clicked cell is a highlighted move
    const isMove = highlightedCells.some((c) => c.row === row && c.col === col);

    if (isMove && selectedPieceCell) {
      const oldRow = selectedPieceCell.row;
      const oldCol = selectedPieceCell.col;
      const movingPiece = myBoard.board[oldRow][oldCol].piece;

      const isWhitesTurn = currentTurn;
      const isWhitesPiece = movingPiece.color === "white";
      if (
        (isWhitesTurn && !isWhitesPiece) ||
        (!isWhitesTurn && isWhitesPiece)
      ) {
        return; // Not this piece’s turn
      }

      const targetPiece = myBoard.board[row][col].piece;

      if (targetPiece) {
        const isWhitesTurn = currentTurn;
        const captureIndex = isWhitesTurn ? 0 : 1; // white captures black, black captures white

        setCapturedPieces((prevCaptures) => {
          const newCaptures = [...prevCaptures];
          newCaptures[captureIndex] = [
            ...newCaptures[captureIndex],
            targetPiece,
          ];
          return newCaptures;
        });

        const pieceValue = targetPiece.point ?? 0; // default to 0 if undefined
        setScores((prevScores) => {
          const updated = [...prevScores];
          updated[captureIndex] += pieceValue;
          return updated;
        });
      }

      // Move the piece
      myBoard.board[row][col].piece = movingPiece;
      myBoard.board[oldRow][oldCol].piece = null;

      // Update King's position if Piece.type === 'king'

      if (movingPiece?.type === "king") {
        const colorIndex = movingPiece.color === "white" ? 0 : 1;

        // Update king position
        setKingSquares((prev) => {
          const updated = [...prev];
          updated[colorIndex] = [row, col];
          return updated;
        });

        // Disable castling for that color
        setCanCastle((prev) => {
          const updated = [...prev];
          updated[colorIndex][0] = updated[colorIndex][1] = false;
          return updated;
        });
      }

      if (movingPiece?.type === "rook") {
        const colorIndex = movingPiece.color === "white" ? 0 : 1;
        // Cancel King-side castling
        if (movingPiece?.position.col === 7) {
          setCanCastle((prev) => {
            const updated = [...prev];
            updated[colorIndex][0] = false;
            return updated;
          });
        }

        // Cancel Queen-side castling

        if (movingPiece?.position.col === 0) {
          setCanCastle((prev) => {
            const updated = [...prev];
            updated[colorIndex][1] = false;
            return updated;
          });
        }
      }

      // Update its internal position too
      if (movingPiece) {
        movingPiece.position = { row, col };

        // If castling done, update rook's position too
        if (movingPiece.type === "king") {
          const colorIndex = movingPiece.color === "white" ? 0 : 1;
          const rowIndex = colorIndex === 0 ? 7 : 0;

          // King-side castling
          if (row === rowIndex && col === 6) {
            const rook = myBoard.board[rowIndex][7].piece;
            myBoard.board[rowIndex][5].piece = rook;
            myBoard.board[rowIndex][7].piece = null;
            if (rook) rook.position = { row: rowIndex, col: 5 };
          }

          // Queen-side castling
          if (row === rowIndex && col === 2) {
            const rook = myBoard.board[rowIndex][0].piece;
            myBoard.board[rowIndex][3].piece = rook;
            myBoard.board[rowIndex][0].piece = null;
            if (rook) rook.position = { row: rowIndex, col: 3 };
          }
        }

        // 🔍 Check if this piece is checking the enemy king
        console.log("Checking for checks");
        const whiteKing =
          myBoard.board[kingSquares[0][0]][kingSquares[0][1]].piece;
        const blackKing =
          myBoard.board[kingSquares[1][0]][kingSquares[1][1]].piece;

        const whiteInCheck = lookForChecks(
          whiteKing,
          kingSquares,
          myBoard,
          canCastle
        );
        const blackInCheck = lookForChecks(
          blackKing,
          kingSquares,
          myBoard,
          canCastle
        );

        if (whiteInCheck) {
          console.log("White King is in check!");
          setCheckedKingPosition(kingSquares[0]);
        } else if (blackInCheck) {
          console.log("Black King is in check!");
          setCheckedKingPosition(kingSquares[1]);
        } else {
          console.log("No Kings in check");
          setCheckedKingPosition(null);
        }
      }

      // Refresh page for re-render
      refresh();

      // Clear highlights
      setHighlightedCells([]);
      setSelectedPieceCell(null);

      setCurrentTurn(!currentTurn);
      return;
    }

    // 2. Select piece to show valid moves
    if (!selectedPiece) {
      setHighlightedCells([]);
      setSelectedPieceCell(null);
      return;
    }

    const moves = validMoves(selectedPiece, myBoard, canCastle);
    setHighlightedCells(moves.map(([r, c]) => ({ row: r, col: c })));
    setSelectedPieceCell({ row, col });
  }

  useEffect(() => {
    const newBoard = new Board(8);
    newBoard.initBoard();
    // console.log(newBoard);
    setMyBoard(newBoard); // replace the whole board object
  }, []);

  const [currCell, setCurrCell] = useState({ row: 0, col: 0 });

  // console.log(currCell)

  if (!myBoard) return <div>Loading board...</div>;
  // console.log(myBoard.board);
  return (
    <div className="w-screen h-screen relative flex gap-7 items-center justify-center bg-gray-900">
      {/* Black Captures */}
      <div className="flex flex-col items-center justify-center h-3/4">
        <div className=" relative flex flex-col items-center justify-center h-full ">
          <span className="text-white min-w-32">
            White&apos;s Score: {scores[0]}
          </span>
          <div className="h-full w-full my-10 bg-gray-700 rounded-md relative p-2 flex flex-col items-center justify-center">
            {capturedPieces[0].map((p, i) => (
              <img key={i} src={p.sprite} className="w-10 h-auto mb-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex flex-col bg-white">
        {myBoard.board.map((rowArr, rowIdx) => (
          <div key={rowIdx} className="flex">
            {rowArr.map(({ row, col }) => {
              const tileColor = (row + col) % 2 === 0 ? "white" : "black";
              return (
                <Tile
                  key={col}
                  tileColor={tileColor}
                  piece={myBoard.board[row][col].piece}
                  onClick={() => handleCellClick(row, col)}
                  cell={{ row: row, col: col }}
                  activeCell={currCell}
                  highlightedCells={highlightedCells}
                  checkedKingPosition={checkedKingPosition}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* White Captures */}
      <div className="flex flex-col items-center justify-center h-3/4">
        <div className=" relative flex flex-col items-center justify-center h-full ">
          <span className="text-white min-w-32">
            Black&apos;s Score: {scores[1]}
          </span>
          <div className="h-full w-full my-10 bg-gray-700 rounded-md relative p-2 flex flex-col items-center justify-center">
            {capturedPieces[1].map((p, i) => (
              <img key={i} src={p.sprite} className="w-10 h-auto mb-1" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Tile = ({
  tileColor,
  piece,
  onClick,
  cell,
  activeCell,
  highlightedCells,
  checkedKingPosition,
}) => {
  const isActive = cell.row === activeCell?.row && cell.col === activeCell?.col;
  const isHighlighted = highlightedCells.some(
    (c) => c.row === cell.row && c.col === cell.col
  );

  return (
    <div
      className={`w-24 h-24 border-2 relative flex items-center justify-center ${
        tileColor === "white" ? "bg-white" : "bg-sky-800"
      } border-black ${isActive ? "border-white" : ""} cursor-pointer
      flex items-center justify-center flex-col
      ${
        checkedKingPosition &&
        piece?.type === "king" &&
        cell.row === checkedKingPosition[0] &&
        cell.col === checkedKingPosition[1]
          ? "bg-red-500"
          : ""
      }
      `}
      onClick={onClick}
    >
      <div>
        {/* Move highlighter */}
        <div
          className={` ${
            isHighlighted ? "absolute" : "hidden"
          }   top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[85%] h-[85%]  rounded-full  z-20 bg-yellow-400/35 `}
        />

        {/* For Checks (optional highlight ring) */}
        {checkedKingPosition &&
          piece?.type === "king" &&
          cell.row === checkedKingPosition[0] &&
          cell.col === checkedKingPosition[1] && (
            <div className="absolute inset-0 z-0 bg-red-500" />
          )}

        <img src={piece?.sprite} alt={piece?.sprite} className="scale-150" />
      </div>
    </div>
  );
};

export default BoardUI;
