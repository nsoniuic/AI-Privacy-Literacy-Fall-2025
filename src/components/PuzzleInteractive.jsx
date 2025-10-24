import { useState } from 'react';
import PuzzleGrid from './PuzzleGrid';
import { PUZZLE_CONFIG, getCellColor, createInitialGrid } from '../utils/puzzleConfig';
import '../styles/PuzzleInteractive.css';

export default function PuzzleInteractive({ onSubmitResult }) {
  const { greenCells, gridSize, resultGrid } = PUZZLE_CONFIG;

  // 6x6 grid state: 0 = empty, 1 = green (prefilled), 2 = yellow (user added)
  const [grid, setGrid] = useState(() => createInitialGrid(greenCells, gridSize));

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
    setGrid(createInitialGrid(greenCells, gridSize));
    setShowButtons(true);
    setShowResult(false);
  };

  const checkGridMatch = () => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
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

  // Create a static grid for the left side
  const staticGrid = createInitialGrid(greenCells, gridSize);

  return (
    <>
      <div className="puzzle-interactive-container">
        <h2 className="puzzle-title">Puzzle 1</h2>
        
        <div className="puzzle-grid-row">
          <div className="puzzle-side">
            <p className="label">Start</p>
            <div className="puzzle-outside-container">
              <PuzzleGrid grid={staticGrid} getCellColor={getCellColor} interactive={false} />
            </div>
          </div>

          <div className="arrow-large">→</div>

          <div className="puzzle-side">
            <p className="label">Finish</p>
            <div className="puzzle-outside-container">
              <PuzzleGrid grid={grid} getCellColor={getCellColor} onCellClick={handleCellClick} interactive={true} />
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