import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import '../styles/Conversation.css';

export default function FinalMessage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter;
  const previousState = location.state?.previousState;
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  const handleContinue = () => {
    if (!showSecondMessage) {
      setShowSecondMessage(true);
    } else {
      // Navigate to home
      navigate('/', { state: { selectedCharacter } });
    }
  };

  const handleBack = () => {
    if (showSecondMessage) {
      setShowSecondMessage(false);
    } else {
      // Navigate back with the previous state to restore the last state
      navigate('/second_scenario/result', { 
        state: { 
          selectedCharacter,
          previousState 
        } 
      });
    }
  };

  return (
    <div className="page-container">
      <div className="characters-container" style={{ justifyContent: 'center' }}>
        {/* Robot avatar with dialogue box */}
        <div className="robot-avatar speaking">
          {!showSecondMessage ? (
            <div className="robot-dialog-box">
              <p className="dialog-text">
                Thank you for joining me in solving the puzzles today!
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
          {showSecondMessage ? 'Finish' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
