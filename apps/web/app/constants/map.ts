import type { Cluster, DataLayer, Marker } from '#/types/map'

export const STANDARD_STYLES = [
  'mapbox://styles/mapbox/standard',
  'mapbox://styles/mapbox/standard-satellite',
]

export const MAP_STYLES = [
  { label: 'Satellite', value: 'mapbox://styles/dgttransmigrasidev/cmnslcvau000701s78ou1602z' },
  {
    label: 'Satellite Monochrome',
    value: 'mapbox://styles/dgttransmigrasidev/cmnsmnn6c001q01quagyg21ua',
  },
  {
    label: 'Province Boundaries',
    value: 'mapbox://styles/dgttransmigrasidev/cmnsng50n000a01segj9k3gy5',
  },
]

export const EMPTY_MAP_STYLE = 'mapbox://styles/mapbox/empty-v9'

export const DATA_LAYERS: DataLayer[] = [
  {
    label: 'Provinces',
    tilesetId: 'dgttransmigrasidev.9x5kadyo',
    sourceLayer: 'id-77m3c4',
  },
  {
    label: 'KWS Trans',
    tilesetId: 'dgttransmigrasidev.dbgt2gzq',
    sourceLayer: 'kws-4chvtl',
  },
]

export const MARKERS: Marker[] = [
  {
    latitude: -2.69030368603606,
    longitude: 114.50784388764288,
  },
  {
    latitude: -8.108314964177438,
    longitude: 112.9239581271122,
  },
  {
    latitude: -7.7663053727165305,
    longitude: 112.59032469678237,
  },
  {
    latitude: -7.955124776612266,
    longitude: 112.46659631024443,
  },
  {
    latitude: -2.3201042360807236,
    longitude: 115.52539521772354,
  },
]

export const CLUSTERS: Cluster[] = [
  {
    id: 1,
    longitude: 112.46659631024443,
    latitude: -7.955124776612266,
    resources: ['palm', 'wheat', 'corn', 'coconut'], // atau SVG icons
  },
  {
    id: 2,
    longitude: 112.59032469678237,
    latitude: -7.7663053727165305,
    resources: ['palm', 'wheat'],
  },
  {
    id: 3,
    longitude: 115.52539521772354,
    latitude: -2.3201042360807236,
    resources: ['palm', 'wheat', 'corn', 'coconut'], // atau SVG icons
  },
  {
    id: 4,
    latitude: -8.108314964177438,
    longitude: 112.9239581271122,
    resources: ['wheat', 'corn', 'coconut'], // atau SVG icons
  },
]

export const OVERLAP_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: '-ml-2', // sedikit overlap
  md: '-ml-3', // seperti screenshot
  lg: '-ml-5', // overlap besar
}

export const MIN_ZOOM = 0
export const MAX_ZOOM = 20
export const MIN_SIZE = 16 // px — ukuran icon di zoom 0
export const MAX_SIZE = 48
