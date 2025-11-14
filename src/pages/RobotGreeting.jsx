import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import useSpeech, { getChildFriendlyVoice } from '../utils/useSpeech';
import '../styles/RobotGreeting.css';
import '../App.css';

export default function RobotGreeting() {
  const navigate = useNavigate();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Toggle for voice
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [friendlyVoice, setFriendlyVoice] = useState(null);

  const dialogues = [
    "Hello there! My name is Robo! What's your name?",
    "It's great to meet you, {name}!",
    "In today's exercise, you'll try solving some puzzles on your own… ",
    "Then I'll show you how I can solve them, and maybe I'll do them even faster! Think you can beat me?",
  ];

  const typingSpeed = 55;

  // Load child-friendly voice on component mount
  useEffect(() => {
    getChildFriendlyVoice().then(voice => {
      setFriendlyVoice(voice);
    });
  }, []);

  // Get current dialogue text
  const currentDialogue = dialogues[currentDialogueIndex].replace('{name}', userName);
  
  // Use speech hook - speak when typing is complete
  const speechControl = useSpeech(
    currentDialogue,
    voiceEnabled && shouldSpeak,
    {
      rate: 0.9,      // Slightly slower for friendly, clear speech
      pitch: 1.0,     // Normal pitch for natural, warm voice
      volume: 1.0,
      voiceName: friendlyVoice?.name // Use child-friendly voice if available
    }
  );

  useEffect(() => {
    const currentDialogue = dialogues[currentDialogueIndex].replace('{name}', userName);
    
    // Start speech immediately when new dialogue starts
    if (displayedText === '') {
      setShouldSpeak(true);
    }
    
    if (isTyping && displayedText.length < currentDialogue.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogue.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogue.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueIndex, userName, dialogues]);

  const handleContinue = () => {
    // Stop any ongoing speech
    speechControl.stop();
    setShouldSpeak(false);
    
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      navigate('/puzzle/first', { state: { userName } });
    }
  };

  const handleBack = () => {
    // Stop any ongoing speech
    speechControl.stop();
    setShouldSpeak(false);
    
    if (currentDialogueIndex > 1) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
      setDisplayedText('');
      setIsTyping(true);
    } else if (currentDialogueIndex === 1) {
      // Go back to name input
      setCurrentDialogueIndex(0);
      setShowInput(true);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // At the very first screen, navigate back to home/character selection
      navigate('/');
    }
  };

  const handleSubmit = () => {
    if (userName.trim()) {
      setShowInput(false);
      setCurrentDialogueIndex(1);
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleInputChange = (e) => {
    setUserName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="page-container" style={{ cursor: !showInput && !isTyping ? 'pointer' : 'default' }}>
      <div className="robot-greeting-content">
        <div className="dialog-box" style={{ width: '300px'}}>
          <p className="dialog-text">{displayedText}</p>
        </div>

        <div className="robot-greeting-robot-container">
          <img 
            src={robotImage} 
            alt="Robot" 
            className="robot-greeting-robot-image"
          />
        </div>

        {showInput && (
          <div 
            className="robot-greeting-form-container"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="robot-greeting-prompt-text">My name is...</p>
            <input
              type="text"
              value={userName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="robot-greeting-input"
              autoFocus
            />
          </div>
        )}

        {!showInput && (
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
              onClick={(e) => {
                e.stopPropagation();
                handleContinue();
              }}
              disabled={isTyping}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}