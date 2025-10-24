import PuzzleGrid from './PuzzleGrid';
import { PUZZLE_CONFIG, getCellColor, createInitialGrid } from '../utils/puzzleConfig';
import '../styles/UserPuzzleDisplay.css';

export default function UserPuzzleDisplay({ showResult = false }) {
  const { greenCells, gridSize, resultGrid } = PUZZLE_CONFIG;

  // Create start grid (same as PuzzleInteractive)
  const startGrid = createInitialGrid(greenCells, gridSize);

  return (
    <div className="user-puzzle-container">
      <h2 className="user-puzzle-title">Puzzle 1</h2>
      
      <div className="user-puzzle-grids">
        <div className="user-puzzle-side">
          <p className="user-label">Start</p>
          <div className="user-grid-container">
            <PuzzleGrid grid={startGrid} getCellColor={getCellColor} interactive={false} />
          </div>
        </div>

        <div className="user-arrow-large">→</div>

        <div className="user-puzzle-side">
          <p className="user-label">Finish</p>
          <div className="user-grid-container">
            <PuzzleGrid grid={showResult ? resultGrid : startGrid} getCellColor={getCellColor} interactive={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
