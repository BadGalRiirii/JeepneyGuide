import { useState, useMemo } from 'react'
import { ArrowRightLeft, Search, Clock, MapPin } from 'lucide-react'
import { ALL_STOPS, findRoutes } from '../utils/routing'
import { TERMINALS } from '../data/routes'

export default function GetMeThere({ onRouteSelect }) {
  const [from, setFrom]         = useState('')
  const [to, setTo]             = useState('')
  const [result, setResult]     = useState(null)
  const [searched, setSearched] = useState(false)

  function resolve(val) {
    const lower = val.trim().toLowerCase()
    return ALL_STOPS.find(s => s.toLowerCase() === lower)
      ?? ALL_STOPS.find(s => s.toLowerCase().startsWith(lower))
      ?? val.trim()
  }

  function handleSearch() {
    setResult(findRoutes(resolve(from), resolve(to)))
    setSearched(true)
  }

  function swap() { setFrom(to); setTo(from); setResult(null); setSearched(false) }
  function clear() { setFrom(''); setTo(''); setResult(null); setSearched(false) }

  const canSearch = from.trim().length > 1 && to.trim().length > 1

  return (
    <div className="flex flex-col gap-3 px-3 py-2">

      {/* Inputs */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400/70 pointer-events-none select-none w-10">
            FROM
          </span>
          <input
            list="gmt-from-list"
            value={from}
            onChange={e => { setFrom(e.target.value); setResult(null); setSearched(false) }}
            placeholder="e.g. Bulua, Lumbia, Bayabas…"
            className="w-full bg-th-glass border border-th-border rounded-xl pl-14 pr-4 h-11 text-sm text-th-text placeholder-th-text3 focus:outline-none focus:border-emerald-500/50 focus:bg-th-glassh transition-all"
          />
          <datalist id="gmt-from-list">
            {ALL_STOPS.filter(s => s.toLowerCase().includes(from.toLowerCase()) && s !== to)
              .slice(0, 30).map(s => <option key={s} value={s} />)}
          </datalist>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-th-bord2" />
          <button
            onClick={swap}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-th-glass hover:bg-th-glassh active:scale-90 border border-th-border transition-all"
            title="Swap from/to"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-th-text2" />
          </button>
          <div className="flex-1 h-px bg-th-bord2" />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400/70 pointer-events-none select-none w-6">
            TO
          </span>
          <input
            list="gmt-to-list"
            value={to}
            onChange={e => { setTo(e.target.value); setResult(null); setSearched(false) }}
            placeholder="e.g. Cogon, Xavier University…"
            className="w-full bg-th-glass border border-th-border rounded-xl pl-9 pr-4 h-11 text-sm text-th-text placeholder-th-text3 focus:outline-none focus:border-amber-500/50 focus:bg-th-glassh transition-all"
          />
          <datalist id="gmt-to-list">
            {ALL_STOPS.filter(s => s.toLowerCase().includes(to.toLowerCase()) && s !== from)
              .slice(0, 30).map(s => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={!canSearch}
        className="h-11 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-35 disabled:cursor-not-allowed text-black font-black text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" />
        Find Route
      </button>

      {/* No result */}
      {searched && !result && (
        <div className="text-center py-5">
          <div className="text-2xl mb-2">😕</div>
          <p className="text-th-text2 text-sm font-medium">No route found</p>
          <p className="text-th-text3 text-[11px] mt-1 leading-relaxed">
            Try using a terminal name as the destination<br />(e.g. "Cogon", "Carmen")
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-th-text3 uppercase tracking-widest font-bold">
              {result.type === 'direct' ? 'Direct' : '1 Transfer'} · {result.options.length} option{result.options.length !== 1 ? 's' : ''}
            </p>
            <button onClick={clear} className="text-[10px] text-th-text3 hover:text-th-text2 transition-colors">
              Clear
            </button>
          </div>
          {result.options.map((opt, i) => (
            <ResultCard key={i} option={opt} onSelect={onRouteSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function ResultCard({ option, onSelect }) {
  if (option.type === 'direct') {
    const t    = TERMINALS[option.route.terminal]
    const code = option.route.variantCode || option.route.routeNumber
    return (
      <button
        onClick={() => onSelect(option.route)}
        className="w-full text-left p-3 rounded-2xl bg-th-glass border border-th-border hover:bg-th-glassh active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 ${t.bg} ${t.text}`}>
            {code}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-th-text text-sm leading-snug">{option.route.name}</div>
            <div className={`text-xs mt-0.5 ${t.text} opacity-80`}>→ {t.short}</div>
            <div className="text-[11px] text-th-text3 mt-0.5">{option.distanceKm.toFixed(1)} km</div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-amber-500 font-black text-base">₱{option.fare}</div>
            <div className="text-th-text2 text-[11px] flex items-center gap-0.5 justify-end mt-0.5">
              <Clock className="w-3 h-3" />{option.time} min
            </div>
          </div>
        </div>
      </button>
    )
  }

  const t1 = TERMINALS[option.route1.terminal]
  const t2 = TERMINALS[option.route2.terminal]
  const c1 = option.route1.variantCode || option.route1.routeNumber
  const c2 = option.route2.variantCode || option.route2.routeNumber

  return (
    <button
      onClick={() => onSelect(option.route1)}
      className="w-full text-left p-3 rounded-2xl bg-th-glass border border-th-border hover:bg-th-glassh active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${t1.bg} ${t1.text}`}>
          {c1}
        </div>
        <div className="flex-1 min-w-0 text-center">
          <div className="text-th-text3 text-[10px] uppercase tracking-widest">transfer at</div>
          <div className="text-th-text text-xs font-semibold truncate">{option.transferStop}</div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${t2.bg} ${t2.text}`}>
          {c2}
        </div>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div className="text-[11px] text-th-text2 leading-snug flex-1 min-w-0 pr-2 truncate">
          {option.route1.name} → {option.route2.name}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-amber-500 font-black text-base">₱{option.fare}</div>
          <div className="text-th-text2 text-[11px] flex items-center gap-0.5 justify-end">
            <Clock className="w-3 h-3" />{option.time} min
          </div>
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-th-text3">
        <MapPin className="w-3 h-3 flex-shrink-0" />
        Tap to view {option.route1.name} on map
      </div>
    </button>
  )
}
