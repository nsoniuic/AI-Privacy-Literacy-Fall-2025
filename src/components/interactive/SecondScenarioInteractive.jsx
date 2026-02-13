import { useState } from "react";
import { useNodeInputLogger } from "../../hooks/useNodeInputLogger";
import robotThinkImage from "../../assets/robot-think.png";
import cloudImage from "../../assets/cloud.svg";
import "../../styles/pages/RobotThinking.css";

export default function SecondScenarioInteractive({
  selectedCharacter,
  onContinue,
  onBack,
}) {
  const [leftCloudAdded, setLeftCloudAdded] = useState(false);
  const [rightCloudAdded, setRightCloudAdded] = useState(false);
  const [leftCloudText, setLeftCloudText] = useState("");
  const [rightCloudText, setRightCloudText] = useState("");
  const [editingLeft, setEditingLeft] = useState(false);
  const [editingRight, setEditingRight] = useState(false);
  const { logNodeChange } = useNodeInputLogger();

  const handleLeftPlusClick = () => {
    if (!leftCloudAdded) {
      setLeftCloudAdded(true);
      setEditingLeft(true);
    }
  };

  const handleRightPlusClick = () => {
    if (!rightCloudAdded) {
      setRightCloudAdded(true);
      setEditingRight(true);
    }
  };

  const handleLeftInputBlur = () => {
    setEditingLeft(false);
    if (leftCloudText.trim()) {
      logNodeChange({ nodeId: "left-cloud", value: leftCloudText });
    }
  };

  const handleRightInputBlur = () => {
    setEditingRight(false);
    if (rightCloudText.trim()) {
      logNodeChange({ nodeId: "right-cloud", value: rightCloudText });
    }
  };

  const bothCloudsCompleted =
    leftCloudAdded &&
    rightCloudAdded &&
    leftCloudText.trim() &&
    rightCloudText.trim();

  return (
    <div className="robot-thinking-container">
      <div className="robot-thinking-content">
        {/* Two initial cloud boxes at the top */}
        <div className="memory-clouds-container">
          <div className="memory-cloud-container-left">
            <div className="memory-cloud show">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">
                Parker mentioned her school name
              </p>
            </div>
          </div>

          <div className="memory-cloud-container-right">
            <div className="memory-cloud show">
              <img src={cloudImage} alt="Cloud" className="cloud-background" />
              <p className="memory-cloud-text">
                Parker takes 5 minutes to travel from home to school
              </p>
            </div>
          </div>
        </div>

        {/* Converging arrows with plus buttons and added clouds */}
        <div className="interactive-arrows-container">
          {/* Left side */}
          <div className="arrow-with-cloud-left">
            {/* Arrow from initial cloud down with plus button overlay */}
            <div className="arrow-with-plus">
              <div className="straight-down-arrow">
                <div className="straight-arrow-line"></div>
                <div className="straight-arrow-head"></div>
              </div>

              {/* Plus button overlaid in middle of arrow */}
              {!leftCloudAdded && (
                <button
                  className="arrow-plus-button-overlay"
                  onClick={handleLeftPlusClick}
                >
                  <span className="plus-icon">+</span>
                </button>
              )}
            </div>

            {/* Added cloud appears when clicked */}
            {leftCloudAdded && (
              <div className="middle-cloud-container">
                <div className="memory-cloud show">
                  <img src={cloudImage} alt="Cloud" className="cloud-background" />
                  {editingLeft ? (
                    <input
                      type="text"
                      className="cloud-input"
                      placeholder="What's Robo thinking?"
                      value={leftCloudText}
                      onChange={(e) => setLeftCloudText(e.target.value)}
                      onBlur={handleLeftInputBlur}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleLeftInputBlur();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="memory-cloud-text clickable"
                      onClick={() => setEditingLeft(true)}
                    >
                      {leftCloudText || "Click to edit..."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="arrow-with-cloud-right">
            {/* Arrow from initial cloud down with plus button overlay */}
            <div className="arrow-with-plus">
              <div className="straight-down-arrow">
                <div className="straight-arrow-line"></div>
                <div className="straight-arrow-head"></div>
              </div>

              {/* Plus button overlaid in middle of arrow */}
              {!rightCloudAdded && (
                <button
                  className="arrow-plus-button-overlay"
                  onClick={handleRightPlusClick}
                >
                  <span className="plus-icon">+</span>
                </button>
              )}
            </div>

            {/* Added cloud appears when clicked */}
            {rightCloudAdded && (
              <div className="middle-cloud-container">
                <div className="memory-cloud show">
                  <img src={cloudImage} alt="Cloud" className="cloud-background" />
                  {editingRight ? (
                    <input
                      type="text"
                      className="cloud-input"
                      placeholder="What's Robo thinking?"
                      value={rightCloudText}
                      onChange={(e) => setRightCloudText(e.target.value)}
                      onBlur={handleRightInputBlur}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleRightInputBlur();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="memory-cloud-text clickable"
                      onClick={() => setEditingRight(true)}
                    >
                      {rightCloudText || "Click to edit..."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Converging arrows to final deduction - only show when clouds are added */}
        <div className="converging-arrows">
          {leftCloudAdded && (
            <div className="converging-arrow converging-arrow-left">
              <div className="converging-arrow-line"></div>
              <div className="converging-arrow-head"></div>
            </div>
          )}
          {rightCloudAdded && (
            <div className="converging-arrow converging-arrow-right">
              <div className="converging-arrow-line"></div>
              <div className="converging-arrow-head"></div>
            </div>
          )}
        </div>

        {/* Final deduction bubble - always visible at bottom */}
        <div className="final-deduction-container">
          <div className="deduction-bubble show">
            <img src={cloudImage} alt="Cloud" className="cloud-background" />
            <p className="deduction-text">
              Parker's neighborhood location is known
            </p>
          </div>
        </div>

        {/* Instruction box and Robot at the bottom */}
        <div className="robot-thinking-image-container">
          <div className="instruction-box">
            <p className="instruction-text">
              Click on the + button to add a thinking cloud!
            </p>
          </div>

          <img src={robotThinkImage} alt="Robot" className="robot-thinking-image" />
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <button className="back-button" onClick={onBack}>
            Back
          </button>
          <button
            className="continue-button"
            onClick={onContinue}
            disabled={!bothCloudsCompleted}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
