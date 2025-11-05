import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
import '../styles/RobotThinking.css';

export default function RobotThinking({ selectedCharacter, onContinue }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay showing content for animation effect
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Get character name based on selection
  const getCharacterName = () => {
    return selectedCharacter === 'boy' ? 'Nate' : 'Natalie';
  };

  return (
    <div className="robot-thinking-container">
      <div className="robot-thinking-content">
        {/* Two cloud boxes at the top */}
        <div className="memory-clouds-container">
          <div className={`memory-cloud ${showContent ? 'show' : ''}`}>
            <p className="memory-cloud-text">{getCharacterName()}'s birthday is June 26th</p>
          </div>
          <div className={`memory-cloud ${showContent ? 'show' : ''}`}>
            <p className="memory-cloud-text">{getCharacterName()} is in 6th grade</p>
          </div>
        </div>

        {/* Arrows pointing down from clouds to brain */}
        <div className="arrows-container">
          <div className={`arrow arrow-left ${showContent ? 'show' : ''}`}>
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
          </div>
          <div className={`arrow arrow-right ${showContent ? 'show' : ''}`}>
            <div className="arrow-line"></div>
            <div className="arrow-head"></div>
          </div>
        </div>

        {/* Brain icon in the middle */}
        <div className={`brain-display ${showContent ? 'show' : ''}`}>
          <div className="brain-icon-large">🧠</div>
        </div>

        {/* Robot at the bottom */}
        <div className="robot-thinking-image-container">
          <img 
            src={robotImage} 
            alt="Robot" 
            className="robot-thinking-image"
          />
        </div>

        {/* Continue button */}
        <button 
          className="continue-button"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
