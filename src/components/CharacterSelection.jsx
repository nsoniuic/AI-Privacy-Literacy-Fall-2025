import '../styles/CharacterSelection.css';
import boyCharacter from '../assets/boy.png';
import girlCharacter from '../assets/girl.png';

export default function CharacterSelection({ selectedCharacter, onCharacterSelect }) {
  return (
    <div className="character-options">
      <div 
        className={`character-option ${selectedCharacter === 'boy' ? 'selected' : ''}`}
        onClick={() => onCharacterSelect('boy')}
      >
        <div className="character-placeholder">
          <img src={boyCharacter} />
        </div>
      </div>

      <div 
        className={`character-option ${selectedCharacter === 'girl' ? 'selected' : ''}`}
        onClick={() => onCharacterSelect('girl')}
      >
        <div className="character-placeholder">
          <img src={girlCharacter} />
        </div>
      </div>
    </div>
  );
}
