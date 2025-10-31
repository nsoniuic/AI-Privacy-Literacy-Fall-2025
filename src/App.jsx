import { Routes, Route, Navigate } from 'react-router-dom'
import RobotGreeting from './pages/RobotGreeting'
import FirstPuzzle from './pages/FirstPuzzle'
import SecondPuzzle from './pages/SecondPuzzle'
import FirstScenario from './pages/FirstScenario'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RobotGreeting />} />
      <Route path="/puzzle" element={<FirstPuzzle />} />
      <Route path="/second_puzzle" element={<SecondPuzzle />} />
      <Route path="/first_scenario" element={<FirstScenario />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App