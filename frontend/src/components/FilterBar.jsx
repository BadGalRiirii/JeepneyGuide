import { TERMINALS } from '../data/routes'

const TERMINAL_FILTERS = [
  { id: 'all', label: 'All', color: 'text-white/70', activeBg: 'bg-white/10', activeBorder: 'border-white/20' },
  ...Object.values(TERMINALS).map((t) => ({
    id: t.id,
    label: t.short,
    color: t.text,
    activeBg: t.bg,
    activeBorder: t.border,
  })),
]

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TERMINAL_FILTERS.map((f) => {
        const isActive = activeFilter === f.id
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-150 ${
              isActive
                ? `${f.activeBg} ${f.color} ${f.activeBorder}`
                : 'bg-transparent border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
