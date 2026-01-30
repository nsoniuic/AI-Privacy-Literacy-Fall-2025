import { useScreenCounter } from '../../contexts/ScreenCounterContext';
import '../../styles/common/ScreenCounter.css';

function ScreenCounter() {
  const { screenNumber } = useScreenCounter();

  return (
    <div className="screen-counter">
      Screen {screenNumber}
    </div>
  );
}

export default ScreenCounter;
