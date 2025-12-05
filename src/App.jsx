import { Routes, Route, Navigate } from 'react-router-dom'
import InitialGreeting from './pages/greeting/InitialGreeting'
import FirstPuzzle from './pages/puzzles/FirstPuzzle'
import SecondPuzzle from './pages/puzzles/SecondPuzzle'
import FirstScenario from './pages/scenarios/first/FirstScenario'
import MemoryExtraction from './pages/scenarios/first/MemoryExtraction'
import ResultPage from './pages/scenarios/first/ResultPage'
import SecondScenario from './pages/scenarios/second/SecondScenario'
import SecondScenarioPuzzle from './pages/scenarios/second/SecondScenarioPuzzle'
import SecondScenarioMemory from './pages/scenarios/second/SecondScenarioMemory'
import SecondScenarioResult from './pages/scenarios/second/SecondScenarioResult'
import FinalMessage from './pages/FinalMessage'
import ProgressIndicator from './components/common/ProgressIndicator'
import VoiceToggle from './components/common/VoiceToggle'
import { useClickLogger } from './hooks/useClickLogger'
import { usePageTimeLogger } from './hooks/usePageTimeLogger'
import './App.css'
import './styles/common/VoiceToggle.css'

function App() {
  useClickLogger();
  usePageTimeLogger();

  return (
    <>
      <ProgressIndicator />
      <VoiceToggle />
      <Routes>
      <Route path="/" element={<InitialGreeting />} />
      <Route path="/puzzle/first" element={<FirstPuzzle />} />
      <Route path="/puzzle/second" element={<SecondPuzzle />} />
      <Route path="/first_scenario/talk" element={<FirstScenario />} />
      <Route path="/first_scenario/memory" element={<MemoryExtraction />} />
      <Route path="/first_scenario/result" element={<ResultPage />} />
      <Route path="/second_scenario/talk" element={<SecondScenario />} />
      <Route path="/second_scenario/puzzle" element={<SecondScenarioPuzzle />} />
      <Route path="/second_scenario/memory" element={<SecondScenarioMemory />} />
      <Route path="/second_scenario/result" element={<SecondScenarioResult />} />
      <Route path="/final_screen" element={<FinalMessage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App
