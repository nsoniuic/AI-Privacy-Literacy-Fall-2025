import PuzzleGrid from './PuzzleGrid';
import { PUZZLE_1_CONFIG, getCellColor, getCellColorWithRed, createInitialGrid } from '../../utils/puzzleConfig';
import '../../styles/puzzles/PuzzleInteractiveExplain.css';

export default function PuzzleInteractiveExplain({ showResult = false, puzzleConfig = PUZZLE_1_CONFIG, puzzleNumber = 1, useRedColor = false }) {
  const { greenCells, gridSize, resultGrid } = puzzleConfig;

  // Create start grid (same as PuzzleInteractive)
  const startGrid = createInitialGrid(greenCells, gridSize);
  const colorFunction = useRedColor ? getCellColorWithRed : getCellColor;

  return (
    <div>
      <h2 className="user-puzzle-title">Puzzle {puzzleNumber}</h2>
      
      <div className="user-puzzle-grids">
        <div className="user-puzzle-side">
          <p className="user-label">Start</p>
          <div className="user-grid-container">
            <PuzzleGrid grid={startGrid} getCellColor={colorFunction} interactive={false} />
          </div>
        </div>

        <div className="user-arrow-large">→</div>

        <div className="user-puzzle-side">
          <p className="user-label">Finish</p>
          <div className="user-grid-container">
            <PuzzleGrid grid={showResult ? resultGrid : startGrid} getCellColor={colorFunction} interactive={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
