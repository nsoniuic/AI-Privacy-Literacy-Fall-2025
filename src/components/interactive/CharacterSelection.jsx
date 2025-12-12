import '../../styles/pages/CharacterSelection.css';
import boyCharacter from '../../assets/boy.png';
import girlCharacter from '../../assets/girl.png';

export default function CharacterSelection({ selectedCharacter, onCharacterSelect, locked = false }) {
  return (
    <div className="character-options">
      <div 
        className={`character-option ${selectedCharacter === 'boy' ? 'selected' : ''} ${locked ? 'locked' : ''}`}
        onClick={() => !locked && onCharacterSelect('boy')}
        style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      >
        <div className="character-placeholder">
          <img src={boyCharacter} />
        </div>
      </div>

      <div 
        className={`character-option ${selectedCharacter === 'girl' ? 'selected' : ''} ${locked ? 'locked' : ''}`}
        onClick={() => !locked && onCharacterSelect('girl')}
        style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
      >
        <div className="character-placeholder">
          <img src={girlCharacter} />
        </div>
      </div>
    </div>
  );
}
