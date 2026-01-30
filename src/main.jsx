import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VoiceProvider } from './contexts/VoiceContext'
import { ScreenCounterProvider } from './contexts/ScreenCounterContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VoiceProvider>
        <ScreenCounterProvider>
          <App />
        </ScreenCounterProvider>
      </VoiceProvider>
    </BrowserRouter>
  </StrictMode>,
)