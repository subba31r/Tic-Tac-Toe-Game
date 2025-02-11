import { useState } from 'react';
import "./styles.css";

function Square({ value, onSquareClick, highlight }) {
  const getTextStyle = (value) => {
    if (value === 'X') {
      return {
        color: '#ff5e57', 
        fontWeight: 'bold',
      };
    } else if (value === 'O') {
      return {
        color: '#57c1ff',
        fontWeight: 'bold',
      };
    } else {
      return {};
    }
  };

  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      <span style={getTextStyle(value)}>{value}</span>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(i) {
    if (winner || squares[i]) return; 
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            highlight={winningLine?.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameResults, setGameResults] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const { winner, line: winningLine } = calculateWinner(currentSquares) || {};

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    if (calculateWinner(nextSquares)) {
      setGameResults([{ winner: calculateWinner(nextSquares).winner, board: nextSquares, line: calculateWinner(nextSquares).line }, ...gameResults]);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game-container">
      <div className="game">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
      </div>
      <div className="game-history">
        <h2>Game History</h2>
        <ul>
          {gameResults.map((result, index) => (
            <li key={`${index}-${result.winner}`}>
              <strong>{result.winner} won!</strong>
              <div className="history-board">
                {result.board.map((sq, i) => (
                  <div key={i} className={`history-square ${result.line.includes(i) ? 'highlight' : ''}`}>
                    {sq}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <h1>Tic Tac Toe</h1>
      <Game />
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
