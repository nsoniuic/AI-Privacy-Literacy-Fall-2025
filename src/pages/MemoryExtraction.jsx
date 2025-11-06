import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RobotThinking from '../components/RobotThinking';
import InteractiveThinking from '../components/InteractiveThinking';
import robotImage from '../assets/robot.png';
import '../App.css';

export default function MemoryExtraction() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const characterName = selectedCharacter === 'boy' ? 'Nate' : 'Natalie';
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  const [showTransitionScreen, setShowTransitionScreen] = useState(false);
  const [showInteractiveScreen, setShowInteractiveScreen] = useState(false);

  const handleContinue = () => {
    if (!showThoughtBubble) {
      // First click: show thought bubble
      setShowThoughtBubble(true);
    } else {
      // After thinking flow: show transition screen
      setShowTransitionScreen(true);
    }
  };

  const handleBack = () => {
    if (showInteractiveScreen) {
      // Go back to transition screen
      setShowInteractiveScreen(false);
    } else if (showTransitionScreen) {
      // Go back to thinking screen
      setShowTransitionScreen(false);
    } else {
      // Go back to the previous page (FirstScenario)
      navigate('/first-scenario', { state: { character: selectedCharacter } });
    }
  };

  const handleTransitionContinue = () => {
    setShowInteractiveScreen(true);
  };

  const handleInteractiveContinue = () => {
    navigate('/result-page', { state: { character: selectedCharacter } });
  };

  const handleInteractiveBack = () => {
    setShowInteractiveScreen(false);
  };

  if (showInteractiveScreen) {
    return (
      <div className="page-container">
        <InteractiveThinking 
          selectedCharacter={selectedCharacter}
          onContinue={handleInteractiveContinue}
          onBack={handleInteractiveBack}
        />
      </div>
    );
  }

  if (showTransitionScreen) {
    return (
      <div className="page-container">
        <div className="final-screen-container">
          <div className="final-thought-bubble-container">
            <div className="thought-bubble large-thought-bubble">
              Now that you have seen how AI reasons, try guessing what I could know based on another example from {characterName}!
            </div>
          </div>
          
          <div className="robot-image-container-center">
            <img 
              src={robotImage} 
              alt="Robot" 
              className="robot-image"
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
              onClick={handleTransitionContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <RobotThinking 
        selectedCharacter={selectedCharacter}
        onContinue={handleContinue}
        showThoughtBubble={showThoughtBubble}
        onBack={handleBack}
      />
    </div>
  );
}
