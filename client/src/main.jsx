import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

if(!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is not defined')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
  