import { useState } from 'react';
import PuzzleGrid from './PuzzleGrid';
import { PUZZLE_3_CONFIG, getCellColor, getCellColorWithRed, createInitialGrid } from '../../utils/puzzleConfig';
import '../../styles/puzzles/PuzzleInteractive.css';

export default function PuzzleInteractive({ onSubmitResult, onBack, puzzleConfig = PUZZLE_3_CONFIG, puzzleNumber = 3, useRedColor = false }) {
  const { greenCells, gridSize, resultGrid } = puzzleConfig;

  // grid state: 0 = empty, 1 = green (prefilled), 2 = yellow (user added), 3 = red (user added)
  const [grid, setGrid] = useState(() => createInitialGrid(greenCells, gridSize));

  const [showButtons, setShowButtons] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 1) return;

    const newGrid = grid.map(r => [...r]);
    // Toggle between empty (0) and yellow (2) or red (3)
    const fillValue = useRedColor ? 3 : 2;
    newGrid[row][col] = grid[row][col] === 0 ? fillValue : 0;
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
  const colorFunction = useRedColor ? getCellColorWithRed : getCellColor;

  return (
    <>
      <div className="puzzle-interactive-container">
        <h2 className="puzzle-title">Puzzle {puzzleNumber}</h2>
        <p className="puzzle-subtitle">Can you spot what changed? 🔍</p>
        
        <div className="puzzle-grid-row">
          <div className="puzzle-side">
            <p className="label label-start">Start</p>
            <div className="puzzle-outside-container">
              <PuzzleGrid grid={staticGrid} getCellColor={colorFunction} interactive={false} />
            </div>
          </div>

          <div className="arrow-large">→</div>

          <div className="puzzle-side">
            <p className="label label-finish">Finish</p>
            <div className="puzzle-outside-container">
              <PuzzleGrid grid={grid} getCellColor={colorFunction} onCellClick={handleCellClick} interactive={true} />
            </div>
            {showButtons && (
              <button className="reset-button" onClick={handleReset}>↺ Reset</button>
            )}
          </div>
        </div>
      </div>

      {showButtons && (
        <div className="navigation-buttons">
          <button className="back-button" onClick={onBack}>
            Back
          </button>
          <button className="continue-button" onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </>
  );
}