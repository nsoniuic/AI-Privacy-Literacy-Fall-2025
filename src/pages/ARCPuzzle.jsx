import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import PuzzleExamples from '../components/PuzzleExamples';
import PuzzleInteractive from '../components/PuzzleInteractive';
import './ARCPuzzle.css';
import '../App.css';

export default function ARCPuzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Friend';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showInteractive, setShowInteractive] = useState(false);
  const [puzzleResult, setPuzzleResult] = useState(null); // null, 'correct', or 'incorrect'

  const examplesText = "Here are two examples that show how the pattern works.\nThe first image in each puzzle is the input, and the second one is the output.\nWatch for what changes: the color, shape, or position.\nTry to guess the rule that transforms the input into the output.\nWhen you think you've got it, press Continue to try one yourself!";
  
  const interactiveText = "Now that you've seen the examples, it's your turn to give it a try!\nUse what you learned from the Start and Finish patterns to solve this puzzle.\nCan you figure out what rule connects them?";
  
  const correctText = "Nice work! Now, let’s compare how you think and how I think.";
  
  const incorrectText = "Oof, not quite right. Let’s compare how you think and how I think.";
  
  const getCurrentText = () => {
    if (puzzleResult === 'correct') return correctText;
    if (puzzleResult === 'incorrect') return incorrectText;
    return showInteractive ? interactiveText : examplesText;
  };
  
  const currentText = getCurrentText();
  const typingSpeed = 30;

  useEffect(() => {
    if (isTyping && displayedText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentText]);

  const handleContinue = () => {
    setShowInteractive(true);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleSubmitResult = (isCorrect) => {
    setPuzzleResult(isCorrect ? 'correct' : 'incorrect');
    setDisplayedText('');
    setIsTyping(true);
  };

  return (
    <div className="page-container arc-puzzle-page">
      <div className="dialog-box instruction-dialog">
        <p className="dialog-text">{displayedText}</p>
      </div>

      <div className="robot-container">
        <img 
          src={robotImage} 
          alt="Robot" 
          className="robot-image"
        />
      </div>

      {!showInteractive ? (
        <>
          <PuzzleExamples />
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            Continue
          </button>
        </>
      ) : (
        <PuzzleInteractive onSubmitResult={handleSubmitResult} />
      )}
    </div>
  );
}