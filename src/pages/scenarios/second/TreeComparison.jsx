import { useLocation, useNavigate } from 'react-router-dom';
import robotHappyImage from '../../../assets/robot-happy.png';
import cloudImage from '../../../assets/cloud.svg';
import AppTitle from '../../../components/common/AppTitle';
import { useScreenNumber } from '../../../hooks/useScreenNumber';
import '../../../styles/pages/RobotThinking.css';
import '../../../styles/pages/TreeComparison.css';
import '../../../App.css';

function CloudBlock({ text, dashed = false }) {
  return (
    <div className="cloud-block">
      <img
        src={cloudImage}
        alt="Cloud"
        style={{
          opacity: dashed ? 0.35 : 1,
          filter: dashed ? 'grayscale(1)' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))',
        }}
      />
      <p style={{ color: dashed ? '#999' : '#000' }}>{text}</p>
    </div>
  );
}

function ArrowDown() {
  return <div className="tree-arrow-down">↓</div>;
}

function ReasoningTree({ possessivePronoun, leftMiddle, rightMiddle, showMiddle, label, labelColor, headerIcon }) {
  const topLeftText = `Parker mentioned ${possessivePronoun} school name`;
  const topRightText = 'Parker takes 5 minutes to travel from home to school';
  const bottomText = "Parker's neighborhood location is known";

  return (
    <div className="tree-panel">
      <div className="tree-header">
        {headerIcon}
        <span className="tree-header-label" style={{ color: labelColor }}>{label}</span>
      </div>

      <div className="tree-row">
        <div className="tree-cell"><CloudBlock text={topLeftText} /></div>
        <div className="tree-cell"><CloudBlock text={topRightText} /></div>
      </div>

      <div className="tree-arrows-down">
        <ArrowDown /><ArrowDown />
      </div>

      <div className="tree-row">
        <div className="tree-cell">
          {showMiddle ? <CloudBlock text={leftMiddle} /> : <CloudBlock text="(empty)" dashed />}
        </div>
        <div className="tree-cell">
          {showMiddle ? <CloudBlock text={rightMiddle} /> : <CloudBlock text="(empty)" dashed />}
        </div>
      </div>

      <div className="tree-arrows-converge">
        <div className="tree-arrow-converge-left">↘</div>
        <div className="tree-arrow-converge-right">↙</div>
      </div>

      <div className="tree-final-row">
        <div className="tree-final-cell">
          <CloudBlock text={bottomText} />
        </div>
      </div>
    </div>
  );
}

export default function TreeComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter || location.state?.character;
  const userLeftCloud = location.state?.userLeftCloud || '';
  const userRightCloud = location.state?.userRightCloud || '';

  useScreenNumber(73);

  const possessivePronoun = selectedCharacter === 'boy' ? 'his' : 'her';

  const roboLeftAnswer = "Parker's school location is known";
  const roboRightAnswer = "Parker lives within 5 minutes of school";

  const handleContinue = () => {
    navigate('/second_scenario/result', { state: { selectedCharacter } });
  };

  const handleBack = () => {
    navigate('/second_scenario/memory', { state: {
      selectedCharacter,
      userLeftCloud,
      userRightCloud,
    }});
  };

  return (
    <div className="page-container">
      <AppTitle />

      {/* Robot + dialogue at bottom-left, matching memory pages */}
      <div className="robot-thinking-image-container">
        <div className="thought-bubble robot-positioned-thought" style={{padding: '30px 90px' }}>
          Let's compare how we think!
        </div>
        <img src={robotHappyImage} alt="Robot" className="robot-thinking-image" />
      </div>

      <div className="tree-comparison-wrapper">
        <div className="tree-comparison-panels">
          {/* User's tree */}
          <ReasoningTree
            possessivePronoun={possessivePronoun}
            leftMiddle={userLeftCloud}
            rightMiddle={userRightCloud}
            showMiddle={!!(userLeftCloud || userRightCloud)}
            label="Your Thinking"
            labelColor="#5585c5"
            headerIcon={<span style={{ fontSize: '1.4rem' }}>🧒</span>}
          />

          <div className="tree-divider" />

          {/* Robo's tree */}
          <ReasoningTree
            possessivePronoun={possessivePronoun}
            leftMiddle={roboLeftAnswer}
            rightMiddle={roboRightAnswer}
            showMiddle
            label="Robo's Thinking"
            labelColor="#e17727"
            headerIcon={
              <img src={robotHappyImage} alt="Robo" style={{ width: '28px', verticalAlign: 'middle' }} />
            }
          />
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="continue-button" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
}
