const CACHE = 'sakayko-v1'

// Cache app assets on first visit; serve from cache on repeat visits
self.addEventListener('fetch', e => {
  const url = e.request.url
  if (e.request.method !== 'GET') return
  // Don't cache map tiles or external fonts — they're large and version-managed
  if (url.includes('cartocdn.com') || url.includes('basemaps') ||
      url.includes('fonts.googleapis') || url.includes('fonts.gstatic') ||
      url.includes('project-osrm.org')) return

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(resp => {
        if (resp.ok && (url.startsWith(self.location.origin) || url.includes('/assets/'))) {
          const clone = resp.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return resp
      }).catch(() => cached)
    })
  )
})

// Remove old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})
