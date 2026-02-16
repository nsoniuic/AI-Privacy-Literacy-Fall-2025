import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import robotHappyImage from '../../../assets/robot-happy.png';
import ConversationContainer from '../../../components/conversation/ConversationContainer';
import AppTitle from '../../../components/common/AppTitle';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import '../../../styles/puzzles/Puzzles.css';
import '../../../styles/pages/InitialGreeting.css';
import '../../../App.css';

export default function SecondScenario() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCharacter = location.state?.character; // Get character from previous page
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showConversation, setShowConversation] = useState(false);

  // Screen 54: Initial dialogue
  // Screen 55+: Conversation messages (handled by ConversationContainer)
  const screenNumber = showConversation ? 55 : 54;
  useScreenNumber(screenNumber);

  const dialogueText = "Ready to see another example? This time, you'll get the chance to discover the thinking process yourself!";

  // Define the conversation between robot and character
  const conversation = [
    {
      speaker: 'robot',
      text: "Hey Parker, good to see you again! Did you just got back from school?"
    },
    {
      speaker: 'character',
      text: "Good to see you too Robo! Yes, I just got dropped off by the school bus."
    },
    {
      speaker: 'robot',
      text: "Sweet! How long was the bus ride from your school?"
    },
    {
      speaker: 'character',
      text: "Hmm... I would say it was around 5 minutes. "
    },
    {
      speaker: 'robot',
      text: "That’s a short trip! Is it a big school?"
    },
    {
      speaker: 'character',
      text: "Yes, a lot of my friends close to my home go to the same school!"
    },
    {
      speaker: 'robot',
      text: "Cool! I bet if you give me the name of your school, I could search up more info about it!"
    },
    {
        speaker: 'character',
        text: "It's called Washington Junior High!"
    },
  ];

  const typingSpeed = 40;

  useEffect(() => {
    if (isTyping && displayedText.length < dialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === dialogueText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, dialogueText]);

  const handleContinue = () => {
    // Show conversation
    setShowConversation(true);
  };

  const handleConversationEnd = () => {
    // Navigate to puzzle page
    navigate('/second_scenario/puzzle', { state: { selectedCharacter } });
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
                src={robotHappyImage} 
                alt="Robot" 
                className="puzzle-robot-image"
              />
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="continue-button"
              onClick={handleContinue}
              disabled={isTyping}
            >
              Let's go!
            </button>
          </div>
        </>
      ) : (
        <ConversationContainer 
          selectedCharacter={selectedCharacter}
          conversation={conversation}
          onConversationEnd={handleConversationEnd}
          memoryTriggers={{ gradeLevel: 3, birthday: 7 }}
          memoryLabels={{ first: 'Travel Time', second: 'School Name' }}
          thoughtBubbleTexts={{ first: 'travel time', second: 'school name' }}
          endThoughtText="Now that you have seen how AI reasons, try guessing what I could know based on what Parker have mentioned!"
          clueStartNumber={3}
          startScreenNumber={55}
        />
      )}
    </div>
  );
}
