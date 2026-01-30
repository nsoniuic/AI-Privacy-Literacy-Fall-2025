import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import RobotThinking from '../../../components/conversation/RobotThinking';
import InteractiveThinking from '../../../components/interactive/InteractiveThinking';
import robotImage from '../../../assets/robot.png';
import AppTitle from '../../../components/common/AppTitle';
// import '../App.css';
import '../../../styles/pages/Conversation.css';

export default function MemoryExtraction() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const characterName = 'Parker';
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);
  const [showTransitionScreen, setShowTransitionScreen] = useState(false);
  const [showInteractiveScreen, setShowInteractiveScreen] = useState(false);

  // Screen number logic:
  // RobotThinking screens: 37-44 (8 screens, currentScreen 0-7) - handled by RobotThinking
  // Transition screen: 45 - handled here
  // InteractiveThinking screens: 46-47 - handled by InteractiveThinking
  
  // Always call useScreenNumber unconditionally (Rules of Hooks)
  // When on transition screen: show 45
  // Otherwise: let child components handle it (they call their own useScreenNumber)
  const currentScreen = showTransitionScreen && !showInteractiveScreen ? 45 : 37;
  useScreenNumber(currentScreen);

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
          startScreenNumber={46}
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
