import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import PuzzleInteractive from '../components/PuzzleInteractive';
import PuzzleInteractiveExplain from '../components/PuzzleInteractiveExplain';
import { PUZZLE_2_CONFIG } from '../utils/puzzleConfig';
import '../styles/Puzzles.css';
import '../App.css';

export default function SecondPuzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || 'Friend';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showPuzzle, setShowPuzzle] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [puzzleKey, setPuzzleKey] = useState(0); // Used to force puzzle reset

  const dialogues = [
    {
      id: 'puzzle-2-intro',
      text: "Let's see if you can apply the same pattern you spotted. Here's another puzzle, remember to look closely at the inputs and outputs.\nWhat changes this time?",
      showPuzzle: true,
    },
    {
      id: 'puzzle-2-retry',
      text: "Not quite. Let's try again! Make sure to think about the pattern of the yellow boxes.",
      showPuzzle: true,
      condition: () => attemptCount === 1,
    },
    {
      id: 'result-correct',
      text: "Nice work, you figured it out! Now let me show you how I solved it.",
      condition: () => puzzleResult === 'correct',
    },
    {
      id: 'result-incorrect',
      text: "You're getting closer! Now let me show you how I solved it.",
      condition: () => puzzleResult === 'incorrect',
    },
    {
      id: 'puzzle-2-explanation',
      text: "First, I find all the green lines (they're my little fences).",
      showExplanation: true,
    },
    {
      id: 'puzzle-2-explanation-2',
      text: "Next, I ask: “does this fence completely surround the area inside it?”",
      showExplanation: true,
    },
    {
      id: 'puzzle-2-explanation-3',
      text: "When I find a closed area, I pour yellow paint inside it.",
      showExplanation: true,
      showResult: true,
    },
    {
      id: 'puzzle-2-explanation-4',
      text: "I don’t change the fence itself—green stays green—only the inside becomes yellow!",
      showExplanation: true,
      showResult: true,
    },
    {
      id: 'puzzle-2-explanation-5',
      text: "I leave open fences (with gaps) alone, because paint would “spill out.” so no fill there.",
      showExplanation: true,
      showResult: true,
      navigateTo: '/first_scenario/talk',
    },
  ];

  const getCurrentDialogue = () => {
    const dialogue = dialogues[currentDialogueIndex];
    if (dialogue?.condition && !dialogue.condition()) {
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

  const handleSubmitResult = (isCorrect) => {
    setAttemptCount(prev => prev + 1);
    
    if (isCorrect) {
      // Correct answer - proceed to explanation
      setPuzzleResult('correct');
      setShowPuzzle(false);
      setCurrentDialogueIndex(2); // Move to result-correct dialogue
      setDisplayedText('');
      setIsTyping(true);
    } else if (attemptCount === 0) {
      // First incorrect attempt - show retry message and reset puzzle
      setCurrentDialogueIndex(1); // Move to retry dialogue
      setPuzzleKey(prev => prev + 1); // Force puzzle to reset
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // Second incorrect attempt - proceed to explanation
      setPuzzleResult('incorrect');
      setShowPuzzle(false);
      setCurrentDialogueIndex(3); // Move to result-incorrect dialogue
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleBack = () => {
    // Don't allow back on first dialogue after result
    if (puzzleResult && (currentDialogueIndex === 1 || currentDialogueIndex === 2)) {
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
    <div className="page-container second-puzzle-page">
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

      {currentDialogue?.showPuzzle && showPuzzle && (
        <PuzzleInteractive 
          key={puzzleKey}
          onSubmitResult={handleSubmitResult}
          onBack={handleBack}
          puzzleConfig={PUZZLE_2_CONFIG}
          puzzleNumber={2}
        />
      )}

      {currentDialogue?.showExplanation && (
        <PuzzleInteractiveExplain 
          showResult={currentDialogue?.showResult || false}
          puzzleConfig={PUZZLE_2_CONFIG}
          puzzleNumber={2}
        />
      )}

      {!currentDialogue?.showPuzzle && (
        <div className="navigation-buttons">
          <button 
            className="back-button"
            onClick={(e) => {
              e.stopPropagation();
              handleBack();
            }}
            disabled={currentDialogueIndex === 0 || (puzzleResult && (currentDialogueIndex === 2 || currentDialogueIndex === 3))}
          >
            Back
          </button>

          {puzzleResult && (
            <button 
              className="continue-button"
              onClick={(e) => {
                e.stopPropagation();
                handleContinueExplanation();
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
