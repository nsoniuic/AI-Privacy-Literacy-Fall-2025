import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import PuzzleExamples from '../components/PuzzleExamples';
import PuzzleInteractive from '../components/PuzzleInteractive';
import PuzzleExamplesExplain from '../components/PuzzleExamplesExplain';
import PuzzleInteractiveExplain from '../components/PuzzleInteractiveExplain';
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
  const [attemptCount, setAttemptCount] = useState(0);
  const [puzzleKey, setPuzzleKey] = useState(0); // Used to force puzzle reset

  const dialogues = [
    {
      id: 'examples',
      text: "Here are two examples that show how the pattern works. The first image in each puzzle is the input, and the second one is the output.\nWatch for what changes: the color, shape, or position. Try to guess the rule that transforms the input into the output. When you think you've got it, press Continue to try one yourself!",
      showExamples: true,
      showContinueButton: true,
    },
    {
      id: 'interactive',
      text: "Now that you've seen the examples, it's your turn to give it a try! Use what you learned from the Start and Finish patterns to solve this puzzle.\nCan you figure out what rule connects them?",
      showPuzzle: true,
    },
    {
      id: 'interactive-retry',
      text: "Not quite. Let's try again! Make sure to think about the pattern of the yellow boxes.",
      showPuzzle: true,
      condition: () => attemptCount === 1,
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
      showSamplePuzzle: 1,
    },
    {
      id: 'explanation2',
      text: "If an area is completely surrounded by the fences, I say, \"Nice; this area can hold paint,\" and I fill everything inside with yellow.",
      showSamplePuzzle: 1,
    },
    {
      id: 'sample-puzzle-1',
      text: "For puzzle 1, I see one neat area completely surrounded by fences, so I paint its inside yellow.",
      showSamplePuzzle: 1,
    },
    {
      id: 'sample-puzzle-2',
      text: "For puzzle 2, some areas have incomplete fences around it, so no paint. The ones that is completely surrounded get their insides painted yellow.",
      showSamplePuzzle: 2,
    },
    {
      id: 'user-puzzle-explanation',
      text: "For the puzzle, only the tiny areas in the middle are complete...",
      showUserPuzzle: true,
    },
    {
      id: 'user-puzzle-result',
      text: "...So only that inside becomes yellow!",
      showUserPuzzle: true,
      showResult: true,
      navigateTo: '/puzzle/second',
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
    setAttemptCount(prev => prev + 1);
    
    if (isCorrect) {
      // Correct answer - proceed to explanation
      setPuzzleResult('correct');
      setShowPuzzle(false);
      setCurrentDialogueIndex(3); // Skip to result-correct dialogue
      setDisplayedText('');
      setIsTyping(true);
    } else if (attemptCount === 0) {
      // First incorrect attempt - show retry message and reset puzzle
      setCurrentDialogueIndex(2); // Move to retry dialogue
      setPuzzleKey(prev => prev + 1); // Force puzzle to reset
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // Second incorrect attempt - proceed to explanation
      setPuzzleResult('incorrect');
      setShowPuzzle(false);
      setCurrentDialogueIndex(4); // Skip to result-incorrect dialogue
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleBack = () => {
    // Don't allow back on first dialogue after result
    if (puzzleResult && (currentDialogueIndex === 2 || currentDialogueIndex === 3)) {
      return;
    }

    if (currentDialogueIndex > 0) {
      let prevIndex = currentDialogueIndex - 1;
      // Skip backwards over any dialogues with unsatisfied conditions
      while (prevIndex >= 0) {
        const prevDialogue = dialogues[prevIndex];
        if (!prevDialogue.condition || prevDialogue.condition()) {
          setCurrentDialogueIndex(prevIndex);
          setDisplayedText('');
          setIsTyping(true);
          break;
        }
        prevIndex--;
      }
    }
  };

  const handleContinueExplanation = () => {
    // Check if current dialogue has navigation
    if (currentDialogue?.navigateTo) {
      navigate(currentDialogue.navigateTo, { state: { userName } });
      return;
    }

    // Move to next valid dialogue
    if (currentDialogueIndex < dialogues.length - 1) {
      let nextIndex = currentDialogueIndex + 1;
      while (nextIndex < dialogues.length) {
        const nextDialogue = dialogues[nextIndex];
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
    <div className="page-container first-puzzle-page" >
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
        </>
      )}

      {currentDialogue?.showPuzzle && showPuzzle && (
        <PuzzleInteractive 
          key={puzzleKey} 
          onSubmitResult={handleSubmitResult} 
          onBack={handleBack} 
        />
      )}

      {currentDialogue?.showSamplePuzzle && (
        <PuzzleExamplesExplain puzzleNumber={currentDialogue.showSamplePuzzle} />
      )}

      {currentDialogue?.showUserPuzzle && (
        <PuzzleInteractiveExplain showResult={currentDialogue?.showResult || false} />
      )}

      {!currentDialogue?.showPuzzle && (
        <div className="navigation-buttons">
          <button 
            className="back-button"
            onClick={(e) => {
              e.stopPropagation();
              handleBack();
            }}
            disabled={currentDialogueIndex === 0 || (puzzleResult && (currentDialogueIndex === 3 || currentDialogueIndex === 4))}
          >
            Back
          </button>

          {(currentDialogue?.showContinueButton || puzzleResult) && (
            <button 
              className="continue-button"
              onClick={(e) => {
                e.stopPropagation();
                if (puzzleResult) {
                  handleContinueExplanation();
                } else {
                  handleContinue();
                }
              }}
              disabled={isTyping}
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}