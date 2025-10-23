import { useState } from 'react';
import '../styles/PuzzleInteractive.css';
import p1input from '../assets/p1input.png';

export default function PuzzleInteractive() {
  const greenCells = [
    [1, 2], [2, 1], [2, 3], [3, 2], [4, 3], [3, 4]
  ];

  // 6x6 grid state: 0 = empty, 1 = green (prefilled), 2 = yellow (user added)
  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    greenCells.forEach(([row, col]) => {
      initialGrid[row][col] = 1;
    });
    return initialGrid;
  });

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
  };

  const handleSubmit = () => {
    // TODO: Add submission logic
    console.log('Submitted grid:', grid);
  };

  const getCellColor = (value) => {
    if (value === 1) return '#03b703ff';
    if (value === 2) return '#ffaa00';
    return 'black';
  };

  return (
    <>
      <div className="puzzle-interactive-container">
        <h2 className="puzzle-title">Puzzle 1</h2>
        
        <div className="puzzle-grid-row">
          <div className="puzzle-side">
            <p className="label">Start</p>
            <div className="puzzle-outside-container">
                <img src={p1input} alt="Puzzle 1 Output" className="puzzle-image" />
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

      <div className="button-container">
        <button className="reset-button" onClick={handleReset}>Reset</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}