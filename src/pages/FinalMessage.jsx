import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotHappyImage from '../assets/robot-happy.png';
import AppTitle from '../components/common/AppTitle';
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

  const typingSpeed = 40;

  const dialogues = {
    first: "Thank you for joining me in solving the puzzles today!",
    second: "I hope you have learned that an AI like me could remember what you told me to connect the dots and come up with details you didn't tell me!"
  };

  const currentDialogueText = showSecondMessage ? dialogues.second : dialogues.first;

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
