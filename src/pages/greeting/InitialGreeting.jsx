import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { startSession } from "../../services/loggingService";
// Import different robot emotion images here as they become available
import robotHappyImage from "../../assets/robot-happy.png";
import robotWaveImage from "../../assets/robot-wave.png";
import robotThinkImage from "../../assets/robot-think.png";
import useSpeech from "../../utils/useSpeech";
import { useVoice } from "../../contexts/VoiceContext";
import { useScreenNumber } from "../../hooks/useScreenNumber";
import AppTitle from "../../components/common/AppTitle";
import "../../styles/pages/InitialGreeting.css";
import "../../App.css";

export default function InitialGreeting() {
  const navigate = useNavigate();
  const { voiceEnabled, friendlyVoice } = useVoice();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [userName, setUserName] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [shouldSpeak, setShouldSpeak] = useState(false);

  const screenNumber = currentDialogueIndex + 1;
  useScreenNumber(screenNumber);

  // Dialogue configuration with emotion/image syncing
  // Each dialogue has text and corresponding robot emotion image
  const dialogueConfig = [
    {
      text: "Hi there! I'm Robo, your A.I buddy. Together, we'll explore how AI thinks and what happens when we share information with it. What's your name?",
      emotion: "happy",
      image: robotWaveImage,
    },
    {
      text: "Great to meet you, {name}! Ever wondered how A.I figures things out? Let's solve a puzzle to see how it reasons when it looks for patterns.",
      emotion: "excited",
      image: robotHappyImage,
    },
    {
      text: "First, you'll solve a puzzle, and then I will so you can compare how your reasoning is similar or different from mine. This will help you understand how I think before we explore how I can use information you share with me to figure out things you never said.",
      emotion: "explaining",
      image: robotThinkImage,
    },
  ];

  const typingSpeed = 40;

  // Get current dialogue configuration
  const currentDialogueConfig = dialogueConfig[currentDialogueIndex];
  const currentDialogue = currentDialogueConfig.text.replace(
    "{name}",
    userName,
  );
  const currentRobotImage = currentDialogueConfig.image;

  // Use speech hook - speak when typing is complete
  const speechControl = useSpeech(
    currentDialogue,
    voiceEnabled && shouldSpeak,
    {
      rate: 0.9, // Slightly slower for friendly, clear speech
      pitch: 1.0, // Normal pitch for natural, warm voice
      volume: 1.0,
      voiceName: friendlyVoice?.name, // Use child-friendly voice if available
    },
  );

  useEffect(() => {
    const dialogueText = dialogueConfig[currentDialogueIndex].text.replace(
      "{name}",
      userName,
    );

    // Start speech immediately when new dialogue starts
    if (displayedText === "") {
      setShouldSpeak(true);
    }

    if (isTyping && displayedText.length < dialogueText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(dialogueText.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === dialogueText.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentDialogueIndex, userName]);

  const handleContinue = () => {
    // Stop any ongoing speech
    speechControl.stop();
    setShouldSpeak(false);

    if (currentDialogueIndex < dialogueConfig.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
      setDisplayedText("");
      setIsTyping(true);
    } else {
      navigate("/puzzle/first", { state: { userName } });
    }
  };

  const handleBack = () => {
    // Stop any ongoing speech
    speechControl.stop();
    setShouldSpeak(false);

    if (currentDialogueIndex > 1) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
      setDisplayedText("");
      setIsTyping(true);
    } else if (currentDialogueIndex === 1) {
      // Go back to name input
      setCurrentDialogueIndex(0);
      setShowInput(true);
      setDisplayedText("");
      setIsTyping(true);
    } else {
      // At the very first screen, navigate back to home/character selection
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    if (userName.trim()) {
      await startSession(userName);
      setShouldBounce(true);
      setTimeout(() => {
        setShouldBounce(false);
        setShowInput(false);
        setCurrentDialogueIndex(1);
        setDisplayedText("");
        setIsTyping(true);
      }, 600); // Duration of bounce animation
    }
  };

  const handleInputChange = (e) => {
    setUserName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="page-container"
      style={{ cursor: !showInput && !isTyping ? "pointer" : "default" }}
    >
      <AppTitle />

      <div className="initial-greeting-content">
        {/* Dialog box positioned at top */}
        <div className="dialog-box-top">
          <p className="dialog-text">{displayedText}</p>
        </div>

        {/* Robot image on the right side */}
        <div className="initial-greeting-robot-container-right">
          <img
            src={currentRobotImage}
            alt={`Robot ${currentDialogueConfig.emotion}`}
            className={`initial-greeting-robot-image ${shouldBounce ? "bounce-animation" : ""}`}
            key={currentDialogueIndex} // Force re-render on dialogue change for smooth transitions
          />
        </div>

        {/* Name prompt and input below robot */}
        {showInput && (
          <div className="initial-greeting-input-section">
            <p className="initial-greeting-prompt-text">What's your name?</p>
            <input
              type="text"
              value={userName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="initial-greeting-input"
              autoFocus
            />
          </div>
        )}

        {!showInput && (
          <div className="navigation-buttons">
            <button
              className="back-button"
              onClick={handleBack}
              disabled={isTyping}
            >
              Back
            </button>

            <button
              className="continue-button"
              onClick={(e) => {
                e.stopPropagation();
                handleContinue();
              }}
              disabled={isTyping}
            >
              {currentDialogueIndex === dialogueConfig.length - 1
                ? "Start Puzzle"
                : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

