import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../../assets/robot-point.png';
import robotThumbsUp from '../../assets/robot-thumbs-up.png';
import p3input from '../../assets/p3input.png';
import p3output from '../../assets/p3output.png';
import p4input from '../../assets/p4input.png';
import p4output from '../../assets/p4output.png';
import PuzzleInteractive from '../../components/puzzles/PuzzleInteractive';
import PuzzleExamplesExplain from '../../components/puzzles/PuzzleExamplesExplain';
import PuzzleInteractiveExplain from '../../components/puzzles/PuzzleInteractiveExplain';
import { PUZZLE_4_CONFIG, PUZZLE_5_CONFIG, PUZZLE_6_CONFIG } from '../../utils/puzzleConfig';
import AppTitle from '../../components/common/AppTitle';
import useSpeech from '../../utils/useSpeech';
import { useVoice } from '../../contexts/VoiceContext';
import '../../styles/puzzles/Puzzles.css';
import '../../App.css';

export default function SecondPuzzle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { voiceEnabled, friendlyVoice } = useVoice();
  const userName = location.state?.userName || 'Friend';
  
  const [currentView, setCurrentView] = useState('overview');
  const [puzzle1Viewed, setPuzzle1Viewed] = useState(false);
  const [puzzle2Viewed, setPuzzle2Viewed] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [hasLeftOverview, setHasLeftOverview] = useState(false);
  const [currentExplanationIndex, setCurrentExplanationIndex] = useState(0);
  const [puzzleResult, setPuzzleResult] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const getDialogueText = () => {
    switch(currentView) {
      case 'overview':
        return "Let's see if you can apply the same pattern you spotted. Here are two more examples. What changes this time?";
      
      case 'puzzle1Focus':
      case 'puzzle2Focus':
        return "What rule do you think it's using to change the Start picture into the Finish picture?";

      case 'puzzleSolve':
        if (attemptCount === 1) {
          return "Not quite. Let's try again! Make sure to think about the pattern of the yellow boxes.";
        }
        return "Now it's your turn! Use the rules you noticed in the earlier examples to solve this new puzzle. Click the blocks that should turn yellow to complete the Finish picture.";
      
      case 'transition':
        return "Nice work, you figured it out how to solve Puzzle 6 based on the new patterns from Puzzle 4 and Puzzle 5! Now let me show you how I would think about it.";
      
      case 'explanation':
        const explanations = [
          "Lets see, if there is an empty line of blocks between 2 color blocks...",
          "the Finish picture fills that empty line with red!",
          "For Puzzle 5, it seems that the same logic holds, even with different color and angles.",
          "I see that there is a line gap between the top and bottom white blocks in Puzzle 6, ",
          "so I will fill that line with red blocks to complete the pattern!"
        ];
        return explanations[currentExplanationIndex] || "";
      
      default:
        return "";
    }
  };

  const currentText = getDialogueText();
  const typingSpeed = 30;

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
    if (currentView === 'overview' && hasLeftOverview) {
      setDisplayedText(currentText);
      setIsTyping(false);
      setShouldSpeak(false);
      return;
    }

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
    if (!puzzle1Viewed) return;
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
      resetDialogue();
      setCurrentView('transition');
    } else if (attemptCount === 0) {
      setPuzzleKey(prev => prev + 1);
      resetDialogue();
    } else {
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
    if (currentExplanationIndex < 4) {
      setCurrentExplanationIndex(prev => prev + 1);
      resetDialogue();
    } else {
      navigate('/first_scenario/talk', { state: { userName } });
    }
  };

  const handleBackToOverview = () => {
    resetDialogue();
    setCurrentView('overview');
  };

  return (
    <div className="page-container second-puzzle-page">
      <AppTitle />
      
      <div className="puzzle-content">
        <div className={`dialog-box-top ${currentView === 'transition' || currentView === 'explanation' ? 'thinking-bubble' : ''}`}>
          <p className="dialog-text" dangerouslySetInnerHTML={{
            __html: displayedText
              .replace(/Start/g, '<span style="color: #b50a0a; font-weight: bold;">Start</span>')
              .replace(/Finish/g, '<span style="color: #FFC107; font-weight: bold;">Finish</span>')
          }} />
          {(currentView === 'transition' || currentView === 'explanation') && (
            <div className="thinking-circles">
              <div className="circle circle-large"></div>
              <div className="circle circle-medium"></div>
              <div className="circle circle-small"></div>
            </div>
          )}
        </div>

        <div className="puzzle-robot-container-right">
          <img 
            src={currentView === 'transition' ? robotThumbsUp : robotImage}
            alt="Robot" 
            className="puzzle-robot-image"
          />
        </div>
      </div>

      {currentView === 'overview' && (
        <div className="puzzles-overview">
          <div className={`puzzle-card ${puzzle1Viewed && !puzzle2Viewed ? '' : ''}`}>
            <h3>Puzzle 4</h3>
            <div className="puzzle-preview">
              <div className="preview-images">
                <img src={p3input} alt="Puzzle 1 Start" />
                <span className="arrow">→</span>
                <img src={p3output} alt="Puzzle 1 Finish" />
              </div>
            </div>
            <button 
              className="start-puzzle-button"
              onClick={handleStartPuzzle1}
            >
              {puzzle1Viewed ? 'Review Puzzle 4' : 'View Puzzle 4'}
            </button>
          </div>

          <div className={`puzzle-card ${!puzzle1Viewed ? 'locked' : ''} ${puzzle1Viewed && !puzzle2Viewed ? 'highlighted' : ''}`}>
            <h3>Puzzle 5</h3>
            <div className="puzzle-preview">
              <div className="preview-images">
                <img src={p4input} alt="Puzzle 2 Start" />
                <span className="arrow">→</span>
                <img src={p4output} alt="Puzzle 2 Finish" />
              </div>
              {!puzzle1Viewed && <div className="lock-overlay">🔒</div>}
            </div>
            <button 
              className="start-puzzle-button"
              onClick={handleStartPuzzle2}
              disabled={!puzzle1Viewed}
            >
              {!puzzle1Viewed ? '🔒 Locked' : puzzle2Viewed ? 'Review Puzzle 5' : 'View Puzzle 5'}
            </button>
          </div>
        </div>
      )}

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

      {currentView === 'puzzle1Focus' && (
        <div className="puzzle-focus-view">
          <div className="puzzle-large">
            <h3>Puzzle 4</h3>
            <div className="puzzle-images-large">
              <div className="puzzle-image-container">
                <h4>Start</h4>
                <img src={p3input} alt="Puzzle 1 Start" />
              </div>
              <span className="arrow-large">→</span>
              <div className="puzzle-image-container">
                <h4>Finish</h4>
                <img src={p3output} alt="Puzzle 1 Finish" />
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

      {currentView === 'puzzle2Focus' && (
        <div className="puzzle-focus-view">
          <div className="puzzle-large">
            <h3>Puzzle 5</h3>
            <div className="puzzle-images-large">
              <div className="puzzle-image-container">
                <h4>Start</h4>
                <img src={p4input} alt="Puzzle 2 Start" />
              </div>
              <span className="arrow-large">→</span>
              <div className="puzzle-image-container">
                <h4>Finish</h4>
                <img src={p4output} alt="Puzzle 2 Finish" />
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

      {currentView === 'puzzleSolve' && (
        <div className="puzzle-solve-view">
          <PuzzleInteractive
            key={puzzleKey}
            onSubmitResult={handleSubmitResult}
            onBack={handleBackToOverview}
            puzzleConfig={PUZZLE_6_CONFIG}
            puzzleNumber={6}
            useRedColor={true}
          />
        </div>
      )}      {currentView === 'transition' && (
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

      {currentView === 'explanation' && (
        <div className="explanation-view">
          {currentExplanationIndex <= 1 ? (
            <PuzzleExamplesExplain
              puzzleNumber={4}
              explanationIndex={currentExplanationIndex}
              puzzleConfig={PUZZLE_4_CONFIG}
              useRedColor={true}
            />
          ) : currentExplanationIndex === 2 ? (
            <PuzzleExamplesExplain
              puzzleNumber={5}
              explanationIndex={0}
              puzzleConfig={PUZZLE_5_CONFIG}
              useRedColor={true}
            />
          ) : currentExplanationIndex === 3 ? (
            <PuzzleInteractiveExplain
              showResult={false}
              puzzleConfig={PUZZLE_6_CONFIG}
              puzzleNumber={6}
              useRedColor={true}
            />
          ) : (
            <PuzzleInteractiveExplain
              showResult={true}
              puzzleConfig={PUZZLE_6_CONFIG}
              puzzleNumber={6}
              useRedColor={true}
            />
          )}
          <div className="navigation-buttons">
            <button 
              className="continue-button"
              onClick={handleNextExplanation}
              disabled={isTyping}
            >
              {currentExplanationIndex < 4 ? 'Continue' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
