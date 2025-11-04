import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
import boyCharacter from '../assets/boy.png';
import girlCharacter from '../assets/girl.png';
import '../styles/Conversation.css';

export default function ConversationContainer({ selectedCharacter, conversation, onConversationEnd }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showMemoryContainer, setShowMemoryContainer] = useState(false);
  const [showGradeLevelThought, setShowGradeLevelThought] = useState(false);
  const [showBirthdayThought, setShowBirthdayThought] = useState(false);

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
      
      // Check if this is the dialogue where character mentions grade level
      if (currentDialogueIndex === 3 && currentDialogue.speaker === 'character') {
        // Trigger thought bubble after 0.5 second delay
        setTimeout(() => {
          setShowGradeLevelThought(true);
          setShowMemoryContainer(true);

        }, 500); // 0.5 second delay after typing finishes
      }
      
      // Check if this is the dialogue where character mentions birthday
      else if (currentDialogueIndex === 6 && currentDialogue.speaker === 'character') {
        // Trigger thought bubble after 0.5 second delay
        setTimeout(() => {
          setShowBirthdayThought(true);
          setShowMemoryContainer(true);

        }, 500); // 0.5 second delay after typing finishes
      }
    }
  }, [displayedText, isTyping, currentDialogue.text, currentDialogueIndex, currentDialogue.speaker]);

  const handleContinue = () => {
    // Hide memory container when continuing to next dialogue after animation
    if (showMemoryContainer && (currentDialogueIndex === 3 || currentDialogueIndex === 6)) {
      setShowMemoryContainer(false);
      setShowBirthdayThought(false);
      setShowGradeLevelThought(false);
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
      if (currentDialogueIndex === 4) {
        setShowMemoryContainer(true);
        setShowGradeLevelThought(true);
      }
      else if (currentDialogueIndex === 7) {
        setShowMemoryContainer(true);
        setShowBirthdayThought(true);
      }
    }
  };

  // Get character image based on selection
  const getCharacterImage = () => {
    return selectedCharacter === 'boy' ? boyCharacter : girlCharacter;
  };

  // Get character name based on selection
  const getCharacterName = () => {
    return selectedCharacter === 'boy' ? 'He' : 'She';
  };

  // Hard-coded collected info based on dialogue progression
  const getCollectedInfo = () => {
    const info = [];
    if (currentDialogueIndex >= 3) {
      info.push('Grade Level');
    }
    if (currentDialogueIndex >= 6) {
      info.push('Birthday');
    }
    return info;
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

      {/* Brain/Memory System - only show when showMemoryContainer is true */}
      {showMemoryContainer && getCollectedInfo().length > 0 && (
        <div className="brain-system">
          <div className="brain-icon">🧠</div>
          <div className="brain-label">AI Memory</div>
          <div className="collected-info-list">
            {getCollectedInfo().map((info, index) => (
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
          {/* Thought bubble for grade level */}
          {showGradeLevelThought && (
            <div className="thought-bubble">
              {getCharacterName()} mentioned grade level!
            </div>
          )}
          
          {/* Thought bubble for birthday */}
          {showBirthdayThought && (
            <div className="thought-bubble">
              {getCharacterName()} mentioned birthday!
            </div>
          )}
          
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
