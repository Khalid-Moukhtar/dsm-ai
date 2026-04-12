import { useState } from 'react'
import { trackShareCopy } from '../utils/analytics'

interface ShareButtonProps {
  hasTheme: boolean
}

/** Copies the current URL (with encoded state in hash) to clipboard. */
export function ShareButton({ hasTheme }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  if (!hasTheme) return null

  function handleClick() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      trackShareCopy()
    }).catch(() => {
      // Clipboard write failed (insecure context, denied permission) — fail silently
    })
  }

  return (
    <button
      type="button"
      className="share-btn"
      onClick={handleClick}
      aria-label="Copy shareable link"
      title="Copy link to this theme"
    >
      {copied ? '✓ Copied!' : '⎘ Copy link'}
    </button>
  )
}
