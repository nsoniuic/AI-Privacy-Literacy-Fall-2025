import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import '../App.css';

export default function RobotGreeting() {
  const navigate = useNavigate();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  const dialogues = [
    "Hello there! My name is Robo! What's your name?",
    "It's great to meet you, {name}!",
    "In today's exercise, you'll try solving some puzzles on your own… ",
    "Then I'll show you how I can solve them, and maybe I'll do them even faster! Think you can beat me?",
  ];

  const typingSpeed = 30;

  useEffect(() => {
    const currentDialogue = dialogues[currentDialogueIndex].replace('{name}', userName);
    
    if (isTyping && displayedText.length < currentDialogue.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogue.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogue.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueIndex, userName, dialogues]);

  const handleScreenClick = () => {
    if (showInput) return;
    if (isTyping) return;
    
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // Navigate to puzzle page with userName as state
      navigate('/puzzle', { state: { userName } });
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
    <div className="page-container" onClick={handleScreenClick} style={{ cursor: !showInput && !isTyping ? 'pointer' : 'default' }}>
      <div style={styles.mainContent}>
        <div className="dialog-box">
          <p className="dialog-text">{displayedText}</p>
        </div>

        <div style={styles.robotContainer}>
          <img 
            src={robotImage} 
            alt="Robot" 
            style={styles.robotImage}
          />
        </div>

        {showInput && (
          <div 
            style={styles.formContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={styles.promptText}>My name is...</p>
            <input
              type="text"
              value={userName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              style={styles.input}
              autoFocus
            />
          </div>
        )}

        {!showInput && !isTyping && currentDialogueIndex < dialogues.length && (
          <p style={styles.clickHint}>Click to continue...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  mainContent: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
  },
  robotContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '250px',
    width: '100%',
  },
  robotImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  promptText: {
    fontSize: '18px',
    color: 'white',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  input: {
    width: '90%',
    maxWidth: '350px',
    padding: '12px 16px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: 'white',
    color: '#333',
  },
  clickHint: {
    fontSize: '16px',
    color: '#ffffff',
    fontWeight: 'bold',
    fontStyle: 'italic',
    margin: '20px 0',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
    animation: 'pulse 2s infinite',
  },
};