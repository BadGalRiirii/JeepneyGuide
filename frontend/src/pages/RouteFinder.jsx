import { useState, useMemo } from 'react'
import { MapPin, Navigation, ArrowRight, Bus, RefreshCw, Lightbulb } from 'lucide-react'
import RouteCard from '../components/RouteCard'
import { routes, findRoutesByOrigin, findRoutesByDestination, TERMINALS } from '../data/routes'

const COMMON_LOCATIONS = [
  'Cogon', 'Carmen', 'Limketkai', 'SM City', 'Gaisano City',
  'Xavier University', 'CDO Seaport / Pier', 'Lumbia Airport',
  'Camp Evangelista', 'Lapasan', 'Bulua', 'Macasandig',
  'Gusa', 'Camaman-an', 'Nazareth', 'Poblacion',
]

export default function RouteFinder() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [searched, setSearched] = useState(false)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setSearched(false)
  }

  const results = useMemo(() => {
    if (!from.trim() && !to.trim()) return []

    if (from.trim() && to.trim()) {
      const fromRoutes = findRoutesByOrigin(from)
      const toRoutes = findRoutesByDestination(to)
      const direct = fromRoutes.filter((r) => toRoutes.includes(r))
      if (direct.length > 0) return { type: 'direct', routes: direct }

      // No direct match — suggest transfer via Cogon or Carmen
      const viaTerminal = fromRoutes.map((r) => ({
        first: r,
        second: findRoutesByOrigin(TERMINALS[r.terminal]?.short || r.destination).filter((r2) =>
          r2.areas.some((a) => a.toLowerCase().includes(to.toLowerCase())) ||
          r2.destination.toLowerCase().includes(to.toLowerCase())
        ),
      })).filter((p) => p.second.length > 0)

      return { type: 'transfer', pairs: viaTerminal.slice(0, 3), fromRoutes: fromRoutes.slice(0, 4) }
    }

    if (from.trim()) return { type: 'from', routes: findRoutesByOrigin(from).slice(0, 8) }
    if (to.trim()) return { type: 'to', routes: findRoutesByDestination(to).slice(0, 8) }
    return []
  }, [searched])

  const handleSearch = () => setSearched((s) => !s || !searched ? true : false)

  const hasResults = searched && Array.isArray(results) ? results.length > 0 : searched && results?.routes?.length > 0 || results?.pairs?.length > 0 || results?.fromRoutes?.length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Route Finder</h1>
        <p className="text-white/40 text-sm">
          Enter where you are and where you want to go.
        </p>
      </div>

      {/* Finder form */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col gap-4">
          {/* From */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">
              From (Your Location)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Bulua, Lapasan, Gusa…"
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* Swap */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <button
              onClick={swap}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/70 transition-all"
              title="Swap origin and destination"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* To */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">
              To (Destination)
            </label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Cogon, SM City, Limketkai…"
                className="input-field pl-11"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!from.trim() && !to.trim()}
            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Bus className="w-5 h-5" />
            Find Jeepney
          </button>
        </div>

        {/* Quick picks */}
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-xs text-white/30 font-medium mb-2.5">Common destinations</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setTo(loc)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  to === loc
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-white/5 text-white/50 border-white/8 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="animate-slide-up">
          {!from.trim() && !to.trim() ? (
            <p className="text-center text-white/40 py-8">Please enter at least one location.</p>
          ) : results.type === 'direct' ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                  Direct routes found
                </h2>
              </div>
              <div className="grid gap-3">
                {results.routes.map((r) => <RouteCard key={r.id} route={r} highlight />)}
              </div>
            </div>
          ) : results.type === 'transfer' ? (
            <div className="space-y-6">
              <div className="glass-card p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/70">
                    No direct route found. You may need to{' '}
                    <strong className="text-white">transfer at Cogon or Carmen terminal</strong>.
                    Take any of these routes first, then find a connecting jeep.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wide mb-3">
                  Jeepneys from your area
                </h2>
                <div className="grid gap-3">
                  {results.fromRoutes.map((r) => <RouteCard key={r.id} route={r} />)}
                </div>
              </div>

              {results.pairs.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wide mb-3">
                    Suggested connections
                  </h2>
                  <div className="space-y-3">
                    {results.pairs.map((pair, i) => (
                      <div key={i} className="glass-card p-4">
                        <p className="text-xs text-white/30 mb-3 uppercase tracking-wide">Option {i + 1}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-white/40 mb-1">Ride first</p>
                            <RouteCard route={pair.first} />
                          </div>
                          <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0 hidden sm:block" />
                          <div className="flex-1">
                            <p className="text-xs text-white/40 mb-1">Then transfer to</p>
                            {pair.second.slice(0, 1).map((r) => <RouteCard key={r.id} route={r} />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : results.type === 'from' ? (
            <div>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wide mb-3">
                Jeepneys from "{from}"
              </h2>
              <div className="grid gap-3">
                {results.routes.length > 0
                  ? results.routes.map((r) => <RouteCard key={r.id} route={r} />)
                  : <p className="text-white/40 text-sm">No routes found for that origin.</p>
                }
              </div>
            </div>
          ) : results.type === 'to' ? (
            <div>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wide mb-3">
                Jeepneys going to "{to}"
              </h2>
              <div className="grid gap-3">
                {results.routes.length > 0
                  ? results.routes.map((r) => <RouteCard key={r.id} route={r} />)
                  : <p className="text-white/40 text-sm">No routes found for that destination.</p>
                }
              </div>
            </div>
          ) : (
            <p className="text-center text-white/40 py-8">No matching routes found. Try a broader search term.</p>
          )}
        </div>
      )}
    </div>
  )
}
