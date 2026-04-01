import type {
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  LngLatBoundsLike,
  MapMouseEvent,
  SkyLayerSpecification,
} from 'mapbox-gl'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import type { MapRef } from 'react-map-gl/mapbox'
import Map, { Layer, Source } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { cx } from 'tailwind-variants'
import { STANDARD_STYLES } from '#/constants/map'
import type { DataLayer } from '#/types/map'

type MapViewerProps = {
  mapStyle: string
  dataLayers: DataLayer[]
  className?: string
  flyTo?: (long: number, lat: number) => void
}

const maxBounds: LngLatBoundsLike = [
  [94.0, -12.0], // Southwest (Min Lng, Min Lat)
  [142.0, 7.0], // Northeast (Max Lng, Max Lat)
]

const geoJsonLayer: Omit<FillLayerSpecification, 'id'> = {
  type: 'fill',
  source: 'composite',
  paint: {
    'fill-color': 'transparent',
    'fill-opacity': 0.9,
    'fill-outline-color': '#fc0320',
  },
}

const buildingsLayer: FillExtrusionLayerSpecification = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],
    'fill-extrusion-opacity': 0.6,
  },
}

const skyLayer: SkyLayerSpecification = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15,
  },
}

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

export const MapViewer = forwardRef<MapRef, MapViewerProps>(
  ({ mapStyle, dataLayers, className, flyTo }, ref) => {
    const [cursor, setCursor] = useState<string>('auto')

    const onClick = useCallback((event: MapMouseEvent) => {
      const { features } = event
      const selectedFeatures = features && features[0]

      if (selectedFeatures && flyTo) flyTo(event.lngLat.lng, event.lngLat.lat)
    }, [])

    const onMouseEnter = useCallback(() => setCursor('pointer'), [])
    const onMouseLeave = useCallback(() => setCursor('auto'), [])

    const isStandard = useMemo(() => {
      return STANDARD_STYLES.includes(mapStyle)
    }, [mapStyle])

    return (
      <div className={cx(className, 'relative w-full h-full')}>
        {mapboxToken ? (
          <Map
            ref={ref}
            cursor={cursor}
            initialViewState={{
              longitude: 118.0149,
              latitude: -2.5489,
              zoom: 1, // Overview of Indonesia
            }}
            mapStyle={mapStyle}
            mapboxAccessToken={mapboxToken}
            projection="mercator"
            style={{ width: '100%', height: '100%' }}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            maxBounds={maxBounds}
            interactiveLayerIds={dataLayers.map((layer) => layer.id)}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* 3D Terrain Source */}
            {!isStandard && (
              <>
                <Source
                  id="mapbox-dem"
                  type="raster-dem"
                  url="mapbox://mapbox.mapbox-terrain-dem-v1"
                  tileSize={512}
                  maxzoom={14}
                />
                <Layer {...skyLayer} />
                <Layer {...buildingsLayer} />
              </>
            )}
            {dataLayers.map((layer) => (
              <Source key={layer.id} id={layer.id} type="geojson" data={layer.data}>
                <Layer id={layer.id} {...geoJsonLayer} />
              </Source>
            ))}
          </Map>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground p-6 text-center">
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Mapbox Token Missing</h2>
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
