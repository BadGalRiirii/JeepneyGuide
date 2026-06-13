import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { COORDS, TERMINAL_COORDS } from '../data/coordinates'
import { TERMINALS } from '../data/routes'
import { ROUTE_PATHS } from '../data/routePaths'
import { routesAtStop } from '../utils/routing'

const CDO_CENTER = { longitude: 124.6472, latitude: 8.4822 }
const MAP_STYLE  = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const TERMINAL_COLORS = {
  cogon:     '#3b82f6',
  carmen:    '#10b981',
  limketkai: '#8b5cf6',
  gaisano:   '#f59e0b',
  wbtpm:     '#ef4444',
  agora:     '#06b6d4',
}

// Building extrusion tints per terminal — applied when that terminal's route is active
const BUILDING_TINTS = {
  cogon:     { a: '#0a1c3d', b: '#0d2450', c: '#112e62' },
  carmen:    { a: '#091e2c', b: '#0b2838', c: '#0d3045' },
  limketkai: { a: '#10143a', b: '#15194d', c: '#1b2060' },
  gaisano:   { a: '#1a160a', b: '#221c0e', c: '#2a2215' },
  wbtpm:     { a: '#1a0c0c', b: '#221010', c: '#2a1414' },
  agora:     { a: '#091e2c', b: '#0b2838', c: '#0d3345' },
}
const BUILDING_DEFAULT = { a: '#0a1a30', b: '#112240', c: '#1a3060' }

function buildRouteGeoJSON(route) {
  const stops = route.areas
    .map((name, i) => {
      const c = COORDS[name]
      if (!c) return null
      return { coord: [c[1], c[0]], name, seq: i + 1 }
    })
    .filter(Boolean)

  if (stops.length === 0) return null

  const lineGeometry = ROUTE_PATHS[route.id] ?? (
    stops.length > 1 ? { type: 'LineString', coordinates: stops.map(s => s.coord) } : null
  )

  return {
    type: 'FeatureCollection',
    features: [
      ...(lineGeometry ? [{ type: 'Feature', geometry: lineGeometry, properties: {} }] : []),
      ...stops.map(s => ({
        type: 'Feature',
        properties: { name: s.name, seq: s.seq },
        geometry: { type: 'Point', coordinates: s.coord },
      })),
    ],
  }
}

export default function CDOMap({ selectedRoute, userLocation }) {
  const mapRef = useRef(null)

  const [terminalPopup, setTerminalPopup] = useState(null)
  const [stopPopup,     setStopPopup]     = useState(null)

  const terminalColor = selectedRoute ? (TERMINAL_COLORS[selectedRoute.terminal] ?? '#f59e0b') : null
  const routeGeoJSON  = useMemo(
    () => (selectedRoute ? buildRouteGeoJSON(selectedRoute) : null),
    [selectedRoute]
  )

  const bTint = selectedRoute ? (BUILDING_TINTS[selectedRoute.terminal] || BUILDING_DEFAULT) : BUILDING_DEFAULT

  // Fly to route bounds on selection
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const go = () => {
      const map = mapRef.current?.getMap()
      if (!map) return

      const fly = () => {
        if (userLocation && !selectedRoute) {
          map.flyTo({ center: [userLocation[1], userLocation[0]], zoom: 15, pitch: 50, duration: 1400 })
          return
        }
        if (!selectedRoute) {
          map.flyTo({ center: [CDO_CENTER.longitude, CDO_CENTER.latitude], zoom: 12, pitch: 45, duration: 1000 })
          return
        }
        let pts
        if (ROUTE_PATHS[selectedRoute.id]) {
          pts = ROUTE_PATHS[selectedRoute.id].coordinates.map(([lng, lat]) => [lat, lng])
        } else {
          pts = selectedRoute.areas.map(a => COORDS[a]).filter(Boolean)
        }
        if (pts.length === 0) return
        const lngs = pts.map(c => c[1])
        const lats = pts.map(c => c[0])
        const padding = isMobile
          ? { top: 90, bottom: 260, left: 40, right: 40 }
          : { top: 90, bottom: 90, left: 60, right: 60 }
        const camera = map.cameraForBounds(
          [[Math.min(...lngs) - 0.003, Math.min(...lats) - 0.003],
           [Math.max(...lngs) + 0.003, Math.max(...lats) + 0.003]],
          { padding }
        )
        if (!camera) return
        map.flyTo({
          center:   camera.center,
          zoom:     Math.min(camera.zoom, 15),
          pitch:    55,
          bearing:  0,
          curve:    1.2,
          speed:    0.38,
          essential: true,
        })
      }

      if (map.isStyleLoaded()) fly()
      else map.once('load', fly)
    }

    const t = setTimeout(go, 80)
    return () => clearTimeout(t)
  }, [selectedRoute, userLocation])

  const handleMapClick = useCallback(e => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const features = map.queryRenderedFeatures(e.point, { layers: ['route-stops'] })
    if (features.length > 0) {
      const name = features[0].properties?.name
      if (name) {
        setStopPopup({ lat: e.lngLat.lat, lng: e.lngLat.lng, stopName: name, routes: routesAtStop(name) })
        setTerminalPopup(null)
      }
    } else {
      setStopPopup(null)
    }
  }, [])

  // Board-here marker: first area with known coords
  const originArea  = selectedRoute?.areas[0]
  const originCoord = originArea ? COORDS[originArea] : null

  return (
    <Map
      ref={mapRef}
      initialViewState={{ ...CDO_CENTER, zoom: 12, pitch: 45, bearing: 0 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
      attributionControl={false}
      onClick={handleMapClick}
      cursor="auto"
    >
      <NavigationControl position="top-right" />

      {/* ── 3D buildings — tinted toward the active terminal's color ── */}
      <Layer
        id="3d-buildings"
        type="fill-extrusion"
        source="carto"
        source-layer="building"
        minzoom={13}
        paint={{
          'fill-extrusion-color': [
            'interpolate', ['linear'], ['zoom'],
            13, bTint.a,
            15, bTint.b,
            18, bTint.c,
          ],
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 10],
          'fill-extrusion-base':   ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
          'fill-extrusion-opacity': [
            'interpolate', ['linear'], ['zoom'],
            13, 0,
            14, selectedRoute ? 0.88 : 0.70,
            18, selectedRoute ? 0.96 : 0.92,
          ],
          'fill-extrusion-vertical-gradient': true,
          'fill-extrusion-ambient-occlusion-intensity': 0.5,
          'fill-extrusion-ambient-occlusion-radius': 3,
          'fill-extrusion-edge-radius': 0.15,
        }}
      />

      {/* ── Terminal pins ── */}
      {Object.entries(TERMINAL_COORDS).map(([id, [lat, lng]]) => {
        const isActive = selectedRoute?.terminal === id
        const color    = TERMINAL_COLORS[id]
        return (
          <Marker key={id} latitude={lat} longitude={lng} anchor="center">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Pulse ring for active terminal */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  width: 36, height: 36,
                  borderRadius: '50%',
                  backgroundColor: color + '40',
                  animation: 'location-pulse 2s ease-out infinite',
                }} />
              )}
              <div
                title={TERMINALS[id].name}
                onClick={() => { setTerminalPopup({ lng, lat, text: TERMINALS[id].name }); setStopPopup(null) }}
                style={{
                  width:  isActive ? 20 : 14,
                  height: isActive ? 20 : 14,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: `${isActive ? '3px' : '2.5px'} solid rgba(255,255,255,${isActive ? 0.95 : 0.85})`,
                  cursor: 'pointer',
                  boxShadow: isActive
                    ? `0 0 16px ${color}, 0 0 32px ${color}88`
                    : `0 0 8px ${color}99, 0 0 16px ${color}44`,
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>
          </Marker>
        )
      })}

      {/* ── User location — pulsing blue dot ── */}
      {userLocation && (
        <Marker latitude={userLocation[0]} longitude={userLocation[1]} anchor="center">
          <div style={{ position: 'relative', width: 0, height: 0 }}>
            <div style={{
              position: 'absolute', width: 28, height: 28, left: -14, top: -14,
              borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.25)',
              animation: 'location-pulse 1.8s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute', width: 14, height: 14, left: -7, top: -7,
              borderRadius: '50%', backgroundColor: '#3b82f6',
              border: '2.5px solid white', boxShadow: '0 2px 8px rgba(59,130,246,0.6)',
            }} />
          </div>
        </Marker>
      )}

      {/* ── Route overlay — street highlight + stop markers ── */}
      {routeGeoJSON && terminalColor && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          {/* Wide road zone — the "street is highlighted" effect */}
          <Layer id="route-road-zone" type="line"
            filter={['==', ['geometry-type'], 'LineString']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{
              'line-color': terminalColor,
              'line-width': ['interpolate', ['linear'], ['zoom'], 11, 12, 14, 28, 17, 48],
              'line-opacity': 0.07,
            }}
          />
          {/* Glow */}
          <Layer id="route-glow" type="line"
            filter={['==', ['geometry-type'], 'LineString']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': terminalColor, 'line-width': 18, 'line-opacity': 0.14, 'line-blur': 8 }}
          />
          {/* Main route line */}
          <Layer id="route-line" type="line"
            filter={['==', ['geometry-type'], 'LineString']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': terminalColor, 'line-width': 5, 'line-opacity': 0.95 }}
          />
          {/* White centre stripe */}
          <Layer id="route-core" type="line"
            filter={['==', ['geometry-type'], 'LineString']}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.45 }}
          />
          {/* Stop halo */}
          <Layer id="route-stop-halo" type="circle"
            filter={['==', ['geometry-type'], 'Point']}
            paint={{ 'circle-radius': 14, 'circle-color': terminalColor, 'circle-opacity': 0.18 }}
          />
          {/* Stop dot */}
          <Layer id="route-stops" type="circle"
            filter={['==', ['geometry-type'], 'Point']}
            paint={{
              'circle-radius': 8,
              'circle-color':  terminalColor,
              'circle-stroke-width': 2.5,
              'circle-stroke-color': '#ffffff',
            }}
          />
          {/* Stop sequence number */}
          <Layer id="route-seq" type="symbol"
            filter={['==', ['geometry-type'], 'Point']}
            layout={{
              'text-field': ['to-string', ['get', 'seq']],
              'text-size': 9,
              'text-font': ['Noto Sans Bold', 'Arial Unicode MS Bold'],
              'text-anchor': 'center',
              'text-allow-overlap': true,
            }}
            paint={{
              'text-color': '#ffffff',
              'text-halo-color': terminalColor,
              'text-halo-width': 0.5,
            }}
          />
          {/* Stop area name */}
          <Layer id="route-labels" type="symbol"
            filter={['==', ['geometry-type'], 'Point']}
            layout={{
              'text-field': ['get', 'name'],
              'text-size': 11,
              'text-font': ['Noto Sans Bold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.7],
              'text-anchor': 'top',
              'text-max-width': 8,
            }}
            paint={{
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 2,
              'text-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 12.5, 1],
            }}
          />
        </Source>
      )}

      {/* ── "Board here" pin at the route origin ── */}
      {selectedRoute && originCoord && terminalColor && (
        <Marker latitude={originCoord[0]} longitude={originCoord[1]} anchor="bottom">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{
              background: terminalColor,
              color: '#000',
              fontWeight: 800,
              fontSize: 11,
              lineHeight: 1,
              padding: '5px 9px',
              borderRadius: 8,
              border: '2px solid rgba(255,255,255,0.9)',
              whiteSpace: 'nowrap',
              boxShadow: `0 4px 16px ${terminalColor}99, 0 2px 8px rgba(0,0,0,0.6)`,
              letterSpacing: '0.01em',
            }}>
              🚏 {originArea}
            </div>
            {/* Pin tail */}
            <div style={{
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `8px solid ${terminalColor}`,
              filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.4))`,
            }} />
          </div>
        </Marker>
      )}

      {/* ── Terminal name popup ── */}
      {terminalPopup && (
        <Popup
          longitude={terminalPopup.lng} latitude={terminalPopup.lat}
          anchor="bottom" onClose={() => setTerminalPopup(null)} closeButton={false}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{terminalPopup.text}</span>
        </Popup>
      )}

      {/* ── Tap-a-stop popup ── */}
      {stopPopup && (
        <Popup
          longitude={stopPopup.lng} latitude={stopPopup.lat}
          anchor="bottom" onClose={() => setStopPopup(null)} closeButton={false}
          maxWidth="220px"
        >
          <div style={{ padding: '2px 0' }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', marginBottom: 6 }}>
              📍 {stopPopup.stopName}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              {stopPopup.routes.length} route{stopPopup.routes.length !== 1 ? 's' : ''} here
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {stopPopup.routes.map(r => {
                const t    = TERMINALS[r.terminal]
                const code = r.variantCode || r.routeNumber
                return (
                  <span key={r.id} style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 999,
                    background: `${TERMINAL_COLORS[r.terminal]}30`,
                    color: t.color,
                    border: `1px solid ${TERMINAL_COLORS[r.terminal]}50`,
                  }}>
                    {code}
                  </span>
                )
              })}
            </div>
          </div>
        </Popup>
      )}
    </Map>
  )
}
