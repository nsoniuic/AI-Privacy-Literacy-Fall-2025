/**
 * Click Event Translator
 * 
 * Translates technical logging data into human-readable descriptions
 * for non-programmer analysis of user interactions
 */

/**
 * Maps page paths to human-readable page names
 */
const PAGE_NAMES = {
  '/': 'Initial Greeting / Home Page',
  '/character': 'Character Selection',
  '/first_scenario/talk': 'First Scenario Conversation',
  '/first_scenario/memory': 'First Scenario Memory Extraction',
  '/first_scenario/result': 'First Scenario Consequences',
  '/first_puzzle': 'First Puzzle',
  '/puzzle/first': 'First Puzzle',
  '/first_puzzle_explain': 'First Puzzle Explanation',
  '/second_puzzle': 'Second Puzzle',
  '/puzzle/second': 'Second Puzzle',
  '/second_puzzle_explain': 'Second Puzzle Explanation',
  '/second_scenario/talk': 'Second Scenario Conversation',
  '/second_scenario/memory': 'Second Scenario Memory Extraction',
  '/second_scenario/puzzle': 'Second Scenario Puzzle',
  '/second_scenario/result': 'Second Scenario Consequences',
  '/final': 'Final Message',
};

/**
 * Maps element IDs to their purposes
 */
const ELEMENT_IDS = {
  'boy-option': 'Boy Character Option',
  'girl-option': 'Girl Character Option',
  'voice-toggle': 'Voice Toggle Button',
};

/**
 * Maps class names to component descriptions
 */
const CLASS_MAPPINGS = {
  'continue-button': 'Continue Button',
  'back-button': 'Back Button',
  'character-option': 'Character Selection Option',
  'puzzle-cell': 'Puzzle Grid Cell',
  'node-input': 'Tree Building Node Input',
  'dialog-box': 'Dialog Box',
  'thought-bubble': 'Thought Bubble',
  'large-thought-bubble': 'Large Thought Bubble',
  'memory-container': 'Memory Container',
  'voice-toggle-button': 'Voice Toggle Button',
  'voice-hint': 'Voice Hint Message',
  'robot-image': 'Robot Image',
  'character-image': 'Character Image',
  'app-title': 'App Title',
  'screen-counter': 'Screen Counter',
  'progress-indicator': 'Progress Indicator',
};

/**
 * Maps button texts to their actions
 */
const BUTTON_TEXTS = {
  "Let's go!": 'Start/Continue Action',
  'Continue': 'Continue to Next Screen',
  'Back': 'Go Back to Previous Screen',
  'Next': 'Proceed to Next Step',
  'Submit': 'Submit Response',
  'Start': 'Begin Activity',
  'Finish': 'Complete Activity',
};

/**
 * Extracts the primary class from a className string
 * @param {string} className - Full className string
 * @returns {string|null} Primary class name
 */
function extractPrimaryClass(className) {
  if (!className || typeof className !== 'string') return null;
  
  const classes = className.split(' ');
  
  // Priority order: look for specific component classes first
  const priorityClasses = [
    'continue-button',
    'back-button',
    'character-option',
    'puzzle-cell',
    'node-input',
    'voice-toggle-button',
    'large-thought-bubble',
    'thought-bubble',
  ];
  
  for (const priorityClass of priorityClasses) {
    if (classes.includes(priorityClass)) {
      return priorityClass;
    }
  }
  
  // Return first class if no priority match
  return classes[0];
}

/**
 * Translates click data into human-readable description
 * @param {Object} clickData - The raw click data from logging
 * @param {string} clickData.element - HTML element tag name
 * @param {string} clickData.className - Element class name(s)
 * @param {string} clickData.id - Element ID
 * @param {string} clickData.text - Element text content
 * @param {string} clickData.page - Page pathname
 * @param {string} clickData.cellRow - Puzzle cell row position
 * @param {string} clickData.cellCol - Puzzle cell column position
 * @param {string} clickData.puzzleNumber - Puzzle number
 * @param {string} clickData.cellType - Type of cell
 * @returns {Object} Translated click information
 */
export function translateClick(clickData) {
  const {
    element = 'UNKNOWN',
    className = '',
    id = '',
    text = '',
    page = '',
    cellRow = null,
    cellCol = null,
    puzzleNumber = null,
    cellType = null,
  } = clickData;

  // Get page name
  const pageName = PAGE_NAMES[page] || `Unknown Page (${page})`;

  // Get element description
  let elementDescription = '';
  
  // Check if it's a puzzle cell with position data
  if (cellType === 'puzzle-cell' && cellRow !== null && cellCol !== null) {
    const row = parseInt(cellRow) + 1; // Convert to 1-based for display
    const col = parseInt(cellCol) + 1;
    elementDescription = `Puzzle Cell (Row ${row}, Col ${col})`;
    if (puzzleNumber) {
      elementDescription = `Puzzle ${puzzleNumber} Cell (Row ${row}, Col ${col})`;
    }
  }
  // Check ID first (most specific)
  else if (id && ELEMENT_IDS[id]) {
    elementDescription = ELEMENT_IDS[id];
  }
  // Then check class names
  else {
    const primaryClass = extractPrimaryClass(className);
    if (primaryClass && CLASS_MAPPINGS[primaryClass]) {
      elementDescription = CLASS_MAPPINGS[primaryClass];
    }
  }

  // Check button text
  let actionDescription = '';
  const trimmedText = text?.trim();
  if (trimmedText && BUTTON_TEXTS[trimmedText]) {
    actionDescription = BUTTON_TEXTS[trimmedText];
  }

  // Build human-readable description
  let description = '';
  
  if (elementDescription) {
    description = elementDescription;
  } else if (element === 'BUTTON') {
    description = 'Button';
  } else if (element === 'INPUT') {
    description = 'Input Field';
  } else if (element === 'IMG') {
    description = 'Image';
  } else {
    description = element.charAt(0) + element.slice(1).toLowerCase();
  }

  // Add action if available
  if (actionDescription) {
    description += ` (${actionDescription})`;
  }
  // Add text if it's meaningful and not too long
  else if (trimmedText && trimmedText.length > 0 && trimmedText.length <= 30) {
    description += ` - "${trimmedText}"`;
  }

  return {
    page: pageName,
    element: description,
    fullDescription: `Clicked ${description} on ${pageName}`,
    rawData: clickData,
  };
}

/**
 * Translates an array of click events
 * @param {Array} clickEvents - Array of click data objects
 * @returns {Array} Array of translated click events
 */
export function translateClickBatch(clickEvents) {
  return clickEvents.map((click, index) => ({
    eventNumber: index + 1,
    timestamp: click.timestamp,
    ...translateClick(click),
  }));
}

/**
 * Generates a CSV-friendly format from translated clicks
 * @param {Array} translatedClicks - Array of translated click events
 * @returns {string} CSV formatted string
 */
export function generateClickReport(translatedClicks) {
  const headers = ['Event #', 'Timestamp', 'Page', 'Element Clicked', 'Description'];
  const rows = [headers];

  for (const click of translatedClicks) {
    rows.push([
      click.eventNumber || '',
      click.timestamp || '',
      click.page || '',
      click.element || '',
      click.fullDescription || '',
    ]);
  }

  return rows.map(row => row.join(',')).join('\n');
}

/**
 * Example usage and testing function
 */
export function testTranslation() {
  const sampleClicks = [
    {
      element: 'BUTTON',
      className: 'continue-button',
      id: '',
      text: "Let's go!",
      page: '/',
      timestamp: '2026-02-16T10:30:00.000Z',
    },
    {
      element: 'DIV',
      className: 'character-option boy-character',
      id: 'boy-option',
      text: 'Boy Character',
      page: '/character',
      timestamp: '2026-02-16T10:30:15.000Z',
    },
    {
      element: 'BUTTON',
      className: 'voice-toggle-button',
      id: '',
      text: '🔊',
      page: '/first_scenario',
      timestamp: '2026-02-16T10:30:30.000Z',
    },
  ];

  console.log('=== Translation Test ===');
  const translated = translateClickBatch(sampleClicks);
  translated.forEach(click => {
    console.log(`${click.eventNumber}. ${click.fullDescription}`);
  });
  
  console.log('\n=== CSV Report ===');
  console.log(generateClickReport(translated));
}
