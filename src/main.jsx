import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './skeleton.css'
import App from './App.jsx'
import { loadSavedTheme } from './utils/theme.js'

loadSavedTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
