import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SecondScenarioInteractive from '../../../components/interactive/SecondScenarioInteractive';
import robotHappyImage from '../../../assets/robot-happy.png';
import AppTitle from '../../../components/common/AppTitle';
import '../../../styles/puzzles/Puzzles.css';
import '../../../styles/pages/InitialGreeting.css';
import '../../../App.css';

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
        <>
          <div className="puzzle-content">
            <div className="dialog-box-top">
              <p className="dialog-text">
                Great work! Now I will show you how I reason with Parker's information 
                to get to her neighborhood location, which she didn't tell me.
              </p>
            </div>

            <div className="puzzle-robot-container-right">
              <img 
                src={robotHappyImage} 
                alt="Robot" 
                className="puzzle-robot-image"
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
              Continue
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
