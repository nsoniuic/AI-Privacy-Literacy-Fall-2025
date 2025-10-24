import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import PuzzleExamples from '../components/PuzzleExamples';
import PuzzleInteractive from '../components/PuzzleInteractive';
import SamplePuzzle from '../components/SamplePuzzle';
import UserPuzzleDisplay from '../components/UserPuzzleDisplay';
import '../styles/Puzzles.css';
import '../App.css';

export default function FirstPuzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Friend';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showInteractive, setShowInteractive] = useState(false);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(true);

  const dialogues = [
    {
      id: 'examples',
      text: "Here are two examples that show how the pattern works.\nThe first image in each puzzle is the input, and the second one is the output.\nWatch for what changes: the color, shape, or position.\nTry to guess the rule that transforms the input into the output.\nWhen you think you've got it, press Continue to try one yourself!",
      showExamples: true,
      showContinueButton: true,
    },
    {
      id: 'interactive',
      text: "Now that you've seen the examples, it's your turn to give it a try!\nUse what you learned from the Start and Finish patterns to solve this puzzle.\nCan you figure out what rule connects them?",
      showPuzzle: true,
    },
    {
      id: 'result-correct',
      text: "Nice work! Now, let's compare how you think and how I think.",
      condition: () => puzzleResult === 'correct',
    },
    {
      id: 'result-incorrect',
      text: "Oof, not quite right. Let's compare how you think and how I think.",
      condition: () => puzzleResult === 'incorrect',
    },
    {
      id: 'explanation1',
      text: "First, I look at all the green lines. I pretend they're little fences. If a fence is broken, I do nothing. You can't keep paint inside a broken fence!",
    },
    {
      id: 'explanation2',
      text: "If a fence makes a complete loop, I say, \"Nice—this fence can hold paint,\" and I fill everything inside with yellow.",
    },
    {
      id: 'sample-puzzle-1',
      text: "For puzzle 1, I see one neat green loop, so I paint its inside yellow.",
      showSamplePuzzle: 1,
    },
    {
      id: 'sample-puzzle-2',
      text: "For puzzle 2, some green bits are broken (no paint), but the true loops get their insides painted yellow.",
      showSamplePuzzle: 2,
    },
    {
      id: 'user-puzzle-explanation',
      text: "For the puzzle, only the tiny loops is complete...",
      showUserPuzzle: true,
    },
    {
      id: 'user-puzzle-result',
      text: "...So only that inside becomes yellow!",
      showUserPuzzle: true,
      showResult: true,
      navigateTo: '/second_puzzle',
    },
  ];

  // Get current dialogue, skipping any with unsatisfied conditions
  const getCurrentDialogue = () => {
    const dialogue = dialogues[currentDialogueIndex];
    if (dialogue?.condition && !dialogue.condition()) {
      // Skip this dialogue if condition not met
      return null;
    }
    return dialogue;
  };

  const currentDialogue = getCurrentDialogue();
  const currentText = currentDialogue?.text || '';
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
    // Move to interactive dialogue
    setCurrentDialogueIndex(1);
    setShowInteractive(true);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleSubmitResult = (isCorrect) => {
    setPuzzleResult(isCorrect ? 'correct' : 'incorrect');
    setShowPuzzle(false); // Hide puzzle immediately on submit
    // Move to result dialogue (index 2 for correct, 3 for incorrect)
    setCurrentDialogueIndex(isCorrect ? 2 : 3);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleScreenClick = () => {
    // Check if current dialogue has navigation
    if (!isTyping && puzzleResult && currentDialogue?.navigateTo) {
      navigate(currentDialogue.navigateTo, { state: { userName } });
      return;
    }

    // Only allow clicking when typing is finished and there's a puzzle result
    if (!isTyping && puzzleResult && currentDialogueIndex < dialogues.length - 1) {
      // Skip to next valid dialogue
      let nextIndex = currentDialogueIndex + 1;
      while (nextIndex < dialogues.length) {
        const nextDialogue = dialogues[nextIndex];
        // If no condition or condition is met, use this dialogue
        if (!nextDialogue.condition || nextDialogue.condition()) {
          setCurrentDialogueIndex(nextIndex);
          setDisplayedText('');
          setIsTyping(true);
          break;
        }
        nextIndex++;
      }
    }
  };

  return (
    <div className="page-container first-puzzle-page" onClick={handleScreenClick}>
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

      {currentDialogue?.showExamples && (
        <>
          <PuzzleExamples />
          {currentDialogue?.showContinueButton && (
            <button 
              className="continue-button"
              onClick={handleContinue}
            >
              Continue
            </button>
          )}
        </>
      )}

      {currentDialogue?.showPuzzle && showPuzzle && (
        <PuzzleInteractive onSubmitResult={handleSubmitResult} />
      )}

      {currentDialogue?.showSamplePuzzle && (
        <SamplePuzzle puzzleNumber={currentDialogue.showSamplePuzzle} />
      )}

      {currentDialogue?.showUserPuzzle && (
        <UserPuzzleDisplay showResult={currentDialogue?.showResult || false} />
      )}

      {!isTyping && puzzleResult && currentDialogueIndex < dialogues.length - 1 && (
        <p className="click-hint">Click to continue...</p>
      )}
    </div>
  );
}