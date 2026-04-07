import type { DataLayer } from '#/types/map'
import { ID_GEOJSON } from './geojson'

export const STANDARD_STYLES = [
  'mapbox://styles/mapbox/standard',
  'mapbox://styles/mapbox/standard-satellite',
]

export const MAP_STYLES = [
  { label: 'Standard', value: 'mapbox://styles/mapbox/standard' },
  { label: 'Standard Satellite', value: 'mapbox://styles/mapbox/standard-satellite' },
  { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
  { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
  { label: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
  { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
  { label: 'Contour', value: 'mapbox://styles/dgttransmigrasidev/cmno2bbaa002i01qt89e7g8hc' }
]

export const DATA_LAYERS: DataLayer[] = [
  {
    id: 'provinces',
    label: 'Provinces',
    data: ID_GEOJSON,
  },
  {
    id: 'kws_trans',
    label: 'KWS Trans',
    data: '/geojson/kws.geojson',
  },
]
