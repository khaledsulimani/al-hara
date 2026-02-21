import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon with Vite/bundlers + حجم أصغر للدبوس
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  shadowSize: [28, 28],
  shadowAnchor: [10, 28],
})

const MAP_CENTER = [19.1269, 41.078]
const DEFAULT_ZOOM = 18
const MAX_ZOOM_ESRI = 18
const MAX_ZOOM_MAPBOX = 22

function FitBoundsToMarkers({ markers, boundary, maxZoom }) {
  const map = useMap()
  useEffect(() => {
    const group = L.featureGroup([])
    if (markers?.length) markers.forEach((m) => group.addLayer(L.marker(m.coordinates)))
    const validBoundary = Array.isArray(boundary) && boundary.length >= 3 && boundary.every((p) => Array.isArray(p) && p.length >= 2)
    if (validBoundary) group.addLayer(L.polygon(boundary))
    if (group.getLayers().length === 0) return
    map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: maxZoom ?? MAX_ZOOM_ESRI })
  }, [map, markers, boundary, maxZoom])
  return null
}

function FlyToUser({ userLocation }) {
  const map = useMap()
  useEffect(() => {
    if (!userLocation || !map) return
    map.flyTo(userLocation, 17, { duration: 1 })
  }, [map, userLocation])
  return null
}

const BOUNDARY_STYLE = {
  color: '#059669',
  weight: 3,
  fillColor: '#10b981',
  fillOpacity: 0.15,
}

/** أعلى منتصف الحدود — لوضع نص "الحارة اليمانية" ثابتاً */
function getBoundaryLabelPosition(boundary) {
  if (!Array.isArray(boundary) || boundary.length < 3) return null
  const valid = boundary.filter((p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number')
  if (valid.length < 3) return null
  const lats = valid.map((p) => p[0])
  const lngs = valid.map((p) => p[1])
  const topLat = Math.max(...lats)
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
  return [topLat, centerLng]
}

const labelIcon = L.divIcon({
  html: '<span class="boundary-label-fixed">الحارة اليمانية</span>',
  className: 'boundary-label-icon',
  iconSize: [140, 28],
  iconAnchor: [70, 14],
})

/** أيقونة دبوس "موقعي" — نقطة زرقاء */
const myLocationIcon = L.divIcon({
  html: '<span style="display:block;width:24px;height:24px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>',
  className: 'my-location-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export default function NeighborhoodMap({ markers = [], boundary = [] }) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''
  const [mapType, setMapType] = useState(mapboxToken ? 'mapbox' : 'satellite')
  const [userLocation, setUserLocation] = useState(null) // [lat, lng] or null
  const [userLocationLoading, setUserLocationLoading] = useState(false)
  const [userLocationError, setUserLocationError] = useState(null)
  const labelPosition = getBoundaryLabelPosition(boundary)

  const isMapbox = mapType === 'mapbox'
  const maxZoom = isMapbox ? MAX_ZOOM_MAPBOX : MAX_ZOOM_ESRI

  const requestMyLocation = () => {
    if (!navigator.geolocation) {
      setUserLocationError('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setUserLocationError(null)
    setUserLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setUserLocationLoading(false)
      },
      (err) => {
        setUserLocationLoading(false)
        if (err.code === 1) setUserLocationError('تم رفض الإذن. اسمح بالموقع لعرضه.')
        else if (err.code === 2) setUserLocationError('الموقع غير متاح حالياً')
        else if (err.code === 3) setUserLocationError('انتهت المهلة. جرّب مرة أخرى.')
        else setUserLocationError('لم نتمكن من تحديد موقعك')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }

  return (
    <section className="w-full min-h-[320px] h-[65vh] flex flex-col" style={{ backgroundColor: 'rgba(13, 59, 42, 0.25)' }} aria-label="خريطة الحارة">
      <div className="h-full w-full min-h-0 flex-1 relative">
        <MapContainer
          className="h-full w-full"
          style={{ height: '100%', minHeight: '100%' }}
          center={MAP_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={14}
          maxZoom={maxZoom}
          scrollWheelZoom={true}
        >
          {mapType === 'mapbox' && mapboxToken ? (
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/{z}/{x}/{y}?access_token=${mapboxToken}`}
              tileSize={512}
              zoomOffset={-1}
              maxZoom={MAX_ZOOM_MAPBOX}
              maxNativeZoom={22}
            />
          ) : null}
          {(mapType === 'satellite' || (mapType === 'mapbox' && !mapboxToken)) && (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={MAX_ZOOM_ESRI}
              maxNativeZoom={MAX_ZOOM_ESRI}
            />
          )}
          {mapType === 'street' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          <FitBoundsToMarkers markers={markers} boundary={boundary} maxZoom={maxZoom} />
          {userLocation && (
            <>
              <FlyToUser userLocation={userLocation} />
              <Marker position={userLocation} icon={myLocationIcon} zIndexOffset={1000}>
                <Popup>
                  <div className="min-w-[160px] text-start">
                    <h3 className="font-semibold text-slate-800 mb-1">موقعك الحالي</h3>
                    <p className="text-xs text-slate-500">
                      {userLocation[0].toFixed(6)}، {userLocation[1].toFixed(6)}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${userLocation[0]},${userLocation[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full mt-2 py-2 px-3 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
                    >
                      اذهب للموقع
                    </a>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
          {Array.isArray(boundary) && boundary.length >= 3 && (
            <>
              <Polygon positions={boundary} pathOptions={BOUNDARY_STYLE} />
              {labelPosition && (
                <Marker position={labelPosition} icon={labelIcon} zIndexOffset={500} interactive={false} />
              )}
            </>
          )}
          {markers.map((place) => {
            const [lat, lng] = place.coordinates
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
            const base = import.meta.env.BASE_URL
            const imagePath = place.image ? (place.image.startsWith('http') ? place.image : `${base}${place.image}`) : null
            return (
              <Marker key={place.id} position={place.coordinates}>
                <Popup>
                  <div className="min-w-[200px] text-start">
                    <h3 className="font-semibold text-slate-800 mb-1">{place.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{place.description}</p>
                    {imagePath && (
                      <div className="mb-2 rounded overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[80px] max-h-[200px]">
                        <img
                          src={imagePath}
                          alt={place.name}
                          className="w-full max-h-[180px] object-contain"
                          loading="lazy"
                          onError={(e) => {
                            const img = e.target
                            const altExt = imagePath.replace(/\.(jpg|jpeg)$/i, '.png')
                            if (altExt !== imagePath && !img.dataset.triedPng) {
                              img.dataset.triedPng = '1'
                              img.src = altExt
                            } else {
                              img.style.display = 'none'
                              img.parentElement?.classList.add('hidden')
                            }
                          }}
                        />
                      </div>
                    )}
                    {place.address && (
                      <p className="text-xs text-slate-500 mb-2">
                        <span className="font-medium">الموقع:</span> {place.address}
                      </p>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
                      >
                        اذهب للموقع
                      </a>
                      {place.whatsapp && (
                        <a
                          href={`https://wa.me/${place.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          طلب عبر واتساب
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        <div className="absolute top-2 end-2 z-[1000] flex flex-col gap-1">
          <button
            type="button"
            onClick={requestMyLocation}
            disabled={userLocationLoading}
            className="px-3 py-1.5 rounded-lg text-sm font-medium shadow-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {userLocationLoading ? 'جاري التحديد…' : userLocation ? 'تحديث موقعي' : 'موقعي'}
          </button>
          {userLocationError && (
            <p className="text-xs text-red-700 bg-white/95 px-2 py-1 rounded shadow max-w-[180px]" role="alert">
              {userLocationError}
            </p>
          )}
          {mapboxToken && (
            <button
              type="button"
              onClick={() => setMapType('mapbox')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow-md ${
                mapType === 'mapbox'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Mapbox (أقمار صناعية)
            </button>
          )}
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow-md ${
              mapType === 'satellite'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            أقمار صناعية
          </button>
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow-md ${
              mapType === 'street'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            شارع
          </button>
        </div>
      </div>
    </section>
  )
}
