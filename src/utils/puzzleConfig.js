export const PUZZLE_1_CONFIG = {
  greenCells: [
    [1, 2], [2, 1], [2, 3], [3, 2], [4, 3], [3, 4],
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

export const PUZZLE_2_CONFIG = {
  greenCells: [
    // Top left broken area
    [0, 1], [1, 1],
    // Top section with complete loop
    [1, 3], [1, 4], [1, 5],
    [2, 3], [2, 5],
    [3, 3], [3, 4], [3, 5],
    // Middle scattered cells
    [4, 1], [4, 2],
    [5, 1],
    // Bottom right complete loop
    [5, 4],
    [6, 4], [6, 5],
    [7, 4], [7, 5],
  ],
  gridSize: 10,
  resultGrid: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

export const PUZZLE_3_CONFIG = {
  greenCells: [
    [1, 2], [2, 1], [2, 3], [3, 2], [4, 3], [3, 4],
    [0, 0], [1, 0], [0, 4], [0, 5],
    [2, 5], [1, 5],
  ],
  gridSize: 6,
  resultGrid: [
    [1, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 1],
    [0, 1, 2, 1, 0, 1],
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
