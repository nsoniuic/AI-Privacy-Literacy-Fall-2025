import { useEffect } from 'react';
import { useScreenCounter } from '../contexts/ScreenCounterContext';

/**
 * Hook to set the screen number for the current component
 * @param {number} screenNumber - The screen number to display
 */
export function useScreenNumber(screenNumber) {
  const { setScreenNumber } = useScreenCounter();

  useEffect(() => {
    setScreenNumber(screenNumber);
  }, [screenNumber, setScreenNumber]);
}
