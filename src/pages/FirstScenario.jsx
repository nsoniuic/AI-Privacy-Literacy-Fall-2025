import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import CharacterSelection from '../components/CharacterSelection';
import ConversationContainer from '../components/ConversationContainer';
import '../styles/RobotGreeting.css';
import '../App.css';

export default function FirstScenario() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const dialogues = [
    "Awesome job with the puzzles! Ready to see how I can connect the dots from what you've shared and figure out things you never told me?",
    "Before we continue, which character would you like to see moving forward?",
    "Great! Now, let me show you an example with my friend. I'll show you what they told me, and what I was able to discover on my own."
  ];

  // Define the conversation between robot and character
  const conversation = [
    {
      speaker: 'robot',
      text: "Hey, I missed chatting with you! How's school going lately?"
    },
    {
      speaker: 'character',
      text: "Hi Robo, it’s going pretty well! We’re starting a new unit in Math!"
    },
    {
      speaker: 'robot',
      text: "Sounds interesting! Is math getting harder for you? What math grade are you on right now?"
    },
    {
      speaker: 'character',
      text: "It sure is! I’m in 6th grade math right now. "
    },
    {
      speaker: 'robot',
      text: "6th grade, huh? You better stay focused in class! Math is getting trickier soon."
    },
    {
      speaker: 'robot',
      text: "When’s your birthday, by the way? I like remembering special days for my friends."
    },
    {
      speaker: 'character',
      text: "My birthday is on June 26th!"
    },
  ];

  const typingSpeed = 30;

  useEffect(() => {
    const dialogueText = dialogues[currentDialogue];
    if (isTyping && displayedText.length < dialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === dialogueText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogue, dialogues]);

  const handleInitialContinue = () => {
    // Show character selection and move to second dialogue
    setShowCharacterSelection(true);
    setCurrentDialogue(1);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleFinalContinue = () => {
    if (selectedCharacter) {
      // Hide character selection and show next dialogue
      setShowCharacterSelection(false);
      setCurrentDialogue(2);
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleNextStep = () => {
    // Show conversation
    setShowConversation(true);
  };

  const handleBack = () => {
    if (currentDialogue === 2) {
      // Go back to character selection
      setShowCharacterSelection(true);
      setCurrentDialogue(1);
      setDisplayedText('');
      setIsTyping(true);
    } else if (currentDialogue === 1) {
      // Go back to first dialogue
      setShowCharacterSelection(false);
      setCurrentDialogue(0);
      setDisplayedText('');
      setIsTyping(true);
    } else {
      // Navigate back to previous page (puzzle)
      navigate('/second-puzzle');
    }
  };

  const handleConversationEnd = () => {
    // Navigate to memory extraction page
    navigate('/memory_extraction', { state: { character: selectedCharacter } });
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="page-container">
      <div className="robot-greeting-content">
        {!showConversation ? (
          <>
            <div className="dialog-box">
              <p className="dialog-text">{displayedText}</p>
            </div>

            <div className="robot-greeting-robot-container">
              <img 
                src={robotImage} 
                alt="Robot" 
                className="robot-greeting-robot-image"
              />
            </div>

            {showCharacterSelection && (
              <CharacterSelection 
                selectedCharacter={selectedCharacter}
                onCharacterSelect={handleCharacterSelect}
              />
            )}

            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={handleBack}
                disabled={currentDialogue === 0 || isTyping}
              >
                Back
              </button>

              {currentDialogue === 0 && (
                <button 
                  className="continue-button"
                  onClick={handleInitialContinue}
                  disabled={isTyping}
                >
                  Let's go!
                </button>
              )}

              {currentDialogue === 1 && (
                <button 
                  className="continue-button"
                  onClick={handleFinalContinue}
                  disabled={isTyping || !selectedCharacter}
                >
                  Continue
                </button>
              )}

              {currentDialogue === 2 && (
                <button 
                  className="continue-button"
                  onClick={handleNextStep}
                  disabled={isTyping}
                >
                  Continue
                </button>
              )}
            </div>
          </>
        ) : (
          <ConversationContainer 
            selectedCharacter={selectedCharacter}
            conversation={conversation}
            onConversationEnd={handleConversationEnd}
          />
        )}
      </div>
    </div>
  );
}
