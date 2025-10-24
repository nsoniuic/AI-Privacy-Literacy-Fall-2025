// Shared puzzle configuration for Puzzle 1
export const PUZZLE_CONFIG = {
  greenCells: [
    [1, 2], [2, 1], [2, 3], [3, 2], [4, 3], [3, 4]
  ],
  gridSize: 6,
  resultGrid: [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 1, 2, 1, 0, 0],
    [0, 0, 1, 2, 1, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ],
};

export const getCellColor = (value) => {
  if (value === 1) return '#03b703ff';
  if (value === 2) return '#ffaa00';
  return 'black';
};

export const createInitialGrid = (greenCells, gridSize) => {
  const initialGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  greenCells.forEach(([row, col]) => {
    initialGrid[row][col] = 1;
  });
  return initialGrid;
};
