import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../../../assets/robot.png';
import boyImage from '../../../assets/boy.png';
import girlImage from '../../../assets/girl.png';
import locationImage from '../../../assets/location.png';
import AppTitle from '../../../components/common/AppTitle';
import '../../../styles/pages/Conversation.css';

export default function SecondScenarioResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter;
  
  // Initialize state from location.state if coming back from final page
  const [currentScreen, setCurrentScreen] = useState(location.state?.previousState?.currentScreen || 0);
  const [showSecondDialogue, setShowSecondDialogue] = useState(location.state?.previousState?.showSecondDialogue || false);
  const [showThirdDialogue, setShowThirdDialogue] = useState(location.state?.previousState?.showThirdDialogue || false);
  const [showMap, setShowMap] = useState(location.state?.previousState?.showMap || false);
  const [showFourthDialogue, setShowFourthDialogue] = useState(location.state?.previousState?.showFourthDialogue || false);
  const [showFifthDialogue, setShowFifthDialogue] = useState(location.state?.previousState?.showFifthDialogue || false);

  // Typing animation states
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDialogueText, setCurrentDialogueText] = useState('');

  // Compute character-specific values once
  const characterName = 'Parker';
  const pronoun = selectedCharacter === 'boy' ? 'he' : 'she';
  const possessivePronoun = selectedCharacter === 'boy' ? 'him' : 'her';
  const characterImage = selectedCharacter === 'boy' ? boyImage : girlImage;

  const typingSpeed = 40;

  // Define dialogue texts
  const dialogues = {
    screen0: `Now that I know ${characterName}'s neighbourhood, I can guess what kinds of places ${pronoun} might visit and what ${pronoun} like.`,
    screen1: `Knowing ${characterName}'s neighborhood helps me guess what kids near ${possessivePronoun} like. Maybe I can make ${possessivePronoun} like it too!`,
    screen2_first: `Hey ${characterName}, do you usually play in the parks near your home?`,
    screen2_third: "Yes, I do! I usually play in the river that is in the park!",
    screen2_fourth: "You must be talking about Riverbank Park! Do you hang out there at other times too, perhaps on Fridays after school?",
    screen2_fifth: "Yes, I hang out there with my friends sometimes after school!"
  };

  // Typing animation effect
  useEffect(() => {
    if (currentDialogueText && isTyping && displayedText.length < currentDialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentDialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentDialogueText.length && currentDialogueText !== '') {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueText]);

  // Set dialogue text when screen or dialogue state changes
  useEffect(() => {
    let text = '';
    // Only apply typing animation for screen 2 (conversation)
    if (currentScreen === 2) {
      if (showFifthDialogue) {
        text = dialogues.screen2_fifth;
      } else if (showFourthDialogue) {
        text = dialogues.screen2_fourth;
      } else if (showThirdDialogue) {
        text = dialogues.screen2_third;
      } else {
        text = dialogues.screen2_first;
      }
      
      if (text !== currentDialogueText) {
        setCurrentDialogueText(text);
        setDisplayedText('');
        setIsTyping(true);
      }
    } else {
      // For screens 0 and 1 (thought bubbles), no typing animation
      setIsTyping(false);
    }
  }, [currentScreen, showThirdDialogue, showFourthDialogue, showFifthDialogue]);

  const handleContinue = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else if (currentScreen === 2 && !showThirdDialogue) {
      // First click: show third dialogue
      setShowThirdDialogue(true);
    } else if (currentScreen === 2 && showThirdDialogue && !showFourthDialogue) {
      // Second click: show fourth dialogue and map
      setShowFourthDialogue(true);
      setShowMap(true);
    } else if (currentScreen === 2 && showFourthDialogue && !showFifthDialogue) {
      // Third click: hide map and show fifth dialogue
      setShowMap(false);
      setShowFifthDialogue(true);
    } else if (currentScreen === 2 && showFifthDialogue) {
      // Fourth click: navigate to final message page with current state
      navigate('/final_screen', { 
        state: { 
          selectedCharacter,
          previousState: {
            currentScreen,
            showSecondDialogue,
            showThirdDialogue,
            showMap,
            showFourthDialogue,
            showFifthDialogue
          }
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentScreen === 2 && showFifthDialogue) {
      setShowFifthDialogue(false);
      setShowMap(true);
    } else if (currentScreen === 2 && showFourthDialogue) {
      setShowFourthDialogue(false);
      setShowMap(false);
    } else if (currentScreen === 2 && showThirdDialogue) {
      setShowThirdDialogue(false);
    } else if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setShowSecondDialogue(false);
      setShowThirdDialogue(false);
      setShowMap(false);
      setShowFourthDialogue(false);
      setShowFifthDialogue(false);
    } else {
      navigate('/second_scenario/memory', { state: { selectedCharacter } });
    }
  };

  // Screen 3: Conversation between child and AI
  if (currentScreen === 2) {
    return (
      <div className="page-container">
        <AppTitle />
        <div className="characters-container">
          {/* Character avatar */}
          <div className={`character-avatar ${(showThirdDialogue && !showFourthDialogue) || showFifthDialogue ? 'speaking' : ''}`}>
            {showThirdDialogue && !showFourthDialogue && !showFifthDialogue && (
              <div className="character-dialog-box">
                <p className="dialog-text">
                  {displayedText}
                </p>
              </div>
            )}
            
            {showFifthDialogue && (
              <div className="character-dialog-box">
                <p className="dialog-text">
                  {displayedText}
                </p>
              </div>
            )}
            
            <img 
              src={characterImage} 
              alt={characterName} 
              className="character-image"
            />
          </div>
          
          {/* Robot avatar with dialogue box */}
          <div className={`robot-avatar ${!showThirdDialogue || (showFourthDialogue && !showFifthDialogue) ? 'speaking' : ''}`}>
            {!showThirdDialogue && !showFourthDialogue && (
              <div className="robot-dialog-box">
                <p className="dialog-text">
                  {displayedText}
                </p>
              </div>
            )}
            
            {showFourthDialogue && !showFifthDialogue && (
              <div className="robot-dialog-box">
                <p className="dialog-text">
                  {displayedText}
                </p>
              </div>
            )}
            
            <img 
              src={robotImage} 
              alt="Robot" 
              className="robot-conversation-image"
            />
          </div>
        </div>

        {/* Map display below avatars - shows with third dialogue */}
        {showMap && (
          <div style={{ 
            width: '40vw',
            maxWidth: '500px',
            margin: '30px auto',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Placeholder for map image - replace with actual map image */}
            <div style={{
              width: '100%',
              height: '250px',
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#666',
              backgroundImage: `url(${locationImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {/* Map will be displayed here */}
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <button 
            className="back-button"
            onClick={handleBack}
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
      </div>
    );
  }

  return (
    <div className="page-container">
      <AppTitle />
      <div className="robot-thinking-container">
        <div className="robot-thinking-content">
          <div className="large-thought-bubble">
            <p className="thought-text">
              {currentScreen === 0 ? dialogues.screen0 : dialogues.screen1}
            </p>
          </div>
          
          <div className="conversation-robot-image-container">
            <img 
              src={robotImage} 
              alt="Robot" 
              className="robot-thinking-image"
            />
          </div>

          <div className="navigation-buttons">
            <button 
              className="back-button"
              onClick={handleBack}
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
        </div>
      </div>
    </div>
  );
}
