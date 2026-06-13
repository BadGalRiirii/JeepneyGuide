import { useState, useMemo, useCallback, useRef } from 'react'
import { Search, Bus, X, MapPin, ChevronUp, ArrowLeft, Navigation, Route } from 'lucide-react'
import { routes, searchRoutes, TERMINALS } from '../data/routes'
import { COORDS } from '../data/coordinates'
import { getRouteDistanceKm, calcFare, calcTime } from '../utils/routing'
import RouteCard from '../components/RouteCard'
import CDOMap from '../components/CDOMap'
import GetMeThere from '../components/GetMeThere'

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
  { id: 'all',       label: 'All',       active: 'bg-white/15 text-white border-white/25',             color: null       },
  { id: 'cogon',     label: 'Cogon',     active: 'bg-blue-500/20 text-blue-300 border-blue-500/40',    color: '#3b82f6'  },
  { id: 'carmen',    label: 'Carmen',    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', color: '#10b981' },
  { id: 'limketkai', label: 'Limketkai', active: 'bg-violet-500/20 text-violet-300 border-violet-500/40',   color: '#8b5cf6' },
  { id: 'gaisano',   label: 'Gaisano',   active: 'bg-amber-500/20 text-amber-300 border-amber-500/40',  color: '#f59e0b'  },
  { id: 'wbtpm',     label: 'WBTPM',     active: 'bg-red-500/20 text-red-300 border-red-500/40',        color: '#ef4444'  },
  { id: 'agora',     label: 'Agora',     active: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',     color: '#06b6d4'  },
]

const PEEK_DEFAULT  = 220
const PEEK_SELECTED = 290

export default function Home() {
  const [tab,          setTab]          = useState('browse')     // 'browse' | 'get'
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

  // Fare + time for selected route
  const routeKm   = selected ? getRouteDistanceKm(selected.id) : 0
  const routeFare = selected ? calcFare(routeKm) : 0
  const routeTime = selected ? calcTime(routeKm) : 0

  // Shared tab bar component
  function TabBar({ className = '' }) {
    return (
      <div className={`flex gap-1 p-1 bg-white/5 rounded-xl ${className}`}>
        <button
          onClick={() => setTab('browse')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'browse' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Bus className="w-3.5 h-3.5" /> Browse
        </button>
        <button
          onClick={() => setTab('get')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'get' ? 'bg-amber-500/20 text-amber-300' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Route className="w-3.5 h-3.5" /> Get Me There
        </button>
      </div>
    )
  }

  // Detail panel for selected route (used in both desktop strip and mobile peek)
  function RouteDetailPanel({ compact = false }) {
    if (!selected || !terminal) return null
    return (
      <div className={compact ? '' : 'px-4 pb-1'}>
        <div className="flex items-start gap-3">
          <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl flex items-center justify-center font-black ${compact ? 'text-base' : 'text-xl'} flex-shrink-0 ${terminal.bg} ${terminal.text}`}>
            {selected.variantCode || selected.routeNumber}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className={`font-bold text-white ${compact ? 'text-sm' : 'text-base'} leading-snug`}>{selected.name}</div>
            <div className={`${terminal.text} text-xs font-semibold mt-0.5`}>→ {terminal.name}</div>
            {/* Fare + time row */}
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-amber-400 font-black text-sm">₱{routeFare}</span>
              <span className="text-white/35 text-[11px]">~{routeTime} min</span>
              <span className="text-white/25 text-[11px]">{routeKm.toFixed(1)} km</span>
            </div>
          </div>
        </div>
        {!compact && (
          <>
            {selected.tip && (
              <div className="text-[11px] text-amber-300/70 mt-2 leading-snug">
                💡 {selected.tip}
              </div>
            )}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {selected.areas.map(area => (
                <span key={area} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                  {area}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden relative bg-[#06111f]">

      {/* ═══════════════════════ DESKTOP ════════════════════════ */}
      <div className="hidden md:flex h-screen">

        {/* Sidebar */}
        <aside className="flex flex-col w-80 lg:w-96 h-full border-r border-white/5 bg-[#060d1a] flex-shrink-0 z-10">

          {/* Brand */}
          <div className="flex items-center gap-2 px-4 h-14 border-b border-white/5 flex-shrink-0">
            <Bus className="w-5 h-5 text-amber-400" />
            <span className="font-black text-white text-lg tracking-tight">SakayKo</span>
            <span className="text-white/20 text-xs ml-1">CDO Jeepney Guide</span>
          </div>

          {/* Tab bar */}
          <div className="px-3 py-2 border-b border-white/5 flex-shrink-0">
            <TabBar />
          </div>

          {/* ── Browse tab ── */}
          {tab === 'browse' && (
            <>
              {/* Search + Near Me */}
              <div className="px-3 py-2.5 flex-shrink-0 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Area, barangay, or code…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 h-10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40 focus:bg-white/8 transition-all"
                    />
                    {query && (
                      <button onClick={clearQuery} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
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
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                    }`}
                  >
                    <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {userLocation && (
                  <p className="text-[10px] text-blue-400/70 mt-1.5 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Sorted by distance from your location
                  </p>
                )}
              </div>

              {/* Terminal filter chips */}
              <div className="px-3 pt-2 pb-1.5 flex gap-1.5 overflow-x-auto flex-shrink-0 border-b border-white/5"
                style={{ scrollbarWidth: 'none' }}>
                {FILTERS.map(f => {
                  const count = f.id === 'all' ? filtered.length : routes.filter(r => r.terminal === f.id).length
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        filter === f.id ? f.active : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                      }`}
                    >
                      {f.color && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                      )}
                      {f.label}
                      {f.id === 'all' && <span className="opacity-50">{count}</span>}
                    </button>
                  )
                })}
              </div>

              {/* Selected route strip */}
              {selected && (
                <div className="mx-3 mt-2 mb-1 p-3 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${terminal.bg} ${terminal.text}`}>
                      {selected.variantCode || selected.routeNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm leading-snug">{selected.name}</div>
                      <div className="text-[11px] text-white/40 mt-0.5 truncate">{selected.areas.join(' › ')}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-400 font-black text-sm">₱{routeFare}</span>
                        <span className="text-white/35 text-[11px]">~{routeTime} min</span>
                        <span className="text-white/20 text-[11px]">{routeKm.toFixed(1)} km</span>
                      </div>
                      {selected.tip && (
                        <div className="text-[11px] text-amber-300/70 mt-1 leading-snug">💡 {selected.tip}</div>
                      )}
                    </div>
                    <button onClick={clearSelection} className="text-white/30 hover:text-white/60 flex-shrink-0">
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
                    <p className="text-white/50 text-sm font-medium">No routes for "{query}"</p>
                    <p className="text-white/25 text-xs mt-1.5 leading-relaxed">Try a barangay name or terminal like "Cogon"</p>
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

          <p className="text-center text-white/15 text-[10px] pb-3 flex-shrink-0">
            Based on LPTRC Consolidated Route Plan · CDO
          </p>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <CDOMap selectedRoute={selected} userLocation={userLocation} />
          {!selected && !userLocation && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-black/50 backdrop-blur border border-white/10 rounded-full px-4 py-2 text-xs text-white/40 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-400" />
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

        {expanded && (
          <div className="absolute inset-0 z-10" onClick={() => setExpanded(false)} />
        )}

        {/* ── Top search bar (floating) ── */}
        <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-4 pb-2">
          <div className="flex items-center gap-2.5 bg-[#060d1a]/92 backdrop-blur-xl rounded-2xl border border-white/12 shadow-2xl px-3"
            style={{ height: 52 }}>
            {selected ? (
              <button onClick={clearSelection} className="text-white/60 active:text-white flex-shrink-0 p-1 -ml-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Bus className="w-4 h-4 text-amber-400 flex-shrink-0" />
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
              className="flex-1 bg-transparent text-[15px] text-white placeholder-white/30 focus:outline-none"
            />

            <button
              onClick={locateMe}
              disabled={locating}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                userLocation
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-white/5 text-white/40 border-white/10 active:bg-white/10'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? '…' : 'Near Me'}</span>
            </button>

            {query && (
              <button onClick={clearQuery} className="text-white/30 active:text-white/60 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Bottom sheet ── */}
        <div
          className="absolute left-0 right-0 bottom-0 z-20 flex flex-col bg-[#060d1a]/96 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 shadow-2xl"
          style={{
            height: '88vh',
            transform: expanded ? 'translateY(0)' : `translateY(calc(88vh - ${peek}px))`,
            transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => setExpanded(!expanded)}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Peeked & no selection: tab chips + filter */}
          {!expanded && !selected && (
            <div className="px-3 pb-2 flex-shrink-0">
              <TabBar className="mb-2.5" />
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mb-2">
                Filter by terminal
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setFilter(f.id); setTab('browse'); setExpanded(true) }}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      filter === f.id ? f.active : 'bg-white/5 text-white/50 border-white/10 active:bg-white/10'
                    }`}
                  >
                    {f.color && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                    )}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Peeked & route selected: route detail card */}
          {!expanded && selected && terminal && (
            <div className="px-4 pb-2 flex-shrink-0">
              {/* Route badge + name + fare */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 ${terminal.bg} ${terminal.text} shadow-lg`}>
                  {selected.variantCode || selected.routeNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[15px] leading-tight truncate">{selected.name}</div>
                  <div className={`text-xs font-semibold mt-1 ${terminal.text} opacity-80`}>via {terminal.name}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-amber-400 font-black text-2xl leading-none">₱{routeFare}</div>
                  <div className="text-white/35 text-[11px] mt-1">~{routeTime} min</div>
                </div>
              </div>

              {/* Board at */}
              <div className="bg-white/5 rounded-xl px-3 py-2.5 mb-2.5 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Board at</div>
                  <div className="text-white/90 text-sm font-bold truncate mt-0.5">{selected.areas[0]}</div>
                </div>
              </div>

              {/* Stops preview — scrollable row */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
                {selected.areas.slice(0, 6).map(area => (
                  <span key={area} className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/40 whitespace-nowrap">
                    {area}
                  </span>
                ))}
                {selected.areas.length > 6 && (
                  <span className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/25 whitespace-nowrap">
                    +{selected.areas.length - 6} more
                  </span>
                )}
              </div>

              <button
                onClick={() => setExpanded(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-white/30 active:text-white/50 py-0.5"
              >
                <ChevronUp className="w-3.5 h-3.5" /> Browse all routes
              </button>
            </div>
          )}

          {/* Expanded: tabs + content */}
          {expanded && (
            <>
              <div className="px-3 pb-2 flex-shrink-0">
                <TabBar className="mb-2" />

                {tab === 'browse' && (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                      {FILTERS.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFilter(f.id)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            filter === f.id ? f.active : 'bg-white/5 text-white/40 border-white/10 active:bg-white/10'
                          }`}
                        >
                          {f.color && (
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                          )}
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/25 font-medium">
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
                      <p className="text-white/50 text-sm font-medium">No routes found</p>
                      <p className="text-white/25 text-xs mt-2 leading-relaxed">
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
