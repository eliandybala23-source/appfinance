import React from 'react'
import { Category } from '../db/db'
import {
  Utensils,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Banknote,
  MoreHorizontal,
  Tag
} from 'lucide-react'

interface CategoryPickerProps {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Banknote,
  MoreHorizontal
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedId,
  onSelect
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Categoria
        </label>
        <span className="text-[11px] text-slate-500">Deslize para ver mais</span>
      </div>

      {/* Carrossel suave com snap scroll e sem quebrar layout em telas pequenas */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x">
        {categories.map((cat) => {
          const IconComponent = (cat.icon && ICON_MAP[cat.icon]) || Tag
          const isSelected = selectedId === cat.id

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => cat.id && onSelect(cat.id)}
              className={`snap-start shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 border ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-900/30'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                  cat.color || 'bg-slate-600'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
