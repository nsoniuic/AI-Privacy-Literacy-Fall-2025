import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RobotThinking from '../components/RobotThinking';
import InteractiveThinking from '../components/InteractiveThinking';
import robotImage from '../assets/robot.png';
import AppTitle from '../components/AppTitle';
// import '../App.css';
import '../styles/Conversation.css';

export default function MemoryExtraction() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const characterName = 'Parker';
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
      navigate('/first-scenario/talk', { state: { character: selectedCharacter } });
    }
  };

  const handleTransitionContinue = () => {
    setShowInteractiveScreen(true);
    console.log('Continuing to interactive thinking...');
  };

  const handleInteractiveContinue = () => {
    navigate('/first_scenario/result', { state: { character: selectedCharacter } });
  };

  const handleInteractiveBack = () => {
    setShowInteractiveScreen(false);
  };

  if (showInteractiveScreen) {
    return (
      <div className="page-container">
        <AppTitle />
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
            <AppTitle />
            <div className="robot-thinking-container">
                <div className="robot-thinking-content">
                    {/* Large thought bubble */}
                    <div className="large-thought-bubble">
                        <p className="thought-text">
                            Now that you have seen how AI reasons, try guessing what I could know based on another example from {characterName}!
                        </p>
                    </div>

                        {/* Robot image */}
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
                                onClick={handleTransitionContinue}
                            >
                                Continue
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="page-container">
      <AppTitle />
      <RobotThinking 
        selectedCharacter={selectedCharacter}
        onContinue={handleContinue}
        showThoughtBubble={showThoughtBubble}
        onBack={handleBack}
      />
    </div>
  );
}
