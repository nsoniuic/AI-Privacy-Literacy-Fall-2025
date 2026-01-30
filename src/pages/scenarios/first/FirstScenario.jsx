import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import robotImage from '../../../assets/robot-happy.png';
import CharacterSelection from '../../../components/interactive/CharacterSelection';
import ConversationContainer from '../../../components/conversation/ConversationContainer';
import AppTitle from '../../../components/common/AppTitle';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import '../../../styles/puzzles/Puzzles.css';
import '../../../styles/pages/InitialGreeting.css';
import '../../../App.css';

export default function FirstScenario() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(0);

  // Update screen number based on state
  // Screen 23-28: Dialogues 0-5 (before conversation)
  // Screen 29+: Conversation messages (handled by ConversationContainer)
  const screenNumber = showConversation ? 29 : 23 + currentDialogue;
  useScreenNumber(screenNumber);

  // Get character name based on selection
  const characterName = 'Parker';

  const dialogues = [
    "Awesome job solving the puzzles! You just learned how AI figures things out by spotting patterns - just like you did!",
    "In the puzzles, AI deduced the rules without anyone telling it.",
    "The same thing can happen when I look at the things you tell it about yourself, like your name, age, or where you live. I can connect clues from different bits of information and make guesses about you, even if you never said those things directly.",
    "Now, I’ll show you some conversations I’ve had with other children like you. As you watch, see how I used little clues they shared, like things about themselves, to figure out new information they never told me directly. Ready to take a look?",
    "Before we continue, which character would you like to see moving forward?",
    "Great! Now, let me show you an example with my friend, Parker. I’ll show you what Parker told me, and what I was able to figure out on my own."
  ];

  // Define the conversation between robot and character
  const conversation = [
    {
      speaker: 'robot',
      text: `Hey ${characterName}, I missed chatting with you! How's school going lately?`
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

  const typingSpeed = 40;

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

  const handleContinue = () => {
    if (currentDialogue === 3) {
      // After 4th dialogue, show character selection
      setShowCharacterSelection(true);
    }
    setCurrentDialogue(prev => prev + 1);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleCharacterContinue = () => {
    if (selectedCharacter) {
      // Keep character selection visible and move to next dialogue
      setCurrentDialogue(5);
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleNextStep = () => {
    // Show conversation
    setShowConversation(true);
  };

  const handleBack = () => {
    if (currentDialogue === 5) {
      // Go back to character selection (keep it visible)
      setCurrentDialogue(4);
      setDisplayedText('');
      setIsTyping(true);
    } else if (currentDialogue === 4) {
      // Go back to previous dialogue and hide character selection
      setShowCharacterSelection(false);
      setCurrentDialogue(3);
      setDisplayedText('');
      setIsTyping(true);
    } else if (currentDialogue > 0) {
      // Go back to previous dialogue
      setCurrentDialogue(prev => prev - 1);
      setDisplayedText('');
      setIsTyping(true);
    }
  };

  const handleConversationEnd = () => {
    // Navigate to memory extraction page
    navigate('/first_scenario/memory', { state: { character: selectedCharacter } });
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="page-container">
      <AppTitle />
      {!showConversation ? (
        <>
          <div className="puzzle-content">
            <div className="dialog-box-top">
              <p className="dialog-text">{displayedText}</p>
            </div>

            <div className="puzzle-robot-container-right">
              <img 
                src={robotImage} 
                alt="Robot" 
                className="puzzle-robot-image"
              />
            </div>
          </div>

            {showCharacterSelection && (
              <CharacterSelection 
                selectedCharacter={selectedCharacter}
                onCharacterSelect={handleCharacterSelect}
                locked={currentDialogue === 5}
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

              {currentDialogue <= 3 && (
                <button 
                  className="continue-button"
                  onClick={handleContinue}
                  disabled={isTyping}
                >
                  {currentDialogue === 3 ? "Let's Go!" : "Continue"}
                </button>
              )}

              {currentDialogue === 4 && (
                <button 
                  className="continue-button"
                  onClick={handleCharacterContinue}
                  disabled={isTyping || !selectedCharacter}
                >
                  Continue
                </button>
              )}

              {currentDialogue === 5 && (
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
          startScreenNumber={29}
        />
      )}
    </div>
  );
}
