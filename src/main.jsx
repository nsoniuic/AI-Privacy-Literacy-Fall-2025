import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VoiceProvider } from './contexts/VoiceContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VoiceProvider>
        <App />
      </VoiceProvider>
    </BrowserRouter>
  </StrictMode>,
)