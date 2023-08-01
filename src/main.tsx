import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import TableriseProvider from './context/TableriseProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TableriseProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    </BrowserRouter>
  </TableriseProvider>
);
