import p1input from '../assets/p1input.png';
import p1output from '../assets/p1output.png';
import p2input from '../assets/p2input.png';
import p2output from '../assets/p2output.png';
import '../styles/PuzzleExamples.css';

export default function PuzzleExamples() {
  return (
    <div className="puzzles-container">
      <div className="puzzle-section">
        <h2 className="puzzle-title">Puzzle 1</h2>
        <div className="puzzle-row">
          <div className="puzzle-column">
            <p className="label">Start</p>
            <div className="puzzle-image-container">
              <img src={p1input} alt="Puzzle 1 Input" className="puzzle-image" />
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="puzzle-column">
            <p className="label">Finish</p>
            <div className="puzzle-image-container">
              <img src={p1output} alt="Puzzle 1 Output" className="puzzle-image" />
            </div>
          </div>
        </div>
      </div>

      <div className="puzzle-section">
        <h2 className="puzzle-title">Puzzle 2</h2>
        <div className="puzzle-row">
          <div className="puzzle-column">
            <p className="label">Start</p>
            <div className="puzzle-image-container">
              <img src={p2input} alt="Puzzle 2 Input" className="puzzle-image" />
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="puzzle-column">
            <p className="label">Finish</p>
            <div className="puzzle-image-container">
              <img src={p2output} alt="Puzzle 2 Output" className="puzzle-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}