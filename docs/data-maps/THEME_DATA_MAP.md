# Theme — Data Map (Lite)

> **Last updated**: 2026-04-10
> **Tier**: 2 (Ship-Fast) — client-side only, stateless, no backend

---

## 1. Entity Schema

### Theme

The top-level entity. One Theme = one complete design system configuration.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| id | string | yes | computed | Slug derived from `{layoutType}-{variant}-{colorMode}` |
| name | string | yes | computed / user override | e.g. `"Stripe — SaaS"` |
| description | string | yes | variant data | 1-sentence description |
| variant | `StyleVariant` | yes | user selection | **UI metadata — excluded from all export formats.** |
| colorMode | `"light" \| "dark"` | yes | user selection | **UI metadata — excluded from all export formats.** |
| layoutType | `"saas" \| "blog" \| "landing" \| "portfolio" \| "ecommerce" \| "docs" \| "community" \| "mobile"` | yes | user selection | **UI-routing only — excluded from all export formats.** Determines which layout component renders in the preview. |
| colors | ColorPalette | yes | variant / user tweaks | See ColorPalette below |
| typography | Typography | yes | variant / user tweaks | See Typography below |
| spacing | SpacingScale | yes | variant / user tweaks | See SpacingScale below |
| borderRadius | BorderRadius | yes | variant / user tweaks | See BorderRadius below |

---

### ColorPalette

Embedded in Theme. All values are hex strings (e.g. `"#6366F1"`).

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| primary | string (hex) | yes | template | Main brand color |
| primaryForeground | string (hex) | yes | template | Text/icons on primary — MUST pass WCAG AA (4.5:1) against `primary` |
| secondary | string (hex) | yes | template | Supporting brand color |
| secondaryForeground | string (hex) | yes | template | Text/icons on secondary — MUST pass WCAG AA against `secondary` |
| background | string (hex) | yes | template | Page/app background |
| surface | string (hex) | yes | template | Card, panel, and modal background |
| text | string (hex) | yes | template | Primary body text — MUST pass WCAG AA against `background` |
| textMuted | string (hex) | yes | template | Secondary / placeholder text |
| border | string (hex) | yes | template | Default border and divider color |
| accent | string (hex) | yes | template | Focus rings, highlights, interactive states |
| error | string (hex) | yes | template | Error state (e.g. `"#EF4444"`) |
| success | string (hex) | yes | template | Success state (e.g. `"#22C55E"`) |
| warning | string (hex) | yes | template | Warning state (e.g. `"#F59E0B"`) |
| focusRing | string (hex) | yes | template | Keyboard focus outline — WCAG 2.2 SC 3.3 requires 3:1 against adjacent color (NOT 4.5:1) |
| info | string (hex) | yes | template | Informational alerts/badges (e.g. `"#2563EB"`) |

---

### Typography

Embedded in Theme.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| fontFamily | string | yes | template | Full font stack, e.g. `"Inter, system-ui, sans-serif"` |
| fontSizeBase | string | yes | template | Base body size, e.g. `"16px"` |
| fontSizeSm | string | yes | template | Small text, e.g. `"14px"` |
| fontSizeLg | string | yes | template | Large text, e.g. `"18px"` |
| fontSizeXl | string | yes | template | Heading 3 size, e.g. `"20px"` |
| fontSize2xl | string | yes | template | Heading 2 size, e.g. `"24px"` |
| fontSize3xl | string | yes | template | Heading 1 size, e.g. `"30px"` |
| fontWeightNormal | number | yes | template | e.g. `400` |
| fontWeightMedium | number | yes | template | e.g. `500` |
| fontWeightBold | number | yes | template | e.g. `700` |
| lineHeightBase | number | yes | template | Unitless multiplier, e.g. `1.5` |
| letterSpacingBase | string | yes | template | e.g. `"0em"` — use `"-0.01em"` for tight headings |

---

### SpacingScale

Embedded in Theme. Values are CSS length strings.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| xs | string | yes | template | e.g. `"4px"` |
| sm | string | yes | template | e.g. `"8px"` |
| md | string | yes | template | e.g. `"16px"` |
| lg | string | yes | template | e.g. `"24px"` |
| xl | string | yes | template | e.g. `"32px"` |
| xxl | string | yes | template | e.g. `"48px"` |
| xxxl | string | yes | template | e.g. `"64px"` |

---

### BorderRadius

Embedded in Theme. Values are CSS length strings.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| none | string | yes | template | Always `"0px"` |
| sm | string | yes | template | e.g. `"4px"` |
| md | string | yes | template | e.g. `"8px"` — default for cards/inputs |
| lg | string | yes | template | e.g. `"12px"` |
| xl | string | yes | template | e.g. `"16px"` |
| full | string | yes | template | Always `"9999px"` — for pills/avatars |

---

### Shadow

Embedded in Theme. Values are CSS box-shadow strings.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| sm | string | yes | variant preset | Small shadow for hover states, e.g. `"0 1px 2px rgba(0,0,0,0.06)"` |
| md | string | yes | variant preset | Default card shadow, e.g. `"0 1px 4px rgba(0,0,0,0.08)"` |
| lg | string | yes | variant preset | Panel / modal shadow, e.g. `"0 4px 12px rgba(0,0,0,0.08)"` |
| xl | string | yes | variant preset | Overlay shadow, e.g. `"0 8px 24px rgba(0,0,0,0.08)"` |

Presets (Flat / Subtle / Elevated / Dramatic) are applied atomically via TokenEditor. Users cannot edit individual shadow values freeform.

---

### ExportedDesignRules (output artifact — not stored)

Generated on demand when the user clicks Export. Never persisted.

| Field | Type | Notes |
|-------|------|-------|
| format | `"markdown" \| "json" \| "css" \| "tailwind" \| "tailwind-v4"` | Chosen by user at export time |
| content | string | Generated string — the file content |
| fileName | string | `"design_rules.md"` / `"design_tokens.json"` / `"variables.css"` / `"tailwind.config.js"` / `"theme.css"` |

**Export field name conventions** (must match exactly across all formats):

| Token | Markdown key | JSON key | CSS variable |
|-------|-------------|----------|-------------|
| Primary color | `color_primary` | `color_primary` | `--color-primary` |
| Primary foreground | `color_primary_foreground` | `color_primary_foreground` | `--color-primary-foreground` |
| Secondary color | `color_secondary` | `color_secondary` | `--color-secondary` |
| Secondary foreground | `color_secondary_foreground` | `color_secondary_foreground` | `--color-secondary-foreground` |
| Background | `color_background` | `color_background` | `--color-background` |
| Surface | `color_surface` | `color_surface` | `--color-surface` |
| Text | `color_text` | `color_text` | `--color-text` |
| Text muted | `color_text_muted` | `color_text_muted` | `--color-text-muted` |
| Border | `color_border` | `color_border` | `--color-border` |
| Accent | `color_accent` | `color_accent` | `--color-accent` |
| Error | `color_error` | `color_error` | `--color-error` |
| Success | `color_success` | `color_success` | `--color-success` |
| Warning | `color_warning` | `color_warning` | `--color-warning` |
| Focus ring | `color_focus_ring` | `color_focus_ring` | `--color-focus-ring` |
| Info | `color_info` | `color_info` | `--color-info` |
| Font family | `font_family` | `font_family` | `--font-family` |
| Font size base | `font_size_base` | `font_size_base` | `--font-size-base` |
| Font size sm | `font_size_sm` | `font_size_sm` | `--font-size-sm` |
| Font size lg | `font_size_lg` | `font_size_lg` | `--font-size-lg` |
| Font size xl | `font_size_xl` | `font_size_xl` | `--font-size-xl` |
| Font size 2xl | `font_size_2xl` | `font_size_2xl` | `--font-size-2xl` |
| Font size 3xl | `font_size_3xl` | `font_size_3xl` | `--font-size-3xl` |
| Font weight normal | `font_weight_normal` | `font_weight_normal` | `--font-weight-normal` |
| Font weight medium | `font_weight_medium` | `font_weight_medium` | `--font-weight-medium` |
| Font weight bold | `font_weight_bold` | `font_weight_bold` | `--font-weight-bold` |
| Line height | `line_height_base` | `line_height_base` | `--line-height-base` |
| Letter spacing | `letter_spacing_base` | `letter_spacing_base` | `--letter-spacing-base` |
| Spacing xs | `spacing_xs` | `spacing_xs` | `--spacing-xs` |
| Spacing sm | `spacing_sm` | `spacing_sm` | `--spacing-sm` |
| Spacing md | `spacing_md` | `spacing_md` | `--spacing-md` |
| Spacing lg | `spacing_lg` | `spacing_lg` | `--spacing-lg` |
| Spacing xl | `spacing_xl` | `spacing_xl` | `--spacing-xl` |
| Spacing xxl | `spacing_xxl` | `spacing_xxl` | `--spacing-xxl` |
| Spacing xxxl | `spacing_xxxl` | `spacing_xxxl` | `--spacing-xxxl` |
| Border radius none | `border_radius_none` | `border_radius_none` | `--border-radius-none` |
| Border radius sm | `border_radius_sm` | `border_radius_sm` | `--border-radius-sm` |
| Border radius md | `border_radius_md` | `border_radius_md` | `--border-radius-md` |
| Border radius lg | `border_radius_lg` | `border_radius_lg` | `--border-radius-lg` |
| Border radius xl | `border_radius_xl` | `border_radius_xl` | `--border-radius-xl` |
| Border radius full | `border_radius_full` | `border_radius_full` | `--border-radius-full` |
| Shadow sm | `shadow_sm` | `shadow_sm` | `--shadow-sm` |
| Shadow md | `shadow_md` | `shadow_md` | `--shadow-md` |
| Shadow lg | `shadow_lg` | `shadow_lg` | `--shadow-lg` |
| Shadow xl | `shadow_xl` | `shadow_xl` | `--shadow-xl` |

> **Total exported tokens**: 44 (15 colors + 12 typography + 7 spacing + 6 radius + 4 shadows). The `toHaveLength(44)` test in `export.test.ts` enforces this.
> **Note**: `layoutType`, `variant`, and `colorMode` are intentionally excluded from all export formats — UI metadata only.
> **Note**: The Markdown export includes an attribution header (Generated by DSM). JSON, CSS, and Tailwind exports are format-pure — no header.
> **Note**: Two Tailwind export formats are supported: `tailwind` targets Tailwind CSS v3 (`module.exports`); `tailwind-v4` targets Tailwind CSS v4 (`@import "tailwindcss"; @theme { }` format, file: `theme.css`).

**Status**: Stateless — generated once on demand, never stored

---

## 2. API / Data Flow

No API. Fully client-side.

```
src/data/variants.ts (VARIANTS map: StyleVariant → VariantDefinition with light/dark palettes)
    ↓
App loads → VariantGallery renders 10 variant cards (stripe/linear/notion/vercel/airbnb/apple/spotify/shopify/github/custom)
    ↓
User picks Layout Type → Style Variant → Light/Dark toggle
    ↓
useTheme hook: computeTheme(layoutType, variant, colorMode, overrides) → Theme object
    ↓
LayoutPreview re-renders: injects all CSS custom properties into scoped container
    → dispatches to correct layout component based on theme.layoutType
    → OR renders SystemTokensView (Tokens tab) showing all semantic tokens in UI context
    ↓
User tweaks a token in TokenEditor → updateSection() called → overrides updated
    → Theme recomputed → LayoutPreview re-renders live
    ↓
User clicks Export → selects format (MD / JSON / CSS / TW v3 / TW v4) in ExportPreview
    ↓
exportTheme(theme, format) in src/utils/export.ts → generates content string
    ↓
Browser: new Blob([content]) → URL.createObjectURL → <a download> click → file saved
```

**Variant data**: `src/data/variants.ts` — add new variants here
**Export logic**: `src/utils/export.ts` — `exportTheme(theme: Theme, format: ExportFormat): string`
**Type definitions**: `src/types/theme.ts` — must match this data map exactly

**Error cases**:
| Scenario | Handling |
|----------|----------|
| Invalid value entered in TokenEditor | Inline validation error on input; revert to last valid value on blur; invalid values never enter state |
| Contrast ratio below WCAG AA | Show contrast warning badge in TokenEditor Colors section; do NOT block export |
| No template selected (initial state) | Workspace (LayoutPreview + TokenEditor + ExportPreview) hidden; only gallery strip shown |

---

## 3. Frontend Consumers

| Component / Hook | File | Fields Used | Notes |
|-----------------|------|-------------|-------|
| `LayoutPreview` | `src/components/LayoutPreview.tsx` | All token fields + `layoutType` | Injects tokens as CSS custom properties; dispatches to correct layout component; hosts Layout/Tokens view toggle |
| `SystemTokensView` | `src/components/SystemTokensView.tsx` | `theme` prop (all fields) | Universal token reference panel — shows all semantic tokens in actual UI context; uses CSS vars for live updates and theme prop for spec values |
| `ComponentsView` | `src/components/ComponentsView.tsx` | `theme` prop (theme.name for heading) | Component preview tab — Buttons / Inputs / Cards / Badges (incl. info) / Alerts / Focus ring demo; all use CSS vars |
| `ShareButton` | `src/components/ShareButton.tsx` | `hasTheme: boolean` | Copies shareable URL (base64 URL hash) to clipboard; only renders when a theme is selected |
| `SaasLayout` | `src/components/layouts/SaasLayout.tsx` | CSS vars via container | Renders polished SaaS dashboard mockup |
| `BlogLayout` | `src/components/layouts/BlogLayout.tsx` | CSS vars via container | Renders polished blog/content site mockup |
| `LandingLayout` | `src/components/layouts/LandingLayout.tsx` | CSS vars via container | Renders polished landing page mockup |
| `PortfolioLayout` | `src/components/layouts/PortfolioLayout.tsx` | CSS vars via container | Renders polished portfolio site mockup |
| `EcommerceLayout` | `src/components/layouts/EcommerceLayout.tsx` | CSS vars via container | Renders polished ecommerce store mockup |
| `DocsLayout` | `src/components/layouts/DocsLayout.tsx` | CSS vars via container | Renders polished documentation site mockup |
| `CommunityLayout` | `src/components/layouts/CommunityLayout.tsx` | CSS vars via container | Renders polished community/forum mockup |
| `MobileLayout` | `src/components/layouts/MobileLayout.tsx` | CSS vars via container | Renders polished mobile app mockup |
| `TokenEditor` | `src/components/TokenEditor.tsx` | All token fields (read + mutate) | Semantic controls only (color pickers, presets, sliders — no raw CSS inputs); calls `updateSection`; shows WCAG contrast badges |
| `ExportPreview` | `src/components/ExportPreview.tsx` | All token fields (read) | Shows export file content inline; triggers download. On markdown tab: shows "Now what?" post-export guidance panel with copy-paste AI agent prompt. |
| `useTheme` | `src/hooks/useTheme.ts` | All Theme fields | Central state hook: `selectedTheme`, `setLayoutType`, `setVariant`, `setColorMode`, `updateSection`, `resetToVariant`, `exportTheme` |

---

## Known Inconsistencies

| Issue | Severity | Status | Found | Notes |
|-------|----------|--------|-------|-------|
| `layoutType`, `variant`, `colorMode` exist in Theme type but are excluded from all export formats | intentional | by design | 2026-04-09 | UI metadata only. The `toHaveLength(44)` test in `export.test.ts` enforces this — do not add any of these to `toJson()`. |
| Markdown export has attribution header + AI Instructions section + per-section usage descriptions; JSON, CSS, and Tailwind exports do not | intentional | by design | 2026-04-09 | MD is the AI-prompt format; other formats are format-pure. |
| URL sharing only preserves color overrides (not typography/spacing/radius/shadow overrides) | intentional | by design | 2026-04-10 | Non-color overrides are complex to validate safely in URL state. Colors are the primary sharing motivation. |

---

## Token Visualization Patterns (SystemTokensView)

Reference: Carbon Design System, Material 3, USWDS, Atlassian.

| Token group | Visualization technique | Key insight |
|-------------|------------------------|-------------|
| Colors | 40×40px swatch squares | All 15 semantic colors shown including focusRing/info/error/success/warning |
| Buttons | Live button elements | Primary / Secondary / Outline / Ghost / Disabled |
| Status | Bordered alert boxes | Error/Success/Warning with colored left-border + icon |
| Badges | Pill badges | All semantic colors as solid badges |
| Form states | Three input variants | Default / Error (red border) / Success (green border) |
| Typography | Text sample per step + spec strip | Shows `{size} · {weight}` beside sample. Body row renders **two lines** so `lineHeightBase` is visible. |
| Font weights | Same glyph (Ag) at all 3 weights | Normal / Medium / Bold side-by-side makes weight differences obvious |
| Letter spacing | Uppercase ABCDEF sample | Caps make tracking differences perceptible |
| Spacing | Proportional bars | `width: var(--spacing-{token})` reads live CSS var — bars resize instantly when Density slider moves |
| Surfaces | Background + Surface panels | Each with a nested card using the opposite surface color |
| Border radius | Same box at all 6 radius values | None / sm / md / lg / xl / Full shapes shown together |
