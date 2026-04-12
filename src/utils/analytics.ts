// Analytics — typed PostHog event wrappers.
// Call these functions instead of posthog.capture() directly anywhere else in the codebase.
// PostHog EU cloud (eu.i.posthog.com) is the only analytics endpoint; no other network
// requests are added by this file.
//
// GDPR note: persistence='memory' (no cookies/localStorage) + autocapture=false.
// IP capture is disabled in PostHog project settings ("Discard client IP data").

import posthog from 'posthog-js'

export function trackLayoutSelect(layout: string): void {
  posthog.capture('layout_select', { layout })
}

export function trackVariantSelect(variant: string): void {
  posthog.capture('variant_select', { variant })
}

export function trackColorModeToggle(mode: string): void {
  posthog.capture('color_mode_toggle', { mode })
}

export function trackExportCopy(format: string): void {
  posthog.capture('export_copy', { format })
}

export function trackExportDownload(format: string): void {
  posthog.capture('export_download', { format })
}

export function trackShareCopy(): void {
  posthog.capture('share_copy')
}

export function trackRandomize(): void {
  posthog.capture('randomize')
}

export function trackTutorialSkip(atStep: number): void {
  posthog.capture('tutorial_skip', { at_step: atStep })
}

export function trackTutorialComplete(): void {
  posthog.capture('tutorial_complete')
}
