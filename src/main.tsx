import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

import { App } from './App'

const rootEl = document.getElementById('root')

if (!rootEl) {
  throw new Error('Root element not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>
)
