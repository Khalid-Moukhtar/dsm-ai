import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './styles/global.css'
import App from './App'

// PostHog analytics — EU cloud, cookieless, no autocapture.
// Public project token is safe to commit (write-only; cannot read data).
// IP capture is disabled in PostHog project settings ("Discard client IP data").
posthog.init('phc_Dhp7B4Xu57K2QCwDJ3D4Xxd7WZ2QKDfTeKCHY3L67PPt', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',        // no cookies, no localStorage — GDPR-safe
  autocapture: false,           // explicit events only; no blanket click capture
  capture_pageview: true,       // counts visits
  capture_pageleave: false,
})

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
