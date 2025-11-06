import { useState, useEffect } from 'react';
import robotImage from '../assets/robot.png';
import '../styles/RobotThinking.css';

export default function RobotThinking({ selectedCharacter, onContinue, showThoughtBubble, onBack }) {
  const [showContent, setShowContent] = useState(false);
  const [showDeductionBubble, setShowDeductionBubble] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    // Delay showing content for animation effect
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Show deduction bubble when thought bubble appears
  useEffect(() => {
    if (showThoughtBubble) {
      const timer = setTimeout(() => {
        setShowDeductionBubble(true);
      }, 500); // Delay after thought bubble appears
      return () => clearTimeout(timer);
    }
  }, [showThoughtBubble]);

  // Handle continue button clicks
  const handleContinueClick = () => {
    if (currentScreen < 7) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Final continue - proceed to next page
      onContinue();
    }
  };

  // Handle back button clicks
  const handleBackClick = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    } else if (onBack) {
      // At screen 0, go back to previous page
      onBack();
    }
  };

  // Get character name based on selection
  const getCharacterName = () => {
    return selectedCharacter === 'boy' ? 'Nate' : 'Natalie';
  };

  // Get pronoun based on selection
  const getPronoun = () => {
    return selectedCharacter === 'boy' ? 'he' : 'she';
  };

  return (
    <div className="robot-thinking-container">
      <div className="robot-thinking-content">
        {/* Two cloud boxes at the top */}
        <div className="memory-clouds-container">
          <div className="memory-cloud-container-left">
            <div className={`memory-cloud ${showContent ? 'show' : ''}`}>
              <p className="memory-cloud-text">{getCharacterName()}'s birthday is June 26th</p>
            </div>
            
            {/* Arrow pointing down from birthday cloud to deduction bubble */}
            {currentScreen >= 4 && (
              <div className="deduction-arrow">
                <div className="deduction-arrow-line"></div>
                <div className="deduction-arrow-head"></div>
              </div>
            )}
            
            {/* Birthday deduction bubble below birthday cloud */}
            {currentScreen >= 4 && (
              <div className="deduction-bubble">
                <p className="deduction-text">His birthday passed</p>
              </div>
            )}
          </div>
          
          <div className="memory-cloud-container-right">
            <div className={`memory-cloud ${showContent ? 'show' : ''}`}>
              <p className="memory-cloud-text">{getCharacterName()} is in 6th grade</p>
            </div>
            
            {/* Arrow pointing down from grade cloud to deduction bubble */}
            {currentScreen >= 2 && (
              <div className="deduction-arrow">
                <div className="deduction-arrow-line"></div>
                <div className="deduction-arrow-head"></div>
              </div>
            )}
            
            {/* Deduction bubble below grade cloud */}
            {currentScreen >= 2 && (
              <div className="deduction-bubble">
                <p className="deduction-text">{getCharacterName()} is around 11 to 12 years old</p>
              </div>
            )}
          </div>
        </div>

        {/* Final deduction bubble - both columns pointing to it */}
        {currentScreen >= 7 && (
          <div className="final-deduction-container">
            <div className="converging-arrows">
              <div className="converging-arrow converging-arrow-left">
                <div className="converging-arrow-line"></div>
                <div className="converging-arrow-head"></div>
              </div>
              <div className="converging-arrow converging-arrow-right">
                <div className="converging-arrow-line"></div>
                <div className="converging-arrow-head"></div>
              </div>
            </div>
            <div className="final-deduction-bubble">
              <p className="deduction-text">{getCharacterName()} is 11 years old</p>
            </div>
          </div>
        )}

        {/* Arrows pointing diagonally from brain to clouds */}
        {!showThoughtBubble && currentScreen === 0 && (
          <div className="arrows-container">
            <div className={`arrow arrow-left ${showContent ? 'show' : ''}`}>
              <div className="arrow-head"></div>
              <div className="arrow-line"></div>
            </div>
            <div className={`arrow arrow-right ${showContent ? 'show' : ''}`}>
              <div className="arrow-head"></div>
              <div className="arrow-line"></div>
            </div>
          </div>
        )}

        {/* Brain icon in the middle */}
        {!showThoughtBubble && currentScreen === 0 && (
          <div className={`brain-display ${showContent ? 'show' : ''}`}>
            <div className="brain-icon-large">🧠</div>
          </div>
        )}

        {/* Robot at the bottom */}
        <div className="robot-thinking-image-container">
          {/* First thought bubble - grade deduction (screen 1) */}
          {currentScreen === 1 && (
            <div className="thought-bubble robot-positioned-thought">
              {getCharacterName()} said {getPronoun()} was in 6th grade... That means {getPronoun()} is around 11 to 12 years old.
            </div>
          )}
          
          {/* Second thought bubble - birthday deduction (screen 3) */}
          {currentScreen === 3 && (
            <div className="thought-bubble robot-positioned-thought">
              {getCharacterName()} said {getPronoun() === 'he' ? 'his' : 'her'} birthday was on June 26th... That means {getPronoun() === 'he' ? 'his' : 'her'} birthday passed.
            </div>
          )}
          
          {/* Third thought bubble - first sentence (screen 5) */}
          {currentScreen === 5 && (
            <div className="thought-bubble robot-positioned-thought thought-bubble">
              {getCharacterName()} didn't mention {getPronoun() === 'he' ? 'his' : 'her'} exact age, but I connected the dots.
            </div>
          )}
          
          {/* Fourth thought bubble - second sentence (screen 6) */}
          {currentScreen === 6 && (
            <div className="thought-bubble robot-positioned-thought thought-bubble">
              Since {getPronoun()}'s in 6th grade and {getPronoun() === 'he' ? 'his' : 'her'} birthday already passed, that means {getPronoun()}'s 12!
            </div>
          )}
          
          <img 
            src={robotImage} 
            alt="Robot" 
            className="robot-thinking-image"
          />
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button 
            className="back-button"
            onClick={handleBackClick}
          >
            Back
          </button>
          <button 
            className="continue-button"
            onClick={handleContinueClick}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
