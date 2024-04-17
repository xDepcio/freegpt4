import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Chat from './components/chat.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>

      {/* <App /> */}
      <Chat />
    </ThemeProvider>
  </React.StrictMode>,
)
