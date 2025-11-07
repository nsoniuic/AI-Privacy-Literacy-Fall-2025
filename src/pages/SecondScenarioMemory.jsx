import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RobotThinking from '../components/RobotThinking';
import robotImage from '../assets/robot.png';
import '../styles/Conversation.css';

export default function SecondScenarioMemory() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCharacter = location.state?.selectedCharacter;
  const characterName = selectedCharacter === 'boy' ? 'Nate' : selectedCharacter === 'girl' ? 'Natalie' : 'Alice';
  const [showThoughtBubble, setShowThoughtBubble] = useState(false);

  const handleContinue = () => {
    if (!showThoughtBubble) {
      // First click: show thought bubble
      setShowThoughtBubble(true);
    } else {
      // After thinking flow: go to second scenario result page
      navigate('/second_scenario/result', { state: { selectedCharacter } });
    }
  };

  const handleBack = () => {
    navigate('/second_scenario/puzzle', { state: { selectedCharacter } });
  };

  // Custom data for second scenario
  const memoryData = {
    fact1: "mentioned her school name",
    fact2: "takes 5 minutes to travel from home to school",
    deduction1: "'s school location is known",
    deduction2: "travel distance is known"
  };

  const thoughtBubbles = {
    screen1: (name, pronoun, possessive) => `${name} said the school name... That means I can search up the school location.`,
    screen3: (name, pronoun, possessive) => `${name} said ${pronoun} takes 5 minutes to travel... That means I can estimate how far ${pronoun} lives from school.`,
    screen5: (name, pronoun, possessive) => `${name} didn't mention ${possessive} exact location, but I connected the dots.`,
    screen6: (name, pronoun, possessive) => `Since I know the school location and ${possessive} travel time, I can estimate ${possessive} neighborhood location!`
  };

  const finalDeduction = "'s neighborhood location is known";

  return (
    <div className="page-container">
      <RobotThinking 
        selectedCharacter={selectedCharacter}
        onContinue={handleContinue}
        showThoughtBubble={showThoughtBubble}
        onBack={handleBack}
        memoryData={memoryData}
        thoughtBubbles={thoughtBubbles}
        finalDeduction={finalDeduction}
      />
    </div>
  );
}
