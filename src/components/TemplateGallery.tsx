import type { Theme } from '../types/theme'
import { TemplateCard } from './TemplateCard'

interface Props {
  themes: Theme[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TemplateGallery({ themes, selectedId, onSelect }: Props) {
  return (
    <div className="template-gallery" role="list">
      {themes.map(theme => (
        <div key={theme.id} role="listitem">
          <TemplateCard
            theme={theme}
            isSelected={theme.id === selectedId}
            onClick={() => onSelect(theme.id)}
          />
        </div>
      ))}
    </div>
  )
}
