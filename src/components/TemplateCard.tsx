import type { Theme } from '../types/theme'

interface Props {
  theme: Theme
  isSelected: boolean
  onClick: () => void
}

const SWATCH_KEYS: (keyof Theme['colors'])[] = [
  'primary',
  'background',
  'surface',
  'text',
  'accent',
]

const CATEGORY_LABELS: Record<Theme['category'], string> = {
  modern: 'Modern',
  corporate: 'Corporate',
  dark: 'Dark',
  glassmorphism: 'Glass',
}

export function TemplateCard({ theme, isSelected, onClick }: Props) {
  return (
    <button
      className={`template-card${isSelected ? ' template-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`${theme.name} template — ${theme.description}`}
    >
      <div className="template-card__swatches" aria-hidden="true">
        {SWATCH_KEYS.map(key => (
          <span
            key={key}
            className="template-card__swatch"
            style={{ backgroundColor: theme.colors[key] }}
          />
        ))}
      </div>
      <p className="template-card__name">{theme.name}</p>
      <p className="template-card__desc">{theme.description}</p>
      <span className="template-card__badge">{CATEGORY_LABELS[theme.category]}</span>
    </button>
  )
}
