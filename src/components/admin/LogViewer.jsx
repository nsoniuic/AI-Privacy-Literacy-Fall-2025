import { useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { translateClickBatch, generateClickReport } from '../../utils/clickTranslator';

/**
 * Log Viewer Component
 * 
 * Displays session logs in a human-readable format
 * Can be used by researchers to analyze user interactions
 */
export default function LogViewer() {
  const [sessionId, setSessionId] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches and processes session data
   */
  const loadSession = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch session metadata
      const sessionRef = doc(db, 'sessions', sessionId.trim());
      const sessionSnap = await getDoc(sessionRef);

      if (!sessionSnap.exists()) {
        throw new Error('Session not found');
      }

      const session = sessionSnap.data();
      setSessionData({
        id: sessionId,
        participantId: session.participantId || 'Anonymous',
        startTime: session.startTime?.toDate?.()?.toLocaleString() || 'Unknown',
        endTime: session.endTime?.toDate?.()?.toLocaleString() || 'Ongoing',
      });

      // Fetch clicks
      const clicksRef = collection(db, 'sessions', sessionId.trim(), 'clicks');
      const clicksSnap = await getDocs(clicksRef);

      const clickData = [];
      clicksSnap.forEach(doc => {
        clickData.push(doc.data());
      });

      // Sort by timestamp
      clickData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Translate clicks
      const translatedClicks = translateClickBatch(clickData);
      setClicks(translatedClicks);

      // Fetch tree building inputs
      const treeRef = collection(db, 'sessions', sessionId.trim(), 'treeBuilding');
      const treeSnap = await getDocs(treeRef);

      const inputData = [];
      treeSnap.forEach(doc => {
        inputData.push(doc.data());
      });

      // Sort by timestamp
      inputData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setInputs(inputData);

    } catch (err) {
      setError(err.message);
      setSessionData(null);
      setClicks([]);
      setInputs([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Downloads report as CSV
   */
  const downloadCSV = () => {
    const csv = generateClickReport(clicks);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_${sessionId}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Downloads report as JSON
   */
  const downloadJSON = () => {
    const report = {
      sessionId,
      ...sessionData,
      totalClicks: clicks.length,
      totalInputs: inputs.length,
      clicks,
      inputs,
    };
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_${sessionId}_report.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Session Log Viewer</h1>
      
      {/* Input Section */}
      <div style={styles.inputSection}>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter Session ID"
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && loadSession()}
        />
        <button onClick={loadSession} disabled={loading} style={styles.button}>
          {loading ? 'Loading...' : 'Load Session'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      {/* Session Info */}
      {sessionData && (
        <div style={styles.sessionInfo}>
          <h2>Session Information</h2>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tableLabel}>Session ID:</td>
                <td>{sessionData.id}</td>
              </tr>
              <tr>
                <td style={styles.tableLabel}>Participant ID:</td>
                <td>{sessionData.participantId}</td>
              </tr>
              <tr>
                <td style={styles.tableLabel}>Start Time:</td>
                <td>{sessionData.startTime}</td>
              </tr>
              <tr>
                <td style={styles.tableLabel}>End Time:</td>
                <td>{sessionData.endTime}</td>
              </tr>
              <tr>
                <td style={styles.tableLabel}>Total Clicks:</td>
                <td>{clicks.length}</td>
              </tr>
              <tr>
                <td style={styles.tableLabel}>Total Text Inputs:</td>
                <td>{inputs.length}</td>
              </tr>
            </tbody>
          </table>

          {/* Export Buttons */}
          <div style={styles.exportButtons}>
            <button onClick={downloadCSV} style={styles.exportButton}>
              📥 Download CSV
            </button>
            <button onClick={downloadJSON} style={styles.exportButton}>
              📥 Download JSON
            </button>
          </div>
        </div>
      )}

      {/* Text Inputs Section */}
      {inputs.length > 0 && (
        <div style={styles.inputsList}>
          <h2>Text Input Responses ({inputs.length} responses)</h2>
          {inputs.map((input, index) => {
            const nodeIdMap = {
              'left-cloud': 'Left Cloud Input (Second Scenario)',
              'right-cloud': 'Right Cloud Input (Second Scenario)',
              'final-deduction': 'Final Deduction Input (First Scenario)',
            };
            const nodeName = nodeIdMap[input.nodeId] || input.nodeId;
            
            return (
              <div key={index} style={styles.inputItem}>
                <div style={styles.inputHeader}>
                  <span style={styles.inputNumber}>#{index + 1}</span>
                  <span style={styles.inputTimestamp}>
                    {new Date(input.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={styles.inputField}>
                  <strong>Field:</strong> {nodeName}
                </div>
                <div style={styles.inputResponse}>
                  <strong>Response:</strong> "{input.value}"
                </div>
                <div style={styles.inputDetails}>
                  <span style={styles.badge}>Page: {input.page || 'Unknown'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clicks List */}
      {clicks.length > 0 && (
        <div style={styles.clicksList}>
          <h2>Click Sequence ({clicks.length} clicks)</h2>
          {clicks.map((click) => (
            <div key={click.eventNumber} style={styles.clickItem}>
              <div style={styles.clickHeader}>
                <span style={styles.clickNumber}>#{click.eventNumber}</span>
                <span style={styles.clickTimestamp}>
                  {new Date(click.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={styles.clickDescription}>
                <strong>{click.fullDescription}</strong>
              </div>
              <div style={styles.clickDetails}>
                <span style={styles.badge}>Page: {click.page}</span>
                <span style={styles.badge}>Element: {click.element}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  inputSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    padding: '15px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  sessionInfo: {
    backgroundColor: '#7a7a7a',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    marginTop: '10px',
    borderCollapse: 'collapse',
  },
  tableLabel: {
    fontWeight: 'bold',
    padding: '8px',
    width: '150px',
  },
  exportButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  exportButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  inputsList: {
    marginTop: '30px',
  },
  inputItem: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #4caf50',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '15px',
  },
  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  inputNumber: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: '18px',
  },
  inputTimestamp: {
    color: '#666',
    fontSize: '14px',
  },
  inputField: {
    marginBottom: '8px',
    fontSize: '15px',
    color: '#333',
  },
  inputResponse: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#1565c0',
    fontStyle: 'italic',
  },
  inputDetails: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  clicksList: {
    marginTop: '30px',
  },
  clickItem: {
    backgroundColor: '#7f7f7f',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '15px',
  },
  clickHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  clickNumber: {
    fontWeight: 'bold',
    color: '#2196F3',
    fontSize: '18px',
  },
  clickTimestamp: {
    color: '#ffffff',
    fontSize: '14px',
  },
  clickDescription: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  clickDetails: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '12px',
    fontSize: '12px',
  },
};
