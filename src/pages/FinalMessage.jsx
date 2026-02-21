import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotHappyImage from '../assets/robot-happy.png';
import AppTitle from '../components/common/AppTitle';
import { useScreenNumber } from '../hooks/useScreenNumber';
import useSpeech from '../utils/useSpeech';
import { CHILD_FRIENDLY_VOICES } from '../services/elevenLabsService';
import { useVoice } from '../contexts/VoiceContext';
import '../styles/pages/InitialGreeting.css';
import '../App.css';

export default function FinalMessage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter;
  const previousState = location.state?.previousState;
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  
  // Typing animation states
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { voiceEnabled } = useVoice();
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const hasSpokeThisScreen = useRef(false);

  // Screen 80: first message, Screen 81: second message
  const screenNumber = showSecondMessage ? 81 : 80;
  useScreenNumber(screenNumber);

  const typingSpeed = 40;

  const dialogues = {
    first: "Thank you for joining me in solving the puzzles today!",
    second: "I hope you have learned that an AI like me could remember what you told me to connect the dots and come up with details you didn't tell me!"
  };

  const currentDialogueText = showSecondMessage ? dialogues.second : dialogues.first;

  // TTS for final messages
  const robotSpeech = useSpeech(
    currentDialogueText,
    voiceEnabled && shouldSpeak,
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.CALLUM
    }
  );

  // Trigger speech when message appears
  useEffect(() => {
    if (voiceEnabled) {
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
  }, [showSecondMessage, voiceEnabled]);

  // Stop speech when voice is disabled
  useEffect(() => {
    if (!voiceEnabled && robotSpeech) {
      robotSpeech.stop();
    }
  }, [voiceEnabled]);

  // Typing animation effect
  useEffect(() => {
    if (isTyping && displayedText.length < currentDialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogueText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueText]);

  // Reset typing when message changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, [showSecondMessage]);

  const handleContinue = () => {
    if (!showSecondMessage) {
      setShowSecondMessage(true);
    } else {
      // Navigate to home
      navigate('/', { state: { selectedCharacter } });
    }
  };

  const handleBack = () => {
    if (showSecondMessage) {
      setShowSecondMessage(false);
    } else {
      // Navigate back with the previous state to restore the last state
      navigate('/second_scenario/result', { 
        state: { 
          selectedCharacter,
          previousState 
        } 
      });
    }
  };

  return (
    <div className="page-container">
      <AppTitle />
      
      <div className="initial-greeting-content">
        {/* Dialog box positioned at top */}
        <div className="dialog-box-top">
          <p className="dialog-text">
            {displayedText}
          </p>
        </div>

        {/* Robot image on the right side */}
        <div className="initial-greeting-robot-container-right">
          <img 
            src={robotHappyImage} 
            alt="Robot" 
            className="initial-greeting-robot-image"
          />
        </div>
        
        <div className="navigation-buttons">
          <button 
            className="back-button"
            onClick={handleBack}
            disabled={isTyping}
          >
            Back
          </button>
          <button 
            className="continue-button"
            onClick={handleContinue}
            disabled={isTyping}
          >
            {showSecondMessage ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
