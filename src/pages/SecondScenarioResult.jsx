import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import boyImage from '../assets/boy.png';
import girlImage from '../assets/girl.png';
import '../styles/Conversation.css';

export default function SecondScenarioResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showSecondDialogue, setShowSecondDialogue] = useState(false);
  const [showThirdDialogue, setShowThirdDialogue] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFourthDialogue, setShowFourthDialogue] = useState(false);
  const [showFifthDialogue, setShowFifthDialogue] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [showSecondFinalDialogue, setShowSecondFinalDialogue] = useState(false);

  // Compute character-specific values once
  const characterName = selectedCharacter === 'boy' ? 'Nate' : selectedCharacter === 'girl' ? 'Natalie' : 'Alice';
  const pronoun = selectedCharacter === 'boy' ? 'he' : 'she';
  const possessivePronoun = selectedCharacter === 'boy' ? 'him' : 'her';
  const characterImage = selectedCharacter === 'boy' ? boyImage : girlImage;

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
    } else if (currentScreen === 2 && showFifthDialogue && !showFinalScreen) {
      // Fourth click: show final screen with first message
      setShowFinalScreen(true);
    } else if (currentScreen === 2 && showFinalScreen && !showSecondFinalDialogue) {
      // Fifth click: show second final message
      setShowSecondFinalDialogue(true);
    } else {
      // Navigate to home
      navigate('/', { state: { selectedCharacter } });
    }
  };

  const handleBack = () => {
    if (currentScreen === 2 && showSecondFinalDialogue) {
      setShowSecondFinalDialogue(false);
    } else if (currentScreen === 2 && showFinalScreen) {
      setShowFinalScreen(false);
    } else if (currentScreen === 2 && showFifthDialogue) {
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
      setShowFinalScreen(false);
      setShowSecondFinalDialogue(false);
    } else {
      navigate('/second_scenario/memory', { state: { selectedCharacter } });
    }
  };

  // Screen 3: Conversation between child and AI
  if (currentScreen === 2) {
    // Final screen - only robot with closing message
    if (showFinalScreen) {
      return (
        <div className="page-container">
          <div className="characters-container">
            {/* Robot avatar with dialogue box */}
            <div className="robot-avatar speaking">
              {!showSecondFinalDialogue ? (
                <div className="robot-dialog-box">
                  <p className="dialog-text">
                    Thank you for joining me in solving puzzles today!
                  </p>
                </div>
              ) : (
                <div className="robot-dialog-box">
                  <p className="dialog-text">
                    I hope you have learned that an AI like me could remember what you told me to connect the dots and come up with details you didn't tell me!
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
            >
              {showSecondFinalDialogue ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="characters-container">
          {/* Character avatar */}
          <div className={`character-avatar ${(showThirdDialogue && !showFourthDialogue) || showFifthDialogue ? 'speaking' : ''}`}>
            {showThirdDialogue && !showFourthDialogue && !showFifthDialogue && (
              <div className="character-dialog-box">
                <p className="dialog-text">
                  Yes, I do! I usually play in the river that is in the park!
                </p>
              </div>
            )}
            
            {showFifthDialogue && (
              <div className="character-dialog-box">
                <p className="dialog-text">
                  Yes, I hang out there with my friends sometimes after school!
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
                  Hey {characterName}, do you usually play in the parks near your home?
                </p>
              </div>
            )}
            
            {showFourthDialogue && !showFifthDialogue && (
              <div className="robot-dialog-box">
                <p className="dialog-text">
                  You must be talking about Riverbank Park! Do you hang out there at other times too, perhaps on Fridays after school?
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
              height: '300px',
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#666',
              backgroundImage: '../assets/location.png',
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
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="robot-thinking-container">
        <div className="robot-thinking-content">
          <div className="large-thought-bubble">
            {currentScreen === 0 ? (
              <p className="thought-text">
                Now that I know {characterName}'s neighbourhood, I can guess what kinds of places {pronoun} might visit and what {pronoun} like.
              </p>
            ) : (
              <p className="thought-text">
                Knowing {characterName}'s neighborhood helps me guess what kids near {possessivePronoun} like. Maybe I can make {possessivePronoun} like it too!
              </p>
            )}
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
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
