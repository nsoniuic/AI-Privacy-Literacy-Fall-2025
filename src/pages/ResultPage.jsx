import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import robotImage from '../assets/robot.png';
import boyImage from '../assets/boy.png';
import girlImage from '../assets/girl.png';
import '../App.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const getCharacterName = () => {
    return selectedCharacter === 'boy' ? 'Nate' : 'Natalie';
  };

  const getPronoun = () => {
    return selectedCharacter === 'boy' ? 'he' : 'she';
  };

  const getCharacterImage = () => {
    return selectedCharacter === 'boy' ? boyImage : girlImage;
  };

  const handleContinue = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else if (currentScreen === 2 && !showVideo) {
      // On conversation screen, first click shows video
      setShowVideo(true);
    } else {
      console.log('Moving to next page...');
      // navigate('/next-page', { state: { character: selectedCharacter } });
    }
  };

  const handleBack = () => {
    if (currentScreen === 2 && showVideo) {
      // If video is showing, go back to dialogue only
      setShowVideo(false);
    } else if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setShowVideo(false);
    } else {
      navigate('/memory-extraction', { state: { character: selectedCharacter } });
    }
  };

  // Screen 3: Conversation between child and AI
  if (currentScreen === 2) {
    return (
      <div className="page-container">
        <div className="conversation-screen-container">
            {!showVideo && (
              <div className="conversation-dialogue-box">
                  <p className="conversation-dialogue-text">
                  Hey {getCharacterName()}, this new candy bar just came out! I think you'd love it!
                  </p>
              </div>
            )}
          <div className="conversation-characters">
            <div className="character-container character-left">
              {/* Video ad above character - only shows after first continue */}
              {showVideo && (
                <div className="ad-video-container">
                  <video 
                    className="ad-video"
                    controls
                    autoPlay
                    muted
                    loop
                  >
                    <source src="/path-to-your-video.mp4" type="video/mp4" />
                    {/* Alternative: embed YouTube video using iframe */}
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              <img 
                src={getCharacterImage()} 
                alt={getCharacterName()} 
                className="character-image"
              />
            </div>
            
            <div className="character-container character-right">
              <img 
                src={robotImage} 
                alt="Robot" 
                className="robot-image"
              />
            </div>
          </div>

          <div className="navigation-buttons">
            <button 
              className="back-button"
              onClick={handleBack}
              disabled={currentScreen === 0}
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
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="result-screen-container">
        <div className="result-thought-bubble-container">
          {currentScreen === 0 ? (
            <div className="thought-bubble large-thought-bubble">
              Now that I know {getCharacterName()}'s age... I can guess what kinds of things {getPronoun()} might like!
            </div>
          ) : (
            <div className="thought-bubble large-thought-bubble result-thought-large">
              I could guess that {getCharacterName()} watch certain YouTubers, or play a certain game. I could show them ads that kids that age usually click on.
            </div>
          )}
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
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
