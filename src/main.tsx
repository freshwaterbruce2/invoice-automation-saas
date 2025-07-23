import React from 'react'
import ReactDOM from 'react-dom/client'
import { initSentry } from './services/sentry'
import { initAnalytics } from './hooks/useAnalytics'

import App from './App'

import './styles/global.css'

// Initialize monitoring and analytics
initSentry()
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)