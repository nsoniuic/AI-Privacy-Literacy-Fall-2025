import { useState } from 'react';
import '../styles/PuzzleInteractive.css';

export default function PuzzleInteractive({ onSubmitResult }) {
  const greenCells = [
    [1, 2], [2, 1], [2, 3], [3, 2], [4, 3], [3, 4]
  ];

  // Define the correct solution grid
  // 0 = empty, 1 = green (prefilled), 2 = yellow (user should add)
  const resultGrid = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 1, 2, 1, 0, 0],
    [0, 0, 1, 2, 1, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];

  // 6x6 grid state: 0 = empty, 1 = green (prefilled), 2 = yellow (user added)
  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    greenCells.forEach(([row, col]) => {
      initialGrid[row][col] = 1;
    });
    return initialGrid;
  });

  const [showButtons, setShowButtons] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 1) return;

    const newGrid = grid.map(r => [...r]);
    // Toggle between empty (0) and yellow (2)
    newGrid[row][col] = grid[row][col] === 0 ? 2 : 0;
    setGrid(newGrid);
  };

  const handleReset = () => {
    const resetGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    greenCells.forEach(([row, col]) => {
      resetGrid[row][col] = 1;
    });
    setGrid(resetGrid);
    setShowButtons(true);
    setShowResult(false);
  };

  const checkGridMatch = () => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (resultGrid[row][col] !== grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    const correct = checkGridMatch();
    setIsCorrect(correct);
    setShowButtons(false);
    setShowResult(true);
    
    // Call the parent callback with the result
    if (onSubmitResult) {
      onSubmitResult(correct);
    }
  };

  const getCellColor = (value) => {
    if (value === 1) return '#03b703ff';
    if (value === 2) return '#ffaa00';
    return 'black';
  };

  // Create a static grid for the left side
  const staticGrid = Array(6).fill(null).map(() => Array(6).fill(0));
  greenCells.forEach(([row, col]) => {
    staticGrid[row][col] = 1;
  });

  return (
    <>
      <div className="puzzle-interactive-container">
        <h2 className="puzzle-title">Puzzle 1</h2>
        
        <div className="puzzle-grid-row">
          <div className="puzzle-side">
            <p className="label">Start</p>
            <div className="puzzle-outside-container">
                <div className="grid-interactive">
                {staticGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                    {row.map((cell, colIndex) => (
                        <div
                        key={`${rowIndex}-${colIndex}`}
                        className="grid-cell"
                        style={{ backgroundColor: getCellColor(cell) }}
                        />
                    ))}
                    </div>
                ))}
                </div>
            </div>
          </div>

          <div className="arrow-large">→</div>

          <div className="puzzle-side">
            <p className="label">Finish</p>
            <div className="puzzle-outside-container">
                <div className="grid-interactive">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                    {row.map((cell, colIndex) => (
                        <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${cell === 1 ? 'locked' : 'clickable'}`}
                        style={{ backgroundColor: getCellColor(cell) }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        />
                    ))}
                    </div>
                ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {showButtons && (
        <div className="button-container">
          <button className="reset-button" onClick={handleReset}>Reset</button>
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </>
  );
}