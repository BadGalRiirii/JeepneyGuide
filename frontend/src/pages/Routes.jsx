import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SortAsc } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import RouteCard from '../components/RouteCard'
import { routes, searchRoutes, TERMINALS } from '../data/routes'

const GROUP_BY_OPTIONS = [
  { id: 'none', label: 'All Routes' },
  { id: 'group', label: 'By Area' },
  { id: 'terminal', label: 'By Terminal' },
]

export default function RoutesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [terminalFilter, setTerminalFilter] = useState(searchParams.get('terminal') || 'all')
  const [groupBy, setGroupBy] = useState('none')

  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (terminalFilter !== 'all') params.terminal = terminalFilter
    setSearchParams(params)
  }, [query, terminalFilter])

  const filtered = useMemo(() => {
    let result = query ? searchRoutes(query) : routes
    if (terminalFilter !== 'all') {
      result = result.filter((r) => r.terminal === terminalFilter)
    }
    return result
  }, [query, terminalFilter])

  const grouped = useMemo(() => {
    if (groupBy === 'group') {
      return filtered.reduce((acc, r) => {
        const key = r.group || r.name
        if (!acc[key]) acc[key] = []
        acc[key].push(r)
        return acc
      }, {})
    }
    if (groupBy === 'terminal') {
      return filtered.reduce((acc, r) => {
        const key = TERMINALS[r.terminal]?.short || r.terminal
        if (!acc[key]) acc[key] = []
        acc[key].push(r)
        return acc
      }, {})
    }
    return { all: filtered }
  }, [filtered, groupBy])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">All Routes</h1>
        <p className="text-white/40 text-sm">
          {routes.length} jeepney routes across Cagayan de Oro City
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <FilterBar activeFilter={terminalFilter} onFilterChange={setTerminalFilter} />
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
            {GROUP_BY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGroupBy(opt.id)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                  groupBy === opt.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      {query || terminalFilter !== 'all' ? (
        <p className="text-sm text-white/40 mb-4">
          {filtered.length} route{filtered.length !== 1 ? 's' : ''} found
          {query && <> for "<span className="text-white/70">{query}</span>"</>}
        </p>
      ) : null}

      {/* Route list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🚌</div>
          <p className="text-white/50 font-medium">No routes found.</p>
          <p className="text-white/30 text-sm mt-1">Try a different search term or clear the filter.</p>
          <button
            onClick={() => { setQuery(''); setTerminalFilter('all') }}
            className="btn-ghost mt-4 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([groupName, groupRoutes]) => (
            <div key={groupName}>
              {groupBy !== 'none' && (
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-base font-bold text-white/80">{groupName}</h2>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                    {groupRoutes.length}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
