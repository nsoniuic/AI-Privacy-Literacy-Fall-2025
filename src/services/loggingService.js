import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Logging Service for tracking user interactions
 *
 * Handles:
 * - Session management (start/end)
 * - Click logging with batched writes
 * - Page visit duration tracking
 * - Tree building node input logging
 */

// Queue for batching writes
let logQueue = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 5000;

// Session state
let currentSessionId = null;
let currentSessionRef = null;
let flushIntervalId = null;

/**
 * Generates a unique session ID
 */
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

/**
 * Starts a new logging session
 * @param {string} participantId - Optional identifier for the participant
 * @returns {Promise<string>} The session ID
 */
export async function startSession(participantId = null) {
  if (currentSessionId) {
    console.warn("Session already active. Ending previous session.");
    await endSession();
  }

  currentSessionId = generateSessionId();
  currentSessionRef = doc(db, "sessions", currentSessionId);

  const sessionData = {
    participantId,
    startTime: serverTimestamp(),
    endTime: null,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };

  await setDoc(currentSessionRef, sessionData);

  // Start periodic flush
  flushIntervalId = setInterval(flushLogQueue, FLUSH_INTERVAL_MS);

  // Flush on page unload
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("visibilitychange", handleVisibilityChange);

  console.log(`Logging session started: ${currentSessionId}`);
  return currentSessionId;
}

/**
 * Ends the current logging session
 */
export async function endSession() {
  if (!currentSessionId) {
    console.warn("No active session to end.");
    return;
  }

  // Flush any remaining logs
  await flushLogQueue();

  // Update session end time
  await updateDoc(currentSessionRef, {
    endTime: serverTimestamp(),
  });

  // Cleanup
  if (flushIntervalId) {
    clearInterval(flushIntervalId);
    flushIntervalId = null;
  }
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("visibilitychange", handleVisibilityChange);

  console.log(`Logging session ended: ${currentSessionId}`);
  currentSessionId = null;
  currentSessionRef = null;
}

/**
 * Gets the current session ID
 */
export function getSessionId() {
  return currentSessionId;
}

/**
 * Logs a click event
 * @param {Object} clickData - Click event data
 */
export function logClick(clickData) {
  if (!currentSessionId) {
    console.warn("No active session. Click not logged.");
    return;
  }

  const logEntry = {
    type: "click",
    timestamp: new Date().toISOString(),
    ...clickData,
  };

  logQueue.push(logEntry);

  if (logQueue.length >= BATCH_SIZE) {
    flushLogQueue();
  }
}

/**
 * Logs a page visit
 * @param {Object} visitData - Page visit data
 */
export async function logPageVisit(visitData) {
  if (!currentSessionId) {
    console.warn("No active session. Page visit not logged.");
    return;
  }

  const pageVisitsRef = collection(
    db,
    "sessions",
    currentSessionId,
    "pageVisits",
  );

  await addDoc(pageVisitsRef, {
    ...visitData,
    timestamp: serverTimestamp(),
  });
}

/**
 * Logs tree building node input
 * @param {Object} nodeData - Node input data
 */
export function logTreeNodeInput(nodeData) {
  if (!currentSessionId) {
    console.warn("No active session. Tree node input not logged.");
    return;
  }

  const logEntry = {
    type: "treeNode",
    timestamp: new Date().toISOString(),
    ...nodeData,
  };

  logQueue.push(logEntry);

  if (logQueue.length >= BATCH_SIZE) {
    flushLogQueue();
  }
}

/**
 * Flushes the log queue to Firestore
 */
async function flushLogQueue() {
  if (logQueue.length === 0 || !currentSessionId) {
    return;
  }

  const logsToFlush = [...logQueue];
  logQueue = [];

  try {
    const batch = writeBatch(db);

    for (const logEntry of logsToFlush) {
      const collectionName =
        logEntry.type === "treeNode" ? "treeBuilding" : "clicks";
      const logRef = doc(
        collection(db, "sessions", currentSessionId, collectionName),
      );
      batch.set(logRef, logEntry);
    }

    await batch.commit();
  } catch (error) {
    console.error("Error flushing log queue:", error);
    // Re-add failed logs to queue for retry
    logQueue = [...logsToFlush, ...logQueue];
  }
}

/**
 * Handles page unload - attempts final flush
 */
function handleBeforeUnload() {
  if (logQueue.length > 0 && currentSessionId) {
    flushLogQueue();
  }
}

/**
 * Handles visibility change - flush when tab becomes hidden
 */
function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    flushLogQueue();
  }
}

/**
 * Utility: Check if a session is active
 */
export function isSessionActive() {
  return currentSessionId !== null;
}
