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

export const PUZZLE_4_CONFIG = {
  greenCells: [
    [1, 2], [1, 4],
    [2, 1], [2, 2], [2, 4], [2, 5],
    [3, 1], [3, 2], [3, 4], [3, 5],
    [4, 1], [4, 2], [4, 4], [4, 5],
    [5, 2], [5, 4],
  ],
  gridSize: 7,
  useBlueOutline: true,
  resultGrid: [
    [0, 0, 0, 3, 0, 0, 0],
    [0, 0, 4, 3, 4, 0, 0],
    [0, 4, 4, 3, 4, 4, 0],
    [0, 4, 4, 3, 4, 4, 0],
    [0, 4, 4, 3, 4, 4, 0],
    [0, 0, 4, 3, 4, 0, 0],
    [0, 0, 0, 3, 0, 0, 0]
  ],
};

export const PUZZLE_5_CONFIG = {
  greenCells: [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3],
    [5, 1], [5, 2], [5, 3],
  ],
  gridSize: 7,
  useBlueOutline: true,
  cellValue: 5,
  resultGrid: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 5, 5, 5, 0, 0, 0],
    [0, 5, 5, 5, 0, 0, 0],
    [0, 5, 5, 5, 0, 0, 0],
    [3, 3, 3, 3, 3, 3, 3],
    [0, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
};

export const PUZZLE_6_CONFIG = {
  greenCells: [
    [1, 2], [1, 3], [1, 4], [2, 1], [2, 2], [2, 4], [2, 5], [3, 0], [3, 1], [3, 5], [3, 6], [5, 1], [5, 2], [5, 4], [5, 5], [6, 2], [6, 3], [6, 4],
  ],
  gridSize: 7,
  resultGrid: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [3, 3, 3, 3, 3, 3, 3],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0]
  ],
};

export const getCellColorWithRed = (value) => {
  if (value === 1) return '#ffffff';
  if (value === 2) return '#ffaa00';
  if (value === 3) return '#ff0000';
  if (value === 4) return '#2575de';
  if (value === 5) return '#004baf';
  return 'black';
};

export const createInitialGrid = (greenCells, gridSize, cellValue = 1) => {
  const initialGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  greenCells.forEach(([row, col]) => {
    initialGrid[row][col] = cellValue;
  });
  return initialGrid;
};
