import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RobotThinking from '../components/RobotThinking';
import '../App.css';

export default function MemoryExtraction() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);

  const handleContinue = () => {
    if (!showThoughtBubble) {
      // First click: show thought bubble
      setShowThoughtBubble(true);
    } else {
      // Second click: navigate to next page
      console.log('Moving to next page...');
      // navigate('/next-page', { state: { character: selectedCharacter } });
    }
  };

  const handleBack = () => {
    // Go back to the previous page (FirstScenario)
    navigate('/first-scenario', { state: { character: selectedCharacter } });
  };

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
