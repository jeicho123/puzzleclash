import './home.css'
import { useState, useEffect } from 'react'
import { LeaderboardChart } from '../components/ui/leaderboard'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import toast, { Toaster } from 'react-hot-toast'
import useSocket from '../hooks/useSocket'
import Logo from '../components/logo'
import DailyPuzzleStats from '../components/ui/puzzlehistory'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [game, setGame] = useState(new Chess());
  const [solution, setSolution] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [puzzleHistory, setPuzzleHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [clickedPiece, setClickedPiece] = useState(null);
  const [orientation, setOrientation] = useState("white");
  const socket = useSocket();
  const navigate = useNavigate();
  const customSquareStyles = {
    ...(lastMove && {
      [lastMove.from]: { 
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
      [lastMove.to]: { 
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      }
    }),
    ...(draggedPiece && {
      [draggedPiece]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      }
    }),
    ...(clickedPiece && {
      [clickedPiece.square]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      }
    })
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("request_leaderboard");
    socket.emit("request_puzzlehistory");

    socket.on("puzzlehistory_update", (data) => {
      setPuzzleHistory(data);
    });

    socket.on("leaderboard_update", (data) => {
      setLeaderboardData(data);
    });
  }, [socket]);

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const validateMove = (move) => {
    const newGame = new Chess(game.fen());
    if (newGame.move(move)) {
      return true;
    }
    return false;
  }

  const makeAMove = (move) => {
    setGame((prevGame) => {
      const newGame = new Chess(prevGame.fen()); 
      const moveResult = newGame.move(move); 
  
      if (moveResult) {
          setLastMove({
              from: moveResult.from,
              to: moveResult.to,
          });
      }
      return newGame;
    });
  }

  const undoMove = () => {
    setGame((prevGame) => {
      const newGame = { ...prevGame };
      newGame.undo();
      setLastMove(null);
      return newGame;
    });
  }

  const handleMove = (sourceSquare, targetSquare, piece) => {
    if (validateMove({ from: sourceSquare, to: targetSquare })) {
      makeAMove({ from: sourceSquare, to: targetSquare });
      
      let uciMove = sourceSquare + targetSquare;
  
      // Check for pawn promotion
      if (piece?.toLowerCase() === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1")) {
        uciMove += "q";
      }
  
      const expectedMove = solution[currentMoveIndex];
  
      if (uciMove === expectedMove) {
        if (currentMoveIndex === solution.length - 1) {
          socket.emit("increment_score");
          toast.success("Puzzle completed 🥳");
  
          setTimeout(() => {
            setLoading(true);
            setLastMove(null);
            fetchPuzzle();
          }, 100);
        } else {
          makeComputerMove();
        }
        return true;
      } else {
        toast.error("Incorrect move 🤔");
        setTimeout(() => {
          undoMove();
        }, 1000);
        return false;
      }
    }
    return false;
  };
  
  const onSquareClick = (square, piece) => {
    if (!clickedPiece && piece) {
      setClickedPiece({
        piece: piece,
        square: square
      });
    } else if (clickedPiece) {
      const result = handleMove(clickedPiece.square, square, clickedPiece.piece);
      setClickedPiece(null);
    }
  };

  const onDrop = (sourceSquare, targetSquare, piece) => {
    const result = handleMove(sourceSquare, targetSquare, piece);
    return result;
  };

  const onPieceDragBegin = (piece, square) => {
    setDraggedPiece(square);
    setClickedPiece(null);
  }

  const onPieceDragEnd = (piece, square) => {
    setDraggedPiece(null);
  }

  const fetchPuzzle = async () => {
    try {
      const response = await fetch("https://lichess.org/api/puzzle/KBt63");
      const data = await response.json();

      const { pgn } = data.game;
      const { solution } = data.puzzle;

      const moves = pgn.split(" ");
      const lastMove = moves.pop();
      const rest = moves.join(" ");

      setGame((prevGame) => {
        const newGame = { ...prevGame };
        newGame.load_pgn(rest);
        setOrientation(newGame.turn() === "w" ? "black" : "white");
        return newGame;
      });

      setSolution(solution);
      setCurrentMoveIndex(0);
      setLoading(false);

      setTimeout(() => {
        makeAMove(lastMove);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch puzzle:", error);
    }
  }

  const makeComputerMove = () => {
    if (currentMoveIndex + 1 < solution.length) {
      const nextMove = solution[currentMoveIndex + 1];
      setTimeout(() => {
        const sourceSquare = nextMove.slice(0, 2);
        const targetSquare = nextMove.slice(2, 4);
        
        makeAMove({
          from: sourceSquare,
          to: targetSquare,
        });
        setCurrentMoveIndex(currentMoveIndex + 2);
      }, 500);
    }
  }

  return (
    <>
      <Toaster position="top-left" />  
      <div className='flex flex-col gap-8 items-center justify-center min-h-screen'>
        <Logo />
        <Button 
          onClick={() => { navigate('/login'); }}
          className="absolute top-4 right-4 text-white font-bold rounded hidden lg:block"
        >
          Logout
        </Button>
        <div className='flex gap-8 items-center justify-center'>
          <div className='w-[600px]'>
            <Chessboard 
              position={game.fen()}
              onPieceDrop={onDrop}
              arePremovesAllowed={false}
              customSquareStyles={customSquareStyles}
              onPieceDragBegin={onPieceDragBegin}
              onPieceDragEnd={onPieceDragEnd}
              boardOrientation={orientation}
              isDraggablePiece={({ piece }) => {
                return orientation === "black" ? piece.startsWith("b") : piece.startsWith("w");
              }}
              onSquareClick={onSquareClick}
            />
          </div>
          <div className='w-[400px] h-[600px]'>
            <LeaderboardChart 
              data={leaderboardData} 
              username={localStorage.getItem('username')}
            />
          </div>
        </div>
        <DailyPuzzleStats puzzleHistory={puzzleHistory} />
      </div>
    </>
  )
}

export default Home;
