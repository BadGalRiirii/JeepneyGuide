import { useState, useMemo, useCallback, useRef } from 'react'
import { Search, Bus, X, MapPin, ChevronUp, ArrowLeft, Navigation, Route } from 'lucide-react'
import { routes, searchRoutes, TERMINALS } from '../data/routes'
import { COORDS } from '../data/coordinates'
import { getRouteDistanceKm, calcFare, calcTime } from '../utils/routing'
import RouteCard from '../components/RouteCard'
import CDOMap from '../components/CDOMap'
import GetMeThere from '../components/GetMeThere'
import { ThemeToggle } from '../contexts/ThemeContext'

function dist([lat1, lng1], [lat2, lng2]) {
  const R  = 6371000
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180
  const a  = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function nearestStopDist(route, userLoc) {
  return Math.min(
    ...route.areas.map(a => COORDS[a]).filter(Boolean).map(c => dist(c, userLoc))
  )
}

const FILTERS = [
  { id: 'all',       label: 'All',       color: null,
    active: 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-white/15 dark:text-white dark:border-white/25' },
  { id: 'cogon',     label: 'Cogon',     color: '#3b82f6',
    active: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40' },
  { id: 'carmen',    label: 'Carmen',    color: '#10b981',
    active: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40' },
  { id: 'limketkai', label: 'Limketkai', color: '#8b5cf6',
    active: 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/40' },
  { id: 'gaisano',   label: 'Gaisano',   color: '#f59e0b',
    active: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40' },
  { id: 'wbtpm',     label: 'WBTPM',     color: '#ef4444',
    active: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40' },
  { id: 'agora',     label: 'Agora',     color: '#06b6d4',
    active: 'bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/40' },
]

const PEEK_DEFAULT  = 220
const PEEK_SELECTED = 290

export default function Home() {
  const [tab,          setTab]          = useState('browse')
  const [query,        setQuery]        = useState('')
  const [filter,       setFilter]       = useState('all')
  const [selected,     setSelected]     = useState(null)
  const [expanded,     setExpanded]     = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locating,     setLocating]     = useState(false)

  const dragStartY = useRef(null)

  const filtered = useMemo(() => {
    let list = query.trim() ? searchRoutes(query) : routes
    if (filter !== 'all') list = list.filter(r => r.terminal === filter)
    if (userLocation) {
      list = [...list].sort((a, b) => nearestStopDist(a, userLocation) - nearestStopDist(b, userLocation))
    }
    return list
  }, [query, filter, userLocation])

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setLocating(false)
        setSelected(null)
        setExpanded(true)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const handleSelect = useCallback(route => {
    setSelected(prev => (prev?.id === route.id ? null : route))
    setExpanded(false)
    setTab('browse')
  }, [])

  const clearSelection = () => { setSelected(null); setExpanded(false) }
  const clearQuery     = () => { setQuery(''); setExpanded(false) }

  const onTouchStart = e => { dragStartY.current = e.touches[0].clientY }
  const onTouchEnd   = e => {
    if (dragStartY.current === null) return
    const delta = dragStartY.current - e.changedTouches[0].clientY
    if (Math.abs(delta) > 30) setExpanded(delta > 0)
    dragStartY.current = null
  }

  const peek     = selected ? PEEK_SELECTED : PEEK_DEFAULT
  const terminal = selected ? TERMINALS[selected.terminal] : null

  const routeKm   = selected ? getRouteDistanceKm(selected.id) : 0
  const routeFare = selected ? calcFare(routeKm) : 0
  const routeTime = selected ? calcTime(routeKm) : 0

  const inactiveChip = 'bg-th-glass text-th-text2 border-th-border hover:text-th-text active:bg-th-glassh'

  function TabBar({ className = '' }) {
    return (
      <div className={`flex gap-1 p-1 bg-th-glass rounded-xl ${className}`}>
        <button
          onClick={() => setTab('browse')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'browse' ? 'bg-th-glassh text-th-text' : 'text-th-text3 hover:text-th-text2'
          }`}
        >
          <Bus className="w-3.5 h-3.5" /> Browse
        </button>
        <button
          onClick={() => setTab('get')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'get'
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
              : 'text-th-text3 hover:text-th-text2'
          }`}
        >
          <Route className="w-3.5 h-3.5" /> Get Me There
        </button>
      </div>
    )
  }

  function FilterChips({ onClick: onChipClick, size = 'sm' }) {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => onChipClick(f.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full font-semibold border transition-all
              ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
              ${filter === f.id ? f.active : inactiveChip}`}
          >
            {f.color && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />}
            {f.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden relative bg-th-bg">

      {/* ═══════════════════════ DESKTOP ════════════════════════ */}
      <div className="hidden md:flex h-screen">

        {/* Sidebar */}
        <aside className="flex flex-col w-80 lg:w-96 h-full border-r border-th-bord2 bg-th-surface flex-shrink-0 z-10 shadow-sm">

          {/* Brand */}
          <div className="flex items-center gap-2 px-4 h-14 border-b border-th-bord2 flex-shrink-0">
            <Bus className="w-5 h-5 text-amber-500" />
            <span className="font-black text-th-text text-lg tracking-tight">SakayKo</span>
            <span className="text-th-text3 text-xs ml-1">CDO</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Tab bar */}
          <div className="px-3 py-2 border-b border-th-bord2 flex-shrink-0">
            <TabBar />
          </div>

          {/* ── Browse tab ── */}
          {tab === 'browse' && (
            <>
              {/* Search + Near Me */}
              <div className="px-3 py-2.5 flex-shrink-0 border-b border-th-bord2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-text3 pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Area, barangay, or code…"
                      className="w-full bg-th-glass border border-th-border rounded-xl pl-9 pr-8 h-10 text-sm text-th-text placeholder-th-text3 focus:outline-none focus:border-amber-500/50 focus:bg-th-glassh transition-all"
                    />
                    {query && (
                      <button onClick={clearQuery} className="absolute right-3 top-1/2 -translate-y-1/2 text-th-text3 hover:text-th-text2">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={locateMe}
                    disabled={locating}
                    title="Sort routes by my location"
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      userLocation
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-500/40'
                        : 'bg-th-glass text-th-text2 border-th-border hover:border-th-border hover:text-th-text'
                    }`}
                  >
                    <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {userLocation && (
                  <p className="text-[10px] text-blue-600 dark:text-blue-400/70 mt-1.5 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Sorted by distance from your location
                  </p>
                )}
              </div>

              {/* Terminal filters */}
              <div className="px-3 pt-2 pb-1.5 flex-shrink-0 border-b border-th-bord2" style={{ scrollbarWidth: 'none' }}>
                <FilterChips onClick={id => setFilter(id)} size="sm" />
              </div>

              {/* Selected route strip */}
              {selected && terminal && (
                <div className="mx-3 mt-2 mb-1 p-3 rounded-xl bg-th-glass border border-th-border flex-shrink-0">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${terminal.bg} ${terminal.text}`}>
                      {selected.variantCode || selected.routeNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-th-text text-sm leading-snug">{selected.name}</div>
                      <div className="text-[11px] text-th-text3 mt-0.5 truncate">{selected.areas.join(' › ')}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-500 font-black text-sm">₱{routeFare}</span>
                        <span className="text-th-text2 text-[11px]">~{routeTime} min</span>
                        <span className="text-th-text3 text-[11px]">{routeKm.toFixed(1)} km</span>
                      </div>
                      {selected.tip && (
                        <div className="text-[11px] text-amber-600 dark:text-amber-300/70 mt-1 leading-snug">💡 {selected.tip}</div>
                      )}
                    </div>
                    <button onClick={clearSelection} className="text-th-text3 hover:text-th-text2 flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Route list */}
              <div className="flex-1 overflow-y-auto px-2 py-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-th-text2 text-sm font-medium">No routes for "{query}"</p>
                    <p className="text-th-text3 text-xs mt-1.5 leading-relaxed">Try a barangay name or terminal like "Cogon"</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filtered.map(route => (
                      <RouteCard
                        key={route.id}
                        route={route}
                        selected={selected?.id === route.id}
                        nearby={userLocation && nearestStopDist(route, userLocation) < 800}
                        onClick={() => handleSelect(route)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Get Me There tab ── */}
          {tab === 'get' && (
            <div className="flex-1 overflow-y-auto">
              <GetMeThere onRouteSelect={handleSelect} />
            </div>
          )}

          <p className="text-center text-th-text3 text-[10px] pb-3 flex-shrink-0">
            Based on LPTRC Consolidated Route Plan · CDO
          </p>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <CDOMap selectedRoute={selected} userLocation={userLocation} />
          {!selected && !userLocation && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="bg-th-surface/90 dark:bg-black/50 backdrop-blur border border-th-border rounded-full px-4 py-2 text-xs text-th-text2 whitespace-nowrap shadow-sm">
                <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-500" />
                Select a route or use "Get Me There" to plan your trip
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════ MOBILE ════════════════════════ */}
      <div className="md:hidden h-screen relative">

        {/* Map fills the whole screen */}
        <div className="absolute inset-0">
          <CDOMap selectedRoute={selected} userLocation={userLocation} />
        </div>

        {/* Tap-outside overlay when expanded */}
        {expanded && (
          <div className="absolute inset-0 z-10" onClick={() => setExpanded(false)} />
        )}

        {/* ── Top search bar (floating) ── */}
        <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 rounded-2xl border border-th-border shadow-md px-3 overflow-hidden"
            style={{ height: 52, backgroundColor: 'var(--c-search)', backdropFilter: 'blur(20px)' }}
          >
            {selected ? (
              <button onClick={clearSelection} className="text-th-text2 active:text-th-text flex-shrink-0 p-1 -ml-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Bus className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}

            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelected(null)
                setTab('browse')
                if (e.target.value.trim()) setExpanded(true)
              }}
              onFocus={() => { setExpanded(true); setTab('browse') }}
              placeholder={selected ? selected.name : 'Search route or barangay…'}
              className="flex-1 min-w-0 bg-transparent text-[15px] text-th-text placeholder-th-text3 focus:outline-none"
            />

            <button
              onClick={locateMe}
              disabled={locating}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                userLocation
                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40'
                  : 'bg-th-glass text-th-text2 border-th-border active:bg-th-glassh'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 flex-shrink-0 ${locating ? 'animate-spin' : ''}`} />
              <span className="whitespace-nowrap">{locating ? '…' : 'Near Me'}</span>
            </button>

            {query && (
              <button onClick={clearQuery} className="text-th-text3 active:text-th-text2 flex-shrink-0 ml-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Bottom sheet ── */}
        <div
          className="absolute left-0 right-0 bottom-0 z-20 flex flex-col rounded-t-3xl border-t border-th-bord2 shadow-2xl"
          style={{
            height: '88vh',
            backgroundColor: 'var(--c-sheet)',
            backdropFilter: 'blur(24px)',
            transform: expanded ? 'translateY(0)' : `translateY(calc(88vh - ${peek}px))`,
            transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Drag handle + theme toggle */}
          <div
            className="flex items-center px-3 pt-3 pb-2 flex-shrink-0"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex-1" />
            <div
              className="flex-shrink-0 px-6 py-2 cursor-grab active:cursor-grabbing"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="w-10 h-1 bg-th-border rounded-full" />
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>

          {/* Peeked & no selection: tab + filters */}
          {!expanded && !selected && (
            <div className="px-3 pb-2 flex-shrink-0">
              <TabBar className="mb-2.5" />
              <p className="text-[10px] text-th-text3 font-semibold uppercase tracking-widest mb-2">
                Filter by terminal
              </p>
              <FilterChips
                size="md"
                onClick={id => { setFilter(id); setTab('browse'); setExpanded(true) }}
              />
            </div>
          )}

          {/* Peeked & route selected */}
          {!expanded && selected && terminal && (
            <div className="px-4 pb-2 flex-shrink-0">
              {/* Badge + name + fare */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm ${terminal.bg} ${terminal.text}`}>
                  {selected.variantCode || selected.routeNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-th-text text-[15px] leading-tight truncate">{selected.name}</div>
                  <div className={`text-xs font-semibold mt-1 ${terminal.text} opacity-80`}>via {terminal.name}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-amber-500 font-black text-2xl leading-none">₱{routeFare}</div>
                  <div className="text-th-text2 text-[11px] mt-1">~{routeTime} min</div>
                </div>
              </div>

              {/* Board at */}
              <div className="bg-th-glass rounded-xl px-3 py-2.5 mb-2.5 flex items-center gap-2.5 border border-th-bord2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-th-text3 font-bold uppercase tracking-widest">Board at</div>
                  <div className="text-th-text text-sm font-bold truncate mt-0.5">{selected.areas[0]}</div>
                </div>
              </div>

              {/* Stops preview */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
                {selected.areas.slice(0, 6).map(area => (
                  <span key={area} className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-th-glass border border-th-bord2 text-th-text2 whitespace-nowrap">
                    {area}
                  </span>
                ))}
                {selected.areas.length > 6 && (
                  <span className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-th-glass border border-th-bord2 text-th-text3 whitespace-nowrap">
                    +{selected.areas.length - 6} more
                  </span>
                )}
              </div>

              <button
                onClick={() => setExpanded(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-th-text3 active:text-th-text2 py-0.5"
              >
                <ChevronUp className="w-3.5 h-3.5" /> Browse all routes
              </button>
            </div>
          )}

          {/* Expanded content */}
          {expanded && (
            <>
              <div className="px-3 pb-2 flex-shrink-0">
                <TabBar className="mb-2" />

                {tab === 'browse' && (
                  <>
                    <FilterChips size="sm" onClick={id => setFilter(id)} />
                    <p className="text-[10px] text-th-text3 font-medium mt-1.5">
                      {filtered.length} route{filtered.length !== 1 ? 's' : ''}
                      {filter !== 'all' && ` · ${TERMINALS[filter]?.name}`}
                    </p>
                  </>
                )}
              </div>

              {tab === 'browse' && (
                <div className="flex-1 overflow-y-auto px-2 pb-10">
                  {filtered.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="text-3xl mb-3">🔍</div>
                      <p className="text-th-text2 text-sm font-medium">No routes found</p>
                      <p className="text-th-text3 text-xs mt-2 leading-relaxed">
                        Try a place name or terminal<br />"Cogon", "Carmen", "Limketkai"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {filtered.map(route => (
                        <RouteCard
                          key={route.id}
                          route={route}
                          selected={selected?.id === route.id}
                          nearby={userLocation && nearestStopDist(route, userLocation) < 800}
                          onClick={() => handleSelect(route)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'get' && (
                <div className="flex-1 overflow-y-auto pb-10">
                  <GetMeThere onRouteSelect={handleSelect} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
