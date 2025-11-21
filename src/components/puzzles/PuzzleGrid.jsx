export default function PuzzleGrid({ grid, getCellColor, onCellClick, interactive = false, glowGreen = false, glowYellow = false }) {
  return (
    <div className="grid-interactive">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-cell ${interactive && cell === 1 ? 'locked' : ''} ${interactive && cell !== 1 ? 'clickable' : ''} ${glowGreen && cell === 1 ? 'glow-green' : ''} ${glowYellow && cell === 2 ? 'glow-yellow' : ''}`}
              style={{ backgroundColor: getCellColor(cell) }}
              onClick={interactive ? () => onCellClick(rowIndex, colIndex) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
