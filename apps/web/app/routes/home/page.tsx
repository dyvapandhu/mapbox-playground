import { useCallback, useRef, useState } from 'react'
import { type MapRef } from 'react-map-gl/mapbox'
import { cx } from 'tailwind-variants'
import { CITIES } from '#/constants/location'
import { DATA_LAYERS, MAP_STYLES } from '#/constants/map'
import type { DataLayer, Location } from '#/types/map'
import { MapViewer } from '../../components/map/MapViewer'
import type { Route } from './+types/page'

export function meta(_props: Route.MetaArgs) {
  return [{ title: 'Map Dashboard' }, { name: 'description', content: 'Mapbox POC' }]
}

export default function Page() {
  const mapRef = useRef<MapRef>(null)
  const [location, setLocation] = useState(CITIES[0].label)
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0].value)
  const [activeLayers, setActiveLayers] = useState<DataLayer[]>([])
  const [showLabel, setShowLabel] = useState<boolean>(true)

  const flyTo = (location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: location.zoom,
      pitch: location.pitch ?? 0,
      bearing: location.bearing ?? 0,
      duration: 2500,
      essential: true,
    })
    setLocation(location.label)
  }

  const jumpIntoLocation = (long: number, lat: number) => {
    mapRef.current?.flyTo({
      center: [long, lat],
      zoom: 12,
      pitch: 75,
      bearing: 0,
      duration: 2500,
      essential: true,
    })
  }

  const handleLayerOnClick = useCallback(
    (layer: DataLayer) => {
      const isLayerExist = activeLayers.some((item) => item.id === layer.id)

      setActiveLayers((prev) => {
        return !isLayerExist ? [...prev, layer] : prev.filter((item) => item.id !== layer.id)
      })
    },
    [activeLayers]
  )

  const isCurrentLayerActive = (layer: DataLayer) => {
    return activeLayers.some((item) => item.id === layer.id)
  }

  const toggleLabel = () => {
    if (!mapRef.current) return

    mapRef.current.setConfigProperty('basemap', 'showPlaceLabels', !showLabel)
    mapRef.current.setConfigProperty('basemap', 'showRoadLabels', !showLabel)

    setShowLabel(prev => !prev)
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 p-6 flex flex-col gap-6 overflow-y-auto z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Mapbox POC</h1>
          <p className="text-sm text-muted-foreground">Interactive Mapbox Implementation</p>
        </div>
        <div className="space-y-6">
          {/* Basemap */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Basemap</label>
            <select
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
            >
              {MAP_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Locks */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Fly To Location</h3>
            <div className="flex flex-col gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.label}
                  className={cx(
                    'px-4 py-2.5 hover:bg-primary/90 hover:cursor-pointer text-sm font-medium rounded-md transition-all shadow-sm active:scale-95 text-left',
                    city.label === location && 'bg-primary text-white'
                  )}
                  onClick={() => flyTo(city)}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic GeoJSON */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold">Data Layers</h3>
            {DATA_LAYERS.map((layer) => (
              <button
                key={layer.id}
                className={cx(
                  'w-full px-4 py-3 text-sm font-medium rounded-md transition-all flex items-center justify-between active:scale-95',
                  isCurrentLayerActive(layer)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700 shadow-sm'
                    : 'bg-background hover:bg-muted border-2 border-border/50 text-muted-foreground'
                )}
                onClick={() => handleLayerOnClick(layer)}
              >
                <span>{layer.label}</span>
                <span className={cx('text-xs px-2 py-0.5 rounded-full bg-muted-foreground/20')}>
                  {isCurrentLayerActive(layer) ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold">Show Places Label</h3>
            <button className='hover:cursor-pointer' onClick={toggleLabel}>
              {showLabel ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewer */}
      <div className="flex-1 relative bg-muted">
        <MapViewer
          ref={mapRef}
          mapStyle={mapStyle}
          dataLayers={activeLayers}
          flyTo={jumpIntoLocation}
        />
      </div>
    </div>
  )
}
