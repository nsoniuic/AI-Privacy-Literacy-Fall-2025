import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import PuzzleInteractive from '../components/PuzzleInteractive';
import UserPuzzleDisplay from '../components/UserPuzzleDisplay';
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

  const dialogues = [
    {
      id: 'puzzle-2-intro',
      text: "Let's see if you can spot the pattern again.\nHere's another puzzle, remember to look closely at the inputs and outputs.\nWhat changes this time?",
      showPuzzle: true,
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
      text: "Next, I ask: “does this fence make a complete loop?”",
      showExplanation: true,
    },
    {
      id: 'puzzle-2-explanation-3',
      text: "When I find a closed fence, I pretend to pour yellow paint inside it.",
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
    setPuzzleResult(isCorrect ? 'correct' : 'incorrect');
    setShowPuzzle(false);
    // Move to result dialogue (index 1 for correct, 2 for incorrect)
    setCurrentDialogueIndex(isCorrect ? 1 : 2);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleScreenClick = () => {
    if (!isTyping && puzzleResult && currentDialogueIndex < dialogues.length - 1) {
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
    <div className="page-container second-puzzle-page" onClick={handleScreenClick}>
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

      {!isTyping && puzzleResult && currentDialogueIndex < dialogues.length - 1 && (
        <p className="click-hint">Click to continue...</p>
      )}

      {currentDialogue?.showPuzzle && showPuzzle && (
        <PuzzleInteractive 
          onSubmitResult={handleSubmitResult} 
          puzzleConfig={PUZZLE_2_CONFIG}
          puzzleNumber={2}
        />
      )}

      {currentDialogue?.showExplanation && (
        <UserPuzzleDisplay 
          showResult={currentDialogue?.showResult || false}
          puzzleConfig={PUZZLE_2_CONFIG}
          puzzleNumber={2}
        />
      )}

      
    </div>
  );
}
