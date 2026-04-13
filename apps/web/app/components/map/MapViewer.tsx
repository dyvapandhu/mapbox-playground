import type { FillLayerSpecification, LngLatBoundsLike, MapMouseEvent } from 'mapbox-gl'
import { forwardRef, useCallback, useState } from 'react'
import type { LayerProps, MapRef } from 'react-map-gl/mapbox'
import MapGL, { Layer, Marker, Source } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cx } from 'tailwind-variants'
import { CLUSTERS, EMPTY_MAP_STYLE, MARKERS } from '#/constants/map'
import type { DataLayer, IconGroupProps, WaybackItem } from '#/types/map'
import { CustomPinMarker } from './CustomMarker'
import ResourceIcon from './ResourceIcon'
import { getWaybackTileUrl } from './useWayback'

type MapViewerProps = {
  mapStyle: string
  dataLayers: DataLayer[]
  className?: string
  useTimeSeries?: boolean
  activeRelease?: WaybackItem
  showContour?: boolean
  flyTo?: (long: number, lat: number) => void
}

const maxBounds: LngLatBoundsLike = [
  [94.0, -12.0], // Southwest (Min Lng, Min Lat)
  [142.0, 7.0], // Northeast (Max Lng, Max Lat)
]

const geoJsonFillLayer: Omit<FillLayerSpecification, 'id'> = {
  type: 'fill',
  source: 'composite',
  paint: {
    'fill-emissive-strength': 1,
    'fill-color': 'rgba(255, 209, 71, 0.30196078431372547)',
    'fill-outline-color': '#ffd147',
  },
}

// const geoJsonOutlineLayer: Omit<LineLayerSpecification, 'id'> = {
//   type: 'line',
//   source: 'composite',
//   paint: {
//     'line-color': '#fc0320',
//     'line-width': 0.8,
//     'line-emissive-strength': 1,
//   },
// }

const rasterLayer: LayerProps = {
  id: 'wayback-raster',
  type: 'raster',
  paint: {
    'raster-opacity': 1,
    'raster-fade-duration': 300,
  },
}

const contourLayer: LayerProps = {
  id: 'contour-layer',
  type: 'line',
  paint: {
    'line-color': '#8ad20f',
    'line-emissive-strength': 1,
    'line-opacity': 0.6,
  },
  layout: {},
  source: 'composite',
  'source-layer': 'contour',
}

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

export const MapViewer = forwardRef<MapRef, MapViewerProps>(
  ({ mapStyle, dataLayers, className, showContour, useTimeSeries, activeRelease, flyTo }, ref) => {
    const [cursor, setCursor] = useState<string>('auto')
    const [zoom, setZoom] = useState<number>(4)

    const onClick = useCallback(
      (event: MapMouseEvent) => {
        const { features } = event
        const selectedFeatures = features?.[0]
        console.info(event.lngLat.lng, event.lngLat.lat)
        if (selectedFeatures && flyTo) flyTo(event.lngLat.lng, event.lngLat.lat)
      },
      [flyTo]
    )

    const onMouseEnter = useCallback((event: MapMouseEvent) => {
      setCursor('pointer')

      const { features } = event
      const selectedFeatures = features?.[0]

      if (selectedFeatures) console.info(selectedFeatures)
    }, [])
    const onMouseLeave = useCallback(() => setCursor('auto'), [])

    const handleZoom = useCallback((e: { viewState: { zoom: number } }) => {
      setZoom(e.viewState.zoom)
    }, [])

    function getIconSize(zoom: number): number {
      if (zoom < 4) return 24
      if (zoom < 7) return 28
      if (zoom < 10) return 32
      if (zoom < 14) return 36
      return 40
    }

    const IconGroup = ({ resources, zoom }: IconGroupProps) => {
      const size = getIconSize(zoom)

      return (
        <div className="flex items-center">
          {resources.map((type, index) => (
            <div
              key={type}
              className="relative flex cursor-pointer items-center justify-center rounded-full border border-[#C8F4B4] bg-black transition-all duration-150 first:ml-0 hover:z-50! hover:scale-110"
              style={{
                paddingInline: 8,
                width: size,
                height: size,
                fontSize: size * 0.45, // icon emoji ikut scale
                marginLeft: index === 0 ? 0 : -(size * 0.3), // overlap tetap proporsional
                zIndex: resources.length - index,
              }}
            >
              <ResourceIcon type={type} size={size} />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={cx(className, 'relative h-full w-full')}>
        {mapboxToken ? (
          <MapGL
            ref={ref}
            cursor={cursor}
            initialViewState={{
              longitude: 118.0149,
              latitude: -2.5489,
              zoom: 1, // Overview of Indonesia
            }}
            mapStyle={useTimeSeries ? EMPTY_MAP_STYLE : mapStyle}
            mapboxAccessToken={mapboxToken}
            projection="mercator"
            style={{ width: '100%', height: '100%' }}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            maxBounds={maxBounds}
            interactiveLayerIds={dataLayers.map((layer) => layer.tilesetId)}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onZoom={handleZoom}
          >
            {useTimeSeries && activeRelease && (
              <Source
                // key={activeRelease.releaseNum} // force remount saat ganti release
                id="wayback"
                type="raster"
                tiles={[getWaybackTileUrl(activeRelease)]}
                tileSize={256}
                minzoom={1}
                maxzoom={19}
                attribution="Esri, Maxar, Earthstar Geographics"
              >
                <Layer {...rasterLayer} />
              </Source>
            )}
            {dataLayers.map((layer) => (
              <Source key={layer.tilesetId} type="vector" url={`mapbox://${layer.tilesetId}`}>
                <Layer
                  id={layer.tilesetId}
                  {...geoJsonFillLayer}
                  source-layer={layer.sourceLayer}
                />
              </Source>
            ))}
            {MARKERS.map((marker) => (
              <CustomPinMarker
                key={marker.longitude}
                longitude={marker.longitude}
                latitude={marker.latitude}
              />
            ))}
            {CLUSTERS.map((loc) => (
              <Marker
                key={loc.id}
                longitude={loc.longitude}
                latitude={loc.latitude}
                anchor="center"
              >
                <IconGroup resources={loc.resources} zoom={zoom} />
              </Marker>
            ))}
            {showContour && (
              <Source id="contour" type="vector" url="mapbox://mapbox.mapbox-terrain-v2">
                <Layer {...contourLayer} />
              </Source>
            )}
          </MapGL>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted p-6 text-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-muted-foreground/50"
            >
              <path d="m3 11 18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
            <h2 className="mb-2 font-semibold text-foreground text-xl">Mapbox Token Missing</h2>
            <p className="max-w-md">
              Please ensure you have added your Mapbox token to the <code>VITE_MAPBOX_TOKEN</code>{' '}
              environment variable in your <code>.env</code> file.
            </p>
          </div>
        )}
      </div>
    )
  }
)

MapViewer.displayName = 'MapViewer'
