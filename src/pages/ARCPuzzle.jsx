import { useLocation } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import './ARCPuzzle.css';
import '../App.css';

export default function ARCPuzzle() {
  const location = useLocation();
  const userName = location.state?.userName || 'Friend';

  return (
    <div className="page-container arc-puzzle-page">
      <div className="instruction-box">
        <p className="instruction-text">
          <strong>Here are two examples that show how the pattern works.</strong><br />
          <strong>The first image in each puzzle is the input, and the second one is the output.</strong><br />
          <strong>Watch for what changes: the color, shape, or position.</strong><br />
          Try to guess the rule that transforms the input into the output.<br />
          When you think you've got it, press Continue to try one yourself!
        </p>
      </div>

      <div className="robot-container">
        <img 
          src={robotImage} 
          alt="Robot" 
          className="robot-image"
        />
      </div>

      <div className="puzzles-container">
        <div className="puzzle-section">
          <h2 className="puzzle-title">Puzzle 1</h2>
          <div className="puzzle-row">
            <div className="puzzle-column">
              <p className="label">Start</p>
              <div className="grid-container">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="black" />
                  {[...Array(6)].map((_, i) => (
                    <g key={i}>
                      <line x1={i * 25} y1="0" x2={i * 25} y2="150" stroke="#333" strokeWidth="0.5" />
                      <line x1="0" y1={i * 25} x2="150" y2={i * 25} stroke="#333" strokeWidth="0.5" />
                    </g>
                  ))}
                  <rect x="50" y="25" width="25" height="25" fill="#00ff00" />
                  <rect x="25" y="50" width="25" height="25" fill="#00ff00" />
                  <rect x="75" y="50" width="25" height="25" fill="#00ff00" />
                  <rect x="50" y="75" width="25" height="25" fill="#00ff00" />
                  <rect x="25" y="100" width="25" height="25" fill="#00ff00" />
                </svg>
              </div>
            </div>
            <div className="arrow">→</div>
            <div className="puzzle-column">
              <p className="label">Finish</p>
              <div className="grid-container">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="black" />
                  {[...Array(6)].map((_, i) => (
                    <g key={i}>
                      <line x1={i * 25} y1="0" x2={i * 25} y2="150" stroke="#333" strokeWidth="0.5" />
                      <line x1="0" y1={i * 25} x2="150" y2={i * 25} stroke="#333" strokeWidth="0.5" />
                    </g>
                  ))}
                  <rect x="50" y="25" width="25" height="25" fill="#00ff00" />
                  <rect x="25" y="50" width="25" height="25" fill="#00ff00" />
                  <rect x="75" y="50" width="25" height="25" fill="#00ff00" />
                  <rect x="50" y="75" width="25" height="25" fill="#00ff00" />
                  <rect x="25" y="100" width="25" height="25" fill="#00ff00" />
                  <rect x="50" y="50" width="25" height="25" fill="#ffaa00" />
                  <rect x="75" y="75" width="25" height="25" fill="#ffaa00" />
                  <rect x="100" y="75" width="25" height="25" fill="#ffaa00" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="puzzle-section">
          <h2 className="puzzle-title">Puzzle 2</h2>
          <div className="puzzle-row">
            <div className="puzzle-column">
              <p className="label">Start</p>
              <div className="grid-container">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="black" />
                  {[...Array(10)].map((_, i) => (
                    <g key={i}>
                      <line x1={i * 15} y1="0" x2={i * 15} y2="150" stroke="#222" strokeWidth="0.5" />
                      <line x1="0" y1={i * 15} x2="150" y2={i * 15} stroke="#222" strokeWidth="0.5" />
                    </g>
                  ))}
                  <rect x="30" y="15" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="30" width="60" height="15" fill="#00ff00" />
                  <rect x="105" y="45" width="15" height="15" fill="#00ff00" />
                  <rect x="30" y="45" width="15" height="45" fill="#00ff00" />
                  <rect x="105" y="75" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="90" width="60" height="15" fill="#00ff00" />
                  <rect x="30" y="105" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="120" width="15" height="15" fill="#00ff00" />
                  <rect x="90" y="120" width="15" height="15" fill="#00ff00" />
                </svg>
              </div>
            </div>
            <div className="arrow">→</div>
            <div className="puzzle-column">
              <p className="label">Finish</p>
              <div className="grid-container">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="black" />
                  {[...Array(10)].map((_, i) => (
                    <g key={i}>
                      <line x1={i * 15} y1="0" x2={i * 15} y2="150" stroke="#222" strokeWidth="0.5" />
                      <line x1="0" y1={i * 15} x2="150" y2={i * 15} stroke="#222" strokeWidth="0.5" />
                    </g>
                  ))}
                  <rect x="30" y="15" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="30" width="60" height="15" fill="#00ff00" />
                  <rect x="105" y="45" width="15" height="15" fill="#00ff00" />
                  <rect x="30" y="45" width="15" height="45" fill="#00ff00" />
                  <rect x="105" y="75" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="90" width="60" height="15" fill="#00ff00" />
                  <rect x="30" y="105" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="120" width="15" height="15" fill="#00ff00" />
                  <rect x="90" y="120" width="15" height="15" fill="#00ff00" />
                  <rect x="45" y="45" width="60" height="45" fill="#ffaa00" />
                  <rect x="60" y="105" width="30" height="15" fill="#ffaa00" />
                  <rect x="105" y="60" width="15" height="15" fill="#aaff00" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="continue-button">Continue</button>
    </div>
  );
}