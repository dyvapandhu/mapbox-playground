import type { FeatureCollection } from 'geojson'
export interface Location {
  label: string
  longitude: number
  latitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export interface DataLayer {
  id: string
  label: string
  data: FeatureCollection | string
}
