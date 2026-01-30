import { useState } from "react";
import { useNodeInputLogger } from "../../hooks/useNodeInputLogger";
import { useScreenNumber } from "../../hooks/useScreenNumber";
import robotImage from "../../assets/robot.png";
import cloudImage from "../../assets/cloud.svg";
import "../../styles/pages/RobotThinking.css";

export default function InteractiveThinking({
  selectedCharacter,
  onContinue,
  onBack,
  startScreenNumber = 45,
}) {
  const [userInput, setUserInput] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);
  const characterName = "Parker";
  const { logNodeChange } = useNodeInputLogger();

  // Track screen number: startScreenNumber, or +1 if showing encouragement
  useScreenNumber(showEncouragement ? startScreenNumber + 1 : startScreenNumber);

  const handleSubmit = () => {
    if (userInput.trim() && !showEncouragement) {
      setShowEncouragement(true);
    } else if (showEncouragement) {
      onContinue();
    }
  };

  return (
    <div className="robot-thinking-container">
      <div className="robot-thinking-content">
        {/* Two cloud boxes at the top */}
        <div className="memory-clouds-container">
          <div className="memory-cloud-container-left">
            <div className="memory-cloud show">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">
                {characterName}'s birthday is July 12th
              </p>
            </div>

            {/* Arrow pointing down from birthday cloud to deduction bubble */}
            <div className="deduction-arrow">
              <div className="deduction-arrow-line"></div>
              <div className="deduction-arrow-head"></div>
            </div>

            {/* Birthday deduction bubble below birthday cloud */}
            <div className="deduction-bubble">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="deduction-text">
                {characterName}'s birthday passed
              </p>
            </div>
          </div>

          <div className="memory-cloud-container-right">
            <div className="memory-cloud show">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">
                {characterName} is in 8th grade
              </p>
            </div>

            {/* Arrow pointing down from grade cloud to deduction bubble */}
            <div className="deduction-arrow">
              <div className="deduction-arrow-line"></div>
              <div className="deduction-arrow-head"></div>
            </div>

            {/* Deduction bubble below grade cloud */}
            <div className="deduction-bubble">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="deduction-text">
                {characterName} is around 13 to 14 years old
              </p>
            </div>
          </div>
        </div>

        {/* Final deduction bubble - user input */}
        <div className="deduction-container">
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
          <div className="deduction-bubble interactive">
            <img src={cloudImage} alt="Cloud" className="cloud-background" />
            <input
              type="text"
              className="deduction-input"
              placeholder="Type your answer here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onBlur={() => {
                if (userInput.trim()) {
                  logNodeChange({
                    nodeId: "final-deduction",
                    value: userInput,
                  });
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        {/* Robot at the bottom */}
        <div className="robot-thinking-image-container">
          {/* Encouragement thought bubble */}
          {showEncouragement && (
            <div className="thought-bubble robot-positioned-thought">
              Great job!
            </div>
          )}

          <img src={robotImage} alt="Robot" className="robot-thinking-image" />
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button
            className="back-button"
            onClick={onBack}
            disabled={showEncouragement}
          >
            Back
          </button>
          <button
            className="continue-button"
            onClick={handleSubmit}
            disabled={!userInput.trim()}
          >
            {showEncouragement ? "Continue" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
