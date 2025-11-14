# Privacy Literacy - AI Privacy Education for Children

An interactive educational web application designed to teach children about AI reasoning, pattern recognition, and digital privacy through engaging puzzles and scenarios.

## Project Overview

Privacy Literacy is a React-based educational tool that introduces children to:
- **How AI Thinks** - Understanding AI pattern recognition through interactive puzzles
- **Privacy Awareness** - Learning about data sharing and inference through realistic scenarios
- **Interactive Learning** - Engaging with an AI character (Robo) through conversational interfaces

## Features

### Core Functionality
- **Voice Dictation** - Text-to-speech with child-friendly voice settings throughout the app
- **Interactive Puzzles** - Pattern recognition challenges that demonstrate AI reasoning
- **Scenario-Based Learning** - Real-world privacy scenarios with character interactions
- **Progress Tracking** - Visual progress indicator showing learning journey
- **Responsive Design** - Fully responsive layout for desktop, tablet, and mobile devices

## 📁 Project Structure

```
digital-privacy/
├── src/
│   ├── assets/                     # Images and static files
│   ├── components/
│   │   ├── common/                 # Reusable UI components
│   │   │   ├── AppTitle.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── VoiceToggle.jsx
│   │   ├── conversation/           # Dialogue components
│   │   │   ├── ConversationContainer.jsx
│   │   │   └── RobotThinking.jsx
│   │   ├── interactive/            # Interactive elements
│   │   │   ├── CharacterSelection.jsx
│   │   │   ├── InteractiveThinking.jsx
│   │   │   ├── SecondScenarioInteractive.jsx
│   │   │   └── VoiceSelector.jsx
│   │   └── puzzles/                # Puzzle components
│   │       ├── PuzzleGrid.jsx
│   │       ├── PuzzleExamples.jsx
│   │       ├── PuzzleInteractive.jsx
│   │       └── PuzzleInteractiveExplain.jsx
│   ├── contexts/
│   │   └── VoiceContext.jsx        # Global voice state management
│   ├── pages/
│   │   ├── greeting/
│   │   │   └── InitialGreeting.jsx # Welcome screen with name input
│   │   ├── puzzles/
│   │   │   ├── FirstPuzzle.jsx     # Pattern recognition puzzle 1
│   │   │   └── SecondPuzzle.jsx    # Pattern recognition puzzle 2
│   │   ├── scenarios/
│   │   │   ├── first/              # Scenario 1: Social media context
│   │   │   │   ├── FirstScenario.jsx
│   │   │   │   ├── MemoryExtraction.jsx
│   │   │   │   └── ResultPage.jsx
│   │   │   └── second/             # Scenario 2: Advanced privacy
│   │   │       ├── SecondScenario.jsx
│   │   │       ├── SecondScenarioPuzzle.jsx
│   │   │       ├── SecondScenarioMemory.jsx
│   │   │       └── SecondScenarioResult.jsx
│   │   └── FinalMessage.jsx        # Conclusion screen
│   ├── styles/
│   │   ├── common/                 # Common component styles
│   │   ├── pages/                  # Page-specific styles
│   │   └── puzzles/                # Puzzle-specific styles
│   ├── utils/
│   │   ├── puzzleConfig.js         # Puzzle configuration
│   │   └── useSpeech.js            # TTS custom hook
│   ├── App.jsx                     # Main routing
│   └── main.jsx                    # Entry point
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/nsoniuic/AI-Privacy-Literacy-Fall-2025.git

# Navigate to project directory
cd digital-privacy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Flow

1. **Initial Greeting** - Child enters their name and meets Robo (the AI)
2. **How AI Thinks (Puzzles)**
   - Puzzle 1: Learn pattern recognition through examples
   - Puzzle 2: Apply learned patterns independently
3. **Scenario 1** - Social media conversation demonstrating AI inference
4. **Scenario 2** - Advanced privacy concepts with additional puzzles
5. **Final Message** - Recap and privacy tips

## Recommended Display Sizes

- **Desktop**: 1400px+ (full side-by-side layout)
- **Laptop**: 1024px - 1400px (slightly condensed)
- **Tablet**: 768px - 1024px (adjusted sizing)

## 🤝 Contributing

This is an educational project. For suggestions or improvements, please open an issue or submit a pull request.

## 👥 Authors

University of Illinois Chicago (UIC)
Dr. Nikita Soni (HCI Assistant Professor)
Sean Kim (PHD Research Assistant)
Nathan Trinh (Undergraduate Research Assistant, Main Developer)