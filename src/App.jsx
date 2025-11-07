import { Routes, Route, Navigate } from 'react-router-dom'
import RobotGreeting from './pages/RobotGreeting'
import FirstPuzzle from './pages/FirstPuzzle'
import SecondPuzzle from './pages/SecondPuzzle'
import FirstScenario from './pages/FirstScenario'
import MemoryExtraction from './pages/MemoryExtraction'
import ResultPage from './pages/ResultPage'
import SecondScenario from './pages/SecondScenario'
import SecondScenarioPuzzle from './pages/SecondScenarioPuzzle'
import SecondScenarioMemory from './pages/SecondScenarioMemory'
import SecondScenarioResult from './pages/SecondScenarioResult'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RobotGreeting />} />
      <Route path="/puzzle/first" element={<FirstPuzzle />} />
      <Route path="/puzzle/second" element={<SecondPuzzle />} />
      <Route path="/first_scenario/talk" element={<FirstScenario />} />
      <Route path="/first_scenario/memory" element={<MemoryExtraction />} />
      <Route path="/first_scenario/result" element={<ResultPage />} />
      <Route path="/second_scenario/talk" element={<SecondScenario />} />
      <Route path="/second_scenario/puzzle" element={<SecondScenarioPuzzle />} />
      <Route path="/second_scenario/memory" element={<SecondScenarioMemory />} />
      <Route path="/second_scenario/result" element={<SecondScenarioResult />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App