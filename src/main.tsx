import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './styles/global.css'
import App from './App'

// PostHog analytics — EU cloud, cookieless, no autocapture.
// Token and host are read from VITE_PUBLIC_POSTHOG_KEY / VITE_PUBLIC_POSTHOG_HOST.
// IP capture is disabled in PostHog project settings ("Discard client IP data").
posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string,
  persistence: 'memory',        // no cookies, no localStorage — GDPR-safe
  autocapture: false,           // explicit events only; no blanket click capture
  capture_pageview: true,       // counts visits
  capture_pageleave: false,
})
posthog.register({ app: 'motif' })

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
