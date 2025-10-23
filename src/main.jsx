import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import RobotGreeting from './pages/RobotGreeting.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RobotGreeting />
  </StrictMode>,
)
