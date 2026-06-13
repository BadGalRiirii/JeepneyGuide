import { routes } from '../data/routes'
import { COORDS } from '../data/coordinates'
import { ROUTE_PATHS } from '../data/routePaths'

// All unique stop names across every route — used for autocomplete
export const ALL_STOPS = [...new Set(routes.flatMap(r => r.areas))].sort()

function haversineKm([lat1, lng1], [lat2, lng2]) {
  const R  = 6371
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180
  const a  = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// Total route length in km using OSRM path when available, else stop coords
export function getRouteDistanceKm(routeId) {
  const path = ROUTE_PATHS[routeId]
  if (path?.coordinates?.length > 1) {
    let total = 0
    const c = path.coordinates
    for (let i = 1; i < c.length; i++) {
      const [lg1, lt1] = c[i - 1], [lg2, lt2] = c[i]
      total += haversineKm([lt1, lg1], [lt2, lg2])
    }
    return total
  }
  const route = routes.find(r => r.id === routeId)
  if (!route) return 0
  const pts = route.areas.map(a => COORDS[a]).filter(Boolean)
  let total = 0
  for (let i = 1; i < pts.length; i++) total += haversineKm(pts[i - 1], pts[i])
  return total
}

// LTFRB jeepney fare formula: ₱13 base for first 4 km, +₱1.80/km after
export function calcFare(distanceKm) {
  if (distanceKm <= 4) return 13
  return Math.round(13 + (distanceKm - 4) * 1.8)
}

// Travel time estimate assuming ~25 km/h average city speed
export function calcTime(distanceKm) {
  return Math.max(5, Math.round(distanceKm / 25 * 60))
}

const TERMINAL_NAMES = new Set([
  'Cogon', 'Cogon Public Market',
  'Carmen', 'Carmen Public Market',
  'Limketkai', 'Limketkai Drive',
  'Gaisano', 'Gaisano City',
  'WBTPM', 'West Bound Terminal (WBTPM)',
  'Agora', 'Agora Market City & Terminal',
])

// BFS: find direct or 1-transfer jeepney route between two stops
export function findRoutes(origin, destination) {
  if (!origin || !destination || origin === destination) return null

  // Direct: both stops appear on the same route
  const direct = routes.filter(r =>
    r.areas.includes(origin) && r.areas.includes(destination)
  )
  if (direct.length > 0) {
    return {
      type: 'direct',
      options: direct.map(r => {
        const km = getRouteDistanceKm(r.id)
        return { type: 'direct', route: r, distanceKm: km, fare: calcFare(km), time: calcTime(km) }
      }),
    }
  }

  // 1-transfer: find a pair (r1, r2) sharing a common stop
  const fromOrigin     = routes.filter(r => r.areas.includes(origin))
  const toDestination  = routes.filter(r => r.areas.includes(destination))

  const transfers = []
  const seen = new Set()

  for (const r1 of fromOrigin) {
    for (const r2 of toDestination) {
      if (r1.id === r2.id) continue
      const common = r1.areas.filter(a => r2.areas.includes(a))
      if (common.length === 0) continue
      // Prefer a terminal as the transfer point — it's safer and has more jeepneys
      const transferStop = common.find(a => TERMINAL_NAMES.has(a)) ?? common[0]
      const key = `${r1.id}|${transferStop}|${r2.id}`
      if (seen.has(key)) continue
      seen.add(key)
      const km1 = getRouteDistanceKm(r1.id)
      const km2 = getRouteDistanceKm(r2.id)
      transfers.push({
        type: 'transfer',
        route1: r1,
        transferStop,
        route2: r2,
        distanceKm: km1 + km2,
        fare: calcFare(km1) + calcFare(km2),
        time: calcTime(km1) + calcTime(km2) + 5, // +5 min wait for transfer
      })
    }
  }

  if (transfers.length > 0) {
    transfers.sort((a, b) => a.time - b.time)
    return { type: 'transfer', options: transfers.slice(0, 5) }
  }

  return null
}

// All routes that stop at a given area — used in the tap-a-stop popup
export function routesAtStop(stopName) {
  return routes.filter(r => r.areas.includes(stopName))
}
