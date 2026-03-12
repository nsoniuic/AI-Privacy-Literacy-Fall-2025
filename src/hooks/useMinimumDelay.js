import { useState, useEffect } from 'react';

/**
 * Returns true until `delayMs` ms have passed since `enabled` became true.
 * The timer only starts (or restarts) when `enabled` transitions to true.
 * Use to enforce a minimum view time before enabling a continue button.
 *
 * @param {number} delayMs - How long to delay in milliseconds. Pass 0 to skip.
 * @param {*} trigger - Any value; changing it restarts the delay timer (when enabled).
 * @param {boolean} enabled - When false, the timer won't start. Defaults to true.
 * @returns {boolean} isDelayed - true while the delay is still active
 */
export function useMinimumDelay(delayMs, trigger, enabled = true) {
  const [isDelayed, setIsDelayed] = useState(delayMs > 0);

  useEffect(() => {
    if (delayMs <= 0 || !enabled) {
      setIsDelayed(false);
      return;
    }

    setIsDelayed(true);
    const timer = setTimeout(() => setIsDelayed(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, trigger, enabled]);

  return isDelayed;
}
