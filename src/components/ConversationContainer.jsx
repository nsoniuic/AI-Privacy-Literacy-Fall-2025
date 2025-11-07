import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
import boyCharacter from '../assets/boy.png';
import girlCharacter from '../assets/girl.png';
import '../styles/Conversation.css';

export default function ConversationContainer({ 
  selectedCharacter, 
  conversation, 
  onConversationEnd,
  memoryTriggers = { gradeLevel: 3, birthday: 6 }, // Default indices for first scenario
  memoryLabels = { first: 'Grade Level', second: 'Birthday' }, // Default labels for first scenario
  thoughtBubbleTexts = { first: 'grade level', second: 'birthday' }, // Default thought bubble texts
  endThoughtText = null // Custom end thought text (optional)
}) {
  const characterName = selectedCharacter === 'boy' ? 'Nate' : 'Natalie';
  const characterPronoun = selectedCharacter === 'boy' ? 'his' : 'her';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [completedDialogues, setCompletedDialogues] = useState([]);
  const [showMemoryContainer, setShowMemoryContainer] = useState(false);
  const [showGradeLevelThought, setShowGradeLevelThought] = useState(false);
  const [showBirthdayThought, setShowBirthdayThought] = useState(false);
  const [showGradeLevelInMemory, setShowGradeLevelInMemory] = useState(false);
  const [showBirthdayInMemory, setShowBirthdayInMemory] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('conversation'); // 'conversation', 'thinking', 'memory-extraction'

  const typingSpeed = 10;
  const currentDialogue = conversation[currentDialogueIndex];

  const thoughtText = endThoughtText || `Now that I have ${characterPronoun} birthday and grade level, let's see what I can figure out...`;

  useEffect(() => {
    if (isTyping && displayedText.length < currentDialogue.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogue.text.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogue.text.length) {
      setIsTyping(false);
      
      // Add completed dialogue to the list
      if (!completedDialogues.find(d => d.index === currentDialogueIndex)) {
        setCompletedDialogues([...completedDialogues, { 
          index: currentDialogueIndex, 
          text: currentDialogue.text,
          speaker: currentDialogue.speaker
        }]);
      }
      
      // Check if this is the dialogue where character mentions grade level
      if (currentDialogueIndex === memoryTriggers.gradeLevel && currentDialogue.speaker === 'character') {
        // Trigger thought bubble after 0.5 second delay
        setTimeout(() => {
          setShowGradeLevelThought(true);
          setShowMemoryContainer(true);
          
          // Add to memory container after additional delay (1.5 seconds total)
          setTimeout(() => {
            setShowGradeLevelInMemory(true);
          }, 1000);

        }, 500); // 0.5 second delay after typing finishes
      }
      
      // Check if this is the dialogue where character mentions birthday
      else if (currentDialogueIndex === memoryTriggers.birthday && currentDialogue.speaker === 'character') {
        // Trigger thought bubble after 0.5 second delay
        setTimeout(() => {
          setShowBirthdayThought(true);
          setShowMemoryContainer(true);
          
          // Add to memory container after additional delay (1.5 seconds total)
          setTimeout(() => {
            setShowBirthdayInMemory(true);
          }, 1000);

        }, 500); // 0.5 second delay after typing finishes
      }
    }
  }, [displayedText, isTyping, currentDialogue.text, currentDialogueIndex, currentDialogue.speaker, completedDialogues, memoryTriggers]);

  const handleContinue = () => {
    // Hide memory container when continuing to next dialogue after animation
    if (showMemoryContainer && (currentDialogueIndex === memoryTriggers.gradeLevel || currentDialogueIndex === memoryTriggers.birthday)) {
      setShowMemoryContainer(false);
      setShowBirthdayThought(false);
      setShowGradeLevelThought(false);
    }
    
    if (currentDialogueIndex < conversation.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // End of conversation - show robot thinking screen
      setCurrentScreen('thinking');
    }
  };

  const handleContinueClick = () => {
    if (currentScreen === 'thinking') {
      // Move from thinking to next page (memory extraction)
      if (onConversationEnd) {
        onConversationEnd();
      }
    }
  };

  const handleBack = () => {
    if (currentDialogueIndex > 0) {
      // Remove the last completed dialogue
      setCompletedDialogues(completedDialogues.slice(0, -1));
      
      const previousIndex = currentDialogueIndex - 1;
      setCurrentDialogueIndex(previousIndex);
      setDisplayedText('');
      setIsTyping(true);
      
      // Reset thought bubbles when going back from dialogue 4 or 7
      if (currentDialogueIndex === 4) {
        setShowGradeLevelThought(false);
        setShowMemoryContainer(true);
      } else if (currentDialogueIndex === 7) {
        setShowBirthdayThought(false);
        setShowMemoryContainer(true);
      }
      
      // If going back before the grade level dialogue, reset that state
      if (previousIndex < 3) {
        setShowGradeLevelThought(false);
        setShowGradeLevelInMemory(false);
        setShowMemoryContainer(false);
      }
      
      // If going back before the birthday dialogue, reset that state
      if (previousIndex < 6) {
        setShowBirthdayThought(false);
        setShowBirthdayInMemory(false);
      }
    }
  };

  // Get character image based on selection
  const getCharacterImage = () => {
    return selectedCharacter === 'boy' ? boyCharacter : girlCharacter;
  };

  // Hard-coded collected info based on dialogue progression with delay
  const getCollectedInfo = () => {
    const info = [];
    if (showGradeLevelInMemory) {
      info.push(memoryLabels.first);
    }
    if (showBirthdayInMemory) {
      info.push(memoryLabels.second);
    }
    return info;
  };

  // Get the most recent completed dialogue for each speaker
  const getLastCharacterDialogue = () => {
    const characterDialogues = completedDialogues.filter(d => d.speaker === 'character');
    return characterDialogues.length > 0 ? characterDialogues[characterDialogues.length - 1] : null;
  };

  const getLastRobotDialogue = () => {
    const robotDialogues = completedDialogues.filter(d => d.speaker === 'robot');
    return robotDialogues.length > 0 ? robotDialogues[robotDialogues.length - 1] : null;
  };

  return (
    <>
      {currentScreen === 'thinking' ? (
        // AI thinking to itself screen
        <div className="robot-thinking-container">
          <div className="robot-thinking-content">
            {/* Large thought bubble */}
            <div className="large-thought-bubble">
              <p className="thought-text">{thoughtText}</p>
            </div>

            {/* Robot image */}
            <div className="conversation-robot-image-container">
              <img 
                src={robotImage} 
                alt="Robot" 
                className="robot-thinking-image"
              />
            </div>

            {/* Continue button */}
            <button 
              className="continue-button"
              onClick={handleContinueClick}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Brain/Memory System - always visible */}
          <div className="brain-system">
            <div className="brain-icon">🧠</div>
            <div className="brain-label">AI Memory</div>
            <div className="collected-info-list">
              {getCollectedInfo().length > 0 ? (
                getCollectedInfo().map((info, index) => (
                  <div key={index} className="collected-info-item">{info}</div>
                ))
              ) : (
                <div className="empty-memory-message">No data collected yet</div>
              )}
            </div>
          </div>

          <div className="characters-container">
            {/* Character avatar with dialogue box */}
            <div className={`character-avatar ${currentDialogue.speaker === 'character' ? 'speaking' : ''}`}>
              {/* Show current typing dialogue or last completed dialogue */}
              {currentDialogue.speaker === 'character' ? (
                <div className="character-dialog-box">
                  <p className="dialog-text">{displayedText}</p>
                </div>
              ) : getLastCharacterDialogue() && (
                <div className="character-dialog-box previous-dialogue">
                  <p className="dialog-text">{getLastCharacterDialogue().text}</p>
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
                  {characterName} mentioned {thoughtBubbleTexts.first}!
                </div>
              )}
              
              {/* Thought bubble for birthday */}
              {showBirthdayThought && (
                <div className="thought-bubble">
                  {characterName} mentioned {thoughtBubbleTexts.second}!
                </div>
              )}
              
              {/* Show current typing dialogue or last completed dialogue, but hide when thought bubble is shown */}
              {!showGradeLevelThought && !showBirthdayThought && (
                <>
                  {currentDialogue.speaker === 'robot' ? (
                    <div className="robot-dialog-box">
                      <p className="dialog-text">{displayedText}</p>
                    </div>
                  ) : getLastRobotDialogue() && (
                    <div className="robot-dialog-box previous-dialogue">
                      <p className="dialog-text">{getLastRobotDialogue().text}</p>
                    </div>
                  )}
                </>
              )}
              <img 
                src={robotImage} 
                alt="Robot" 
                className="robot-conversation-image"
              />
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="back-button"
              onClick={handleBack}
              disabled={currentDialogueIndex === 0}
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
      )}
    </>
  );
}
