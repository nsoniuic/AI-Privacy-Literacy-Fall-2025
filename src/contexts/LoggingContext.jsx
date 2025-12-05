import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  startSession,
  endSession,
  getSessionId,
  isSessionActive,
} from "../services/loggingService";

const LoggingContext = createContext(null);

/**
 * Hook to access logging context
 */
export function useLogging() {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error("useLogging must be used within a LoggingProvider");
  }
  return context;
}

/**
 * Provider component for logging functionality
 * Manages session lifecycle and provides logging state to children
 */
export function LoggingProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(true);

  /**
   * Initializes a new logging session
   */
  const initializeSession = useCallback(
    async (participantIdentifier = null) => {
      if (!isLoggingEnabled) {
        console.log("Logging is disabled. Session not started.");
        return null;
      }

      try {
        const newSessionId = await startSession(participantIdentifier);
        setSessionId(newSessionId);
        setParticipantId(participantIdentifier);
        return newSessionId;
      } catch (error) {
        console.error("Failed to start logging session:", error);
        return null;
      }
    },
    [isLoggingEnabled],
  );

  /**
   * Ends the current logging session
   */
  const terminateSession = useCallback(async () => {
    try {
      await endSession();
      setSessionId(null);
    } catch (error) {
      console.error("Failed to end logging session:", error);
    }
  }, []);

  /**
   * Updates the participant ID for the current session
   */
  const updateParticipantId = useCallback((newParticipantId) => {
    setParticipantId(newParticipantId);
  }, []);

  /**
   * Toggles logging on/off
   */
  const toggleLogging = useCallback(
    (enabled) => {
      setIsLoggingEnabled(enabled);
      if (!enabled && isSessionActive()) {
        terminateSession();
      }
    },
    [terminateSession],
  );

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (isSessionActive()) {
        endSession();
      }
    };
  }, []);

  const value = {
    sessionId,
    participantId,
    isLoggingEnabled,
    isSessionActive: sessionId !== null,
    initializeSession,
    terminateSession,
    updateParticipantId,
    toggleLogging,
    getSessionId,
  };

  return (
    <LoggingContext.Provider value={value}>{children}</LoggingContext.Provider>
  );
}
