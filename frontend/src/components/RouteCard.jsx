import { TERMINALS } from '../data/routes'

export default function RouteCard({ route, selected, nearby, onClick }) {
  const terminal = TERMINALS[route.terminal]
  const code     = route.variantCode || route.routeNumber

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-2xl transition-all active:scale-[0.98] ${
        selected
          ? 'bg-white/10 border border-white/20'
          : 'hover:bg-white/5 active:bg-white/8 border border-transparent'
      }`}
      style={{ minHeight: 64 }}
    >
      {/* Code badge — matches what's displayed on the actual jeepney */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-base leading-none ${terminal.bg} ${terminal.text}`}
      >
        {code}
      </div>

      {/* Route info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-white text-[15px] leading-snug truncate">
            {route.name}
          </span>
          {nearby && (
            <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
              Nearby
            </span>
          )}
        </div>
        <div className={`text-xs font-medium mt-0.5 truncate ${terminal.text} opacity-75`}>
          → {terminal.short}
        </div>
      </div>

      {selected && (
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: terminal.color }} />
      )}
    </button>
  )
}
