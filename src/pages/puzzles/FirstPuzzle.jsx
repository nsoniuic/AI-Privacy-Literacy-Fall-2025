import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../../assets/robot-point.png';
import robotThumbsUp from '../../assets/robot-thumbs-up.png';
import p1input from '../../assets/p1input.png';
import p1output from '../../assets/p1output.png';
import p2input from '../../assets/p2input.png';
import p2output from '../../assets/p2output.png';
import PuzzleInteractive from '../../components/puzzles/PuzzleInteractive';
import PuzzleExamplesExplain from '../../components/puzzles/PuzzleExamplesExplain';
import PuzzleInteractiveExplain from '../../components/puzzles/PuzzleInteractiveExplain';
import AppTitle from '../../components/common/AppTitle';
import useSpeech from '../../utils/useSpeech';
import { useVoice } from '../../contexts/VoiceContext';
import '../../styles/puzzles/Puzzles.css';
import '../../App.css';

export default function FirstPuzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { voiceEnabled, friendlyVoice } = useVoice();
  const userName = location.state?.userName || 'Friend';
  
  // New state management for the updated flow
  const [currentView, setCurrentView] = useState('overview'); // overview, puzzle1Focus, puzzle2Focus, puzzleSolve, transition, explanation
  const [puzzle1Viewed, setPuzzle1Viewed] = useState(false);
  const [puzzle2Viewed, setPuzzle2Viewed] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [dialogueShown, setDialogueShown] = useState(false);
  const [hasLeftOverview, setHasLeftOverview] = useState(false);
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [puzzleKey, setPuzzleKey] = useState(0);

  // Dialogue texts for different states
  const getDialogueText = () => {
    switch(currentView) {
      case 'overview':
        return "Let's look at two examples to see how A.I thinks! A.I figures things out by finding rules! What rule do you think it's using to change the Start picture into the Finish picture? Look closely, do the colors, shapes, or positions change?";
      
      case 'puzzle1Focus':
      case 'puzzle2Focus':
        return "What rule do you think it's using to change the Start picture into the Finish picture?";

      case 'puzzleSolve':
        if (attemptCount === 1) {
          return "Not quite. Let's try again! Make sure to think about the pattern that you have seen on the previous two puzzles."
        }
        return "Now it's your turn! Use the rules you noticed in the earlier examples to solve this new puzzle. Click the blocks that should turn yellow to complete the Finish picture.";
      
      case 'transition':
        return "Great job! You figured out the rules from Puzzles 1 and 2 and used them to crack Puzzle 3. Now it's my turn, let's see if I think the same way you do!";
      
      case 'explanation':
        const explanations = [
          "Let's see, if an area is completely surrounded by the green lines in the Start picture, like a tiny fence...",
          "...the Finish picture fills that space with yellow!",
          "For puzzle 1, I see one neat area completely surrounded by fences, so I paint its inside yellow.",
          "For puzzle 2, some areas have incomplete fences around it, so no paint. The ones that are completely surrounded get their insides painted yellow."
        ];
        return explanations[currentExplanationIndex] || "";
      
      default:
        return "";
    }
  };

  const currentText = getDialogueText();
  const typingSpeed = 30;

  // Speech control
  const speechControl = useSpeech(
    currentText,
    voiceEnabled && shouldSpeak && !(currentView === 'overview' && hasLeftOverview),
    {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      voiceName: friendlyVoice?.name
    }
  );

  useEffect(() => {
    // If returning to overview after viewing a puzzle, show text immediately without typing/speech
    if (currentView === 'overview' && hasLeftOverview) {
      setDisplayedText(currentText);
      setIsTyping(false);
      setShouldSpeak(false);
      return;
    }

    // Start speech when new dialogue starts
    if (displayedText === '') {
      setShouldSpeak(true);
    }
    
    if (isTyping && displayedText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentText, currentView, hasLeftOverview]);

  const resetDialogue = () => {
    speechControl.stop();
    setShouldSpeak(false);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleStartPuzzle1 = () => {
    setHasLeftOverview(true);
    resetDialogue();
    setCurrentView('puzzle1Focus');
  };

  const handleStartPuzzle2 = () => {
    if (!puzzle1Viewed) return; // Can't start puzzle 2 if puzzle 1 not viewed
    setHasLeftOverview(true);
    resetDialogue();
    setCurrentView('puzzle2Focus');
  };

  const handleContinueToPuzzle = () => {
    setHasLeftOverview(true);
    resetDialogue();
    setAttemptCount(0);
    setPuzzleKey(prev => prev + 1);
    setCurrentView('puzzleSolve');
  };

  const handleDoneThinking = (puzzleNumber) => {
    // Mark puzzle as viewed and return to overview
    if (puzzleNumber === 1) {
      setPuzzle1Viewed(true);
    } else {
      setPuzzle2Viewed(true);
    }
    setCurrentView('overview');
  };

  const handleSubmitResult = (isCorrect) => {
    setAttemptCount(prev => prev + 1);
    
    if (isCorrect) {
      // Correct answer - proceed to transition screen
      resetDialogue();
      setCurrentView('transition');
    } else if (attemptCount === 0) {
      // First incorrect attempt - reset puzzle
      setPuzzleKey(prev => prev + 1);
      resetDialogue();
    } else {
      // Second incorrect attempt - proceed to explanation anyway
      resetDialogue();
      setCurrentExplanationIndex(0);
      setCurrentView('explanation');
    }
  };

  const handleTransitionContinue = () => {
    resetDialogue();
    setCurrentExplanationIndex(0);
    setCurrentView('explanation');
  };

  const handleNextExplanation = () => {
    if (currentExplanationIndex < 3) {
      setCurrentExplanationIndex(prev => prev + 1);
      resetDialogue();
    } else {
      // Navigate to next page
      navigate('/puzzle/second', { state: { userName } });
    }
  };

  const handleBackToOverview = () => {
    resetDialogue();
    setCurrentView('overview');
  };

  return (
    <div className="page-container first-puzzle-page">
      <AppTitle />
      
      <div className="puzzle-content">
        {/* Dialog box positioned at top left */}
        <div className={`dialog-box-top ${currentView === 'transition' || currentView === 'explanation' ? 'thinking-bubble' : ''}`}>
          <p className="dialog-text" dangerouslySetInnerHTML={{
            __html: displayedText
              .replace(/Start/g, '<span style="color: #b50a0a; font-weight: bold;">Start</span>')
              .replace(/Finish/g, '<span style="color: #FFC107; font-weight: bold;">Finish</span>')
          }} />
          {/* Thinking bubble circles for transition and explanation views */}
          {(currentView === 'transition' || currentView === 'explanation') && (
            <div className="thinking-circles">
              <div className="circle circle-large"></div>
              <div className="circle circle-medium"></div>
              <div className="circle circle-small"></div>
            </div>
          )}
        </div>

        {/* Robot image on the right side */}
        <div className="puzzle-robot-container-right">
          <img 
            src={currentView === 'transition' ? robotThumbsUp : robotImage}
            alt="Robot" 
            className="puzzle-robot-image"
          />
        </div>
      </div>

      {/* Overview: Show both puzzles with unlock status */}
      {currentView === 'overview' && (
        <div className="puzzles-overview">
          <div className={`puzzle-card ${puzzle1Viewed && !puzzle2Viewed ? '' : ''}`}>
            <h3>Puzzle 1</h3>
            <div className="puzzle-preview">
              <div className="preview-images">
                <img src={p1input} alt="Puzzle 1 Start" />
                <span className="arrow">→</span>
                <img src={p1output} alt="Puzzle 1 Finish" />
              </div>
            </div>
            <button 
              className="start-puzzle-button"
              onClick={handleStartPuzzle1}
            >
              {puzzle1Viewed ? 'Review Puzzle 1' : 'View Puzzle 1'}
            </button>
          </div>

          <div className={`puzzle-card ${!puzzle1Viewed ? 'locked' : ''} ${puzzle1Viewed && !puzzle2Viewed ? 'highlighted' : ''}`}>
            <h3>Puzzle 2</h3>
            <div className="puzzle-preview">
              <div className="preview-images">
                <img src={p2input} alt="Puzzle 2 Start" />
                <span className="arrow">→</span>
                <img src={p2output} alt="Puzzle 2 Finish" />
              </div>
              {!puzzle1Viewed && <div className="lock-overlay">🔒</div>}
            </div>
            <button 
              className="start-puzzle-button"
              onClick={handleStartPuzzle2}
              disabled={!puzzle1Viewed}
            >
              {!puzzle1Viewed ? '🔒 Locked' : puzzle2Viewed ? 'Review Puzzle 2' : 'View Puzzle 2'}
            </button>
          </div>
        </div>
      )}

      {/* Continue button for overview */}
      {currentView === 'overview' && (
        <div className="navigation-buttons" style={{ justifyContent: 'center' }}>
          <button 
            className="continue-button"
            onClick={handleContinueToPuzzle}
            disabled={!puzzle1Viewed || !puzzle2Viewed}
          >
            Continue
          </button>
        </div>
      )}

      {/* Puzzle 1 Focus: Think-aloud phase */}
      {currentView === 'puzzle1Focus' && (
        <div className="puzzle-focus-view">
          <div className="puzzle-large">
            <h3>Puzzle 1</h3>
            <div className="puzzle-images-large">
              <div className="puzzle-image-container">
                <h4>Start</h4>
                <img src={p1input} alt="Puzzle 1 Start" />
              </div>
              <span className="arrow-large">→</span>
              <div className="puzzle-image-container">
                <h4>Finish</h4>
                <img src={p1output} alt="Puzzle 1 Finish" />
              </div>
            </div>
          </div>
          <div className="navigation-buttons">
            <button className="continue-button" onClick={() => handleDoneThinking(1)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Puzzle 2 Focus: Think-aloud phase */}
      {currentView === 'puzzle2Focus' && (
        <div className="puzzle-focus-view">
          <div className="puzzle-large">
            <h3>Puzzle 2</h3>
            <div className="puzzle-images-large">
              <div className="puzzle-image-container">
                <h4>Start</h4>
                <img src={p2input} alt="Puzzle 2 Start" />
              </div>
              <span className="arrow-large">→</span>
              <div className="puzzle-image-container">
                <h4>Finish</h4>
                <img src={p2output} alt="Puzzle 2 Finish" />
              </div>
            </div>
          </div>
          <div className="navigation-buttons">
            <button className="continue-button" onClick={() => handleDoneThinking(2)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Puzzle Solve: Interactive puzzle */}
      {currentView === 'puzzleSolve' && (
        <div className="puzzle-solve-view">
          <PuzzleInteractive 
            key={puzzleKey}
            onSubmitResult={handleSubmitResult}
            onBack={handleBackToOverview}
          />
        </div>
      )}

      {/* Transition screen after solving puzzle */}
      {currentView === 'transition' && (
        <div className="transition-view">
          <div className="navigation-buttons">
            <button 
              className="continue-button"
              onClick={handleTransitionContinue}
              disabled={isTyping}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Explanation phase */}
      {currentView === 'explanation' && (
        <div className="explanation-view">
          {currentExplanationIndex <= 1 && (
            <PuzzleExamplesExplain puzzleNumber={1} explanationIndex={currentExplanationIndex} />
          )}
          {currentExplanationIndex >= 2 && currentExplanationIndex <= 2 && (
            <PuzzleExamplesExplain puzzleNumber={1} explanationIndex={currentExplanationIndex} />
          )}
          {currentExplanationIndex === 3 && (
            <PuzzleExamplesExplain puzzleNumber={2} explanationIndex={currentExplanationIndex} />
          )}
          
          <div className="navigation-buttons">
            <button 
              className="continue-button"
              onClick={handleNextExplanation}
              disabled={isTyping}
            >
              {currentExplanationIndex < 3 ? 'Continue' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
