import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/App.css'
import './css/MobileEmbed.css'
import { App } from './App.tsx'
import { MobileShell } from './components/mobile-shell'
import { isEmbedded, isMobileDevice, setupEmbeddedCanvas } from './utils/mobileViewport'

// No celular, a página só abre a moldura; o jogo de verdade roda no iframe dela.
const showMobileShell = isMobileDevice() && !isEmbedded()
if (isEmbedded()) setupEmbeddedCanvas()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showMobileShell ? <MobileShell /> : <App />}
  </StrictMode>,
)
