import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
// Import character images when ready
import boyCharacter from '../assets/boy.png';
import girlCharacter from '../assets/girl.png';
import '../styles/Conversation.css';

export default function ConversationContainer({ selectedCharacter, conversation, onConversationEnd }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showGradeLevelAnimation, setShowGradeLevelAnimation] = useState(false);
  const [showBirthdayAnimation, setShowBirthdayAnimation] = useState(false);
  const [collectedInfo, setCollectedInfo] = useState([]);
  const [hasTriggeredGradeLevelAnimation, setHasTriggeredGradeLevelAnimation] = useState(false);
  const [hasTriggeredBirthdayAnimation, setHasTriggeredBirthdayAnimation] = useState(false);
  const [showMemoryContainer, setShowMemoryContainer] = useState(false);

  const typingSpeed = 30;
  const currentDialogue = conversation[currentDialogueIndex];

  useEffect(() => {
    if (isTyping && displayedText.length < currentDialogue.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogue.text.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogue.text.length) {
      setIsTyping(false);
      
      // Check if this is the dialogue where character mentions grade level and animation hasn't been triggered yet
      if (currentDialogueIndex === 3 && currentDialogue.speaker === 'character' && !hasTriggeredGradeLevelAnimation) {
        // Trigger animation after 1 second delay
        setTimeout(() => {
          setShowGradeLevelAnimation(true);
          setHasTriggeredGradeLevelAnimation(true);
          setShowMemoryContainer(true);
          
          // Wait for animation to complete
          setTimeout(() => {
            setCollectedInfo(['Grade Level']);
            setShowGradeLevelAnimation(false);
          }, 2000); // Animation duration
        }, 1000); // 1 second delay after typing finishes
      }
      
      // Check if this is the dialogue where character mentions birthday
      if (currentDialogueIndex === 6 && currentDialogue.speaker === 'character' && !hasTriggeredBirthdayAnimation) {
        // Trigger animation after 1 second delay
        setTimeout(() => {
          setShowBirthdayAnimation(true);
          setHasTriggeredBirthdayAnimation(true);
          setShowMemoryContainer(true);
          
          // Wait for animation to complete
          setTimeout(() => {
            setCollectedInfo(prevInfo => [...prevInfo, 'Birthday']);
            setShowBirthdayAnimation(false);
          }, 2000); // Animation duration
        }, 1000); // 1 second delay after typing finishes
      }
    }
  }, [displayedText, isTyping, currentDialogue.text, currentDialogueIndex, currentDialogue.speaker, hasTriggeredGradeLevelAnimation, hasTriggeredBirthdayAnimation]);

  const handleContinue = () => {
    // Hide memory container when continuing to next dialogue after animation
    if (showMemoryContainer && (currentDialogueIndex === 3 || currentDialogueIndex === 6)) {
      setShowMemoryContainer(false);
    }
    
    if (currentDialogueIndex < conversation.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // End of conversation
      if (onConversationEnd) {
        onConversationEnd();
      }
    }
  };

  const handleBack = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
      setDisplayedText('');
      setIsTyping(true);
      
      // Reset memory container state when going back
      if (currentDialogueIndex === 4 || currentDialogueIndex === 7) {
        setShowMemoryContainer(true);
      }
    }
  };

  // Get character image based on selection
  const getCharacterImage = () => {
    return selectedCharacter === 'boy' ? boyCharacter : girlCharacter;
  };

  return (
    <>
      {/* Back button */}
      <button 
        className="back-button"
        onClick={handleBack}
        disabled={currentDialogueIndex === 0}
      >
        ← Back
      </button>

      {/* Animated "Grade Level" text */}
      {showGradeLevelAnimation && (
        <div className="animated-info-text">Grade Level</div>
      )}

      {/* Animated "Birthday" text */}
      {showBirthdayAnimation && (
        <div className="animated-info-text">Birthday</div>
      )}

      {/* Brain/Memory System - only show when showMemoryContainer is true */}
      {showMemoryContainer && collectedInfo.length > 0 && (
        <div className="brain-system">
          <div className="brain-icon">🧠</div>
          <div className="brain-label">AI Memory</div>
          <div className="collected-info-list">
            {collectedInfo.map((info, index) => (
              <div key={index} className="collected-info-item">{info}</div>
            ))}
          </div>
        </div>
      )}

      <div className="characters-container">
        {/* Character avatar with dialogue box */}
        <div className={`character-avatar ${currentDialogue.speaker === 'character' ? 'speaking' : ''}`}>
          {currentDialogue.speaker === 'character' && (
            <div className="character-dialog-box">
              <p className="dialog-text">{displayedText}</p>
            </div>
          )}
          {getCharacterImage() ? (
            <img src={getCharacterImage()} alt="Character" className="character-image" />
          ) : (
            <div className="character-placeholder-img">Character</div>
          )}
        </div>

        {/* Robot avatar with dialogue box */}
        <div className={`robot-avatar ${currentDialogue.speaker === 'robot' ? 'speaking' : ''}`}>
          {currentDialogue.speaker === 'robot' && (
            <div className="robot-dialog-box">
              <p className="dialog-text">{displayedText}</p>
            </div>
          )}
          <img 
            src={robotImage} 
            alt="Robot" 
            className="robot-conversation-image"
          />
        </div>
      </div>

      <button 
        className="continue-button"
        onClick={handleContinue}
        disabled={isTyping}
      >
        {currentDialogueIndex < conversation.length - 1 ? 'Continue' : 'Finish'}
      </button>
    </>
  );
}
