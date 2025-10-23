import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
import ARCPuzzle from './ARCPuzzle';

export default function RobotGreeting() {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [showNewPage, setShowNewPage] = useState(false);

  const dialogues = [
    "Hello there! My name is Robo! What's your name?",
    "It's great to meet you, {name}!",
    "In today’s exercise, you’ll try solving some puzzles on your own… ",
    "Then I’ll show you how I can solve them, and maybe I’ll do them even faster! Think you can beat me?",
  ];

  const typingSpeed = 50;

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
    // Don't advance if we're still showing the input
    if (showInput) return;
    
    // Don't advance if still typing
    if (isTyping) return;
    
    // Move to next dialogue if available
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // We've reached the final dialogue, switch to new page
      setShowNewPage(true);
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

  if (showNewPage) {
    return <ARCPuzzle userName={userName} />;
  }

  return (
    <div style={styles.container}>
      <div 
        style={styles.mainContent} 
        onClick={handleScreenClick}
      >
        <div style={styles.dialogBox}>
          <p style={styles.dialogText}>{displayedText}</p>
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

        {!showInput && !isTyping && currentDialogueIndex < dialogues.length - 1 && (
          <p style={styles.clickHint}>Click to continue...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    margin: '0 auto',
    backgroundColor: '#87CEEB',
    padding: '40px 20px',
    textAlign: 'center',
    minHeight: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mainContent: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#87CEEB',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'pointer',
  },
  dialogBox: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px 24px',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    maxWidth: '400px',
  },
  dialogText: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
    minHeight: '24px',
    wordWrap: 'break-word',
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
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    margin: '10px 0',
    animation: 'pulse 2s infinite',
  },
};