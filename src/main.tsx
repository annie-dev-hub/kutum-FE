/**
 * ========================================
 * KUTUM - Application Entry Point
 * ========================================
 * 
 * This is the main entry file for the React application
 * Sets up the root component and React Router
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css' // Global styles (Tailwind CSS)

/**
 * Initialize React application
 * 
 * - React.StrictMode: Helps identify potential problems in development
 * - BrowserRouter: Enables client-side routing
 * - App: Main application component with all routes and features
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Router wrapper enables navigation without page reloads */}
    <BrowserRouter>
      <App /> {/* Main app with AI chatbot, document scanner, and all features */}
    </BrowserRouter>
  </React.StrictMode>,
)

