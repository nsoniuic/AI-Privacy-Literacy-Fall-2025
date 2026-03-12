import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SecondScenarioInteractive from '../../../components/interactive/SecondScenarioInteractive';
import robotHappyImage from '../../../assets/robot-happy.png';
import AppTitle from '../../../components/common/AppTitle';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import useSpeech from '../../../utils/useSpeech';
import { CHILD_FRIENDLY_VOICES } from '../../../services/elevenLabsService';
import { useVoice } from '../../../contexts/VoiceContext';
import '../../../styles/puzzles/Puzzles.css';
import '../../../styles/pages/InitialGreeting.css';
import '../../../App.css';

export default function SecondScenarioPuzzle() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCharacter = location.state?.selectedCharacter || location.state?.character || 'girl';
  const [showPuzzle, setShowPuzzle] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [userLeftCloud, setUserLeftCloud] = useState('');
  const [userRightCloud, setUserRightCloud] = useState('');
  const { voiceEnabled } = useVoice();
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const hasSpokeThisScreen = useRef(false);

  // Screen 64: Puzzle, Screen 65: Transition
  const screenNumber = showTransition ? 65 : 64;
  useScreenNumber(screenNumber);

  // Dynamic pronouns based on selected character
  const possessivePronoun = selectedCharacter === 'boy' ? 'his' : 'her';
  const pronoun = selectedCharacter === 'boy' ? 'he' : 'she';

  // TTS for transition screen (screen 65)
  const transitionText = `Great work! Now I will show you how I reason with Parker's information to get to ${possessivePronoun} neighborhood location, which ${pronoun} didn't tell me.`;
  
  const typingSpeed = 40;
  
  // Typing animation effect
  useEffect(() => {
    if (showTransition && isTyping && displayedText.length < transitionText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(transitionText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === transitionText.length && transitionText !== '') {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, transitionText, showTransition]);
  
  // Reset typing when transition screen appears
  useEffect(() => {
    if (showTransition) {
      setDisplayedText('');
      setIsTyping(true);
    }
  }, [showTransition]);
  
  const robotSpeech = useSpeech(
    transitionText,
    voiceEnabled && shouldSpeak && showTransition,
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.CALLUM
    }
  );

  // Trigger speech when transition screen appears
  useEffect(() => {
    if (showTransition && voiceEnabled) {
      hasSpokeThisScreen.current = false;
      setShouldSpeak(false);
      const timer = setTimeout(() => {
        if (!hasSpokeThisScreen.current) {
          hasSpokeThisScreen.current = true;
          setShouldSpeak(true);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showTransition, voiceEnabled]);

  // Stop speech when voice is disabled
  useEffect(() => {
    if (!voiceEnabled && robotSpeech) {
      robotSpeech.stop();
    }
  }, [voiceEnabled]);

  const handlePuzzleComplete = (leftCloud, rightCloud) => {
    setUserLeftCloud(leftCloud);
    setUserRightCloud(rightCloud);
    setShowPuzzle(false);
    setShowTransition(true);
  };

  const handleContinue = () => {
    navigate('/second_scenario/memory', { state: { selectedCharacter, userLeftCloud, userRightCloud } });
  };

  const handleBack = () => {
    navigate('/second_scenario/talk', { state: { selectedCharacter, startAtThinking: true } });
  };

  return (
    <div className='page-container'>
      <AppTitle />
      {showPuzzle ? (
        <SecondScenarioInteractive 
          selectedCharacter={selectedCharacter}
          onContinue={handlePuzzleComplete}
          onBack={handleBack}
        />
      ) : showTransition ? (
        <>
          <div className="puzzle-content">
            <div className="dialog-box-top">
              <p className="dialog-text">
                {displayedText}
              </p>
            </div>

            <div className="puzzle-robot-container-right">
              <img 
                src={robotHappyImage} 
                alt="Robot" 
                className="puzzle-robot-image"
              />
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="back-button"
              onClick={handleBack}
            >
              Back
            </button>
            <button 
              className="continue-button"
              onClick={handleContinue}
              disabled={isTyping}
            >
              Continue
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
