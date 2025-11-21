import { PUZZLE_1_CONFIG, PUZZLE_2_CONFIG, getCellColor, createInitialGrid } from '../../utils/puzzleConfig';
import PuzzleGrid from './PuzzleGrid';
import p2input from '../../assets/p2input.png';
import p2output from '../../assets/p2output.png';
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

  // Use images for puzzle 2 instead of grids
  if (puzzleNumber === 2) {
    // Broken fence positions for Puzzle 2 (10x10 grid)
    // Each position is [row, col] which we'll convert to percentage positions
    const brokenFencePositions = [
      { row: 2, col: 3 },  // Top left broken area
      { row: 7, col: 5 },
      { row: 5, col: 5 },
      { row: 6, col: 7 },
    ];

    // Convert grid position to percentage (10x10 grid)
    const getPosition = (row, col) => {
      return {
        top: `${(row / 10) * 100 + 5}%`,  // 5% offset to center in cell
        left: `${(col / 10) * 100 + 5}%`,
      };
    };

    return (
      <div>
        <h2 className="sample-puzzle-title">Puzzle {puzzleNumber}</h2>
        
        <div className="sample-puzzle-grids">
          <div className="sample-puzzle-side">
            <p className="sample-label sample-label-start">Start</p>
            <div className="sample-grid-container puzzle-image-wrapper">
              <img src={p2input} alt="Puzzle 2 Start" className="sample-puzzle-image" />
              {brokenFencePositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="broken-fence-marker"
                  style={getPosition(pos.row, pos.col)}
                >
                  ✖
                </div>
              ))}
            </div>
          </div>

          <div className="sample-arrow-large">→</div>

          <div className="sample-puzzle-side">
            <p className="sample-label sample-label-finish">Finish</p>
            <div className="sample-grid-container">
              <img src={p2output} alt="Puzzle 2 Finish" className="sample-puzzle-image" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
