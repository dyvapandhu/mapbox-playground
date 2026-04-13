import { useCallback, useRef, useState } from 'react'
import { type MapRef } from 'react-map-gl/mapbox'
import { cx } from 'tailwind-variants'
import { useWaybackReleases } from '#/components/map/useWayback'
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
  const [showLabel, setShowLabel] = useState<boolean>(false)
  const [showMapHistory, setShowMapHistory] = useState<boolean>(false)
  const [showContour, setShowContour] = useState<boolean>(false)

  const { releases } = useWaybackReleases()
  const [selectedNum, setSelectedNum] = useState<number | null>(null)

  const activeRelease = releases.find((r) => r.releaseNum === selectedNum) ?? releases[0]

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedNum(Number(e.target.value)),
    []
  )

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
      const isLayerExist = activeLayers.some((item) => item.tilesetId === layer.tilesetId)

      setActiveLayers((prev) => {
        return !isLayerExist
          ? [...prev, layer]
          : prev.filter((item) => item.tilesetId !== layer.tilesetId)
      })
    },
    [activeLayers]
  )

  const isCurrentLayerActive = (layer: DataLayer) => {
    return activeLayers.some((item) => item.tilesetId === layer.tilesetId)
  }

  const toggleLabel = () => {
    if (!mapRef.current) return

    mapRef.current.setConfigProperty('basemap', 'showPlaceLabels', !showLabel)
    mapRef.current.setConfigProperty('basemap', 'showRoadLabels', !showLabel)

    setShowLabel((prev) => !prev)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar Controls */}
      <div className="z-10 flex w-80 flex-col gap-6 overflow-y-auto p-6">
        <div>
          <h1 className="mb-2 font-bold text-2xl tracking-tight">Mapbox POC</h1>
          <p className="text-muted-foreground text-sm">Interactive Mapbox Implementation</p>
        </div>
        <div className="space-y-6">
          {/* Basemap */}
          <div className="flex flex-col gap-2">
            <label htmlFor="basemap" className="font-semibold text-sm">
              Basemap
            </label>
            <select
              id="basemap"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            <h3 className="font-semibold text-sm">Fly To Location</h3>
            <div className="flex flex-col gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.label}
                  type="button"
                  className={cx(
                    'rounded-md px-4 py-2.5 text-left font-medium text-sm shadow-sm transition-all hover:cursor-pointer hover:bg-primary/90 active:scale-95',
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
          <div className="space-y-3 border-border border-t pt-4">
            <h3 className="font-semibold text-sm">Data Layers</h3>
            {DATA_LAYERS.map((layer) => (
              <button
                key={layer.tilesetId}
                type="button"
                className={cx(
                  'flex w-full items-center justify-between rounded-md px-4 py-3 font-medium text-sm transition-all active:scale-95',
                  isCurrentLayerActive(layer)
                    ? 'border-2 border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'border-2 border-border/50 bg-background text-muted-foreground hover:bg-muted'
                )}
                onClick={() => handleLayerOnClick(layer)}
              >
                <span>{layer.label}</span>
                <span className={cx('rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs')}>
                  {isCurrentLayerActive(layer) ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-3 border-border border-t pt-4">
            <h3 className="font-semibold text-sm">Properties</h3>
            <button
              type="button"
              className={cx(
                'flex w-full items-center justify-between rounded-md px-4 py-3 font-medium text-sm transition-all active:scale-95',
                showLabel
                  ? 'border-2 border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'border-2 border-border/50 bg-background text-muted-foreground hover:bg-muted'
              )}
              onClick={toggleLabel}
            >
              <span>Places Label</span>
              <span className={cx('rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs')}>
                {showLabel ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              type="button"
              className={cx(
                'flex w-full items-center justify-between rounded-md px-4 py-3 font-medium text-sm transition-all active:scale-95',
                showContour
                  ? 'border-2 border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'border-2 border-border/50 bg-background text-muted-foreground hover:bg-muted'
              )}
              onClick={() => setShowContour((prev) => !prev)}
            >
              <span>Contour</span>
              <span className={cx('rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs')}>
                {showContour ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              type="button"
              className={cx(
                'flex w-full items-center justify-between rounded-md px-4 py-3 font-medium text-sm transition-all active:scale-95',
                showMapHistory
                  ? 'border-2 border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'border-2 border-border/50 bg-background text-muted-foreground hover:bg-muted'
              )}
              onClick={() => setShowMapHistory((prev) => !prev)}
            >
              <span>Map History</span>
              <span className={cx('rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs')}>
                {showMapHistory ? 'ON' : 'OFF'}
              </span>
            </button>
            {showMapHistory && (
              <div className="flex flex-col gap-2">
                <select
                  id="date"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={activeRelease?.releaseNum ?? ''}
                  onChange={handleYearChange}
                >
                  {releases.map((r) => (
                    <option key={r.releaseNum} value={r.releaseNum}>
                      {r.dateLabel}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Viewer */}
      <div className="relative flex-1 bg-muted">
        <MapViewer
          ref={mapRef}
          mapStyle={mapStyle}
          dataLayers={activeLayers}
          activeRelease={activeRelease}
          useTimeSeries={showMapHistory}
          showContour={showContour}
          flyTo={jumpIntoLocation}
        />
      </div>
    </div>
  )
}
