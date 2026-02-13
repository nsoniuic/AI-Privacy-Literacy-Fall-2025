import { useState, useEffect, useRef } from 'react';
import robotHappyImage from '../../assets/robot-happy.png';
import boyCharacter from '../../assets/boy.png';
import girlCharacter from '../../assets/girl.png';
import useSpeech, { getChildFriendlyVoice } from '../../utils/useSpeech';
import { CHILD_FRIENDLY_VOICES } from '../../services/elevenLabsService';
import { useScreenNumber } from '../../hooks/useScreenNumber';
import '../../styles/pages/Conversation.css';

export default function ConversationContainer({ 
  selectedCharacter, 
  conversation, 
  onConversationEnd,
  memoryTriggers = { gradeLevel: 3, birthday: 6 }, // Default indices for first scenario
  memoryLabels = { first: 'Grade Level', second: 'Birthday' }, // Default labels for first scenario
  thoughtBubbleTexts = { first: 'grade level', second: 'birthday' }, // Default thought bubble texts
  endThoughtText = null, // Custom end thought text (optional)
  clueStartNumber = 1, // Starting clue number (1 for first scenario, 3 for second scenario)
  startScreenNumber = 29 // Starting screen number for this conversation
}) {
  const characterName = 'Parker';
  const characterPronoun = selectedCharacter === 'boy' ? 'his' : 'her';
  const characterPossessive = selectedCharacter === 'boy' ? 'He' : 'She';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [completedDialogues, setCompletedDialogues] = useState([]);
  const [showMemoryContainer, setShowMemoryContainer] = useState(false);
  const [showGradeLevelThought, setShowGradeLevelThought] = useState(false);
  const [showBirthdayThought, setShowBirthdayThought] = useState(false);
  const [showGradeLevelInMemory, setShowGradeLevelInMemory] = useState(false);
  const [showBirthdayInMemory, setShowBirthdayInMemory] = useState(false);
  const [newlyAddedItem, setNewlyAddedItem] = useState(null); // Track which item was just added
  const [hasTriggeredGradeAnimation, setHasTriggeredGradeAnimation] = useState(false);
  const [hasTriggeredBirthdayAnimation, setHasTriggeredBirthdayAnimation] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('conversation'); // 'conversation', 'thinking', 'memory-extraction'
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Toggle for voice
  const [shouldSpeakRobot, setShouldSpeakRobot] = useState(false);
  const [shouldSpeakCharacter, setShouldSpeakCharacter] = useState(false);
  const [friendlyVoice, setFriendlyVoice] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Update screen number based on current dialogue index and screen state
  // Each message in conversation gets its own screen number
  // When on thinking screen, use startScreenNumber + conversation.length
  const screenNumber = currentScreen === 'thinking' 
    ? startScreenNumber + conversation.length 
    : startScreenNumber + currentDialogueIndex;
  useScreenNumber(screenNumber);
  
  // Refs for animation positioning
  const characterDialogRef = useRef(null);
  const memoryBoxRef = useRef(null);
  const robotAvatarRef = useRef(null);

  const typingSpeed = 40;
  const currentDialogue = conversation[currentDialogueIndex];

  const thoughtText = endThoughtText || `Now that I have ${characterPronoun} birthday and grade level, let's see what I can figure out...`;

  // Load child-friendly voice on component mount
  useEffect(() => {
    getChildFriendlyVoice().then(voice => {
      setFriendlyVoice(voice);
    });
  }, []);

  // Start speech when dialogue starts (synchronize with typing)
  useEffect(() => {
    if (displayedText === '') {
      if (currentDialogue.speaker === 'robot') {
        setShouldSpeakRobot(true);
        setShouldSpeakCharacter(false);
      } else if (currentDialogue.speaker === 'character') {
        setShouldSpeakCharacter(true);
        setShouldSpeakRobot(false);
      }
    }
  }, [currentDialogueIndex, currentDialogue.speaker, displayedText]);

  // Robot speech - warm male voice
  const robotSpeechControl = useSpeech(
    currentDialogue.speaker === 'robot' ? currentDialogue.text : '',
    voiceEnabled && shouldSpeakRobot && currentDialogue.speaker === 'robot',
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.CALLUM, // Warm male voice for robot
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      voiceName: friendlyVoice?.name
    }
  );

  // Child character speech - child voice
  const characterSpeechControl = useSpeech(
    currentDialogue.speaker === 'character' ? currentDialogue.text : '',
    voiceEnabled && shouldSpeakCharacter && currentDialogue.speaker === 'character',
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.LILY, // Child voice for character
      rate: 0.6,
      pitch: 0.2,
      volume: 1.0
    }
  );

  useEffect(() => {
    if (isTyping && displayedText.length < currentDialogue.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogue.text.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogue.text.length) {
      
      // Add completed dialogue to the list
      if (!completedDialogues.find(d => d.index === currentDialogueIndex)) {
        setCompletedDialogues([...completedDialogues, { 
          index: currentDialogueIndex, 
          text: currentDialogue.text,
          speaker: currentDialogue.speaker
        }]);
      }
      
      // Check if this is the dialogue where character mentions grade level
      if (currentDialogueIndex === memoryTriggers.gradeLevel && currentDialogue.speaker === 'character' && !hasTriggeredGradeAnimation) {
        setHasTriggeredGradeAnimation(true);
        // Start animation sequence
        setTimeout(() => {
          setShowGradeLevelThought(true);
          setShowAnimation(true);
          setShowMemoryContainer(true);
          
          // Show thought bubble after short delay
          // setTimeout(() => {
            
          // }, 800);
          
          // Add to memory container after delay
          setTimeout(() => {
            setShowGradeLevelInMemory(true);
            setNewlyAddedItem('grade');
            setIsTyping(false);
            // Clear the new item flag after animation completes
            setTimeout(() => setNewlyAddedItem(null), 2000);
          }, 1700);

        }, 500); // 0.5 second delay after typing finishes
      }
      
      // Check if this is the dialogue where character mentions birthday
      else if (currentDialogueIndex === memoryTriggers.birthday && currentDialogue.speaker === 'character' && !hasTriggeredBirthdayAnimation) {
        setHasTriggeredBirthdayAnimation(true);
        // Start animation sequence
        setTimeout(() => {
          setShowAnimation(true);
          
          // Show thought bubble after short delay
          setTimeout(() => {
            setShowBirthdayThought(true);
          }, 800);
          
          // Add to memory container after delay
          setTimeout(() => {
            setShowBirthdayInMemory(true);
            setNewlyAddedItem('birthday');
            setIsTyping(false);
            // Clear the new item flag after animation completes
            setTimeout(() => setNewlyAddedItem(null), 2000);
          }, 1700);

        }, 500); // 0.5 second delay after typing finishes
      }
      else {
        setIsTyping(false);
      }

      
    }
  }, [displayedText, isTyping, currentDialogue.text, currentDialogueIndex, currentDialogue.speaker, completedDialogues, memoryTriggers]);

  const handleContinue = () => {
    // Stop any ongoing speech
    robotSpeechControl.stop();
    characterSpeechControl.stop();
    setShouldSpeakRobot(false);
    setShouldSpeakCharacter(false);
    
    // Only hide thought bubbles and animation, keep memory visible
    setShowBirthdayThought(false);
    setShowGradeLevelThought(false);
    setShowAnimation(false);
    setNewlyAddedItem(null);
    
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
    // Stop any ongoing speech
    robotSpeechControl.stop();
    characterSpeechControl.stop();
    setShouldSpeakRobot(false);
    setShouldSpeakCharacter(false);
    
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
      info.push({ 
        id: 'grade',
        icon: '📚',
        text: `Clue ${clueStartNumber}: I learned ${characterName}'s ${memoryLabels.first.toLowerCase()}`,
        isNew: newlyAddedItem === 'grade'
      });
    }
    if (showBirthdayInMemory) {
      info.push({ 
        id: 'birthday',
        icon: '🎂',
        text: `Clue ${clueStartNumber + 1}: I learned ${characterName}'s ${memoryLabels.second.toLowerCase()}`,
        isNew: newlyAddedItem === 'birthday'
      });
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

  // Calculate SVG path for animated connection
  const getConnectionPath = () => {
    if (!characterDialogRef.current || !memoryBoxRef.current || !robotAvatarRef.current) {
      return { path1: '', path2: '' };
    }

    const containerRect = characterDialogRef.current.closest('.characters-container')?.getBoundingClientRect();
    const charRect = characterDialogRef.current.getBoundingClientRect();
    const memoryRect = memoryBoxRef.current.getBoundingClientRect();
    const robotRect = robotAvatarRef.current.getBoundingClientRect();

    if (!containerRect) {
      return { path1: '', path2: '' };
    }

    // Calculate relative positions
    const charX = charRect.right - containerRect.left;
    const charY = charRect.top + charRect.height / 2 - containerRect.top;
    
    const memoryX = memoryRect.left - containerRect.left;
    const memoryY = memoryRect.top + memoryRect.height / 2 - containerRect.top;
    
    const robotX = robotRect.left + robotRect.width / 2 - containerRect.left;
    const robotY = robotRect.top - containerRect.top - 50; // Above robot

    // Path 1: Character dialog to memory
    const path1 = `M ${charX} ${charY} Q ${(charX + memoryX) / 2} ${charY - 50} ${memoryX} ${memoryY}`;
    
    // Path 2: Memory to robot (thought bubble position)
    const path2 = `M ${memoryX + memoryRect.width} ${memoryY} Q ${(memoryX + memoryRect.width + robotX) / 2} ${memoryY - 50} ${robotX} ${robotY}`;

    return { path1, path2 };
  };

  return (
    <>
      {/* Voice Toggle Button */}
      <button 
        className="voice-toggle-button"
        onClick={() => {
          setVoiceEnabled(!voiceEnabled);
          if (voiceEnabled) {
            speechControl.stop();
          }
        }}
        title={voiceEnabled ? "Mute voice" : "Enable voice"}
      >
        {voiceEnabled ? "🔊" : "🔇"}
      </button>

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
                src={robotHappyImage} 
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
          <div className="characters-container">
            {/* SVG overlay for connection animation */}
            {showAnimation && (
              <svg className="thought-connection-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20 }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#ff6b35" />
                  </marker>
                </defs>
                <path 
                  d={getConnectionPath().path1} 
                  className="connection-line animate-line-1"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            )}

            {/* Character avatar with dialogue box */}
            <div className={`character-avatar ${currentDialogue.speaker === 'character' ? 'speaking' : ''}`}>
              {/* Show current typing dialogue or last completed dialogue */}
              {currentDialogue.speaker === 'character' ? (
                <div className="character-dialog-box" ref={characterDialogRef}>
                  <p className="dialog-text">{displayedText}</p>
                </div>
              ) : getLastCharacterDialogue() && (
                <div className="character-dialog-box previous-dialogue" ref={characterDialogRef}>
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
            <div className={`robot-avatar ${currentDialogue.speaker === 'robot' ? 'speaking' : ''}`} ref={robotAvatarRef}>
              {/* Thought bubble for first item */}
              {showGradeLevelThought && (
                <div className={`thought-bubble ${showAnimation ? 'thought-bubble-delayed' : ''}`}>
                  Oh! {characterName} just told me {characterPronoun === 'his' ? 'his' : 'her'} {thoughtBubbleTexts.first}. I'll remember that!
                </div>
              )}
              
              {/* Thought bubble for second item */}
              {showBirthdayThought && (
                <div className={`thought-bubble ${showAnimation ? 'thought-bubble-delayed' : ''}`}>
                  Oh! {characterName} just told me {characterPronoun === 'his' ? 'his' : 'her'} {thoughtBubbleTexts.second}. I'll remember that!
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
                src={robotHappyImage} 
                alt="Robot" 
                className="robot-conversation-image"
              />
            </div>

            {/* Brain/Memory System - always visible */}
            <div className="brain-system">
              <div ref={memoryBoxRef} className={showAnimation ? 'memory-pulse' : ''}>
                <div className="brain-icon">🧠</div>
                <div className="brain-label">Robo's Memory</div>
                <div className="collected-info-list">
                  {getCollectedInfo().length > 0 ? (
                    getCollectedInfo().map((info, index) => (
                      <div 
                        key={info.id} 
                        className={`collected-info-item ${info.isNew ? 'newly-added' : ''}`}
                      >
                        <span className="info-icon">{info.icon}</span>
                        <span className="info-text">{info.text}</span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-memory-message">No data collected yet</div>
                  )}
                </div>
              </div>
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
