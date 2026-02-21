#!/usr/bin/env node

/**
 * Log Processing Script
 * 
 * Fetches click logs from Firebase and generates human-readable reports
 * 
 * Usage:
 *   node scripts/processLogs.js [sessionId]
 * 
 * If no sessionId provided, processes all sessions
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { config } from 'dotenv';
import { translateClickBatch, generateClickReport } from '../src/utils/clickTranslator.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config({ path: path.resolve(__dirname, '../.env') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
if (!firebaseConfig.projectId) {
  console.error('❌ Error: Firebase configuration not found.');
  console.error('Make sure you have a .env file with VITE_FIREBASE_* variables.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches session data from Firebase
 */
async function fetchSession(sessionId) {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (!sessionSnap.exists()) {
    throw new Error(`Session ${sessionId} not found`);
  }
  
  return {
    id: sessionId,
    ...sessionSnap.data(),
  };
}

/**
 * Fetches click logs for a session
 */
async function fetchClickLogs(sessionId) {
  const clicksRef = collection(db, 'sessions', sessionId, 'clicks');
  const clicksSnap = await getDocs(clicksRef);
  
  const clicks = [];
  clicksSnap.forEach(doc => {
    clicks.push(doc.data());
  });
  
  // Sort by timestamp
  clicks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return clicks;
}

/**
 * Fetches tree building input logs for a session
 */
async function fetchTreeBuildingLogs(sessionId) {
  const treeRef = collection(db, 'sessions', sessionId, 'treeBuilding');
  const treeSnap = await getDocs(treeRef);
  
  const inputs = [];
  treeSnap.forEach(doc => {
    inputs.push(doc.data());
  });
  
  // Sort by timestamp
  inputs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return inputs;
}

/**
 * Fetches all session IDs
 */
async function fetchAllSessions() {
  const sessionsRef = collection(db, 'sessions');
  const sessionsSnap = await getDocs(sessionsRef);
  
  const sessions = [];
  sessionsSnap.forEach(doc => {
    sessions.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  
  return sessions;
}

/**
 * Generates a detailed report for a session
 */
async function generateSessionReport(sessionId) {
  console.log(`\nProcessing session: ${sessionId}`);
  
  try {
    // Fetch session data
    const session = await fetchSession(sessionId);
    console.log(`   Participant ID: ${session.participantId || 'Anonymous'}`);
    console.log(`   Start Time: ${session.startTime?.toDate?.() || 'Unknown'}`);
    
    // Fetch clicks
    const clicks = await fetchClickLogs(sessionId);
    console.log(`   Total Clicks: ${clicks.length}`);
    
    // Fetch tree building inputs
    const treeInputs = await fetchTreeBuildingLogs(sessionId);
    console.log(`   Total Input Fields: ${treeInputs.length}`);
    
    if (clicks.length === 0 && treeInputs.length === 0) {
      console.log('   ⚠️  No data to process');
      return null;
    }
    
    // Translate clicks
    const translatedClicks = translateClickBatch(clicks);
    
    // Generate report
    const report = {
      sessionId,
      participantId: session.participantId || 'Anonymous',
      startTime: session.startTime?.toDate?.()?.toISOString() || 'Unknown',
      endTime: session.endTime?.toDate?.()?.toISOString() || 'Ongoing',
      totalClicks: clicks.length,
      totalInputs: treeInputs.length,
      clicks: translatedClicks,
      inputs: treeInputs,
    };
    
    return report;
    
  } catch (error) {
    console.error(`   ❌ Error processing session: ${error.message}`);
    return null;
  }
}

/**
 * Saves report to file
 */
function saveReport(report, format = 'json') {
  const outputDir = path.join(process.cwd(), 'logs', 'reports');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${report.sessionId}_${timestamp}.${format}`;
  const filepath = path.join(outputDir, filename);
  
  if (format === 'json') {
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  } else if (format === 'csv') {
    const csv = generateClickReport(report.clicks);
    fs.writeFileSync(filepath, csv);
  } else if (format === 'txt') {
    const txt = generateTextReport(report);
    fs.writeFileSync(filepath, txt);
  }
  
  console.log(`\nReport saved: ${filepath}`);
  return filepath;
}

/**
 * Generates human-readable text report
 */
function generateTextReport(report) {
  let text = '';
  
  text += '='.repeat(80) + '\n';
  text += 'USER INTERACTION REPORT\n';
  text += '='.repeat(80) + '\n\n';
  
  text += `Session ID: ${report.sessionId}\n`;
  text += `Participant: ${report.participantId}\n`;
  text += `Start Time: ${report.startTime}\n`;
  text += `End Time: ${report.endTime}\n`;
  text += `Total Clicks: ${report.totalClicks}\n`;
  text += `Total Text Inputs: ${report.totalInputs || 0}\n\n`;
  
  // Add text inputs section if any exist
  if (report.inputs && report.inputs.length > 0) {
    text += '-'.repeat(80) + '\n';
    text += 'TEXT INPUT RESPONSES\n';
    text += '-'.repeat(80) + '\n\n';
    
    const nodeIdMap = {
      'left-cloud': 'Left Cloud Input (Second Scenario)',
      'right-cloud': 'Right Cloud Input (Second Scenario)',
      'final-deduction': 'Final Deduction Input (First Scenario)',
    };
    
    for (let i = 0; i < report.inputs.length; i++) {
      const input = report.inputs[i];
      const nodeName = nodeIdMap[input.nodeId] || input.nodeId;
      text += `${i + 1}. [${input.timestamp}]\n`;
      text += `   Field: ${nodeName}\n`;
      text += `   Page: ${input.page || 'Unknown'}\n`;
      text += `   Response: "${input.value}"\n\n`;
    }
  }
  
  text += '-'.repeat(80) + '\n';
  text += 'CLICK SEQUENCE\n';
  text += '-'.repeat(80) + '\n\n';
  
  for (const click of report.clicks) {
    text += `${click.eventNumber}. [${click.timestamp}]\n`;
    text += `   ${click.fullDescription}\n\n`;
  }
  
  return text;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const sessionId = args[0];
  
  console.log('Click Log Processor\n');
  
  try {
    if (sessionId) {
      // Process single session
      const report = await generateSessionReport(sessionId);
      if (report) {
        saveReport(report, 'json');
        saveReport(report, 'csv');
        saveReport(report, 'txt');
      }
    } else {
      // Process all sessions
      console.log('Fetching all sessions...');
      const sessions = await fetchAllSessions();
      console.log(`Found ${sessions.length} session(s)\n`);
      
      for (const session of sessions) {
        const report = await generateSessionReport(session.id);
        if (report) {
          saveReport(report, 'txt');
        }
      }
    }
    
    console.log('\nProcessing complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
