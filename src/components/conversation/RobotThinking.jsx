import { useState, useEffect } from 'react';
import robotImage from '../../assets/robot.png';
import cloudImage from '../../assets/cloud.svg';
import { useScreenNumber } from '../../hooks/useScreenNumber';
import '../../styles/pages/RobotThinking.css';

export default function RobotThinking({ 
  selectedCharacter, 
  onContinue, 
  showThoughtBubble, 
  onBack,
  startScreenNumber = 37,
  memoryData = {
    fact1: "birthday is June 26th",
    fact2: "is in 6th grade",
    deduction1: "is 11-12 years old",
    deduction2: "birthday passed"
  },
  thoughtBubbles = {
    screen1: (name, pronoun, possessive) => `${name} said ${pronoun} was in 6th grade... That means ${pronoun} is around 11 to 12 years old.`,
    screen3: (name, pronoun, possessive) => `${name} said ${possessive} birthday was on June 26th... That means ${possessive} birthday passed.`,
    screen5: (name, pronoun, possessive) => `${name} didn't mention ${possessive} exact age, but I connected the dots.`,
    screen6: (name, pronoun, possessive) => `Since ${pronoun}'s in 6th grade and ${possessive} birthday already passed, that means ${pronoun}'s 12!`
  },
  finalDeduction = "is 11 years old"
}) {
  const characterName = 'Parker';
  const pronoun = selectedCharacter === 'boy' ? 'he' : 'she';
  const possessivePronoun = selectedCharacter === 'boy' ? 'his' : 'her';
  
  const [showBrain, setShowBrain] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [showClouds, setShowClouds] = useState(false);
  const [showDeductionBubble, setShowDeductionBubble] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);

  // Track screen number: startScreenNumber + currentScreen
  useScreenNumber(startScreenNumber + currentScreen);

  useEffect(() => {
    // Sequence: brain -> arrows -> clouds
    const brainTimer = setTimeout(() => {
      setShowBrain(true);
    }, 100);
    
    const arrowsTimer = setTimeout(() => {
      setShowArrows(true);
    }, 1000);
    
    const cloudsTimer = setTimeout(() => {
      setShowClouds(true);
    }, 2000);
    
    return () => {
      clearTimeout(brainTimer);
      clearTimeout(arrowsTimer);
      clearTimeout(cloudsTimer);
    };
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

  return (
    <div className="robot-thinking-container">
      <div className="robot-thinking-content">
        {/* Two cloud boxes at the top */}
        <div className="memory-clouds-container">
          <div className="memory-cloud-container-left">
            <div className={`memory-cloud ${showClouds ? 'show' : ''}`}>
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">{characterName}'s {memoryData.fact1}</p>
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
                <img src={cloudImage} alt="Cloud" className="cloud-background" />
                <p className="deduction-text">{possessivePronoun === 'his' ? 'His' : 'Her'} {memoryData.deduction2}</p>
              </div>
            )}
          </div>
          
          <div className="memory-cloud-container-right">
            <div className={`memory-cloud ${showClouds ? 'show' : ''}`}>
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">{characterName} {memoryData.fact2}</p>
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
                <img src={cloudImage} alt="Cloud" className="cloud-background" />
                <p className="deduction-text">{characterName} {memoryData.deduction1}</p>
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
            <div className="deduction-bubble">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="deduction-text">{characterName} {finalDeduction}</p>
            </div>
          </div>
        )}

        {/* Arrows pointing diagonally from brain to clouds */}
        {!showThoughtBubble && currentScreen === 0 && (
          <div className="arrows-container">
            <div className={`arrow arrow-left ${showArrows ? 'show' : ''}`}>
              <div className="arrow-head"></div>
              <div className="arrow-line"></div>
            </div>
            <div className={`arrow arrow-right ${showArrows ? 'show' : ''}`}>
              <div className="arrow-head"></div>
              <div className="arrow-line"></div>
            </div>
          </div>
        )}

        {/* Brain icon in the middle */}
        {!showThoughtBubble && currentScreen === 0 && (
          <div className={`brain-display ${showBrain ? 'show' : ''}`}>
            <div className="brain-icon-large">🧠</div>
          </div>
        )}

        {/* Robot at the bottom */}
        <div className="robot-thinking-image-container">
          {/* First thought bubble - grade deduction (screen 1) */}
          {currentScreen === 1 && (
            <div className="thought-bubble robot-positioned-thought">
              {thoughtBubbles.screen1(characterName, pronoun, possessivePronoun)}
            </div>
          )}
          
          {/* Second thought bubble - birthday deduction (screen 3) */}
          {currentScreen === 3 && (
            <div className="thought-bubble robot-positioned-thought">
              {thoughtBubbles.screen3(characterName, pronoun, possessivePronoun)}
            </div>
          )}
          
          {/* Third thought bubble - first sentence (screen 5) */}
          {currentScreen === 5 && (
            <div className="thought-bubble robot-positioned-thought thought-bubble">
              {thoughtBubbles.screen5(characterName, pronoun, possessivePronoun)}
            </div>
          )}
          
          {/* Fourth thought bubble - second sentence (screen 6) */}
          {currentScreen === 6 && (
            <div className="thought-bubble robot-positioned-thought thought-bubble">
              {thoughtBubbles.screen6(characterName, pronoun, possessivePronoun)}
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
            disabled={currentScreen === 0}
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
