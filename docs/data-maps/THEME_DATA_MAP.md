# Theme — Data Map (Lite)

> **Last updated**: 2026-04-09
> **Tier**: 2 (Ship-Fast) — client-side only, stateless, no backend

---

## 1. Entity Schema

### Theme

The top-level entity. One Theme = one complete design system configuration.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| id | string | yes | static data file | Unique slug, e.g. `"modern-saas"` |
| name | string | yes | static data file | Display name, e.g. `"Modern SaaS"` |
| description | string | yes | static data file | 1-sentence description shown in gallery card |
| category | `"modern" \| "corporate" \| "dark" \| "glassmorphism"` | yes | static data file | Template category for filtering |
| colors | ColorPalette | yes | static / user tweaks | See ColorPalette below |
| typography | Typography | yes | static / user tweaks | See Typography below |
| spacing | SpacingScale | yes | static / user tweaks | See SpacingScale below |
| borderRadius | BorderRadius | yes | static / user tweaks | See BorderRadius below |

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

### ExportedDesignRules (output artifact — not stored)

Generated on demand when the user clicks Export. Never persisted.

| Field | Type | Notes |
|-------|------|-------|
| format | `"markdown" \| "json" \| "css"` | Chosen by user at export time |
| content | string | Generated string — the file content |
| fileName | string | `"design_rules.md"` / `"design_tokens.json"` / `"variables.css"` |

**Export field name conventions** (must match exactly across all formats):

| Token | Markdown key | JSON key | CSS variable |
|-------|-------------|----------|-------------|
| Primary color | `color_primary` | `color_primary` | `--color-primary` |
| Primary foreground | `color_primary_foreground` | `color_primary_foreground` | `--color-primary-foreground` |
| Background | `color_background` | `color_background` | `--color-background` |
| Surface | `color_surface` | `color_surface` | `--color-surface` |
| Text | `color_text` | `color_text` | `--color-text` |
| Text muted | `color_text_muted` | `color_text_muted` | `--color-text-muted` |
| Border | `color_border` | `color_border` | `--color-border` |
| Accent | `color_accent` | `color_accent` | `--color-accent` |
| Error | `color_error` | `color_error` | `--color-error` |
| Success | `color_success` | `color_success` | `--color-success` |
| Warning | `color_warning` | `color_warning` | `--color-warning` |
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

**Status**: Stateless — generated once on demand, never stored

---

## 2. API / Data Flow

No API. Fully client-side.

```
src/data/templates.ts (static array of Theme objects)
    ↓
App loads → TemplateGallery renders cards for each template
    ↓
User selects template → selectedTheme state updated (React useState)
    ↓
ThemePreview re-renders with new theme values (CSS vars injected into :root)
    ↓
User optionally tweaks a token value → local state updated, preview re-renders live
    ↓
User clicks Export → selects format (MD / JSON / CSS)
    ↓
exportTheme(theme, format) in src/utils/export.ts → generates content string
    ↓
Browser: new Blob([content]) → URL.createObjectURL → <a download> click → file saved
```

**Entry point**: `src/data/templates.ts` — add new templates here
**Export logic**: `src/utils/export.ts` — `exportTheme(theme: Theme, format: ExportFormat): string`
**Type definitions**: `src/types/theme.ts` — must match this data map exactly

**Error cases**:
| Scenario | Handling |
|----------|----------|
| Invalid hex color entered during tweak | Show inline validation error on the input; disable export button until resolved |
| Contrast ratio below WCAG AA | Show contrast warning badge on preview; do NOT block export |
| No template selected (initial state) | Export button is disabled; show "Select a template to export" tooltip |

---

## 3. Frontend Consumers

| Component / Hook | File | Fields Used | Notes |
|-----------------|------|-------------|-------|
| `TemplateGallery` | `src/components/TemplateGallery.tsx` | `id, name, description, category` | Shows grid of clickable template cards |
| `ThemePreview` | `src/components/ThemePreview.tsx` | All Theme fields | Injects tokens as CSS custom properties; renders live component examples |
| `ColorEditor` | `src/components/ColorEditor.tsx` | `colors.*` | Color picker inputs for tweaking palette |
| `TypographyEditor` | `src/components/TypographyEditor.tsx` | `typography.*` | Inputs for font family, sizes, weights |
| `SpacingEditor` | `src/components/SpacingEditor.tsx` | `spacing.*` | Slider/input controls for spacing scale |
| `BorderRadiusEditor` | `src/components/BorderRadiusEditor.tsx` | `borderRadius.*` | Slider/input controls for radius values |
| `ExportPanel` | `src/components/ExportPanel.tsx` | All Theme fields | Format selector + download trigger |
| `ContrastBadge` | `src/components/ContrastBadge.tsx` | `colors.primary, colors.primaryForeground` | Displays WCAG contrast ratio |
| `useTheme` | `src/hooks/useTheme.ts` | All Theme fields | Central state hook: selectedTheme, setTheme, tweakToken |

---

## Known Inconsistencies

None yet. This section will be populated as bugs are discovered.

| Issue | Severity | Status | Found | Notes |
|-------|----------|--------|-------|-------|
| — | — | — | — | — |
