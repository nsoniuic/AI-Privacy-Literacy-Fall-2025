import { Routes, Route, Navigate } from 'react-router-dom'
import RobotGreeting from './pages/RobotGreeting'
import ARCPuzzle from './pages/ARCPuzzle'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RobotGreeting />} />
      <Route path="/puzzle" element={<ARCPuzzle />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App