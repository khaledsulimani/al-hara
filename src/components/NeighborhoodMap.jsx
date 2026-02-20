import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon with Vite/bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
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

export default function NeighborhoodMap({ markers = [], boundary = [] }) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''
  const [mapType, setMapType] = useState(mapboxToken ? 'mapbox' : 'satellite')
  const labelPosition = getBoundaryLabelPosition(boundary)

  const isMapbox = mapType === 'mapbox'
  const maxZoom = isMapbox ? MAX_ZOOM_MAPBOX : MAX_ZOOM_ESRI

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
              url={`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=${mapboxToken}`}
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
          {Array.isArray(boundary) && boundary.length >= 3 && (
            <>
              <Polygon positions={boundary} pathOptions={BOUNDARY_STYLE} />
              {labelPosition && (
                <Marker position={labelPosition} icon={labelIcon} zIndexOffset={500} interactive={false} />
              )}
            </>
          )}
          {markers.map((place) => (
            <Marker key={place.id} position={place.coordinates}>
              <Popup>
                <div className="min-w-[180px] text-start">
                  <h3 className="font-semibold text-slate-800 mb-1">{place.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{place.description}</p>
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
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute top-2 end-2 z-[1000] flex flex-col gap-1">
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
