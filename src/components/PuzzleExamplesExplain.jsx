import p1input from '../assets/p1input.png';
import p1output from '../assets/p1output.png';
import p2input from '../assets/p2input.png';
import p2output from '../assets/p2output.png';
import '../styles/PuzzleExamplesExplain.css';

export default function PuzzleExamplesExplain({ puzzleNumber }) {
  // Select the appropriate images based on puzzle number
  const getImages = () => {
    if (puzzleNumber === 1) {
      return { input: p1input, output: p1output };
    } else if (puzzleNumber === 2) {
      return { input: p2input, output: p2output };
    }
    return { input: p1input, output: p1output };
  };

  const { input, output } = getImages();

  return (
    <div>
      <h2 className="sample-puzzle-title">Sample Puzzle {puzzleNumber}</h2>
      
      <div className="sample-puzzle-grids">
        <div className="sample-puzzle-side">
          <p className="sample-label">Start</p>
          <div className="sample-grid-container">
            <img src={input} alt={`Puzzle ${puzzleNumber} Input`} className="sample-puzzle-image" />
          </div>
        </div>

        <div className="sample-arrow-large">→</div>

        <div className="sample-puzzle-side">
          <p className="sample-label">Finish</p>
          <div className="sample-grid-container">
            <img src={output} alt={`Puzzle ${puzzleNumber} Output`} className="sample-puzzle-image" />
          </div>
        </div>
      </div>
    </div>
  );
}
