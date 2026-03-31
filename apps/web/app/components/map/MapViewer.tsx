import type { FillExtrusionLayer, FillLayer, LngLatBoundsLike, SkyLayer } from 'mapbox-gl'
import { forwardRef } from 'react'
import type { MapRef } from 'react-map-gl/mapbox'
import Map, { Layer, Source } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { FeatureCollection } from 'geojson'
import { IG_GEOJSON } from '#/constants/geojson'

type MapViewerProps = {
  mapStyle: string
  className?: string
  useBoundaries?: boolean
}

const maxBounds: LngLatBoundsLike = [
  [94.0, -12.0], // Southwest (Min Lng, Min Lat)
  [142.0, 7.0], // Northeast (Max Lng, Max Lat)
]

const geoJsonLayer: Omit<FillLayer, 'source'> = {
  id: 'geojson-layer',
  type: 'fill',
  paint: {
    'fill-color': '#0ea5e9',
    'fill-opacity': 0.5,
    'fill-outline-color': '#0284c7',
  },
}

const buildingsLayer: FillExtrusionLayer = {
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

const skyLayer: SkyLayer = {
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
  ({ mapStyle, className, useBoundaries }, ref) => {
    return (
      <div className={`relative w-full h-full ${className || ''}`}>
        {mapboxToken ? (
          <Map
            ref={ref}
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
          >
            {/* 3D Terrain Source */}
            <Source
              id="mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
            <Layer {...skyLayer} />
            <Layer {...buildingsLayer} />
            {useBoundaries && (
              <Source id="id-geojson" type="geojson" data={IG_GEOJSON}>
                <Layer {...geoJsonLayer} />
              </Source>
            )}
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
