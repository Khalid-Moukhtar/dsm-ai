// Gallery of 8 layout type cards — user picks what they're building.
// Replaces the old TemplateGallery which showed flat Theme cards.

import type { LayoutType } from '../types/theme'
import { LAYOUT_TYPES, LAYOUT_TYPE_META } from '../data/variants'

interface Props {
  selectedLayoutType: LayoutType | null
  onSelect: (layout: LayoutType) => void
}

export function LayoutGallery({ selectedLayoutType, onSelect }: Props) {
  return (
    <div className="layout-gallery" role="list">
      {LAYOUT_TYPES.map(layout => {
        const meta = LAYOUT_TYPE_META[layout]
        const isSelected = layout === selectedLayoutType
        return (
          <div key={layout} role="listitem">
            <button
              className={`layout-card${isSelected ? ' layout-card--selected' : ''}`}
              onClick={() => onSelect(layout)}
              aria-pressed={isSelected}
              aria-label={`${meta.label} — ${meta.description}`}
            >
              <span className="layout-card__symbol" aria-hidden="true">{meta.symbol}</span>
              <p className="layout-card__name">{meta.label}</p>
              <p className="layout-card__desc">{meta.description}</p>
            </button>
          </div>
        )
      })}
    </div>
  )
}
