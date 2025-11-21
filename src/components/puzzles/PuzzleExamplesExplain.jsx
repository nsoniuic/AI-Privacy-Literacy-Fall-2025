import { PUZZLE_1_CONFIG, PUZZLE_2_CONFIG, getCellColor, createInitialGrid } from '../../utils/puzzleConfig';
import PuzzleGrid from './PuzzleGrid';
import '../../styles/puzzles/PuzzleExamplesExplain.css';

export default function PuzzleExamplesExplain({ puzzleNumber, explanationIndex }) {
  // Select the appropriate configuration based on puzzle number
  const getConfig = () => {
    if (puzzleNumber === 1) {
      return PUZZLE_1_CONFIG;
    } else if (puzzleNumber === 2) {
      return PUZZLE_2_CONFIG;
    }
    return PUZZLE_1_CONFIG;
  };

  const config = getConfig();
  const startGrid = createInitialGrid(config.greenCells, config.gridSize);
  const finishGrid = config.resultGrid;

  // Add glow effect to green cells on first explanation screen
  const shouldGlowGreen = explanationIndex === 0;
  // Add glow effect to yellow cells and arrow on second explanation screen
  const shouldGlowYellow = explanationIndex === 1;
  const shouldGlowArrow = explanationIndex === 1;

  return (
    <div>
      <h2 className="sample-puzzle-title">Puzzle {puzzleNumber}</h2>
      
      <div className="sample-puzzle-grids">
        <div className="sample-puzzle-side">
          <p className="sample-label sample-label-start">Start</p>
          <div className="sample-grid-container">
            <PuzzleGrid 
              grid={startGrid} 
              getCellColor={getCellColor}
              interactive={false}
              glowGreen={shouldGlowGreen}
            />
          </div>
        </div>

        <div className={`sample-arrow-large ${shouldGlowArrow ? 'glow-arrow' : ''}`}>→</div>

        <div className="sample-puzzle-side">
          <p className="sample-label sample-label-finish">Finish</p>
          <div className="sample-grid-container">
            <PuzzleGrid 
              grid={finishGrid} 
              getCellColor={getCellColor}
              interactive={false}
              glowGreen={false}
              glowYellow={shouldGlowYellow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
