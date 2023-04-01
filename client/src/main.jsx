import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

if(!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is not defined')
}

console.debug = () => {}

if(import.meta.env.mode === 'development') {
  console.warn('You are running the app in development mode')
  console.debug = console.log
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)