import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme, type CSSVariablesResolver } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import App from './App.tsx'
import { LanguageProvider } from './LanguageContext.tsx'

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colors: {
    teal: [
      '#e6fff9', '#b3ffe8', '#66ffc8', '#00f5a0',
      '#00e691', '#00cc80', '#00b36e', '#009960',
      '#007a4d', '#00523a',
    ],
    dark: [
      '#c9c9d4', '#a8a8b8', '#88889a', '#66667c',
      '#3d3d52', '#2a2a3d', '#1e1e2e', '#16162a',
      '#0f0f1e', '#0a0a14',
    ],
  },
})

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {
    '--mantine-color-body': '#0f0f1e',
    '--mantine-color-default-border': '#2a2a4a',
    '--mantine-color-dark-6': '#1e1e2e',
    '--mantine-color-dark-7': '#16162a',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
      <Notifications position="top-center" />
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MantineProvider>
  </StrictMode>,
)
