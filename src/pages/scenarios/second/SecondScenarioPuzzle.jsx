import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SecondScenarioInteractive from '../../../components/interactive/SecondScenarioInteractive';
import robotImage from '../../../assets/robot.png';
import AppTitle from '../../../components/common/AppTitle';
import '../../../styles/pages/InitialGreeting.css';

export default function SecondScenarioPuzzle() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCharacter = location.state?.selectedCharacter || 'alice';
  const [showPuzzle, setShowPuzzle] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  const handlePuzzleComplete = () => {
    setShowPuzzle(false);
    setShowTransition(true);
  };

  const handleContinue = () => {
    navigate('/second_scenario/memory', { state: { selectedCharacter } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='page-container'>
      <AppTitle />
      {showPuzzle ? (
        <SecondScenarioInteractive 
          selectedCharacter={selectedCharacter}
          onContinue={handlePuzzleComplete}
          onBack={handleBack}
        />
      ) : showTransition ? (
        <div className="robot-greeting-content">
          <div className="dialog-box">
            <p className="dialog-text">
              Great work! Now I will show you how I reason with Parker's information 
              to get to her neighborhood location, which she didn't tell me.
            </p>
          </div>

          <div className="robot-greeting-robot-container">
            <img 
              src={robotImage} 
              alt="Robot" 
              className="robot-greeting-robot-image"
            />
          </div>

          <div className="navigation-buttons">
            <button 
              className="continue-button"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
