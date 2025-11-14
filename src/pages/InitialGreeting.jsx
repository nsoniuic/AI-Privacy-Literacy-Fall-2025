import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
// Import different robot emotion images here as they become available
import robotHappyImage from '../assets/robot-happy.png';
import robotWaveImage from '../assets/robot-wave.png';
import robotThumbsUpImage from '../assets/robot-thumbs-up.png';
import robotThinkImage from '../assets/robot-think.png';
import useSpeech, { getChildFriendlyVoice } from '../utils/useSpeech';
import AppTitle from '../components/AppTitle';
import '../styles/InitialGreeting.css';
import '../App.css';

export default function InitialGreeting() {
  const navigate = useNavigate();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Toggle for voice
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [friendlyVoice, setFriendlyVoice] = useState(null);

  // Dialogue configuration with emotion/image syncing
  // Each dialogue has text and corresponding robot emotion image
  const dialogueConfig = [
    {
      text: "Hi there! I’m Robo, your AI buddy. Together, we’ll explore how AI thinks and what happens when we share information with it. What’s your name?",
      emotion: 'happy',
      image: robotWaveImage, // Replace with robotHappyImage when available
    },
    {
      text: "It's great to meet you, {name}!",
      emotion: 'excited',
      image: robotWaveImage, // Replace with robotExcitedImage when available
    },
    {
      text: "In today's exercise, you'll try solving some puzzles on your own… ",
      emotion: 'neutral',
      image: robotHappyImage, // Current default robot image
    },
    {
      text: "Then I'll show you how I can solve them, and maybe I'll do them even faster! Think you can beat me?",
      emotion: 'playful',
      image: robotHappyImage, // Replace with robotPlayfulImage when available
    },
  ];

  const typingSpeed = 55;

  // Load child-friendly voice on component mount
  useEffect(() => {
    getChildFriendlyVoice().then(voice => {
      setFriendlyVoice(voice);
    });
  }, []);

  // Get current dialogue configuration
  const currentDialogueConfig = dialogueConfig[currentDialogueIndex];
  const currentDialogue = currentDialogueConfig.text.replace('{name}', userName);
  const currentRobotImage = currentDialogueConfig.image;
  
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
    const dialogueText = dialogueConfig[currentDialogueIndex].text.replace('{name}', userName);
    
    // Start speech immediately when new dialogue starts
    if (displayedText === '') {
      setShouldSpeak(true);
    }
    
    if (isTyping && displayedText.length < dialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === dialogueText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueIndex, userName]);

  const handleContinue = () => {
    // Stop any ongoing speech
    speechControl.stop();
    setShouldSpeak(false);
    
    if (currentDialogueIndex < dialogueConfig.length - 1) {
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
      <AppTitle />

      <div className="initial-greeting-content">
        {/* Dialog box positioned at top */}
        <div className="dialog-box-top">
          <p className="dialog-text">{displayedText}</p>
        </div>

        {/* Robot image on the right side */}
        <div className="initial-greeting-robot-container-right">
          <img 
            src={currentRobotImage} 
            alt={`Robot ${currentDialogueConfig.emotion}`} 
            className="initial-greeting-robot-image"
            key={currentDialogueIndex} // Force re-render on dialogue change for smooth transitions
          />
        </div>

        {/* Name prompt and input below robot */}
        {showInput && (
          <div className="initial-greeting-input-section">
            <p className="initial-greeting-prompt-text">What's your name?</p>
            <input
              type="text"
              value={userName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="initial-greeting-input"
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