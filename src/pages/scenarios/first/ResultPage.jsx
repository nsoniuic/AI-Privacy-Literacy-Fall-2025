import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import robotImage from '../../../assets/robot-happy.png';
import boyImage from '../../../assets/boy.png';
import girlImage from '../../../assets/girl.png';
import adVideo from '../../../assets/ad.mp4';
import AppTitle from '../../../components/common/AppTitle';
import useSpeech from '../../../utils/useSpeech';
import { CHILD_FRIENDLY_VOICES } from '../../../services/elevenLabsService';
import { useVoice } from '../../../contexts/VoiceContext';
// import '../App.css';
import '../../../styles/pages/Conversation.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.character;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showSecondDialogue, setShowSecondDialogue] = useState(false);
  const [showThirdDialogue, setShowThirdDialogue] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { voiceEnabled } = useVoice();
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const hasSpokeThisScreen = useRef(false);

  // Screen number logic:
  // Screen 48: currentScreen === 0
  // Screen 49: currentScreen === 1
  // Screen 50: currentScreen === 2, initial dialogue
  // Screen 51: currentScreen === 2, showVideo
  // Screen 52: currentScreen === 2, showSecondDialogue
  // Screen 53: currentScreen === 2, showThirdDialogue
  const getScreenNumber = () => {
    if (currentScreen < 2) {
      return 48 + currentScreen;
    } else {
      // currentScreen === 2
      if (showThirdDialogue) return 53;
      if (showSecondDialogue) return 52;
      if (showVideo) return 51;
      return 50;
    }
  };
  useScreenNumber(getScreenNumber());

  // Compute character-specific values once
  const characterName = 'Parker';
  const pronoun = selectedCharacter === 'boy' ? 'he' : 'she';
  const characterImage = selectedCharacter === 'boy' ? boyImage : girlImage;

  // Get current text based on screen state
  const getCurrentText = () => {
    if (currentScreen === 0) {
      return `Now that I know ${characterName}'s age... I can guess what kinds of things ${pronoun} might like!`;
    } else if (currentScreen === 1) {
      return `${characterName} could play a certain game, or like certain food. I could show them ads of items that kids that age usually like.`;
    } else if (currentScreen === 2) {
      if (showThirdDialogue) {
        return "Thanks Robo, I'll buy some later today!";
      } else if (showSecondDialogue) {
        return "Right now, there's a discount if you buy 2 or more bars! You should buy it; I think it's a great offer!";
      } else if (!showVideo) {
        return "Hey Parker, this new candy bar just came out! I think you'd love it!";
      }
    }
    return '';
  };

  const currentText = getCurrentText();
  const typingSpeed = 40;

  // TTS for robot's thought bubbles (screens 48-49)
  const robotThought = useSpeech(
    currentText,
    voiceEnabled && shouldSpeak && currentScreen < 2,
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.CALLUM
    }
  );

  // TTS for robot's dialogue in conversation (screens 50, 52)
  const isRobotSpeaking = currentScreen === 2 && !showVideo && !showThirdDialogue;
  const robotDialogue = useSpeech(
    currentText,
    voiceEnabled && shouldSpeak && isRobotSpeaking,
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.CALLUM
    }
  );

  // TTS for child's dialogue (screen 53)
  const isChildSpeaking = currentScreen === 2 && showThirdDialogue && !showVideo;
  const childDialogue = useSpeech(
    currentText,
    voiceEnabled && shouldSpeak && isChildSpeaking,
    {
      elevenLabsVoiceId: CHILD_FRIENDLY_VOICES.LILY
    }
  );

  // Trigger speech when screen changes to a thought bubble screen (48-49)
  useEffect(() => {
    // Reset speech tracking when screen changes
    hasSpokeThisScreen.current = false;
    setShouldSpeak(false);

    // Trigger speech if on a thought bubble screen (0 or 1) and voice is enabled
    if (currentScreen < 2 && voiceEnabled && currentText) {
      // Small delay to let bubble appear first
      const timer = setTimeout(() => {
        if (!hasSpokeThisScreen.current) {
          hasSpokeThisScreen.current = true;
          setShouldSpeak(true);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, voiceEnabled, currentText]);

  // Trigger speech for conversation screens (50, 52, 53)
  useEffect(() => {
    if (currentScreen === 2 && !showVideo && voiceEnabled && currentText) {
      // Reset and trigger speech for dialogue
      hasSpokeThisScreen.current = false;
      setShouldSpeak(false);
      
      const timer = setTimeout(() => {
        if (!hasSpokeThisScreen.current) {
          hasSpokeThisScreen.current = true;
          setShouldSpeak(true);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, showVideo, showSecondDialogue, showThirdDialogue, voiceEnabled, currentText]);

  // Stop all speech when voice is disabled
  useEffect(() => {
    if (!voiceEnabled) {
      if (robotThought) robotThought.stop();
      if (robotDialogue) robotDialogue.stop();
      if (childDialogue) childDialogue.stop();
    }
  }, [voiceEnabled]);

  // Typing animation
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
  }, [currentScreen, showVideo, showSecondDialogue, showThirdDialogue]);

  useEffect(() => {
    if (currentText && isTyping && displayedText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === currentText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentText]);

  const handleContinue = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else if (currentScreen === 2 && !showVideo && !showSecondDialogue && !showThirdDialogue) {
      // First click: show video
      setShowVideo(true);
    } else if (currentScreen === 2 && showVideo && !showSecondDialogue && !showThirdDialogue) {
      // Second click: hide video and show second dialogue
      setShowVideo(false);
      setShowSecondDialogue(true);
    } else if (currentScreen === 2 && !showVideo && showSecondDialogue && !showThirdDialogue) {
      // Third click: show third dialogue (child's response)
      setShowThirdDialogue(true);
    } else {
      navigate('/second_scenario/talk', { state: { character: selectedCharacter } });
    }
  };

  const handleBack = () => {
    if (currentScreen === 2 && showThirdDialogue) {
      // If showing third dialogue, go back to second dialogue
      setShowThirdDialogue(false);
    } else if (currentScreen === 2 && showSecondDialogue) {
      // If showing second dialogue, go back to video
      setShowSecondDialogue(false);
      setShowVideo(true);
    } else if (currentScreen === 2 && showVideo) {
      // If video is showing, go back to first dialogue
      setShowVideo(false);
    } else if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setShowVideo(false);
      setShowSecondDialogue(false);
      setShowThirdDialogue(false);
    }
  };

  // Screen 3: Conversation between child and AI
  if (currentScreen === 2) {
    return (
      <div className="page-container">
        <AppTitle />
        <>
          {/* Video ad in center - shows after first continue */}
          {showVideo && (
            <div style={{ 
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 200,
              width: '80vw',
              maxWidth: '1100px'
            }}>
              <video 
                className="ad-video"
                controls
                autoPlay
                style={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: '15px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                }}
              >
                <source src={adVideo} type="video/mp4" />
              </video>
            </div>
          )}

          <div className="characters-container">
            {/* Character avatar */}
            <div className={`character-avatar ${showVideo ? '' : showThirdDialogue ? 'speaking' : ''}`}>
              {showThirdDialogue && (
                <div className="character-dialog-box">
                  <p className="dialog-text">
                    {displayedText}
                  </p>
                </div>
              )}
              
              <img 
                src={characterImage} 
                alt={characterName} 
                className="character-image"
              />
            </div>
            
            {/* Robot avatar with dialogue box */}
            <div className={`robot-avatar ${showVideo ? '' : (showSecondDialogue && !showThirdDialogue) || (!showSecondDialogue && !showThirdDialogue) ? 'speaking' : ''}`}>
              {!showVideo && !showSecondDialogue && !showThirdDialogue && (
                <div className="robot-dialog-box">
                  <p className="dialog-text">
                    {displayedText}
                  </p>
                </div>
              )}
              
              {!showVideo && showSecondDialogue && !showThirdDialogue && (
                <div className="robot-dialog-box">
                  <p className="dialog-text">
                    {displayedText}
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
        </>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AppTitle />
      <div className="robot-thinking-container">
        <div className="robot-thinking-content">
            <div className="large-thought-bubble">
              <p className="thought-text">
                {displayedText}
              </p>
            </div>
            
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
                    onClick={handleContinue}
                    disabled={isTyping}
                >
                    Continue
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
